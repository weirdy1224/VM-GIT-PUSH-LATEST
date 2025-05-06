"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  ZAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export default function VulnerabilityBubbleChart() {
  const [data, setData] = useState([]); // State to store fetched data
  const [totalVulnerabilities, setTotalVulnerabilities] = useState(0); // State for total vulnerabilities
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Define an array of colors for the vulnerabilities
  const colors = ["#2563eb", "#eab308", "#22c55e", "#dc2626", "#ff6b6b"];

  // Fetch the data from the backend API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get the token from localStorage
        const token = localStorage.getItem("token");

        // Check if token exists
        if (!token) {
          setError("No token found in localStorage.");
          setLoading(false);
          return;
        }

        const response = await fetch(
          "http://localhost:5000/api/vulnerabilities-by-year",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`, // Include token in the request header
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
          setData(result.data); // Set the fetched data array
          setTotalVulnerabilities(result.totalVulnerabilities); // Set the total vulnerabilities
        } else {
          setError(result.message); // Set error from the API response
        }
      } catch (error) {
        setError(error.message); // Set error if any
      } finally {
        setLoading(false); // Set loading to false after the API call
      }
    };

    fetchData();
  }, []); // Empty dependency array to run only once when the component mounts

  // Handle loading and error states
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Add a console log to check the data being received
  console.log("Received data:", data);

  // Calculate the maximum vulnerability count to normalize bubble sizes
  const maxValue = Math.max(...data.map((item) => item.totalVulnerabilities));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vulnerabilities by Year</CardTitle>
        <p>Total Vulnerabilities: {totalVulnerabilities}</p>{" "}
        {/* Display total */}
      </CardHeader>
      <CardContent>
        <div className="h-[314px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart
              margin={{
                top: 20,
                right: 20,
                bottom: 20,
                left: 60,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={true}
                horizontal={false}
              />
              <XAxis
                type="number"
                dataKey="year"
                name="Year"
                domain={["auto", "auto"]}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                type="number"
                dataKey="totalVulnerabilities"
                name="Vulnerability Count"
                domain={["auto", "auto"]}
                tickCount={7}
              />
              <ZAxis
                type="number"
                dataKey="totalVulnerabilities" // Use totalVulnerabilities for bubble size
                range={[100, 1000]} // Adjusts the visual range for bubble size
                domain={["auto", "auto"]}
              />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                content={({ payload, label }) => {
                  if (payload && payload.length) {
                    const { year, totalVulnerabilities } = payload[0].payload;
                    return (
                      <div
                        style={{
                          backgroundColor: "white",
                          padding: "8px",
                          border: "1px solid #ccc",
                        }}
                      >
                        <p>Year: {year}</p>
                        <p>
                          Vulnerability Count: {totalVulnerabilities}{" "}
                          vulnerabilities
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              {data.map((entry, index) => (
                <Scatter
                  key={index}
                  data={[entry]}
                  fill={colors[index % colors.length]} // Cycle through the color array
                  size={(entry.totalVulnerabilities / maxValue) * 400} // Adjust bubble size based on totalVulnerabilities
                />
              ))}
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
