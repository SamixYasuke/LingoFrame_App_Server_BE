import mongoose from "mongoose";
import { CustomError } from "../errors/CustomError";
import { Credit, User } from "../models";

class UserService {
  constructor() {}

  public getUserAvailableCredits = async (userId: string): Promise<any> => {
    const user = await User.findById(userId);
    const currentDate = new Date();

    if (!user) {
      throw new CustomError("User not found", 404);
    }

    const result = await Credit.aggregate([
      { $match: { user_id: userId, expiry_date: { $gte: currentDate } } },
      { $group: { _id: "$user_id", total_credits: { $sum: "$credits" } } },
    ]);

    if (!result.length) {
      return { credits: 0 };
    }
    return { credits: result[0].total_credits };
  };

  public deductUserCredits = async (
    userId: string,
    creditsToDeduct: number
  ): Promise<void> => {
    try {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new CustomError("Invalid user ID format", 400);
      }

      const user = await User.findById(userId);

      if (!user) {
        throw new CustomError("User not found", 404);
      }

      if (creditsToDeduct <= 0) {
        throw new CustomError("Invalid deduction amount", 400);
      }

      // Get all unexpired credits, sorted by expiry date (earliest first)
      const credits = await Credit.find({
        user_id: userId,
        expiry_date: { $gte: new Date() },
        credits: { $gt: 0 },
      }).sort({ expiry_date: 1 });

      if (!credits.length) {
        throw new CustomError(
          "Insufficient credits, please fund your wallet",
          402
        );
      }

      let remainingToDeduct = creditsToDeduct;
      const updates: Array<Promise<any>> = [];

      // Loop through credits from earliest expiring
      for (const credit of credits) {
        if (remainingToDeduct <= 0) break;

        if (credit.credits >= remainingToDeduct) {
          // This credit has enough to cover remaining amount
          credit.credits -= remainingToDeduct;
          remainingToDeduct = 0;
        } else {
          // Use up all of this credit and continue
          remainingToDeduct -= credit.credits;
          credit.credits = 0;
        }

        updates.push(credit.save());
      }

      if (remainingToDeduct > 0) {
        throw new CustomError(
          "Insufficient credits, please fund your wallet",
          402
        );
      }

      await Promise.all(updates);
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
    }
  };

  public refundUserCredits = async (
    userId: string,
    creditsToRefund: number
  ): Promise<void> => {
    try {
      const credit = await Credit.findOne({
        user_id: userId,
        expiry_date: { $gte: new Date() },
      }).sort({ expiry_date: 1 });

      if (credit) {
        credit.credits += creditsToRefund;
        await credit.save();
      } else {
        const newCredit = new Credit({
          user_id: userId,
          credits: creditsToRefund,
          purchase_date: new Date(),
          expiry_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 DAYS
          package_type: "refund",
        });
        await newCredit.save();
      }
    } catch (error) {
      throw new CustomError("Error refunding credits", 500);
    }
  };
}

export default UserService;
