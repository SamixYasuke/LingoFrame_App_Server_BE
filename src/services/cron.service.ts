import cron from "node-cron";
import { Credit } from "../models";

class CronService {
  constructor() {
    this.scheduleJobs();
  }

  private scheduleJobs() {
    cron.schedule("0 0 * * *", this.deleteExpiredCredits, {
      scheduled: true,
      timezone: "UTC",
    });
    console.log("Cron job scheduled to delete expired credits at midnight UTC");
  }

  private deleteExpiredCredits = async () => {
    try {
      const currentDate = new Date();
      const result = await Credit.deleteMany({
        expiry_date: { $lt: currentDate },
      });

      console.log(
        `Deleted ${
          result.deletedCount
        } expired credits at ${new Date().toISOString()}`
      );
    } catch (error) {
      console.error("Error deleting expired credits:", error);
    }
  };

  public runCleanupNow = async () => {
    await this.deleteExpiredCredits();
  };
}

export default CronService;
