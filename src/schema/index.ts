import { z } from "zod";

export const transaction_schema = z.object({
  transactionDate: z.string(),
  description: z.string(),
  amount: z.number(),
});

export const auth_schema = z.object({
  username: z.string().nonempty(),
  password: z.string().nonempty(),
});
