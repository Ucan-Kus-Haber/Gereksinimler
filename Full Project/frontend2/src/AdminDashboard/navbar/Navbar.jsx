import { useState } from 'react';
import {
    MenuIcon,
    BellIcon,
    UserCircleIcon,
    SearchIcon
} from '../icons/Icons';
import './Navbar.css';

const Navbar = ({ toggleSidebar }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        // Implement search functionality
        console.log('Searching for:', searchQuery);
    };

    const toggleNotifications = () => {
        setShowNotifications(!showNotifications);
        setShowProfileMenu(false);
    };

    const toggleProfileMenu = () => {
        setShowProfileMenu(!showProfileMenu);
        setShowNotifications(false);
    };

    return (
        <header className="navbar">
            <div className="navbar-left">
                <button className="menu-button" onClick={toggleSidebar}>
                    <MenuIcon />
                </button>
                <form className="search-form" onSubmit={handleSearchSubmit}>
                    <div className="search-input-container">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="search-input"
                        />
                        <button type="submit" className="search-button">
                            <SearchIcon />
                        </button>
                    </div>
                </form>
            </div>

            <div className="navbar-right">
                <div className="notification-container">
                    <button
                        className="notification-button"
                        onClick={toggleNotifications}
                    >
                        <BellIcon />
                        <span className="notification-badge">3</span>
                    </button>
                    {showNotifications && (
                        <div className="notification-dropdown">
                            <h3>Notifications</h3>
                            <ul>
                                <li>New article submitted for review</li>
                                <li>User comment awaiting approval</li>
                                <li>System update available</li>
                            </ul>
                        </div>
                    )}
                </div>

                <div className="profile-container">
                    <button
                        className="profile-button"
                        onClick={toggleProfileMenu}
                    >
                        <UserCircleIcon />
                        <span className="profile-name">Admin User</span>
                    </button>
                    {showProfileMenu && (
                        <div className="profile-dropdown">
                            <ul>
                                <li><a href="/dashboard/profile">My Profile</a></li>
                                <li><a href="/dashboard/account">Account Settings</a></li>
                                <li><a href="/logout">Logout</a></li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;