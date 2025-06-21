import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';
import './LoginPage.css';
import { useAuth } from './AuthContext.jsx'; // Adjust path as needed

export const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth(); // Use auth context
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // API base URL - hardcoded for development
    const API_BASE_URL = 'https://ucankus-deploy2.onrender.com';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const payload = {
            email: formData.email,
            password: formData.password,
        };

        console.log('Login payload:', { email: payload.email, passwordLength: payload.password.length });

        try {
            const response = await axios.post(`${API_BASE_URL}/auth/login`, payload, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true,
            });

            console.log('Login response status:', response.status);

            if (response.data && response.data.token) {
                const userData = {
                    token: response.data.token,
                    userId: response.data.userId,
                    name: response.data.name,
                    email: response.data.email,
                    access: response.data.access,
                };

                // Use login function from auth context
                login(userData);

                console.log('Login successful, redirecting to home');

                // Always navigate to home page
                navigate('/');
            } else {
                console.error('Invalid response format:', response.data);
                setError('Invalid response from server');
            }
        } catch (error) {
            console.error('Login error:', {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data,
            });

            if (error.response?.status === 401) {
                setError('Invalid email or password');
            } else if (error.response?.data) {
                setError(typeof error.response.data === 'string'
                    ? error.response.data
                    : 'Login failed. Please try again.');
            } else {
                setError('Unable to connect to server. Please check your network connection.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="login-container">
            <div className="login-content">
                <h1>Welcome Back</h1>
                <p>Enter your credentials to access your account</p>
                {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}
                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <div className="input-group">
                            <Mail className="input-icon" size={18} />
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="name@company.com"
                                required
                                style={{ paddingLeft: '2.5rem' }}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <div className="input-group">
                            <Lock className="input-icon" size={18} />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                required
                                style={{ paddingLeft: '2.5rem' }}
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>
                    <button type="submit" className="login-button" disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign in'} {!loading && <ArrowRight size={18} />}
                    </button>
                </form>
                <p className="signup-prompt">
                    Don't have an account? <a href="/register">Create account</a>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;