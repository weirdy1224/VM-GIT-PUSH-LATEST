import axios from "axios";
import React, { useEffect, useState } from "react";
import './Overview.css';

const vulnerabilityColors = ["#dc2626", "#f97316", "#facc15", "#22c55e"];
const severityLevels = ["Critical", "High", "Medium", "Low"];
const severityToScore = { Critical: 80, High: 44, Medium: 30, Low: 10 };

const VulnerabilityIndicator = ({ score, index }) => (
  <div
    className="vulnerability-indicator"
    style={{ backgroundColor: vulnerabilityColors[index % vulnerabilityColors.length] }}
  >
    {score}
  </div>
);

export default function VulnerableTargetsTable() {
  const [targetsData, setTargetsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchVulnerableTargets = async () => {
      try {
        if (!userId || !token) {
          throw new Error("User ID or token is missing. Please log in.");
        }

        setLoading(true);
        const response = await axios.get("http://localhost:5000/api/mostvul", {
          headers: { Authorization: `Bearer ${token}`, "X-User-Id": userId },
        });

        if (!response.data.success) {
          throw new Error(response.data.message || "API returned an error");
        }

        const transformedData = response.data.data.map((vuln) => ({
          url: vuln.location || "Unknown Location",
          vulnerabilities: [
            {
              score: severityToScore[vuln.severity] || 0,
              severity: vuln.severity,
            },
          ],
        }));

        const normalizedData = transformedData.map((target) => {
          const allSeverities = severityLevels.map((severity) => {
            const vuln = target.vulnerabilities.find(
              (v) => v.severity === severity
            );
            return { score: vuln ? vuln.score : 0, severity };
          });
          return { ...target, vulnerabilities: allSeverities };
        });

        setTargetsData(normalizedData);
        setError(null);
      } catch (error) {
        console.error("Error fetching vulnerable targets:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVulnerableTargets();
  }, [userId, token]);

  return (
    <div className="data-card">
      <h2>Vulnerable Targets</h2>
      {loading ? (
        <p>Loading targets...</p>
      ) : error ? (
        <p style={{ color: "#dc2626" }}>{error}</p>
      ) : targetsData.length > 0 ? (
        <div className="list">
          {targetsData.map((target, index) => (
            <div key={index} className="list-item">
              <a href={target.url} target="_blank" rel="noopener noreferrer">
                {target.url}
              </a>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                {target.vulnerabilities.map((vulnerability, vIndex) => (
                  <VulnerabilityIndicator
                    key={vIndex}
                    score={vulnerability.score}
                    index={vIndex}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No vulnerable targets to display.</p>
      )}
    </div>
  );
}