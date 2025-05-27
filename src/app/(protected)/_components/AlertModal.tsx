"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface AlertProps {
  openDelete: boolean;
  setOpenDelete: React.Dispatch<React.SetStateAction<boolean>>;
  selectedIds?: (string | number)[];
  handleBulkDelete: () => void;
}
export default function AlertModal({
  openDelete,
  selectedIds,
  handleBulkDelete,
  setOpenDelete,
}: AlertProps) {
  return (
    <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="">
              Apakah Anda yakin ingin menghapus kategori berikut?
              <ul className="mt-2 list-disc ml-6 text-sm text-muted-foreground">
                {selectedIds?.map((id) => (
                  <li key={id}>{id}</li>
                ))}
              </ul>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline" onClick={() => setOpenDelete(false)}>
              Batal
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button variant="destructive" onClick={handleBulkDelete}>
              Lanjutkan
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
