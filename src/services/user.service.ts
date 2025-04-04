import mongoose from "mongoose";
import { CustomError } from "../errors/CustomError";
import { User } from "../models";

class UserService {
  constructor() {}

  public getUserAvailableCredits = async (
    userId: string
  ): Promise<{ credits: number }> => {
    const user = await User.findById(userId);

    if (!user) {
      throw new CustomError("User not found", 404);
    }

    return { credits: user.credits ?? 0 };
  };

  public deductUserCredits = async (
    userId: string,
    creditsToDeduct: number
  ): Promise<void> => {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new CustomError("Invalid user ID format", 400);
    }

    if (creditsToDeduct <= 0) {
      throw new CustomError("Invalid deduction amount", 400);
    }

    const updateResult = await User.updateOne(
      { _id: userId, credits: { $gte: creditsToDeduct } },
      { $inc: { credits: -creditsToDeduct } }
    );

    if (updateResult.matchedCount === 0) {
      throw new CustomError(
        "User not found or insufficient credits, please fund your wallet",
        402
      );
    }

    if (updateResult.modifiedCount === 0) {
      throw new CustomError("Failed to deduct credits", 500);
    }
  };

  public refundUserCredits = async (
    userId: string,
    creditsToRefund: number
  ): Promise<void> => {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new CustomError("Invalid user ID format", 400);
    }

    if (creditsToRefund <= 0) {
      throw new CustomError("Invalid refund amount", 400);
    }

    const updateResult = await User.updateOne(
      { _id: userId },
      { $inc: { credits: creditsToRefund } }
    );

    if (updateResult.matchedCount === 0) {
      throw new CustomError("User not found", 404);
    }

    if (updateResult.modifiedCount === 0) {
      throw new CustomError("Failed to refund credits", 500);
    }
  };
}

export default UserService;
