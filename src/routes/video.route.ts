import { Router } from "express";
import VideoController from "../controllers/video.controller";
import { authenticateJwt } from "../middlewares/authenticateJwt.middleware";

const router = Router();

const videoController = new VideoController();

router.get(
  "/estimate",
  authenticateJwt,
  videoController.getVideoEstimateController
);

router.delete(
  "/jobs/:jobId/cancel",
  authenticateJwt,
  videoController.videoJobCancelController
);

router.post(
  "/jobs/:jobId/accept",
  authenticateJwt,
  videoController.acceptVideoJobController
);

export default router;
