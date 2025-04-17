import { Router } from "express";
import VideoController from "../controllers/video.controller";
import RateLimiter from "../utils/rateLimiters";
import { authenticateAccessToken } from "../middlewares/authenticateJwt.middleware";

const router = Router();
const videoController = new VideoController();
const rateLimiter = new RateLimiter();
const userRateLimiter = rateLimiter.getUserRateLimiter();

router.post(
  "/estimate",
  authenticateAccessToken,
  userRateLimiter,
  videoController.getVideoEstimateController
);

router.post(
  "/jobs/accept",
  authenticateAccessToken,
  userRateLimiter,
  videoController.acceptVideoJobController
);

router.get(
  "/jobs",
  authenticateAccessToken,
  userRateLimiter,
  videoController.getVideoJobsForUserController
);

router.get(
  "/jobs/:jobId",
  authenticateAccessToken,
  userRateLimiter,
  videoController.getVideoJobByIdController
);

export default router;
