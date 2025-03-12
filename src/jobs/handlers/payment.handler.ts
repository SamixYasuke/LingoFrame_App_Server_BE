// import { Job, Worker } from "bullmq";
// import { bullmqConfig } from "../../config/bullmq.config";
// import { refundTransaction } from "../../services/payment.service";

// const userRefundWorker = new Worker(
//   "user-refund-queue",
//   async (job: Job) => {
//     const { paymentReference, amountInKobo } = job.data;
//     try {
//       await refundTransaction(paymentReference, amountInKobo);
//     } catch (error: any) {
//       throw error;
//     }
//   },
//   bullmqConfig
// );

// export { userRefundWorker };
