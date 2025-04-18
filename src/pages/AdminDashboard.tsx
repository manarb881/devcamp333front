
import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useData } from "@/contexts/DataContext";
import { 
  BarChart,
  Package,
  ShoppingCart,
  Settings,
  User,
  Users,
} from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { isAdmin } = useData();
  const location = useLocation();
  
  // Redirect if not an admin
  if (!isAdmin) {
    setTimeout(() => navigate("/"), 0);
    return null;
  }

  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen pt-16 pb-12 flex flex-col">
      <SidebarProvider>
        <div className="flex flex-1 w-full">
          <Sidebar>
            <SidebarHeader className="py-4 border-b">
              <div className="px-2 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Admin Dashboard</h2>
                <SidebarTrigger />
              </div>
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Overview</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton 
                        onClick={() => navigate("/admin")}
                        isActive={location.pathname === "/admin"} 
                        tooltip="Dashboard"
                      >
                        <BarChart className="mr-2 h-5 w-5" />
                        <span>Dashboard</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>

              <SidebarGroup>
                <SidebarGroupLabel>Catalog</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton 
                        onClick={() => navigate("/products/admin")}
                        isActive={location.pathname.includes("/products/admin")}
                        tooltip="Products"
                      >
                        <Package className="mr-2 h-5 w-5" />
                        <span>Products</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>



              <SidebarGroup>
                <SidebarGroupLabel>System</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton 
                        onClick={() => navigate("/settings")} 
                        tooltip="Settings"
                      >
                        <Settings className="mr-2 h-5 w-5" />
                        <span>Settings</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>

          <div className="flex-1 p-6 md:p-8">
            <Outlet />
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default AdminDashboard;
