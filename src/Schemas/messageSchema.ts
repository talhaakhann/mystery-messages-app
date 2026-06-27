import { z } from "zod";

export const messageSchema = z.object({
  content: z.string()
  .min(10,{message:"content must be atleast of 10 letters"})
  .max(100,{message:"content must be atleast of 100 letters"})
});
