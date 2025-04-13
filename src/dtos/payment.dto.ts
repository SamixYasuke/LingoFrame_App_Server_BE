import { z } from "zod";

export const createPaymentDTO = z.object({
  bundle_price: z.union([
    z.literal(5),
    z.literal(10),
    z.literal(25),
    z.literal(50),
  ]),
});

export type CreatePaymentDTO = z.infer<typeof createPaymentDTO>;
