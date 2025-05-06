"use client";
import * as React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "../Navbar/Navbar.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./client.css";

export default function Clients() {
  const navigate = useNavigate();
  const [users, setUsers] = React.useState([]);

  React.useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/users");

      setUsers(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      alert(
        `Error fetching users: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="flex">
      <SidebarProvider>
        <div className="flex min-h-screen">
          <AppSidebar onNavigate={handleNavigation} />
        </div>
      </SidebarProvider>
      <div className="container">
        <h1 className="page-title">Users</h1>
        {users.length === 0 ? (
          <p className="no-users">No clients found.</p>
        ) : (
          <div className="users-grid">
            {users.map((user) => (
              <div key={user._id} className="user-card">
                <h3 className="user-title">{user.companyName}</h3>
                <p className="user-detail">
                  <strong>Industry:</strong> {user.industry}
                </p>
                <p className="user-detail">
                  <strong>PIC Name:</strong> {user.picName}
                </p>
                <p className="user-detail">
                  <strong>Designation:</strong> {user.picDesignation}
                </p>
                <p className="user-detail">
                  <strong>Contact:</strong> {user.picContact}
                </p>
                <p className="user-detail">
                  <strong>Website:</strong>{" "}
                  <a
                    href={user.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {user.website}
                  </a>
                </p>
                <p className="user-detail">
                  <strong>Profile Link:</strong>{" "}
                  <a
                    href={user.profileLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {user.profileLink}
                  </a>
                </p>
                <p className="user-detail">
                  <strong>Unique ID{user._id}</strong>
                </p>
                <p className="user-detail">
                  <strong>Created At:</strong>{" "}
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
