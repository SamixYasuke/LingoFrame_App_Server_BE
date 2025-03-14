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

router.delete(
  "/jobs/:jobId/cancel",
  authenticateAccessToken,
  videoController.videoJobCancelController
);

router.post(
  "/jobs/:jobId/accept",
  authenticateAccessToken,
  videoController.acceptVideoJobController
);

export default router;
