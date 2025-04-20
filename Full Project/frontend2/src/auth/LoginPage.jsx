import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';
import './LoginPage.css';
import { useAuth } from './AuthContext.jsx';

export const LoginPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        forgotEmail: '',
    });
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const payload = {
            email: formData.email,
            password: formData.password,
        };
        console.log('Login payload:', payload);
        try {
            const response = await axios.post('https://deploy-backend2-jcl1.onrender.com/auth/login', payload, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true,
            });
            console.log('Login response:', response.data);
            const { token, userId, name, email, access } = response.data;
            if (token) {
                login({ token, userId, name, email, access });

                if (access === 'admin') {
                    navigate('/dashboard');
                } else {
                    navigate('/');
                }
            } else {
                setError('No token received from server');
            }
        } catch (error) {
            console.error('Login error:', {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data,
            });
            setError(error.response?.data || 'Login failed. Check network or server.');
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPasswordSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        setLoading(true);
        try {
            await axios.post('https://deploy-backend2-jcl1.onrender.com/auth/forgot-password', {
                email: formData.forgotEmail,
            });
            setSuccessMessage('Password reset link sent to your email.');
            setFormData((prev) => ({ ...prev, forgotEmail: '' }));
        } catch (error) {
            setError(error.response?.data || 'Failed to send reset link.');
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

                {!showForgotPassword ? (
                    <>
                        <h1>Welcome Back</h1>
                        <p>Enter your credentials to access your account</p>
                        {error && <p className="error-message">{error}</p>}
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
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                <div className="forgot-password-container">
                                    <button
                                        type="button"
                                        className="forgot-password-link"
                                        onClick={() => setShowForgotPassword(true)}
                                    >
                                        Forgot password?
                                    </button>
                                </div>
                            </div>
                            <button type="submit" className="login-button" disabled={loading}>
                                {loading ? 'Signing in...' : 'Sign in'} {!loading && <ArrowRight size={18} />}
                            </button>
                        </form>
                        <p className="signup-prompt">
                            Don't have an account? <a href="/signUp">Create account</a>
                        </p>
                    </>
                ) : (
                    <>
                        <h1>Reset Password</h1>
                        <p>Enter your email to receive a password reset link</p>
                        {error && <p className="error-message">{error}</p>}
                        {successMessage && <p className="success-message">{successMessage}</p>}
                        <form onSubmit={handleForgotPasswordSubmit} className="login-form">
                            <div className="form-group">
                                <label htmlFor="forgotEmail">Email</label>
                                <div className="input-group">
                                    <Mail className="input-icon" size={18} />
                                    <input
                                        type="email"
                                        id="forgotEmail"
                                        name="forgotEmail"
                                        value={formData.forgotEmail}
                                        onChange={handleChange}
                                        placeholder="name@company.com"
                                        required
                                    />
                                </div>
                            </div>
                            <button type="submit" className="login-button" disabled={loading}>
                                {loading ? 'Sending...' : 'Send Reset Link'} {!loading && <ArrowRight size={18} />}
                            </button>
                        </form>
                        <p className="signup-prompt">
                            <button
                                type="button"
                                className="forgot-password-link"
                                onClick={() => setShowForgotPassword(false)}
                            >
                                Back to Sign in
                            </button>
                        </p>
                    </>
                )}
            </div>
        </div>
    );
};

export default LoginPage;