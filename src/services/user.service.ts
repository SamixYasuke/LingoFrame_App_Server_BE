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
      throw new CustomError(
        "Invalid user ID format. Please provide a valid MongoDB ObjectId.",
        400
      );
    }

    if (creditsToDeduct <= 0) {
      throw new CustomError(
        "Invalid deduction amount. Credits to deduct must be greater than zero.",
        400
      );
    }

    const user = await User.findById(userId).select("credits");
    if (!user) {
      throw new CustomError(
        "User not found. No account exists with the provided ID.",
        404
      );
    }

    if (user.credits < creditsToDeduct) {
      throw new CustomError(
        `Insufficient credits. You have ${user.credits} credits, but ${creditsToDeduct} are required. Please fund your wallet.`,
        402
      );
    }

    const updateResult = await User.updateOne(
      { _id: userId, credits: { $gte: creditsToDeduct } },
      [
        {
          $set: {
            credits: {
              $round: [{ $subtract: ["$credits", creditsToDeduct] }, 2],
            },
          },
        },
      ]
    );

    if (updateResult.modifiedCount === 0) {
      throw new CustomError(
        "Failed to deduct credits. The operation could not be completed, possibly due to a concurrent update. Please try again.",
        500
      );
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

  public getUserDetails = async (userId: string) => {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new CustomError("Invalid user ID format", 400);
    }

    const user = await User.findById(userId).select("credits first_name");

    if (!user) {
      throw new CustomError("User not found", 404);
    }

    const resData = {
      name: user.first_name,
      credits: user.credits,
    };

    return { user: resData };
  };
}

export default UserService;
