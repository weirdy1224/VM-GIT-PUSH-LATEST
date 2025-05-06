"use client"
import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

// Navigation data structure
const navigation = {
  pages: [
    { name: "Clients", link: "/admin/client" },
    { name: "User Management", link: "/admin/user-management" },
    { name: "Upload Reports", link: "/admin/upload-reports" },
  ]
};

export function AppSidebar() {
  return (
    <Sidebar className="border-r bg-background">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.pages.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    asChild
                    isActive={item.isActive}
                    className="hover:bg-accent"
                  >
                    <a href={item.link}>
                      <span>{item.name}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}