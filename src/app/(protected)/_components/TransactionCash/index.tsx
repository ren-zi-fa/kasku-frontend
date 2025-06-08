"use client";

import React from "react";
import { DataTable } from "../Data-Table";
import { columnTransaction } from "./ColumnTransaction";
import TransactionForm from "./Transaction-Form";
import { fetchDataForTable } from "@/hooks/use-transaction";

export default function DataTransactionCash() {
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  return (
    <DataTable
      createForm={<TransactionForm onSucces={() => {}} />}
      searchkey="description"
      deleteBulkEndpoint="/api/categories/bulk-delete"
      columns={columnTransaction}
      pagination={pagination}
      setPagination={setPagination}
      fetchData={fetchDataForTable}
    />
  );
}
