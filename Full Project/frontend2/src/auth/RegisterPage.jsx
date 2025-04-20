import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from 'lucide-react';
import './RegisterPage.css';
import { useAuth } from "./AuthContext.jsx";

export const RegisterPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const payload = {
            name: formData.name,
            email: formData.email,
            password: formData.password,
        };
        console.log('Register payload:', payload);
        try {
            const response = await axios.post('https://deploy-backend2-jcl1.onrender.com/auth/register', payload, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true,
            });
            console.log('Register response:', response.data);
            const { token, userId, name, email, access } = response.data;
            if (token) {
                // Use the login function from AuthContext instead of manually setting localStorage
                login({ token, userId, name, email, access });

                if (access === 'admin') {
                    navigate('/dashboard');
                } else {
                    navigate('/');
                }
            } else {
                setError('No token received from server');
                navigate('/login');
            }
        } catch (error) {
            console.error('Register error:', {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data,
            });
            setError(error.response?.data || 'Registration failed. Check network or server.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="register-container">
            <div className="register-content">
                <h1>Create Account</h1>
                <p>Fill in the details to sign up</p>
                {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}
                <form onSubmit={handleSubmit} className="register-form">
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <div className="input-group">
                            <User className="input-icon" size={18} />
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Your Name"
                                required
                                style={{ paddingLeft: '2.5rem' }}
                            />
                        </div>
                    </div>
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
                    <button type="submit" className="register-button" disabled={loading}>
                        {loading ? 'Creating account...' : 'Sign up'} {!loading && <ArrowRight size={18} />}
                    </button>
                </form>
                <p className="login-prompt">
                    Already have an account? <a href="/login">Sign in</a>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;