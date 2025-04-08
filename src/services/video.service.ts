import { User, VideoJob } from "../models";
import { CustomError } from "../errors/CustomError";
import { calculateCredits, generateJobId } from "../utils/helper";
import { SubtitleOptions } from "../types/subtitle-options";
import { CreditData } from "../utils/helper";
import jwt from "jsonwebtoken";
import axios from "axios";
import { DecodedVideoData } from "../types/decoded";
import UserService from "./user.service";
import { isValidObjectId } from "mongoose";

class VideoService {
  private readonly JWT_SECRET: string;
  private readonly VIDEO_SERVER_BASE_URL: string;
  private readonly userService: UserService;
  private readonly NODE_ENV: string;
  private readonly VIDEO_SERVER_BASE_PROD_URL: string;

  constructor() {
    this.JWT_SECRET = process.env.JWT_SECRET;
    this.VIDEO_SERVER_BASE_URL = process.env.VIDEO_SERVER_BASE_URL;
    this.userService = new UserService();
    this.NODE_ENV = process.env.NODE_ENV;
    this.VIDEO_SERVER_BASE_PROD_URL = process.env.VIDEO_SERVER_BASE_PROD_URL;

    if (!this.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    if (!this.VIDEO_SERVER_BASE_URL) {
      throw new Error(
        "VIDEO_SERVER_BASE_URL is not defined in environment variables"
      );
    }
  }

  public getVideoEstimateService = async (
    userId: string,
    videoUrl: string,
    fileName: string,
    subtitleType: "merge" | "srt",
    customizationOptions: SubtitleOptions,
    translationLanguage: string
  ) => {
    const user = await User.findById(userId);
    if (!user) {
      throw new CustomError("User Not Found", 404);
    }

    const missing = [];
    if (!videoUrl) missing.push("videoUrl");
    if (!subtitleType) missing.push("subtitleType");
    if (missing.length) {
      throw new CustomError(
        `Missing required fields: ${missing.join(", ")}`,
        400
      );
    }

    let videoSizeInBytes: number;
    let videoDurationInSeconds: number;

    const BASE_URL =
      this.NODE_ENV === "development"
        ? this.VIDEO_SERVER_BASE_URL
        : this.VIDEO_SERVER_BASE_PROD_URL;
    console.log(BASE_URL);
    try {
      const url = `${BASE_URL}/api/video/info`;
      const res = await axios.get(url, {
        data: {
          video_url: videoUrl,
        },
        headers: {
          Authorization: `Bearer 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`,
        },
      });
      videoSizeInBytes = res.data.data.video_size_in_bytes;
      videoDurationInSeconds = res.data.data.video_duration_in_seconds;
    } catch (error) {
      throw new CustomError(
        "Something went wrong coudn't get video meta data",
        400
      );
    }

    const fileSizeMB = parseFloat(
      (videoSizeInBytes / (1024 * 1024)).toFixed(2)
    );
    const durationMinutes = parseFloat(
      (videoDurationInSeconds / 60).toFixed(2)
    );
    const hasTranslation = !!translationLanguage;

    const data: CreditData = {
      fileSizeMB,
      durationMinutes,
      subtitleType,
      translationLanguage,
      customizationOptions,
    };
    const creditEstimate = calculateCredits(data);

    const messageParts = [
      `Base cost calculated for a ${fileSizeMB} MB video with ${durationMinutes} minutes duration`,
      subtitleType === "srt"
        ? "Generating separate subtitle file (.srt)"
        : "Merging subtitles with video",
    ];
    if (hasTranslation)
      messageParts.push(`Translation to "${translationLanguage}" included`);
    if (Object.keys(customizationOptions).length > 0) {
      messageParts.push(
        `Customizations: ${JSON.stringify(customizationOptions)}`
      );
    }
    const message = `${messageParts.join(
      ". "
    )}. Total credits: ${creditEstimate}.`;

    const jobId = await generateJobId();
    const tokenPayload = {
      userId,
      videoUrl,
      fileName,
      videoSizeInBytes,
      videoDurationInSeconds,
      subtitleType,
      customizationOptions,
      translationLanguage,
      creditEstimate,
      jobId,
      exp: Math.floor(Date.now() / 1000) + 300, // Expires in 5 minutes
    };

    const token = jwt.sign(tokenPayload, this.JWT_SECRET);

    return {
      credit_estimate: creditEstimate,
      estimate: message,
      token,
    };
  };

  public acceptVideoJobService = async (
    token: string,
    userId: string
  ): Promise<string> => {
    let decodedData: DecodedVideoData;
    try {
      decodedData = jwt.verify(token, this.JWT_SECRET) as DecodedVideoData;
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        throw new CustomError("Token has expired", 401);
      }
      throw new CustomError("Invalid token", 401);
    }

    const {
      userId: decodedUserId,
      videoUrl,
      fileName,
      videoSizeInBytes,
      videoDurationInSeconds,
      subtitleType,
      customizationOptions,
      translationLanguage,
      creditEstimate,
      jobId,
    } = decodedData;

    if (decodedUserId !== userId) {
      throw new CustomError("User ID mismatch, possible tampering", 400);
    }

    const user = await User.findById(userId);
    if (!user) throw new CustomError("User Not Found", 404);

    const fileSizeMB = parseFloat(
      (videoSizeInBytes / (1024 * 1024)).toFixed(2)
    );
    const durationMinutes = parseFloat(
      (videoDurationInSeconds / 60).toFixed(2)
    );

    const recalculatedCredits = calculateCredits({
      fileSizeMB,
      durationMinutes,
      subtitleType,
      translationLanguage,
      customizationOptions,
    });

    if (recalculatedCredits !== creditEstimate) {
      throw new CustomError("Estimate mismatch, possible tampering", 400);
    }

    const videoJob = new VideoJob({
      job_id: jobId,
      user_id: userId,
      video_url: videoUrl,
      file_name: fileName,
      duration_minutes: durationMinutes,
      size_mb: fileSizeMB,
      customization_options: customizationOptions,
      subtitle_type: subtitleType,
      credit_cost: creditEstimate,
      translation_language: translationLanguage,
      status: "active",
    });

    await Promise.all([
      this.userService.deductUserCredits(userId, creditEstimate),
      videoJob.save(),
    ]);

    const BASE_URL =
      this.NODE_ENV === "development"
        ? this.VIDEO_SERVER_BASE_URL
        : this.VIDEO_SERVER_BASE_PROD_URL;

    const url = `${BASE_URL}/api/subtitle/process`;
    const data = {
      email: user.email,
      video_url: videoJob.video_url,
      file_name: videoJob.file_name,
      subtitle_mode: videoJob.subtitle_type,
      language: videoJob.translation_language || "",
      subtitle_options: videoJob.customization_options,
      job_id: videoJob.job_id,
    };

    try {
      const res = await axios.post(url, data, {
        headers: {
          Authorization: `Bearer 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`,
        },
      });
      if (res.status === 200 || res.status === 201) {
        return res.data.message || "Video job accepted and processing started";
      }
      throw new CustomError(
        `Unexpected response from processing API: ${res.status}`,
        500
      );
    } catch (error) {
      try {
        await Promise.all([
          this.userService.refundUserCredits(userId, creditEstimate),
          VideoJob.updateOne(
            { job_id: jobId, user_id: userId },
            { status: "failed" }
          ),
        ]);
      } catch (rollbackError) {
        console.error("Rollback failed:", rollbackError);
        throw new CustomError(
          "Failed to process video job and rollback failed",
          500
        );
      }
      throw new CustomError(
        `Failed to process video job: ${error.message || "Unknown error"}`,
        500
      );
    }
  };

