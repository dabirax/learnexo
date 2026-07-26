import { AppSidebar } from "@/components/app-sidebar";
import Header from "@/components/ui/Header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Outlet, useParams } from "react-router-dom";

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const inAssessment = !!id && !isNaN(parseInt(id));

  if (inAssessment) {
    return <Outlet />;
  }

  return (
    <div className="relative w-full min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      <SidebarProvider>
        <AppSidebar />
        <div className="w-full max-h-screen mt-24">
          <Header />
          <Outlet />
        </div>
      </SidebarProvider>
    </div>
  );
}
