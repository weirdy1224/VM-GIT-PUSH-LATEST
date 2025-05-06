import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutGrid, User, Bug, BarChart2, FileText } from "lucide-react";
import "./Navbar.css";
const navItems = [
  { name: " Overview", icon: LayoutGrid, path: "/overview" },
  { name: " Discovery", icon: User, path: "/discovery" },
  { name: " Vulnerabilities", icon: Bug, path: "/vulnerabilities" },
  { name: " Scorecard", icon: BarChart2, path: "/scorecard" },
  { name: " Reports", icon: FileText, path: "/reports" },
];
import hebesec_png from "../images/hebesec_logo.png";
export default function Navbar() {
  return (
    <>
      <nav className="flex flex-col w-50 h-screen bg-gray-900 text-gray-400 text-center">
        <img src={hebesec_png} className="logo" />
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-10 py-3 hover:bg-gray-800 transition-colors duration-200   ${
                isActive ? "text-amber-400 border-2 border-amber-500 " : ""
              }`
            }
          >
            <item.icon
              className={`w-5 h-5 mr-3  ${
                item.isActive ? "text-amber-500" : ""
              }`}
            />
            <span className="text-sm font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </>
  );
}
