import { z } from "zod";

export const transaction_schema = z.object({
  transactionDate: z.date({ required_error: "A date transaction is required." }),
  description: z.string(),
  cashAccountId: z.number(),
  categoryId: z.number(),
  amount: z.string(),
  type: z.string(),
});

export const auth_schema = z.object({
  username: z.string().nonempty(),
  password: z.string().nonempty(),
});
