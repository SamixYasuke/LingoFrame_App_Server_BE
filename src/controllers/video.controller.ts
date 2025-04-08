import { Response } from "express";
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
        subtitle_type,
        customization_options,
        translation_language,
      }: any = req.body;
      const { user_id } = req.user;
      const data = await this.videoService.getVideoEstimateService(
        user_id,
        video_url,
        file_name,
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

  public acceptVideoJobController = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const { user_id } = req.user;
      const token = req.body.token;
      const data = await this.videoService.acceptVideoJobService(
        token,
        user_id
      );
      return res.status(200).json({
        status_code: 200,
        message: "Job in progress successfully",
        data,
      });
    }
  );

  public getVideoJobsForUserController = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const { user_id } = req.user;
      const status = req.query.status;
      const data = await this.videoService.getVideoJobsForUserService(
        user_id,
        status
      );
      return res.status(200).json({
        status_code: 200,
        message: "Jobs gotten successfully",
        data,
      });
    }
  );

  public getVideoJobByIdController = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const { user_id } = req.user;
      const jobId = req.params.jobId;
      const data = await this.videoService.getVideoJobByIdService(
        user_id,
        jobId
      );
      return res.status(200).json({
        status_code: 200,
        message: "Job gotten successfully",
        data,
      });
    }
  );
}

export default VideoController;
