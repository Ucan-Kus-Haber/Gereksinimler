import React, { useState, useEffect } from 'react';
import { Search, Globe, User, ChevronDown, Bell, Folder } from 'lucide-react';
import './header.css';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../auth/AuthContext.jsx';

function Header() {
    const [searchQuery, setSearchQuery] = useState('');
    const [showLanguageMenu, setShowLanguageMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showNewsFolder, setShowNewsFolder] = useState(false);
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();

    // Use the authentication context
    const auth = useAuth();

    // Get user data from the auth context
    const user = auth?.user;
    const isLoggedIn = !!user;
    const userName = user?.name || '';
    const isAdmin = user?.access === 'admin';

    // Sample notifications data
    const notifications = [
        {
            id: 1,
            actor: "John Smith",
            description: "Tagged you in a comment",
            time: "5 minutes ago"
        },
        {
            id: 2,
            actor: "Admin Team",
            description: "Your application has been approved",
            time: "1 hour ago"
        },
        {
            id: 3,
            actor: "Sarah Johnson",
            description: "Sent you a message",
            time: "Yesterday"
        }
    ];

    // Sample news data for the folder
    const savedNews = [
        {
            id: 101,
            actor: "Tech Daily",
            description: "New advancements in AI technology",
            time: "2 days ago"
        },
        {
            id: 102,
            actor: "Sports Update",
            description: "Championship finals scheduled for next week",
            time: "1 week ago"
        },
        {
            id: 103,
            actor: "Local News",
            description: "Community development project launched",
            time: "2 weeks ago"
        }
    ];

    const languages = [
        { code: 'en', name: 'English' },
        { code: 'ru', name: 'Русский' },
        { code: 'tr', name: 'Türkçe' }
    ];

    const handleLanguageChange = (langCode) => {
        i18n.changeLanguage(langCode);
        setShowLanguageMenu(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            // Close language menu when clicking outside
            if (showLanguageMenu && !event.target.closest('.head-language-dropdown')) {
                setShowLanguageMenu(false);
            }

            // Close notifications when clicking outside
            if (showNotifications && !event.target.closest('.head-notifications-dropdown')) {
                setShowNotifications(false);
            }

            // Close news folder when clicking outside
            if (showNewsFolder && !event.target.closest('.head-news-folder-dropdown')) {
                setShowNewsFolder(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showLanguageMenu, showNotifications, showNewsFolder]);

    const handleLogout = () => {
        if (auth?.logout) {
            auth.logout();
        }
        navigate('/');
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch(e);
        }
    };

    // Debug log for authentication state changes
    useEffect(() => {
        console.log("Auth status in Header:", isLoggedIn ? "Logged in" : "Not logged in");
    }, [isLoggedIn]);

    return (
        <header className="head-header">
            <div className="head-container">
                <div className="head-header-content">
                    {/* Logo with translated brand name */}
                    <div className="head-logo">
                        <span className="head-logo-text">{t('Ucan Kus')}</span>
                    </div>

                    {/* Navigation Links with translated text */}
                    <nav className="head-nav-links">
                        <a href="/" className="head-nav-link">{t('home')}</a>
                        <a href="/dashboard" className="head-nav-link">{t('dashboard')}</a>
                        <a href="#" className="head-nav-link">{t('services')}</a>
                        {isLoggedIn && (
                            <a
                                onClick={() => navigate(isAdmin ? '/dashboard' : '/apply')}
                                className="head-nav-link"
                            >
                                {isAdmin ? t('dashboard') : t('application')}
                            </a>
                        )}
                        <a href="#" className="head-nav-link">{t('about')}</a>
                    </nav>

                    {/* Enhanced Search Bar */}
                    <form onSubmit={handleSearch} className="head-search-container">
                        <Search className="head-search-icon" />
                        <input
                            type="text"
                            placeholder={t('searchPlaceholder')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="head-search-input"
                            aria-label={t('search')}
                        />
                        <button
                            type="submit"
                            className="head-search-button"
                            aria-label={t('search')}
                        >
                            {t('search')}
                        </button>
                    </form>

                    {/* Right Icons */}
                    <div className="head-icon-group">
                        {/* News Folder Dropdown */}
                        <div className="head-news-folder-dropdown">
                            <button
                                className="head-icon-btn"
                                onClick={() => setShowNewsFolder(!showNewsFolder)}
                                aria-label="Saved News"
                            >
                                <Folder className="head-icon" />
                                {savedNews.length > 0 && (
                                    <span className="head-badge">{savedNews.length}</span>
                                )}
                            </button>
                            {showNewsFolder && (
                                <div className="head-dropdown-menu-container">
                                    <div className="head-dropdown-menu head-news-menu">
                                        <div className="head-dropdown-header">
                                            <h3>Saved News</h3>
                                        </div>
                                        {savedNews.length > 0 ? (
                                            <div className="head-dropdown-items">
                                                {savedNews.map(news => (
                                                    <div key={news.id} className="head-news-item">
                                                        <div className="head-news-content">
                                                            <p className="head-news-actor">{news.actor}</p>
                                                            <p className="head-news-description">{news.description}</p>
                                                            <p className="head-news-time">{news.time}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="head-empty-message">No saved news</p>
                                        )}
                                        <div className="head-dropdown-footer">
                                            <button className="head-view-all-btn">View All</button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Notifications Dropdown */}
                        <div className="head-notifications-dropdown">
                            <button
                                className="head-icon-btn"
                                onClick={() => setShowNotifications(!showNotifications)}
                                aria-label="Notifications"
                            >
                                <Bell className="head-icon" />
                                {notifications.length > 0 && (
                                    <span className="head-badge">{notifications.length}</span>
                                )}
                            </button>
                            {showNotifications && (
                                <div className="head-dropdown-menu-container">
                                    <div className="head-dropdown-menu head-notification-menu">
                                        <div className="head-dropdown-header">
                                            <h3>Notifications</h3>
                                        </div>
                                        {notifications.length > 0 ? (
                                            <div className="head-dropdown-items">
                                                {notifications.map(notification => (
                                                    <div key={notification.id} className="head-notification-item">
                                                        <div className="head-notification-content">
                                                            <p className="head-notification-actor">{notification.actor}</p>
                                                            <p className="head-notification-description">{notification.description}</p>
                                                            <p className="head-notification-time">{notification.time}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="head-empty-message">No notifications</p>
                                        )}
                                        <div className="head-dropdown-footer">
                                            <button className="head-view-all-btn">Mark all as read</button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Language Dropdown */}
                        <div className="head-language-dropdown">
                            <button
                                className="head-icon-btn head-language-trigger"
                                onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                            >
                                <Globe className="head-icon" />
                                <ChevronDown size={16} className="ml-1" />
                            </button>
                            {showLanguageMenu && (
                                <div className="head-language-menu-container">
                                    <div className="head-language-menu">
                                        {languages.map((lang) => (
                                            <button
                                                key={lang.code}
                                                className="head-language-menu-item"
                                                onClick={() => handleLanguageChange(lang.code)}
                                            >
                                                {lang.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {isLoggedIn ? (
                            <div className="head-user-profile">
                                <button
                                    className="head-icon-btn"
                                    onClick={() => navigate('/profilePage')}
                                >
                                    <User className="head-icon" />
                                </button>
                                <span className="head-username">{userName}</span>
                                <button className="head-logout-btn" onClick={handleLogout}>
                                    {t('logout')}
                                </button>
                            </div>
                        ) : (
                            <div className="head-auth-buttons">
                                <button className="head-signin-btn" onClick={() => navigate('/login')}>
                                    {t('signIn')}
                                </button>
                                <button className="head-signup-btn" onClick={() => navigate('/signUp')}>
                                    {t('signUp')}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;