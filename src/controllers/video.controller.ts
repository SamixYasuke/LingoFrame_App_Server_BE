import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import VideoService from "../services/video.service";
import { AuthenticatedRequest } from "../types/express";

class VideoController {
  private readonly videoService: VideoService;

  constructor() {
    this.videoService = new VideoService();
  }

  public getVideoEstimateController = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const {
        video_url,
        file_name,
        video_size,
        video_duration,
        subtitle_type,
        customization_options,
        translation_language,
      } = req.body;
      const { user_id } = req.user;
      const data = await this.videoService.getVideoEstimateService(
        user_id,
        video_url,
        file_name,
        video_size, //in bytes
        video_duration, //in seconds
        subtitle_type,
        customization_options,
        translation_language
      );
      return res.status(200).json({
        status_code: 200,
        message: "Estimate gotten successfully",
        data,
      });
    }
  );

  public videoJobCancelController = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const { user_id } = req.user;
      const { jobId } = req.params;
      const data = await this.videoService.cancelVideoJobService(
        user_id,
        jobId
      );
      return res.status(204).json({
        status_code: 204,
        message: data,
      });
    }
  );

  public acceptVideoJobController = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const { user_id } = req.user;
      const { jobId } = req.params;
      const data = await this.videoService.acceptVideoJobService(
        user_id,
        jobId
      );
      return res.status(200).json({
        status_code: 200,
        message: "Job in progress successfully",
        data,
      });
    }
  );
}

export default VideoController;
