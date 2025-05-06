import React, { useState } from "react";
import Navbar from "../Navbar/Navbar";
import DatePickerWithRange from "./datepicker";
import Dashboard from "./CVS";
import VulnerabilityBubbleChart from "./bubble";

function Scorecard() {
  const [dateRange, setDateRange] = useState({
    from: new Date(2025, 0, 1), // January 1, 2025
    to: new Date(2025, 11, 31), // December 31, 2025
  });

  return (
    <div className="flex">
      <Navbar />
      <div className="scorecard-container">
        <DatePickerWithRange onDateChange={setDateRange} />
        <div className="graph flex">
          <div className="cvs_graph">
            <Dashboard />
          </div>
          <div className="bubble_graph">
            <VulnerabilityBubbleChart dateRange={dateRange} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Scorecard;
