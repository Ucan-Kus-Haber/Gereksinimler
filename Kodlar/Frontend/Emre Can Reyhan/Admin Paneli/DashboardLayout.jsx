import { useState } from 'react';
import { Outlet } from 'react-router-dom'; // 👈 required for nested routes
import Sidebar from '../sidebar/Sidebar';
import Navbar from '../navbar/Navbar';
import './DashboardLayout.css';

const DashboardLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="dashboard-container">
            <Sidebar isOpen={sidebarOpen} />
            <div className={`main-content ${sidebarOpen ? 'sidebar-open' : ''}`}>
                <Navbar toggleSidebar={toggleSidebar} />
                <div className="content-wrapper">
                    <Outlet /> {/* 👈 render dashboard pages here */}
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;
