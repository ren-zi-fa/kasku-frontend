import { z } from "zod";

export const transaction_schema = z.object({
  transactionDate: z.string(),
  description: z.string(),
  type: z.string(),
  amount: z.number(),
});