  public getVideoJobsForUserService = async (
    userId: string,
    status: string | any
  ): Promise<object> => {
    const validStatuses = ["active", "completed", "failed"];
    if (status && !validStatuses.includes(status)) {
      throw new CustomError(
        `Invalid status. Valid statuses are: ${validStatuses.join(", ")}`,
        400
      );
    }

    const query: {
      user_id: string;
      status?: string;
    } = { user_id: userId };

    if (status) {
      query.status = status;
    }

    const videoJobs = await VideoJob.find(query)
      .sort({ createdAt: -1 })
      .select("job_id subtitle_type status _id createdAt");

    if (!videoJobs || videoJobs.length === 0) {
      return [];
    }

    const cleanedVideoJobs = videoJobs.map((job) => {
      return {
        id: job._id,
        job_id: job.job_id,
        subtitle_type: job.subtitle_type,
        status: job.status,
        created_at: job.createdAt,
      };
    });

    return cleanedVideoJobs;
  };

  public getVideoJobByIdService = async (
    userId: string,
    jobId: string
  ): Promise<object> => {
    if (!isValidObjectId(jobId)) {
      throw new CustomError("Invalid job ID or Job not found", 400);
    }

    const videoJob = await VideoJob.findOne({
      user_id: userId,
      _id: jobId,
    }).select("-__v");

    if (!videoJob) {
      throw new CustomError("Video job not found", 404);
    }

    const cleanedVideoJobs = {
      id: videoJob._id,
      job_id: videoJob.job_id,
      user_id: videoJob.user_id,
      duration_minutes: videoJob.duration_minutes,
      customization_options: videoJob.customization_options,
      subtitle_type: videoJob.subtitle_type,
      translation_language: videoJob.translation_language,
      credit_cost: videoJob.credit_cost,
      status: videoJob.status,
      result_url: videoJob.result_url,
      created_at: videoJob.createdAt,
      updated_at: videoJob.updatedAt,
    };

    return cleanedVideoJobs;
  };
}

export default VideoService;
