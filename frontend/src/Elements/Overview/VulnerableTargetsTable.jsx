import axios from "axios";
import React, { useEffect, useState } from "react";

const vulnerabilityColors = ["#9B0101BF", "#FF0606", "#FFA500", "#44AAFF"];
const severityLevels = ["Critical", "High", "Medium", "Low"];
const severityToScore = { Critical: 80, High: 44, Medium: 30, Low: 10 };

const VulnerabilityIndicator = ({ score, index }) => (
  <div
    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
    style={{
      backgroundColor: vulnerabilityColors[index % vulnerabilityColors.length],
    }}
  >
    {score}
  </div>
);

export default function VulnerableTargetsTable() {
  const [targetsData, setTargetsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [criticalSum, setCriticalSum] = useState(0);
  const [highSum, setHighSum] = useState(0);
  const [mediumSum, setMediumSum] = useState(0);
  const [lowSum, setLowSum] = useState(0);

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

  useEffect(() => {
    if (targetsData.length > 0) {
      let critical = 0,
        high = 0,
        medium = 0,
        low = 0;

      targetsData.forEach((target) => {
        target.vulnerabilities.forEach((vuln) => {
          if (vuln.severity === "Critical") critical += vuln.score;
          if (vuln.severity === "High") high += vuln.score;
          if (vuln.severity === "Medium") medium += vuln.score;
          if (vuln.severity === "Low") low += vuln.score;
        });
      });

      setCriticalSum(critical);
      setHighSum(high);
      setMediumSum(medium);
      setLowSum(low);
    }
  }, [targetsData]);

  return (
    <div className="p-5 bg-white rounded-lg shadow-md max-w-full">
      <h2 className="text-xl font-bold mb-4 text-gray-800">
        Most Vulnerable Targets
      </h2>
      {loading ? (
        <p className="text-gray-500 text-center p-4">Loading targets...</p>
      ) : error ? (
        <p className="text-red-500 bg-red-50 p-4 rounded-lg text-center">
          {error}
        </p>
      ) : targetsData.length > 0 ? (
        <div
          className="overflow-y-auto"
          style={{ maxHeight: "240px", paddingRight: "10px" }}
        >
          <div className="border-t border-gray-200">
            {targetsData.map((target, index) => (
              <div
                key={index}
                className="flex items-center py-2 border-b border-gray-200 hover:bg-gray-100 transition-colors"
              >
                <div className="flex-grow truncate mr-8">
                  <a
                    href={target.url}
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {target.url}
                  </a>
                </div>
                <div className="flex space-x-2">
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
        </div>
      ) : (
        <p className="text-gray-500 text-center p-4">
          No vulnerable targets to display.
        </p>
      )}
    </div>
  );
}
