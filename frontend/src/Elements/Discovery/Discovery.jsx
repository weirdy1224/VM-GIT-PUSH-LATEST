import React from 'react'
import Navbar from '../Navbar/Navbar'
import DiscoveryTable from './DiscoveryTable'
import './Discovery.css'
function Discovery() {
  return (
    <div className="flex">
      <Navbar />
      <div className="discovery-container"> 
      <DiscoveryTable />
      </div>
      </div>
  )
}

export default Discovery