import { Router } from "express";
import UserController from "../controllers/user.controller";

const router = Router();
const userController = new UserController();

router.get("/", userController.getUserDetailsController);

router.get("/credits", userController.getUserAvailableCredits);

export default router;
