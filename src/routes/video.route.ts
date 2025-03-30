import { Router } from "express";
import VideoController from "../controllers/video.controller";
import { authenticateAccessToken } from "../middlewares/authenticateJwt.middleware";

const router = Router();

const videoController = new VideoController();

router.get(
  "/estimate",
  authenticateAccessToken,
  videoController.getVideoEstimateController
);

router.post(
  "/jobs/:jobId/accept",
  authenticateAccessToken,
  videoController.acceptVideoJobController
);

router.get(
  "/jobs",
  authenticateAccessToken,
  videoController.getVideoJobsForUserController
);

router.get(
  "/jobs/:jobId",
  authenticateAccessToken,
  videoController.getVideoJobByIdController
);

export default router;
