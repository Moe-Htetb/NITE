import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Package,
  Folder,
  Users,
  BarChart3,
  Settings,
  HomeIcon,
  LogOut,
  ShoppingBag,
  FileText,
  TrendingUp,
} from "lucide-react";
import { Link, useLocation } from "react-router";

const menuItems = [
  {
    title: "Main",
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "Products",
        url: "/dashboard/products",
        icon: Package,
      },
      {
        title: "Categories",
        url: "/dashboard/categories",
        icon: Folder,
      },
      {
        title: "Orders",
        url: "/dashboard/orders",
        icon: ShoppingBag,
      },
    ],
  },
  {
    title: "Analytics",
    items: [
      {
        title: "Reports",
        url: "/dashboard/reports",
        icon: FileText,
      },
      {
        title: "Analytics",
        url: "/dashboard/analytics",
        icon: BarChart3,
      },
      {
        title: "Trends",
        url: "/dashboard/trends",
        icon: TrendingUp,
      },
    ],
  },
  {
    title: "Settings",
    items: [
      {
        title: "Users",
        url: "/dashboard/users",
        icon: Users,
      },
      {
        title: "Settings",
        url: "/dashboard/settings",
        icon: Settings,
      },
      {
        title: "Home",
        url: "/",
        icon: HomeIcon,
      },
    ],
  },
];

const AdminSidebar = () => {
  const location = useLocation();

  return (
    <Sidebar collapsible="icon" className="border-r border-gray-200 bg-white">
      <SidebarHeader className="border-b border-gray-200 p-4 bg-white">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-black flex items-center justify-center shrink-0">
            <Package className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-lg font-bold text-black">NITE Admin</span>
            <span className="text-xs text-gray-500">Dashboard</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-white">
        {menuItems.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel className="text-gray-600 font-medium text-xs uppercase tracking-wider px-2">
              {group.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const IconComponent = item.icon;
                  const isActive = location.pathname === item.url;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={item.title}
                        className={`${
                          isActive ? "bg-black text-white " : "text-gray-700"
                        }`}
                      >
                        <Link to={item.url}>
                          <IconComponent />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="border-t border-gray-200 p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Logout"
              className="text-gray-700 hover:bg-red-50 hover:text-red-600"
            >
              <LogOut />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};

export default AdminSidebar;
