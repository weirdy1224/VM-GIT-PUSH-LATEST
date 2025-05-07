import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Elements/Login/Login.jsx";
import Overview from "./Elements/Overview/Overview.jsx";
import Discovery from "./Elements/Discovery/Discovery.jsx";
import Vulnerabilities from "./Elements/Vulnerabilities/Vulnerabilities.jsx";
import Reports from "./Elements/Reports/Reports.jsx";
import Scorecard from "./Elements/Scorecard/Scorecard.jsx";
import Admin from "./Admin/admin.jsx";
import UploadReport from "./Admin/Rep_Upload/Upload_report.jsx";
import Client from "./Admin/Clients/Clients.jsx";
import User from "./Admin/User_Management/User.jsx";
import "./App.css";

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/overview" element={<Overview />} />
          <Route path="/discovery" element={<Discovery />} />
          <Route path="/vulnerabilities" element={<Vulnerabilities />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/scorecard" element={<Scorecard />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/upload-reports" element={<UploadReport />} />
          <Route path="/client" element={<Client />} />
          <Route path="/user-management" element={<User />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
