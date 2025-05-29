"use client";

import React, { useEffect } from "react";

import { DataTable } from "../Data-Table";
import { useTransactionStore } from "@/hooks/use-transaction";
import { columnTransaction } from "./ColumnTransaction";
import TransactionForm from "./Transaction-Form";

export default function DataTransactionCash() {
  const { data, fetchData } = useTransactionStore();

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <>
      {data && (
        <DataTable
          createForm={<TransactionForm onSucces={fetchData} />}
          searchkey="description"
          deleteBulkEndpoint="/api/categories/bulk-delete"
          data={data}
          columns={columnTransaction}
          onRefresh={fetchData}
        />
      )}
    </>
  );
}
