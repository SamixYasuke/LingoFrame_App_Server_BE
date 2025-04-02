import { Request, Response } from "express";
import { AuthenticatedRequest } from "../types/express";
import UserService from "../services/user.service";
import { asyncHandler } from "../utils/asyncHandler";

class UserController {
  private readonly userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  public getUserAvailableCredits = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const { user_id } = req.user;
      const credits = await this.userService.getUserAvailableCredits(user_id);
      return res.status(200).json({
        status_code: 200,
        message: "Credit Retrived Successfully",
        data: credits,
      });
    }
  );
}

export default UserController;
