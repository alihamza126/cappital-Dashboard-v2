import React from 'react'
import Sidebar from '../../components/sidebar/Sidebar'
import Navbar from '../../components/navbar/Navbar'
import { Outlet } from 'react-router-dom'

const AdminHome = () => {
    return (
        <div id="wrapper">
            {/* Sidebar */}
            <Sidebar />
            {/* main content here pages or components */}
            <div id="content-wrapper" className="d-flex flex-column">
                <div id="content">
                    <Navbar />
                    {/* //Main Content */}
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default AdminHome