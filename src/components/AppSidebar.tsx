
import { useState } from "react";
import { 
  BarChart3, 
  Package, 
  Users, 
  FileText, 
  Settings, 
  CreditCard,
  PieChart,
  TrendingUp 
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useTranslation } from "react-i18next";


export function AppSidebar() {
  const { t } = useTranslation();
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const isCollapsed = state === "collapsed";

  const menuItems = [
    { title: t('navigation.dashboard'), url: "/", icon: BarChart3 },
    { title: t('navigation.analytics'), url: "/analytics", icon: PieChart },
    { title: t('navigation.products'), url: "/products", icon: Package },
    { title: t('navigation.customers'), url: "/customers", icon: Users },
    { title: t('navigation.invoices'), url: "/invoices", icon: FileText },
    { title: t('navigation.payments'), url: "/payments", icon: CreditCard },
    { title: t('navigation.reports'), url: "/reports", icon: TrendingUp },
    { title: t('navigation.settings'), url: "/settings", icon: Settings },
  ];

  const isActive = (path: string) => {
    if (path === "/" && currentPath === "/") return true;
    if (path !== "/" && currentPath.startsWith(path)) return true;
    return false;
  };

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-primary/10 text-primary border-r-2 border-primary font-medium" 
      : "hover:bg-accent/50 text-muted-foreground hover:text-foreground";

  return (
    <Sidebar className={isCollapsed ? "w-16" : "w-64"} collapsible="icon">
      <SidebarContent className="bg-sidebar-background">
        <div className="p-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg honey-gradient flex items-center justify-center">
              <span className="text-white font-bold text-sm">🐝</span>
            </div>
            {!isCollapsed && (
              <div>
                <h2 className="font-bold text-lg honey-text">HoneyBEE</h2>
                <p className="text-xs text-muted-foreground">Accounting Software</p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end={item.url === "/"} 
                      className={getNavCls({ isActive: isActive(item.url) })}
                    >
                      <item.icon className="h-4 w-4 mr-3" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
