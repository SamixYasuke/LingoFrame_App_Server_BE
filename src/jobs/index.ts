// import { userRefundQueue } from "./queues/payment.queue";
// import { emailOtpQueue, welcomeEmailQueue } from "./queues/email.queue";

// const refundUserJob = async (
//   paymentReference: string,
//   amountInKobo: number
// ) => {
//   const data = { paymentReference, amountInKobo };
//   await userRefundQueue.add("user-refund-queue", data, {
//     attempts: 3,
//     backoff: 10000,
//   });
// };

// const sendWelcomeEmailJob = async (email: string) => {
//   const data = { email };
//   await welcomeEmailQueue.add("welcome-email-queue", data, {
//     attempts: 3,
//     backoff: 5000,
//   });
// };

// const emailOtpJob = async (email: string, otp: string) => {
//   const data = { email, otp };
//   await emailOtpQueue.add("email-otp-queue", data, {
//     attempts: 3,
//     backoff: 5000,
//   });
// };

// export { refundUserJob, sendWelcomeEmailJob, emailOtpJob };
