import React, { useEffect, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import axios from "axios";
import "./Vulnerabilities.css";

export default function VulnTable() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [vulnDetails, setVulnDetails] = useState(null);
  const [error, setError] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("User is not authenticated");
        setError("User is not authenticated");
        return;
      }

      try {
        const response = await axios.get("http://localhost:5000/api/reports", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data.success) {
          setData(response.data.data || []);
        } else {
          setError("Failed to fetch reports: " + response.data.message);
        }
      } catch (error) {
        console.error("Error fetching reports:", error);
        setError("Failed to fetch reports. Please try again later.");
      }
    };

    fetchData();
  }, []);

  const fetchVulnerabilityDetails = async (vulnId) => {
    const token = localStorage.getItem("token");
    setLoadingDetails(true);
    try {
      const response = await axios.get(
        `http://localhost:5000/api/vulnerability/${vulnId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        setVulnDetails(response.data.data);
      } else {
        setError(
          "Failed to fetch vulnerability details: " + response.data.message
        );
      }
    } catch (error) {
      console.error("Error fetching vulnerability details:", error);
      setError("Failed to fetch vulnerability details");
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleSort = (key) => {
    const sortedData = [...data].sort((a, b) => {
      const aValue =
        key === "severity" ? a.vulnerabilities[0]?.severity : a[key];
      const bValue =
        key === "severity" ? b.vulnerabilities[0]?.severity : b[key];
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    });
    setData(sortedData);
  };

  const handleRowClick = (item, vuln) => {
    setSelectedItem({
      ...vuln,
      domain: item.domain,
      ip_address: item.ip_address,
    });
    fetchVulnerabilityDetails(vuln._id);
  };

  const handleClosePopup = () => {
    setSelectedItem(null);
    setVulnDetails(null);
  };

  const filteredData = data.filter((item) =>
    item.vulnerabilities.some((vuln) =>
      Object.values({
        ...vuln,
        domain: item.domain,
        ip_address: item.ip_address,
      }).some((value) =>
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
  );

  return (
    <div className="flex justify-center relative">
      <div
        className={`vulnerabilities-container ${
          selectedItem ? "opacity-60" : ""
        }`}
      >
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

        {/* Error Message */}
        {error && <div className="text-red-500 mb-4">{error}</div>}

        {/* Table */}
        <div className="max-h-96 overflow-y-auto">
          <table className="vuln-table">
            <thead>
              <tr style={{ backgroundColor: "#b8b1b0", color: "white" }}>
                {["Domain", "Severity", "IP Address"].map((header) => (
                  <th
                    key={header}
                    onClick={() => handleSort(header.toLowerCase())}
                    className="cursor-pointer"
                  >
                    {header} <ChevronDown className="inline-block w-4" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.flatMap((item) =>
                item.vulnerabilities.map((vuln, index) => (
                  <tr
                    key={`${item._id}-${index}`}
                    onClick={() => handleRowClick(item, vuln)}
                    className="cursor-pointer hover:bg-gray-200"
                  >
                    <td>{item.domain}</td>
                    <td>{vuln.severity}</td>
                    <td>{item.ip_address || "N/A"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Vulnerability Description Popup */}
      {selectedItem && (
        <div className="vulnerability-popup">
          <div className="vulnerability-popup-content">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-blue-900">
                Vulnerability Description
              </h2>
            </div>
            {loadingDetails ? (
              <div>Loading vulnerability details...</div>
            ) : vulnDetails ? (
              <div>
                <p>
                  <strong>Vulnerability name:</strong>{" "}
                  {vulnDetails.name || "N/A"}
                </p>
                <p>
                  <strong>Severity:</strong>{" "}
                  <span className={`severity-${selectedItem.severity}`}>
                    {selectedItem.severity}
                  </span>
                </p>
                <p>
                  <strong>Location:</strong> {selectedItem.domain}
                  {vulnDetails.location || ""}
                </p>
                <p>
                  <strong>Description:</strong>{" "}
                  <pre className="whitespace-pre-wrap">
                    {vulnDetails.description || "No description available"}
                  </pre>
                </p>
                <p>
                  <strong>Impact:</strong>
                  <ul className="list-disc pl-5">
                    {(vulnDetails.impact || []).map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </p>
                <p>
                  <strong>Proof of Concept:</strong>
                  <ol className="list-decimal pl-5">
                    {(vulnDetails.proofOfConcept || []).map(
                      (stepObj, index) => (
                        <li key={stepObj._id} className="mb-2">
                          {stepObj.step}
                          {stepObj.image && (
                            <img
                              src={stepObj.image}
                              alt={`Proof step ${index + 1}`}
                              className="mt-2 max-w-xs"
                            />
                          )}
                        </li>
                      )
                    )}
                  </ol>
                </p>
                <p>
                  <strong>Remediation:</strong>
                  <ul className="list-disc pl-5">
                    {(vulnDetails.remediation || []).map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </p>
                {vulnDetails.references && (
                  <p>
                    <strong>Reference link:</strong>{" "}
                    <a
                      href={vulnDetails.references}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {vulnDetails.references}
                    </a>
                  </p>
                )}
              </div>
            ) : (
              <div>No details available</div>
            )}
            <button
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={handleClosePopup}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
