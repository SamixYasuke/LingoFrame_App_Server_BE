import { WorkerOptions, QueueOptions } from "bullmq";
import dotenv from "dotenv";

dotenv.config();

const bullmqConfig: QueueOptions & WorkerOptions = {
  connection: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD,
  },
};

export { bullmqConfig };
