import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { LayoutGrid, User, Bug, BarChart2, FileText } from "lucide-react";
import "./Navbar.css";
import hebesec_png from "../images/hebesec_logo.png";
const navItems = [
  { name: "Overview", icon: LayoutGrid, path: "/overview" },
  { name: "Discovery", icon: User, path: "/discovery" },
  { name: "Vulnerabilities", icon: Bug, path: "/vulnerabilities" },
  { name: "Scorecard", icon: BarChart2, path: "/scorecard" },
  { name: "Reports", icon: FileText, path: "/reports" },
];

export default function Navbar() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <nav>
      <div className="logo">
        <img src={hebesec_png} alt="Hebesec Logo" />
      </div>

      {navItems.map((item) => (
        <NavLink
          key={item.name}
          to={item.path}
          className={({ isActive }) =>
            `flex items-center px-4 py-3 transition-colors duration-200 ${
              isActive ? "active" : ""
            }`
          }
        >
          <item.icon className="w-5 h-5 mr-3" />
          <span className="text-sm font-medium">{item.name}</span>
        </NavLink>
      ))}
            <button className="theme-toggle" onClick={toggleTheme}>
        {theme === "light" ? "Dark Mode" : "Light Mode"}
      </button>
    </nav>
  );
}