"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { toast } from "sonner";
import axios from "axios";
import AlertModal from "./AlertModal";
import instance from "@/lib/axios";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { ApiResponse } from "@/types";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  searchkey: string;
  deleteBulkEndpoint?: string;
  fetchData: (pagination: PaginationState) => Promise<ApiResponse<TData>>;
  dataAddition?: React.ReactNode;
  createForm?: React.ReactNode;
  pagination: PaginationState;
  setPagination: React.Dispatch<React.SetStateAction<PaginationState>>;
}

const queryClient = new QueryClient();

export function DataTable<TData, TValue>({
  columns,
  searchkey,
  deleteBulkEndpoint,
  dataAddition,
  createForm,
  pagination,
  setPagination,
  fetchData,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [openDelete, setOpenDelete] = React.useState(false);

  const { data: serverData, isLoading } = useQuery({
    queryKey: ["transactions", pagination],
    queryFn: () => fetchData(pagination),
    placeholderData: (prev) => prev,
  });

  const table = useReactTable({
    data: serverData?.data ?? [],
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
    pageCount: Math.ceil((serverData?.meta?.total ?? 0) / pagination.pageSize),
    onPaginationChange: setPagination,
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const handleBulkDelete = async () => {
    try {
      await instance.delete(`${deleteBulkEndpoint}`);
      toast.success("Data berhasil dihapus");
      setOpenDelete(false);
      fetchData(pagination);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const msg =
          error.response?.data?.message || error.message || "Unknown error";
        toast.error("Gagal menghapus data: " + msg);
      } else {
        toast.error("Gagal menghapus data: Unknown error");
      }
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center py-4 space-x-4">
        <Input
          placeholder="Search..."
          value={(table.getColumn(searchkey)?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn(searchkey)?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        {createForm && createForm}
        {dataAddition && dataAddition}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-md border max-w-lg mx-auto md:max-w-full overflow-hidden">
        <div className="w-full overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>

      <AlertModal
        handleBulkDelete={handleBulkDelete}
        setOpenDelete={setOpenDelete}
        openDelete={openDelete}
      />
    </div>
  );
}
