import { User, VideoJob } from "../models";
import { CustomError } from "../errors/CustomError";
import { calculateCredits, generateJobId } from "../utils/helper";
import { SubtitleOptions } from "../utils/defaultStyles";
import { CreditData } from "../utils/helper";
import axios from "axios";

class VideoService {
  constructor() {}

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

    const hasTranslation = !!translationLanguage;
    const fileSizeMB = parseFloat((videoSize / (1024 * 1024)).toFixed(2));
    const durationMinutes = parseFloat((videoDuration / 60).toFixed(2));

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
    if (hasTranslation) {
      messageParts.push(`Translation to "${translationLanguage}" included`);
    }
    if (Object.keys(customizationOptions).length > 0) {
      messageParts.push(
        `Customizations: ${JSON.stringify(customizationOptions)}`
      );
    }
    const message = `${messageParts.join(
      ". "
    )}. Total credits: ${creditEstimate}.`;

    const jobId = await generateJobId();

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
      estimation_message: message,
    });

    await videoJob.save();
    return {
      credit_estimate: creditEstimate,
      estimate: message,
      job_id: jobId,
    };
  };

  public cancelVideoJobService = async (
    userId: string,
    jobId: string
  ): Promise<string> => {
    const user = await User.findById(userId);
    if (!user) {
      throw new CustomError("User Not Found", 404);
    }

    const videoJob = await VideoJob.findOne({
      job_id: jobId,
      user_id: userId,
    });

    if (!videoJob) {
      throw new CustomError("Video Job Not Found", 404);
    }

    if (videoJob.status !== "waiting") {
      throw new CustomError(
        `Cannot cancel job with status "${videoJob.status}"`,
        400
      );
    }

    await VideoJob.deleteOne({ job_id: jobId, user_id: userId });

    return "Video job canceled successfully";
  };

  public acceptVideoJobService = async (
    userId: string,
    jobId: string
  ): Promise<string> => {
    const user = await User.findById(userId);
    if (!user) {
      throw new CustomError("User Not Found", 404);
    }

    const videoJob = await VideoJob.findOne({ job_id: jobId, user_id: userId });
    if (!videoJob) {
      throw new CustomError("Video Job Not Found", 404);
    }

    if (videoJob.status === "active" || videoJob.status === "completed") {
      throw new CustomError("Job already accepted or completed", 400);
    }

    if (user.credits < videoJob.credit_cost) {
      throw new CustomError(
        "Insufficient credits, please fund your wallet",
        402
      );
    }

    await User.updateOne(
      { _id: userId },
      { $inc: { credits: -videoJob.credit_cost } }
    );
    await VideoJob.updateOne(
      { job_id: jobId, user_id: userId },
      { status: "active" }
    );

    const data = {
      email: user.email,
      video_url: videoJob.video_url,
      file_name: videoJob.file_name,
      subtitle_mode: videoJob.subtitle_type,
      language: videoJob.translation_language || "",
      subtitle_options: videoJob.customization_options,
    };

    const url = "http://localhost:5000/api/subtitle/process";

    try {
      const res = await axios.post(url, data);
      if (res.status === 200 || res.status === 201) {
        return res.data.message || "Video job accepted and processing started";
      } else {
        throw new CustomError(
          `Unexpected response from processing API: ${res.status}`,
          500
        );
      }
    } catch (error) {
      await User.updateOne(
        { _id: userId },
        { $inc: { credits: videoJob.credit_cost } }
      );
      await VideoJob.updateOne(
        { job_id: jobId, user_id: userId },
        { status: "failed" }
      );
      throw new CustomError(
        `Failed to process video job: ${error.message || "Unknown error"}`,
        500
      );
    }
  };
}

export default VideoService;
