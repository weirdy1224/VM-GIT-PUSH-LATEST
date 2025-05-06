"use client";
import * as React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "../Navbar/Navbar.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./user.css";

export default function User() {
  const [option, setOption] = React.useState("");
  const [selectedUser, setSelectedUser] = React.useState(null);
  const [users, setUsers] = React.useState([]);
  const [formData, setFormData] = React.useState({
    companyName: "",
    industry: "",
    picName: "",
    picDesignation: "",
    picContact: "",
    website: "",
    profileLink: "",
  });
  const [loginFormData, setLoginFormData] = React.useState({
    email: "",
    password: "",
    role: "client", // Default role is "client"
  });

  const navigate = useNavigate();

  React.useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      console.log("Fetching users from http://localhost:5000/api/users");
      const response = await axios.get("http://localhost:5000/api/users");
      setUsers(response.data);
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

  const handleOptionChange = (value) => {
    setOption(value);
    setSelectedUser(null);
    setFormData({
      companyName: "",
      industry: "",
      picName: "",
      picDesignation: "",
      picContact: "",
      website: "",
      profileLink: "",
    });
    setLoginFormData({
      email: "",
      password: "",
      role: "client",
    });
  };

  const handleInputChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleLoginInputChange = (event) => {
    setLoginFormData({
      ...loginFormData,
      [event.target.name]: event.target.value,
    });
  };

  const handleAddUser = async () => {
    // Validate fields before sending the request
    if (
      !formData.companyName ||
      !formData.industry ||
      !formData.picName ||
      !formData.picDesignation ||
      !formData.picContact ||
      !formData.website ||
      !formData.profileLink ||
      !loginFormData.email ||
      !loginFormData.password
    ) {
      alert("All fields are required!");
      return;
    }

    try {
      console.log("Registering user with data:", {
        ...formData,
        ...loginFormData,
      });

      // Make a single API request to register the user
      const response = await axios.post("http://localhost:5000/api/users", {
        ...formData,
        ...loginFormData,
      });

      // Get the token and user data from the response
      const { token, user } = response.data;

      // Store the token (optional, for authentication)
      localStorage.setItem("authToken", token);

      alert(`User registered successfully! Welcome, ${user.companyName}.`);

      // Refresh user list
      fetchUsers();

      // Reset form fields
      setFormData({
        companyName: "",
        industry: "",
        picName: "",
        picDesignation: "",
        picContact: "",
        website: "",
        profileLink: "",
      });

      setLoginFormData({
        email: "",
        password: "",
        role: "client",
      });
    } catch (error) {
      console.error("Error registering user:", error);
      alert(
        `Error registering user: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  const handleModifyUser = async () => {
    if (!selectedUser) return alert("Please select a user to modify.");
    try {
      console.log(
        "Modifying user with data:",
        formData,
        "for ID:",
        selectedUser._id
      );
      const response = await axios.put(
        `http://localhost:5000/api/users/${selectedUser._id}`,
        formData
      );
      alert("User modified successfully!");
      fetchUsers();
      setSelectedUser(null);
      setFormData({
        companyName: "",
        industry: "",
        picName: "",
        picDesignation: "",
        picContact: "",
        website: "",
        profileLink: "",
      });
    } catch (error) {
      console.error("Error modifying user:", error);
      alert(
        `Error modifying user: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return alert("Please select a user to delete.");
    try {
      console.log("Deleting user with ID:", selectedUser._id);
      await axios.delete(`http://localhost:5000/api/users/${selectedUser._id}`);
      alert("User deleted successfully!");
      fetchUsers();
      setSelectedUser(null);
    } catch (error) {
      console.error("Error deleting user:", error);
      alert(
        `Error deleting user: ${error.response?.data?.message || error.message}`
      );
    }
  };

  return (
    <div className="flex">
      <SidebarProvider>
        <div className="flex min-h-screen">
          <AppSidebar onNavigate={handleNavigation} />
        </div>
      </SidebarProvider>
      <div className="container">
        <h1 className="title">What would you like to do?</h1>
        <div className="options-container">
          <div className="option-cards">
            <div
              className={`option-card ${option === "add" ? "selected" : ""}`}
              onClick={() => handleOptionChange("add")}
            >
              <span className="option-icon">➕</span>
              <span className="option-text">Add a User</span>
            </div>
            <div
              className={`option-card ${option === "modify" ? "selected" : ""}`}
              onClick={() => handleOptionChange("modify")}
            >
              <span className="option-icon">✏️</span>
              <span className="option-text">Modify a User</span>
            </div>
            <div
              className={`option-card ${option === "delete" ? "selected" : ""}`}
              onClick={() => handleOptionChange("delete")}
            >
              <span className="option-icon">🗑️</span>
              <span className="option-text">Delete a User</span>
            </div>
            {/* Removed the "Add Login Credentials" option since it's now part of "Add a User" */}
          </div>
        </div>

        {option === "add" && (
          <div className="form-container">
            <div className="form-grid">
              {Object.keys(formData).map((key) => (
                <div key={key} className="form-group">
                  <label className="form-label">
                    {key.replace(/([A-Z])/g, " $1").replace("Link", " Link")}
                  </label>
                  <input
                    type="text"
                    name={key}
                    value={formData[key]}
                    placeholder={key
                      .replace(/([A-Z])/g, " $1")
                      .replace("Link", " Link")}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>
              ))}
              {/* Add Login Credentials fields */}
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  value={loginFormData.email}
                  placeholder="Enter email"
                  onChange={handleLoginInputChange}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  name="password"
                  value={loginFormData.password}
                  placeholder="Enter password"
                  onChange={handleLoginInputChange}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Role</label>
                <select
                  name="role"
                  value={loginFormData.role}
                  onChange={handleLoginInputChange}
                  className="form-input"
                >
                  <option value="client">Client</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <button onClick={handleAddUser} className="submit-button">
              Add User
            </button>
          </div>
        )}

        {option === "modify" && (
          <div className="form-container">
            <h2 className="subtitle">Select a user to modify:</h2>
            <select
              value={selectedUser?._id || ""}
              onChange={(e) => {
                const user =
                  users.find((u) => u._id === e.target.value) || null;
                setSelectedUser(user);
                setFormData(
                  user
                    ? { ...user }
                    : {
                        companyName: "",
                        industry: "",
                        picName: "",
                        picDesignation: "",
                        picContact: "",
                        website: "",
                        profileLink: "",
                      }
                );
              }}
              className="select-input"
            >
              <option value="" disabled>
                Select User
              </option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.companyName}
                </option>
              ))}
            </select>
            {selectedUser && (
              <div className="form-grid">
                {Object.keys(formData).map((key) => (
                  <div key={key} className="form-group">
                    <label className="form-label">
                      {key.replace(/([A-Z])/g, " $1").replace("Link", " Link")}
                    </label>
                    <input
                      type="text"
                      name={key}
                      value={formData[key]}
                      placeholder={key
                        .replace(/([A-Z])/g, " $1")
                        .replace("Link", " Link")}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>
                ))}
                <p className="form-label">Unique ID: {selectedUser._id}</p>
                <button onClick={handleModifyUser} className="submit-button">
                  Modify User
                </button>
              </div>
            )}
          </div>
        )}

        {option === "delete" && (
          <div className="form-container">
            <h2 className="subtitle">Select a user to delete:</h2>
            <select
              value={selectedUser?._id || ""}
              onChange={(e) =>
                setSelectedUser(
                  users.find((u) => u._id === e.target.value) || null
                )
              }
              className="select-input"
            >
              <option value="" disabled>
                Select User
              </option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.companyName}
                </option>
              ))}
            </select>
            {selectedUser && (
              <>
                <p className="form-label">Unique ID: {selectedUser._id}</p>
                <button onClick={handleDeleteUser} className="delete-button">
                  Confirm Deletion
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
