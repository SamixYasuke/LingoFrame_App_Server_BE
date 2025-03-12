// import { Job, Worker } from "bullmq";
// import { bullmqConfig } from "../../config/bullmq.config";
// import { sendOtpEmail, sendWelcomeEmail } from "../../services/email.service";

// const welcomeEmailWorker = new Worker(
//   "welcome-email-queue",
//   async (job: Job) => {
//     const { email } = job.data;
//     await sendWelcomeEmail(email);
//   },
//   bullmqConfig
// );

// const sendOtpEmailWorker = new Worker(
//   "email-otp-queue",
//   async (job: Job) => {
//     const { email, otp } = job.data;
//     await sendOtpEmail(email, otp);
//   },
//   bullmqConfig
// );

// export { welcomeEmailWorker, sendOtpEmailWorker };
