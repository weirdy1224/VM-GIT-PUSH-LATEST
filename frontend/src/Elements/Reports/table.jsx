import React, { useState, useEffect } from "react";
import { Filter } from "lucide-react";
import axios from "axios";
import "./Reports.css";

const BASE_URL = "http://localhost:5000";

const handleDownload = async (filePath, domain) => {
  try {
    if (!filePath) {
      alert("❌ Invalid file path.");
      return;
    }

    const fileUrl = filePath.startsWith("http")
      ? filePath
      : `${BASE_URL}${filePath}`;
    console.log("🔗 File Download URL:", fileUrl);

    const sanitizedDomain = domain
      ? domain.replace(/https?:\/\//, "").replace(/\W+/g, "_")
      : "report";

    const response = await fetch(fileUrl);
    if (!response.ok)
      throw new Error(`Failed to fetch file: ${response.status}`);

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${sanitizedDomain}.pdf`;
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("❌ Download error:", error);
    alert("Failed to download report. Please try again.");
  }
};

export default function ReportTable() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [globalFilter, setGlobalFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("❌ No authentication token found. Please log in.");
        }

        const response = await axios.get(`${BASE_URL}/api/reports`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("✅ API Response:", response.data);

        if (!Array.isArray(response.data.data)) {
          throw new Error("Invalid response format");
        }

        setReports(
          response.data.data.map((report, index) => ({
            serialNumber: index + 1,
            id: report._id,
            template:
              report.vulnerabilities?.length > 0
                ? "Vulnerability Report"
                : "Generic Report",
            domain: report.domain,
            createdOn: new Date(report.uploadedAt).toLocaleString(),
            filePath: report.filePath
              ? `${BASE_URL}${report.filePath.replace(
                  /^\/server\/server/,
                  "/uploads"
                )}`
              : "",
          }))
        );
      } catch (error) {
        console.error(
          "❌ Fetch error:",
          error.response ? error.response.data : error.message
        );
        setError("Failed to fetch reports. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const filteredReports = reports.filter((report) =>
    Object.values(report).some((value) =>
      value?.toString().toLowerCase().includes(globalFilter.toLowerCase())
    )
  );

  const totalRecords = filteredReports.length;
  const totalPages = Math.ceil(totalRecords / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const paginatedReports = filteredReports.slice(startIndex, startIndex + recordsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const renderPagination = () => {
    const pages = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={currentPage === i ? "active" : ""}
        >
          {i}
        </button>
      );
    }

    if (startPage > 1) {
      pages.unshift(<button key="first" onClick={() => handlePageChange(1)}>1</button>);
      if (startPage > 2) pages.unshift(<span key="dots-start">...</span>);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pages.push(<span key="dots-end">...</span>);
      pages.push(<button key="last" onClick={() => handlePageChange(totalPages)}>{totalPages}</button>);
    }

    return <div className="pagination">{pages}</div>;
  };

  return (
    <div className="data-card">
      <h2>Reports</h2>
      <div className="search-bar">
        <input
          placeholder="Filter reports..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
        />
        <Filter className="w-5 h-5" />
      </div>

      {error && <div className="error-message">{error}</div>}

      <table>
        <thead>
          <tr>
            <th>S.No</th>
            <th>Report Template</th>
            <th>Domain</th>
            <th>Created On</th>
            <th>Download</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={5} className="text-center py-4">
                Loading...
              </td>
            </tr>
          ) : paginatedReports.length > 0 ? (
            paginatedReports.map((report) => (
              <tr key={report.id}>
                <td>{report.serialNumber}</td>
                <td>{report.template}</td>
                <td>{report.domain}</td>
                <td>{report.createdOn}</td>
                <td>
                  {report.filePath ? (
                    <button
                      className="download-button"
                      onClick={() => handleDownload(report.filePath, report.domain)}
                    >
                      Download PDF
                    </button>
                  ) : (
                    <span className="not-available">Not Available</span>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="text-center py-4">
                No reports available.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {totalPages > 1 && renderPagination()}
    </div>
  );
}