import { z } from "zod";

export const aceptingMessageSchema = z.object({
  messages: z.boolean(),
});
