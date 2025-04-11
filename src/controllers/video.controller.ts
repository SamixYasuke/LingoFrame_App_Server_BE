import { Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import VideoService from "../services/video.service";
import { AuthenticatedRequest } from "../types/express";
import { GetVideoEstimateDto } from "../dtos/video.dto";
import { flattenZodErrors } from "../utils/helper";
import { CustomError } from "../errors/CustomError";

class VideoController {
  private readonly videoService: VideoService;

  constructor() {
    this.videoService = new VideoService();
  }

  public getVideoEstimateController = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const validatedReqBody = GetVideoEstimateDto.safeParse(req.body);

      const { data: validatedData, error: validationError } = validatedReqBody;

      if (!validatedReqBody.success) {
        const errorMessages = flattenZodErrors(validationError);
        throw new CustomError("Validation Error", 400, errorMessages);
      }

      const { user_id } = req.user;
      const data = await this.videoService.getVideoEstimateService(
        user_id,
        validatedData
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
