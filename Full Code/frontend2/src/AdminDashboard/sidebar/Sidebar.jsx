// src/components/Sidebar/Sidebar.jsx
import { NavLink } from 'react-router-dom';
import {
    HomeIcon,
    NewspaperIcon,
    DocumentTextIcon,
    UserGroupIcon,
    ChartBarIcon,
    CogIcon
} from '../icons/Icons';
import './Sidebar.css';
import CloudflareIcon from "../cloudflare/CloudflareIcon.jsx";

const Sidebar = ({ isOpen }) => {
    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: <HomeIcon /> },
        { name: 'News', path: '/dashboard/news', icon: <NewspaperIcon /> },
        // { name: 'Categories', path: '/dashboard/categories', icon: <NewspaperIcon /> },
        { name: 'Users', path: '/dashboard/users', icon: <UserGroupIcon /> },

        { name: 'Ads', path: '/dashboard/ads', icon: <DocumentTextIcon /> },
        { name: 'Cloudflare', path: '/dashboard/cloudflare', icon: <CloudflareIcon /> },

    ];

    return (
        <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
            <div className="sidebar-header">
                <h2>NewsAdmin</h2>
            </div>
            <nav className="sidebar-nav">
                <ul>
                    {navItems.map((item, index) => (
                        <li key={index}>
                            <NavLink
                                to={item.path}
                                className={({ isActive }) => isActive ? 'active' : ''}
                            >
                                <span className="icon">{item.icon}</span>
                                <span className="item-name">{item.name}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="sidebar-footer">
                <p>News Admin v1.0</p>
            </div>
        </div>
    );
};

export default Sidebar;