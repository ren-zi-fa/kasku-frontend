import { create } from "zustand";
import instance from "@/lib/axios";
import { useEffect, useState } from "react";
import { ApiResponse, CashTransaction } from "@/types";

type Transaction = CashTransaction;
interface TransactionState {
  data?: ApiResponse<Transaction> | null;
  fetchData: () => Promise<void>;
}

export const fetchDataForTable = async (pagination: {
  pageIndex: number;
  pageSize: number;
}) => {
  const page = pagination.pageIndex + 1;
  const limit = pagination.pageSize;

  const res = await instance.get<ApiResponse<CashTransaction>>(
    `/cash-transaction?page=${page}&limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Mywicm9sZSI6InN0YWZmIiwidXNlcm5hbWUiOiJyZW56aSIsImlhdCI6MTc0OTIxNzQ5MCwiZXhwIjoxNzUxODA5NDkwfQ.rbr28B78yFzezRpMmdweAkhT3xoeKtVohq931XduGGQ`,
      },
    }
  );

  return {
    success: true,
    message: "Fetched successfully",
    data: res.data.data,
    meta: {
      total: res.data.meta.total,
      page: res.data.meta.page,
      pageCount: res.data.meta.pageCount,
      hasNext: res.data.meta.hasNext,
      hasPrev: res.data.meta.hasPrev,
    },
  };
};

export const useTransactionStore = create<TransactionState>((set) => ({
  data: null,
  fetchData: async (pagination?: { pageIndex: number; pageSize: number }) => {
    try {
      const page = (pagination?.pageIndex ?? 0) + 1;
      const size = pagination?.pageSize ?? 10;

      const res = await instance.get<ApiResponse<Transaction>>(
        `/cash-transaction?page=${page}&limit=${size}`,
        {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Mywicm9sZSI6InN0YWZmIiwidXNlcm5hbWUiOiJyZW56aSIsImlhdCI6MTc0OTIxNzQ5MCwiZXhwIjoxNzUxODA5NDkwfQ.rbr28B78yFzezRpMmdweAkhT3xoeKtVohq931XduGGQ`,
          },
        }
      );
      set({ data: res.data });
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
      .get(`/cash-transaction/${id}`)
      .then((res) => setTransaction(res.data.data))
      .catch((err) => setError(`Gagal mengambil kategori ${err} `))
      .finally(() => setLoading(false));
  }, [id]);

  return { transaction, loading, error };
}
