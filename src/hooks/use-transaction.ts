import { create } from "zustand";
import instance from "@/lib/axios";
import { transaction_schema } from "@/schema";
import { useEffect, useState } from "react";
import { z } from "zod";
import {  CashTransaction } from "@/types";

type Transaction = CashTransaction;
interface TransactionState {
  data: Transaction[];
  fetchData: () => Promise<void>;
}

export const useTransactionStore = create<TransactionState>((set) => ({
  data: [],
  fetchData: async () => {
    try {
      const res = await instance.get("/cash-transaction");
      set({ data: res.data.data });
    } catch (e) {
      console.log(e);
    }
  },
}));

export function useTransactionById(id: string | undefined) {
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    instance
      .get(`/api/categories/${id}`)
      .then((res) => setTransaction(res.data.data))
      .catch((err) => setError(`Gagal mengambil kategori ${err} `))
      .finally(() => setLoading(false));
  }, [id]);

  return { transaction, loading, error };
}
