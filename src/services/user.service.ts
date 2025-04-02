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
}

export default UserService;
