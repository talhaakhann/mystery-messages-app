import { z } from "zod";

export const usernameSchema = z
  .string()
  .min(2, "username must be of 2 letters")
  .max(20, "username must be of 20 letters")
  .regex(
    /^[a-zA-Z0-9_]{3,20}$/,
    "Username must be 3-20 characters and contain only letters, numbers, and underscores",
  );

export const signUpSchema = z.object({
  username: usernameSchema,
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .regex(
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      "Please provide a valid email address",
    ),
  password: z
  .string().min(6, "Password must be atleast 6 letters"),
});
