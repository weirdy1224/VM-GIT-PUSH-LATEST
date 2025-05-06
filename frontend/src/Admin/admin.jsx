"use client";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./Navbar/Navbar.jsx";
import { useNavigate } from "react-router-dom";

export default function Admin() {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="flex">
      <SidebarProvider>
        <div className="flex min-h-screen">
          <AppSidebar onNavigate={handleNavigation} />
        </div>
        Welcome Admin
      </SidebarProvider>
    </div>
  );
}
