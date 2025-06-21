import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// Create the Auth Context with default values
const AuthContext = createContext({
    user: null,
    login: () => {},
    logout: () => {},
    isAuthenticated: () => false,
    loading: false,
    refreshAuthState: () => {},
    sessionData: null,
    refreshSession: () => {}
});

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sessionData, setSessionData] = useState(null);
    const [authState, setAuthState] = useState(Date.now());

    // API base URL
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://ucankus-deploy2.onrender.com';

    // Load user from localStorage when the component mounts
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = localStorage.getItem('token');
                const userId = localStorage.getItem('userId');
                const userName = localStorage.getItem('userName');
                const userEmail = localStorage.getItem('userEmail');
                const access = localStorage.getItem('access');

                if (token && userId) {
                    // Set axios default header
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                    // Verify token with server
                    try {
                        const response = await axios.get(`${API_BASE_URL}/auth/current-user`);
                        if (response.data) {
                            setUser({
                                id: userId,
                                name: userName,
                                email: userEmail,
                                access: access || 'user',
                                token: token,
                            });
                        }
                    } catch (error) {
                        console.error('Token verification failed:', error);
                        // Clear invalid token
                        clearAuthData();
                    }
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error('Auth check error:', error);
                clearAuthData();
            } finally {
                setLoading(false);
            }
        };

        checkAuth();

        // Add event listener to handle storage changes from other tabs
        const handleStorageChange = () => {
            checkAuth();
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('auth-change', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('auth-change', handleStorageChange);
        };
    }, [authState]);

    // Clear auth data helper
    const clearAuthData = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('access');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
        setSessionData(null);
    };

    const login = async (userData) => {
        try {
            const { token, userId, name, email, access } = userData;

            if (!token || !userId) {
                throw new Error('Invalid user data received');
            }

            // Store in localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('userId', userId);
            localStorage.setItem('userName', name);
            localStorage.setItem('userEmail', email);
            localStorage.setItem('access', access || 'user');

            // Set axios default header
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            // Set user state
            setUser({
                id: userId,
                name: name,
                email: email,
                access: access || 'user',
                token: token,
            });

            // Force refresh of auth state
            setAuthState(Date.now());

            // Dispatch a custom event to notify components about auth changes
            window.dispatchEvent(new Event('auth-change'));

            // Fetch session data
            await fetchSessionData(token);

            return true;
        } catch (error) {
            console.error('Login error in context:', error);
            clearAuthData();
            throw error;
        }
    };

    const logout = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                // Notify server about logout
                try {
                    await axios.post(`${API_BASE_URL}/auth/logout`, {}, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                } catch (error) {
                    console.error('Server logout error:', error);
                    // Continue with local logout even if server fails
                }
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Always clear local data
            clearAuthData();
            setAuthState(Date.now());
            window.dispatchEvent(new Event('auth-change'));
        }
    };

    const fetchSessionData = async (token) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/auth/session`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setSessionData(response.data);
        } catch (error) {
            console.error('Failed to fetch session data:', error);
            // Don't fail login if session data fetch fails
        }
    };

    const refreshSession = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            await fetchSessionData(token);
        }
    };

    const isAuthenticated = () => {
        return !!user && !!user.token;
    };

    // Expose a method to force refresh of auth state
    const refreshAuthState = () => {
        setAuthState(Date.now());
    };

    const contextValue = {
        user,
        login,
        logout,
        isAuthenticated,
        loading,
        refreshAuthState,
        sessionData,
        refreshSession
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};