"use client";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogHeader,
  DialogDescription,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { transaction_schema } from "@/schema";
import { Input } from "@/components/ui/input";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
  FormDescription,
} from "@/components/ui/form";
import { toast } from "sonner";
import instance from "@/lib/axios";
import axios from "axios";
import {
  useCashAccounts,
  useTransactionCategories,
} from "@/hooks/use-data-store";

import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FieldSelect } from "@/components/fieldSelect";

type TransactionSchema = z.infer<typeof transaction_schema>;

interface FormProps {
  onSucces: () => void;
}
export default function TransactionForm({ onSucces }: FormProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<TransactionSchema>({
    resolver: zodResolver(transaction_schema),
    defaultValues: {
      amount: "",
      description: "",
      transactionDate: undefined,
      cashAccountId: 0,
      categoryId: 0,
      type: "",
    },
  });
  const { setError } = form;
  type LoginErrorType = string | { msg?: string } | { msg?: string }[] | null;
  const [loginError, setLoginError] = useState<LoginErrorType>("");

  const { data: cashAccount, error, fetchData } = useCashAccounts();
  const {
    data: categories,
    error: errroCategories,
    fetchData: fetchCategories,
  } = useTransactionCategories();

  useEffect(() => {
    fetchData("/cash-accounts");
    fetchCategories("/transaction-categories");
    if (error) {
      toast.error(error);
    }
    if (errroCategories) {
      toast.error(errroCategories);
    }
  }, [error, errroCategories]);

  const onSubmit = async (values: TransactionSchema) => {
    setLoading(true);
    try {
      const res = await instance.post("/cash-transaction", values);
      if (res.status === 201 || res.status === 200) {
        form.reset();
        toast.success("transaksi berhasil disimpan!");
        onSucces();
      } else {
        toast.error("Gagal menyimpan transaksi.");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const messages = error.response?.data?.message;
        setLoginError(messages ?? "Terjadi kesalahan");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!loginError) return;

    if (typeof loginError === "string") {
      toast.error(loginError);
    } else if (Array.isArray(loginError)) {
    
      loginError.forEach((msg) => {
        if (typeof msg === "string") {
          toast.error(msg);
        }
      });
    } else if (typeof loginError === "object" && loginError?.msg) {
      toast.error(loginError.msg);
    } else {
      toast.error("Terjadi kesalahan.");
    }
  }, [loginError]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Tambah Transaksi</Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[500px] sm:max-h-[600px] overflow-auto rounded-xl p-6"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Tambah Transaksi Baru</DialogTitle>
          <DialogDescription>
            Isi data Transaksi di bawah ini.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="transactionDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date of Transaction</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Tanggal Terjadinya Transaksi
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">
                    Amount
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="1200000"
                      {...field}
                      onChange={(e) => field.onChange(String(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">
                    Deskripsi
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      onChange={(e) => field.onChange(e.target.value)}
                      value={field.value}
                      placeholder="Tulis deskripsi..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {categories && (
              <FieldSelect
                name="categoryId"
                control={form.control}
                label="Category"
                data={categories}
                getValue={(cat) => cat.id}
                getLabel={(cat) => cat.name}
                placeholder="Pilih kategori"
                disabled={loading}
              />
            )}
            {categories && (
              <FieldSelect
                name="type"
                control={form.control}
                label="Type"
                data={categories}
                getValue={(cat) => cat.type}
                getLabel={(cat) => cat.type}
                placeholder="Pilih type"
                disabled={loading}
              />
            )}
            {cashAccount && (
              <FieldSelect
                name="cashAccountId"
                control={form.control}
                label="Cash account"
                data={cashAccount}
                getValue={(cash) => cash.id}
                getLabel={(cash) => cash.name}
                placeholder="cash account"
                disabled={loading}
              />
            )}

            <Button
              type="submit"
              className="w-full text-base py-2"
              disabled={loading}
            >
              {loading ? "Menyimpan..." : "Simpan transaksi"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
