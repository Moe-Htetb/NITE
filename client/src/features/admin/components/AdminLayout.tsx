import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import AdminSidebar from "./AdminSidebar";
import { useEffect } from "react";
// import { getCookie } from "react-use-cookie";
import { Outlet, useNavigate } from "react-router";
import { memo } from "react";
import { useAppSelector } from "@/types/useRedux";
import { selectIsAuthenticated, selectUserRole } from "@/store/authSlice";

const AdminLayout = () => {
  const navigate = useNavigate();

  const userRole = useAppSelector(selectUserRole);
  const isLogin = useAppSelector(selectIsAuthenticated);
  useEffect(() => {
    if (!isLogin) {
      navigate("/login");
    }
    if (userRole !== "admin") {
      navigate("/");
    }
  }, [navigate]);

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset className="bg-white">
        <header className="flex py-5 shrink-0 items-center gap-2 border-b border-gray-200 bg-white px-4">
          <SidebarTrigger className="text-gray-700 hover:bg-gray-100" />
          <div className="flex-1" />
        </header>
        <div className="flex flex-1 flex-col overflow-auto">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default memo(AdminLayout);
