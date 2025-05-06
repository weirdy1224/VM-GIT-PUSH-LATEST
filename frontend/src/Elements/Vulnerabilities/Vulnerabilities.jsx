import React from 'react';
import Navbar from '../Navbar/Navbar';
import VulnTable from './table';
import './Vulnerabilities.css'; // Import the CSS file

function Vulnerabilities() {
  return (
    <div className='flex'>
    <Navbar />
    <div className="vulnerabilities-container">
      <VulnTable />
    </div>
    </ div>
  );
}

export default Vulnerabilities;
