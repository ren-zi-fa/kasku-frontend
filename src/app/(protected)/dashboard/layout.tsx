import AdminPanelLayout from "@/components/admin-panel/admin-panel-layout";
import { Providers } from "@/providers/layout.provider";
export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AdminPanelLayout>
      <Providers>{children}</Providers>
    </AdminPanelLayout>
  );
}
