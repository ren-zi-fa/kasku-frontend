import { create } from "zustand";
import instance from "@/lib/axios";
import { CashAccount, TransactionCategory, User } from "@/types";
import axios from "axios";

interface DataApi<T, E = unknown> {
  data: T | null;
  error: E | null;
  fetchData: (endpoint: string) => Promise<void>;
}

export function useFetchDataStore<T, E = string>() {
  return create<DataApi<T, E>>((set) => ({
    data: null,
    error: null,
    fetchData: async (endpoint: string) => {
      try {
        const res = await instance.get(endpoint);
        let extractedData: any = res.data.data;

        if (endpoint.includes("profile") && extractedData.user) {
          extractedData = extractedData.user;
        }

        set({ data: extractedData, error: null });
      } catch (err) {
        const msg = axios.isAxiosError(err)
          ? err.response?.data?.message || err.message
          : "Unknown error";

        set({ error: msg as E });
      }
    },
  }));
}

export const useCashAccounts = useFetchDataStore<CashAccount[], string>();
export const useTransactionCategories = useFetchDataStore<
  TransactionCategory[],
  string
>();
export const useProfileStore = useFetchDataStore<User, string>();
