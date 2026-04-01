import { DashboardHeader } from "@/components/layout/dashboard-header";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { SidebarProvider } from "@/components/providers/sidebar-provider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <SidebarProvider>
        <div className="flex min-h-screen bg-slate-50 text-slate-900 dark:bg-[#11120f] dark:text-stone-100">
          <DashboardSidebar />
          <div className="min-w-0 flex-1">
            <DashboardHeader />
            <main>{children}</main>
          </div>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
}
