"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import CellAction from "./CellActionTransaction";
import { CashTransaction } from "@/types";

type TransactionColumn = CashTransaction;

export const columnTransaction: ColumnDef<TransactionColumn>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: "transactionDate",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Tanggal Transaksi <ArrowUpDown className="ml-1 inline" />
      </Button>
    ),
    cell: ({ getValue }) => {
      const rawDate = getValue();
      const date = new Date(rawDate as string);
      return date.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    },
  },
  {
    accessorKey: "description",
    header: "Deskripsi",
    cell: ({ getValue }) => {
      const data = getValue();
      const deskripsi = data as string;
      return <div className="whitespace-normal break-words">{deskripsi}</div>;
    },
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "amount",
    header: "Jumlah",
    cell: (info) => info.getValue(),
  },
  {
    header: "Category ",
    accessorFn: (row) => row.category?.name ?? "-",
    id: "categoryName",
  },

  {
    header: "Di Inputkan Oleh",
    accessorFn: (row) =>
      row.user ? `${row.user.username} (${row.user.role})` : "-",
    cell: (info) => info.getValue(),
    id: "username",
  },
  {
    header: "Akun Kas",
    accessorFn: (row) => row.cashAccount?.name ?? "-",
    id: "cash",
  },
  {
    accessorKey: "createdAt",
    header: "Waktu Di Inputkan",
    cell: ({ getValue }) => {
      const rawDate = getValue();
      const date = new Date(rawDate as string);
      return date.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    },
  },

  {
    accessorKey: "actions",
    cell: ({ row }) => <CellAction data={row.original}></CellAction>,
  },
];
