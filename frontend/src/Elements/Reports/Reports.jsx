import React from 'react'
import Navbar from '../Navbar/Navbar'
import ReportTable from './table'
import './Reports.css'
function Reports() {
  return (
    <div className='flex'>
   <Navbar />
   <div className="report-container">
   <div className="table">
   <ReportTable />
   </div>
   </div>
   </div>
  )
}

export default Reports