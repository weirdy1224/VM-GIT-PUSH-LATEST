import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Vuln_circle from "./vuln_circle";
import ScanSummary from "./scan_summary.jsx";
import "./Overview.css";
import VulnerableTargetsTable from "./VulnerableTargetsTable.jsx";
import TopVulnerabilitiesList from "./TopVulnerability.jsx";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, Settings, LogOut } from "lucide-react";
import axios from "axios";

function Overview() {
  const navigate = useNavigate();
  const [severityCounts, setSeverityCounts] = useState({
    Critical: 0,
    High: 0,
    Medium: 0,
    Low: 0,
  });

  function handleLogout() {
    localStorage.removeItem("companyName");
    localStorage.removeItem("email");
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/");
  }

  useEffect(() => {
    const fetchVulnerabilityData = async () => {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");

      if (!userId || !token) return;

      try {
        const response = await axios.get("http://localhost:5000/api/mostvul", {
          headers: { Authorization: `Bearer ${token}`, "X-User-Id": userId },
        });

        if (!response.data.success) {
          throw new Error(response.data.message || "API returned an error");
        }

        let updatedCounts = { Critical: 0, High: 0, Medium: 0, Low: 0 };
        response.data.data.forEach((vuln) => {
          if (vuln.severity in updatedCounts) {
            updatedCounts[vuln.severity] += 1;
          }
        });

        setSeverityCounts(updatedCounts);
      } catch (error) {
        console.error("Error fetching vulnerability data:", error);
      }
    };

    fetchVulnerabilityData();
  }, []);

  return (
    <div className="flex">
      <Navbar />
      <div className="overview-container">
        <div className="overview-header flex items-center justify-between">
          <h1>Hello, User</h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="w-auto justify-between px-4 py-3 hover:bg-slate-200 transition-colors duration-200"
              >
                <div className="flex items-center">
                  <User className="w-5 h-5 mr-3" />
                  <span className="text-sm font-medium">Account</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-gray-300 text-black-400 border-gray-700">
              <DropdownMenuItem className="focus:bg-gray-700 focus:text-gray-200">
                <Settings className="w-4 h-4 mr-2" />
                <span>Account Details</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="focus:bg-gray-700 focus:text-gray-200"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="vuln-section">
          <Vuln_circle count={severityCounts.Critical} severity="Critical" />
          <Vuln_circle count={severityCounts.High} severity="High" />
          <Vuln_circle count={severityCounts.Medium} severity="Medium" />
          <Vuln_circle count={severityCounts.Low} severity="Low" />
        </div>

        <div className="scan-summary">
          <ScanSummary
            scansRunning={1}
            totalScansCompleted={3}
            openVulnerabilities={4}
            totalTargets={5}
          />
        </div>

        <div className="vuln-list">
          <VulnerableTargetsTable />
          <TopVulnerabilitiesList />
        </div>
      </div>
    </div>
  );
}

export default Overview;
