import { z } from "zod";

export const createUserDto = z.object({
  first_name: z
    .string({ required_error: "First Name Required" })
    .min(1, "First Name Required"),
  last_name: z
    .string({ required_error: "Last Name Required" })
    .min(1, "Last Name Required"),
  email: z
    .string({ required_error: "Email Required" })
    .email("Invalid email address"),
  password: z
    .string({ required_error: "Password Required" })
    .min(8, "Password Must Have a Minimum of 8 Characters"),
  terms_accepted_at: z
    .string({ required_error: "Terms Accepted At Required" })
    .datetime(),
  terms_accepted_device: z
    .string({ required_error: "Device Info Required" })
    .min(1, "Device info is required"),
});

export const loginUserDto = z.object({
  email: z
    .string({ required_error: "Email Required" })
    .email("Invalid Email Address"),
  password: z
    .string({ required_error: "Password is Required" })
    .min(1, "Password is Required"),
});

export type CreateUserDto = z.infer<typeof createUserDto>;
export type LoginUserDto = z.infer<typeof loginUserDto>;
