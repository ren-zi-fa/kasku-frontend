"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogHeader,
  DialogDescription,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { transaction_schema } from "@/schema";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@/components/ui/form";
import { toast } from "sonner";
import instance from "@/lib/axios";
import axios from "axios";

type TransactionSchema = z.infer<typeof transaction_schema>;

interface FormProps {
  onSucces: () => void;
}
export default function TransactionForm({ onSucces }: FormProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<TransactionSchema>({
    resolver: zodResolver(transaction_schema),
    defaultValues: {
      amount: 0,
      description: "",
      transactionDate: "",
      type: "",
    },
  });
  console.log(form.formState.errors);

  const onSubmit = async (values: TransactionSchema) => {
    setLoading(true);
    try {
      const res = await instance.post("/api/categories", values);
      if (res.status === 201 || res.status === 200) {
        form.reset();
        toast.success("Kategori berhasil disimpan!");
        onSucces();
      } else {
        toast.error("Gagal menyimpan kategori.");
      }
    } catch (error) {
      const msg = axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : "Unknown error";
      toast.error("Gagal menyimpan kategori: " + msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Tambah Category</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] rounded-xl p-6">
        <DialogHeader>
          <DialogTitle>Tambah kategori Baru</DialogTitle>
          <DialogDescription>Isi data kategori di bawah ini.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="transactionDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">
                    Tanggal
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Tanggal" {...field} />
                  </FormControl>
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
                    <Input placeholder="Jumlah" {...field} />
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
                    <Input placeholder="Masukkan nama kategori" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">Type</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan nama kategori" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full text-base py-2"
              disabled={loading}
            >
              {loading ? "Menyimpan..." : "Simpan Kategori"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
