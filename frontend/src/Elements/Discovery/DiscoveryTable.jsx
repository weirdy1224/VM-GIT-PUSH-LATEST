import React, { useEffect, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import axios from "axios";
import "./Discovery.css";

function DiscoveryTable1() {
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");

        if (!userId || !token) {
          throw new Error("User ID or token is missing");
        }

        const response = await axios.get("http://localhost:5000/api/reports", {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-User-Id": userId,
          },
        });

        if (!response.data.success) {
          throw new Error(response.data.message || "API returned an error");
        }

        setData(response.data.data || []);
      } catch (error) {
        console.error("Error fetching reports:", error.message);
      }
    };

    fetchReports();
  }, []);

  const handleSort = (key) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });

    const sortedData = [...data].sort((a, b) => {
      const aValue = a[key]?.toString().toLowerCase() || "";
      const bValue = b[key]?.toString().toLowerCase() || "";

      return direction === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });

    setData(sortedData);
  };

  const filteredData = data.filter((item) =>
    Object.values(item).some((value) =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="bg-white shadow-md rounded-lg p-6 hi">
      {/* Search Input */}
      <div className="mb-4 relative">
        <input
          type="text"
          placeholder="Search..."
          className="w-full p-2 pl-10 pr-4 border rounded-md"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>

      {/* Table */}
      <div className="max-h-96 overflow-y-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              {["URL", "DOMAIN", "IP", "PROGRESS", "STATUS"].map((header) => (
                <th
                  key={header}
                  className="p-2 text-left cursor-pointer"
                  onClick={() => handleSort(header.toLowerCase())}
                >
                  {header} <ChevronDown className="inline-block w-4 h-4" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.flatMap((item, index) =>
              (item.vulnerabilities || []).map((vuln, vulnIndex) => (
                <tr key={`${index}-${vulnIndex}`} className="border-b">
                  <td className="p-2">{vuln.location || "N/A"}</td>
                  <td className="p-2">{item.domain || "N/A"}</td>
                  <td className="p-2">{item.ip_address || "N/A"}</td>
                  <td className="p-2">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{
                          width: `${
                            vuln.cvss_score ? vuln.cvss_score * 10 : 0
                          }%`,
                        }}
                      ></div>
                    </div>
                  </td>
                  <td className="p-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        vuln.cvss_score >= 7
                          ? "bg-red-200 text-red-800"
                          : vuln.cvss_score >= 4
                          ? "bg-yellow-200 text-yellow-800"
                          : vuln.cvss_score > 0
                          ? "bg-green-200 text-green-800"
                          : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      {vuln.cvss_score ? `${vuln.cvss_score}` : "Pending"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function DiscoveryTable() {
  return (
    <div className="f">
      <DiscoveryTable1 />
    </div>
  );
}
