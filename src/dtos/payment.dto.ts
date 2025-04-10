import { z } from "zod";

export const createPaymentDTO = z.object({
  credits: z
    .number()
    .min(50, "Credits must be at least 50")
    .max(280, "Credits cannot exceed 280"),
});

export type CreatePaymentDTO = z.infer<typeof createPaymentDTO>;
