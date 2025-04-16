import { Router } from "express";
import VideoController from "../controllers/video.controller";

const router = Router();

const videoController = new VideoController();

router.post("/estimate", videoController.getVideoEstimateController);

router.post("/jobs/accept", videoController.acceptVideoJobController);

router.get("/jobs", videoController.getVideoJobsForUserController);

router.get("/jobs/:jobId", videoController.getVideoJobByIdController);

export default router;
