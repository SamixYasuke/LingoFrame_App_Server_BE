import { User, VideoJob } from "../models";
import { CustomError } from "../errors/CustomError";
import { calculateCredits, generateJobId } from "../utils/helper";
import { SubtitleOptions } from "../utils/defaultStyles";
import { CreditData } from "../utils/helper";
import jwt from "jsonwebtoken";
import axios from "axios";
import { DecodedVideoData } from "../types/decoded";

class VideoService {
  private readonly JWT_SECRET: string;
  private readonly VIDEO_SERVER_BASE_URL: string;

  constructor() {
    this.JWT_SECRET = process.env.JWT_SECRET;
    this.VIDEO_SERVER_BASE_URL = process.env.VIDEO_SERVER_BASE_URL;
    if (!this.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }
  }

  public getVideoEstimateService = async (
    userId: string,
    videoUrl: string,
    fileName: string,
    videoSize: number, // in bytes
    videoDuration: number, // in seconds
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
    if (!videoSize) missing.push("videoSize");
    if (!videoDuration) missing.push("videoDuration");
    if (!subtitleType) missing.push("subtitleType");
    if (missing.length) {
      throw new CustomError(
        `Missing required fields: ${missing.join(", ")}`,
        400
      );
    }
    if (videoSize <= 0 || videoDuration <= 0) {
      throw new CustomError("Video size and duration must be positive", 400);
    }

    const fileSizeMB = parseFloat((videoSize / (1024 * 1024)).toFixed(2));
    const durationMinutes = parseFloat((videoDuration / 60).toFixed(2));
    const hasTranslation = !!translationLanguage;

    const data: CreditData = {
      fileSizeMB,
      durationMinutes,
      subtitleType,
      hasTranslation,
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
      videoSize,
      videoDuration,
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
      videoSize,
      videoDuration,
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

    if (user.credits < creditEstimate) {
      throw new CustomError(
        "Insufficient credits, please fund your wallet",
        402
      );
    }

    const fileSizeMB = parseFloat((videoSize / (1024 * 1024)).toFixed(2));
    const durationMinutes = parseFloat((videoDuration / 60).toFixed(2));
    const hasTranslation = !!translationLanguage;
    const recalculatedCredits = calculateCredits({
      fileSizeMB,
      durationMinutes,
      subtitleType,
      hasTranslation,
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
      User.updateOne({ _id: userId }, { $inc: { credits: -creditEstimate } }),
      videoJob.save(),
    ]);

    const url = `${this.VIDEO_SERVER_BASE_URL}/api/subtitle/process`;
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
      const res = await axios.post(url, data);
      if (res.status === 200 || res.status === 201) {
        return res.data.message || "Video job accepted and processing started";
      }
      throw new CustomError(
        `Unexpected response from processing API: ${res.status}`,
        500
      );
    } catch (error) {
      await Promise.all([
        User.updateOne({ _id: userId }, { $inc: { credits: creditEstimate } }),
        VideoJob.updateOne(
          { job_id: jobId, user_id: userId },
          { status: "failed" }
        ),
      ]);
      throw new CustomError(
        `Failed to process video job: ${error.message || "Unknown error"}`,
        500
      );
    }
  };
}

export default VideoService;
