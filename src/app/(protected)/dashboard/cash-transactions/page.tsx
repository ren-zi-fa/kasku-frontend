import { ContentLayout } from "@/components/admin-panel/content-layout";
import DataTransactionCash from "../../_components/TransactionCash";

export default function page() {
  return (
    <ContentLayout title="Transaksi Kas">
      <div>Test</div>
      <div className="flex justify-center">
        <DataTransactionCash />
      </div>
    </ContentLayout>
  );
}
