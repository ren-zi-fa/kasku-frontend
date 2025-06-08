import { ContentLayout } from "@/components/admin-panel/content-layout";
import instance from "@/lib/axios";
import { ApiResponse } from "@/types";

type Transaction = {
  id: number;
  type: string;
  amount: string;
  transactionDate: string;
  createdAt: string;
  description: string;
};
export default async function Page() {
  const res = await instance.get<ApiResponse<Transaction>>(
    "/cash-transaction",
    {
      headers: {
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Mywicm9sZSI6InN0YWZmIiwidXNlcm5hbWUiOiJyZW56aSIsImlhdCI6MTc0OTIxNzQ5MCwiZXhwIjoxNzUxODA5NDkwfQ.rbr28B78yFzezRpMmdweAkhT3xoeKtVohq931XduGGQ`,
      },
    }
  );
  return (
    <ContentLayout title="Test">
      <div>Test</div>
    </ContentLayout>
  );
}
