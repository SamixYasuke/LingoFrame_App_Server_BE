import { User, VideoJob } from "../models";
import { CustomError } from "../errors/CustomError";
import { calculateCredits, generateJobId } from "../utils/helper";
import { CreditData } from "../utils/helper";
import jwt from "jsonwebtoken";
import axios from "axios";
import { DecodedVideoData } from "../types/decoded";
import UserService from "./user.service";
import { isValidObjectId } from "mongoose";
import { GetVideoEstimateDtoType } from "../dtos/video.dto";

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
    videoData: GetVideoEstimateDtoType
  ) => {
    const user = await User.findById(userId);
    if (!user) {
      throw new CustomError("User Not Found", 404);
    }

    const {
      file_name,
      video_url,
      translation_language,
      subtitle_type,
      customization_options,
    } = videoData;

    let videoSizeInBytes: number;
    let videoDurationInSeconds: number;

    const BASE_URL =
      this.NODE_ENV === "development"
        ? this.VIDEO_SERVER_BASE_URL
        : this.VIDEO_SERVER_BASE_PROD_URL;

    try {
      const url = `${BASE_URL}/api/video/info`;
      const res = await axios.get(url, {
        data: {
          video_url,
        },
        headers: {
          Authorization: `Bearer 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`,
        },
      });
      videoSizeInBytes = res.data.data.video_size_in_bytes;
      videoDurationInSeconds = res.data.data.video_duration_in_seconds;
    } catch (error) {
      throw new CustomError(
        "Something went wrong, couldn't get video metadata",
        400
      );
    }

    const fileSizeMB = parseFloat(
      (videoSizeInBytes / (1024 * 1024)).toFixed(2)
    );
    const durationMinutes = parseFloat(
      (videoDurationInSeconds / 60).toFixed(2)
    );
    const hasTranslation = !!translation_language;

    const data: CreditData = {
      fileSizeMB,
      durationMinutes,
      subtitleType: subtitle_type,
      translationLanguage: translation_language,
      customizationOptions: customization_options,
    };

    const creditEstimate = calculateCredits(data);

    const estimateDetails = {
      baseCost: {
        fileSizeMB,
        durationMinutes,
        description: `Video of ${fileSizeMB} MB and ${durationMinutes} minutes`,
      },
      subtitleType: {
        type: subtitle_type,
        description:
          subtitle_type === "srt"
            ? "Generating separate subtitle file (.srt)"
            : "Merging subtitles with video",
      },
      translation: hasTranslation
        ? {
            language: translation_language,
            description: `Translation to ${translation_language}`,
          }
        : null,
      customizations:
        customization_options && Object.keys(customization_options).length > 0
          ? {
              options: customization_options,
              description: "Custom subtitle styling applied",
            }
          : null,
      totalCredits: creditEstimate,
    };

    const message = estimateDetails;

    const jobId = await generateJobId();
    const tokenPayload = {
      userId,
      videoUrl: video_url,
      fileName: file_name,
      videoSizeInBytes,
      videoDurationInSeconds,
      subtitleType: subtitle_type,
      customizationOptions: customization_options,
      translationLanguage: translation_language,
      creditEstimate,
      jobId,
    };

    const token = jwt.sign(tokenPayload, this.JWT_SECRET, {
      expiresIn: Math.floor(Date.now() / 1000) + 1800, // Expires in 30 minutes
    });

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
        throw new CustomError("Estimate has expired, get new estimate", 400);
      }
      throw new CustomError("Estimate has expired, get new estimate", 400);
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

    await this.userService.deductUserCredits(userId, creditEstimate);
    await videoJob.save();

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
      detected_language: videoJob.detected_language,
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
