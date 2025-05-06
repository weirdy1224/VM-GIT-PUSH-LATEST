import React from 'react';
import './Overview.css';

export default function ScanSummary({
  scansRunning,
  scansWaiting,
  totalScansCompleted,
  openVulnerabilities,
  totalTargets
}) {
  return (
    <div className="w-full pl-8 pr-8 mx-auto" style={{ marginTop: '-45px' }}>
      <table className="w-full border-t border-b border-transparent flex-grow">
        <thead>
          <tr>
            <th className="py-2 px-4 text-left font-medium text-gray-500" style={{ textAlign: 'center' }}>Testing Ongoing</th>
            {/* <th className="py-2 px-4 text-left font-medium text-gray-500" style={{ textAlign: 'center' }}>Scans Waiting</th> */}
            <th className="py-2 px-4 text-left font-medium text-gray-500" style={{ textAlign: 'center' }}>Testing Completed</th>
            <th className="py-2 px-4 text-left font-medium text-gray-500" style={{ textAlign: 'center' }}>Total Bugs</th>
            <th className="py-2 px-4 text-left font-medium text-gray-500" style={{ textAlign: 'center' }}>Total Targets</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="py-2 px-4 text-2xl font-semibold text-purple-600" style={{ textAlign: 'center' }}>{scansRunning}</td>
            {/* <td className="py-2 px-4 text-2xl font-semibold text-purple-600" style={{ textAlign: 'center' }}>{scansWaiting}</td> */}
            <td className="py-2 px-4 text-2xl font-semibold text-purple-600" style={{ textAlign: 'center' }}>{totalScansCompleted}</td>
            <td className="py-2 px-4 text-2xl font-semibold text-purple-600" style={{ textAlign: 'center' }}>{openVulnerabilities}</td>
            <td className="py-2 px-4 text-2xl font-semibold text-purple-600" style={{ textAlign: 'center' }}>{totalTargets}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
