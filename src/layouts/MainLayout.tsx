import { AppSidebar } from "@/components/app-sidebar";
import Header from "@/components/ui/Header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";

export default function Page() {
  return (
    <div className="relative w-full">
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
