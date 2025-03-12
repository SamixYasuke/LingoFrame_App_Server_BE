import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { ExpressAdapter } from "@bull-board/express";
// import { welcomeEmailQueue, emailOtpQueue } from "../jobs/queues/email.queue";
// import { userRefundQueue } from "../jobs/queues/payment.queue";

const setupBullBoard = () => {
  const serverAdapter = new ExpressAdapter();
  serverAdapter.setBasePath("/ui");

  createBullBoard({
    queues: [
      // new BullMQAdapter(welcomeEmailQueue),
      // new BullMQAdapter(emailOtpQueue),
      // new BullMQAdapter(userRefundQueue),
    ],
    serverAdapter,
  });

  return serverAdapter;
};

export default setupBullBoard;
