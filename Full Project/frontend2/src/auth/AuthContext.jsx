    import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// Create the Auth Context
const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        const userName = localStorage.getItem('userName');
        const userEmail = localStorage.getItem('userEmail');
        const access = localStorage.getItem('access');

        if (token && userId) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setUser({
                id: userId,
                name: userName,
                email: userEmail,
                access: access || 'user', // Default to 'user' if undefined
                token: token,

            });
        }
        setLoading(false);
    }, []);

    const login = (userData) => {
        const { token, userId, name, email, access } = userData;

        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId);
        localStorage.setItem('userName', name);
        localStorage.setItem('userEmail', email);
        localStorage.setItem('access', access || 'user');

        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        setUser({
            id: userId,
            name: name,
            email: email,
            access: access || 'user',
            token: token,
        });
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('access');

        delete axios.defaults.headers.common['Authorization'];

        setUser(null);
    };

    const isAuthenticated = () => {
        return !!user;
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                isAuthenticated,
                loading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};