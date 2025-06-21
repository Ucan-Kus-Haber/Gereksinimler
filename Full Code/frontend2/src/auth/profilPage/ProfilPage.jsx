import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProfilPage.css';

// Base URL for API calls - can be set as an environment variable in production
const API_BASE_URL = 'https://ucankus-backend.onrender.com';

const ProfilePage = ({ userId = null }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({});

    // Function to fetch user profile
    const fetchUserProfile = async () => {
        try {
            setLoading(true);

            // Get the token from localStorage
            const token = localStorage.getItem('token');

            if (!token) {
                setError('You must be logged in to view your profile');
                setLoading(false);
                return;
            }

            // Determine which endpoint to use
            // Using the /auth endpoint from AuthController
            const endpoint = userId
                ? `${API_BASE_URL}/auth/${userId}`
                : `${API_BASE_URL}/auth/current-user`;

            const response = await axios.get(endpoint, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data) {
                setUser(response.data);
                setFormData(response.data);
            } else {
                // If no data returned but request was successful, create empty user template
                const emptyUser = {
                    name: '',
                    surname: '',
                    email: '', // This will be filled from the token later
                    dateOfBirth: '',
                    phoneNumber: '',
                    address: '',
                    nationality: '',
                    gender: '',
                    bio: '',
                    profilePicture: '',
                    roles: ['USER'],
                    createdDate: new Date().toISOString()
                };

                setUser(emptyUser);
                setFormData(emptyUser);

                // Set editing mode to true automatically if no user data
                setEditing(true);
            }

            setLoading(false);
        } catch (err) {
            console.error('Fetch Error:', err);

            // If 404 error (no user profile yet), create empty user for editing
            if (err.response && err.response.status === 404) {
                // Create a default empty user with just the email from token
                const emptyUser = {
                    name: '',
                    surname: '',
                    email: '', // This should be filled from the token if possible
                    dateOfBirth: '',
                    phoneNumber: '',
                    address: '',
                    nationality: '',
                    gender: '',
                    bio: '',
                    profilePicture: '',
                    roles: ['USER'],
                    createdDate: new Date().toISOString()
                };

                // Try to get email from token
                try {
                    const token = localStorage.getItem('token');
                    if (token) {
                        // Parse token to get user email (depends on your token structure)
                        // This is a simplified example - you may need to adjust based on your JWT structure
                        const tokenData = JSON.parse(atob(token.split('.')[1]));
                        if (tokenData && tokenData.sub) {
                            emptyUser.email = tokenData.sub;
                        }
                    }
                } catch (tokenErr) {
                    console.error('Error parsing token:', tokenErr);
                }

                setUser(emptyUser);
                setFormData(emptyUser);
                setEditing(true);
                setLoading(false);
            } else {
                setError(`Failed to fetch user profile: ${err.message}`);
                setLoading(false);
            }
        }
    };

    const updateUserProfile = async () => {
        try {
            setLoading(true);

            // Use the auth endpoint from AuthController
            // If user has an ID, update existing user, otherwise create new profile
            const endpoint = user && user.id
                ? `${API_BASE_URL}/auth/${user.id}`
                : `${API_BASE_URL}/auth/update-profile`;

            const response = await axios.put(endpoint, formData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.data) {
                setUser(response.data);
                setFormData(response.data);
                setEditing(false);
            } else {
                setError('Invalid data format received from API');
            }

            setLoading(false);
        } catch (err) {
            console.error('Update Error:', err);
            setError(`Failed to update profile: ${err.message}`);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserProfile();
    }, [userId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        updateUserProfile();
    };

    const toggleEdit = () => {
        setEditing(!editing);

        // Reset form data to current user data when toggling edit mode
        if (!editing) {
            setFormData(user);
        }
    };

    if (loading && !user) {
        return (
            <div className="Pfp-loading-container">
                <div className="Pfp-loading-spinner"></div>
                <div>Loading profile...</div>
            </div>
        );
    }

    // Changed this condition - we'll show the form even if there's an error if we have user data
    if (error && !user) {
        return (
            <div className="Pfp-container">
                <header className="Pfp-header">
                    <div className="Pfp-logo">NEWSWATCH</div>
                    <nav className="Pfp-categories-nav">
                        <ul>
                            <li onClick={() => window.location.href = "/"}>
                                Home
                            </li>
                            <li className="Pfp-active">
                                Profile
                            </li>
                            <li onClick={() => window.location.href = "/settings"}>
                                Settings
                            </li>
                        </ul>
                    </nav>
                </header>

                <div className="Pfp-error-message">
                    {error}
                    <br />
                    <button className="Pfp-edit-button" onClick={() => {
                        // Create empty user and start editing
                        const emptyUser = {
                            name: '',
                            surname: '',
                            email: '',
                            dateOfBirth: '',
                            phoneNumber: '',
                            address: '',
                            nationality: '',
                            gender: '',
                            bio: '',
                            profilePicture: '',
                            roles: ['USER'],
                            createdDate: new Date().toISOString()
                        };

                        setUser(emptyUser);
                        setFormData(emptyUser);
                        setEditing(true);
                        setError(null);
                    }}>
                        Create Profile
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="Pfp-container">
            <header className="Pfp-header">
                <div className="Pfp-logo">NEWSWATCH</div>
                <nav className="Pfp-categories-nav">
                    <ul>
                        <li onClick={() => window.location.href = "/"}>
                            Home
                        </li>
                        <li className="Pfp-active">
                            Profile
                        </li>
                        <li onClick={() => window.location.href = "/settings"}>
                            Settings
                        </li>
                    </ul>
                </nav>
            </header>

            <div className="Pfp-banner">
                <span className="Pfp-banner-label">PROFILE</span>
                <div className="Pfp-banner-content">
                    {user && (user.name || user.surname) ? `${user.name || ''} ${user.surname || ''}` : 'Complete Your Profile'}
                </div>
            </div>

            {error && (
                <div className="Pfp-error-message">{error}</div>
            )}

            <div className="Pfp-content">
                <div className="Pfp-sidebar">
                    <div className="Pfp-image-container">
                        <img
                            src={user && user.profilePicture ? user.profilePicture : 'https://pub-cab830fe342c4f9480be11e8b3347409.r2.dev/de7aa2fe-cb60-4a37-b368-309c3f0bee18-download_(1).jpeg'}
                            alt={`${user && user.name ? user.name : 'User'}'s profile`}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://pub-cab830fe342c4f9480be11e8b3347409.r2.dev/de7aa2fe-cb60-4a37-b368-309c3f0bee18-download_(1).jpeg';
                            }}
                        />
                    </div>
                    <div className="Pfp-user-roles">
                        {user && user.roles && user.roles.map((role, index) => (
                            <span key={index} className="Pfp-role-badge">{role}</span>
                        ))}
                    </div>
                    <div className="Pfp-stats">
                        <div className="Pfp-stat-item">
                            <span className="Pfp-stat-label">Member Since</span>
                            <span className="Pfp-stat-value">
                                {user && user.createdDate ? new Date(user.createdDate).toLocaleDateString() : new Date().toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="Pfp-main">
                    {editing ? (
                        <form onSubmit={handleSubmit} className="Pfp-edit-form">
                            <h2>Edit Profile</h2>

                            <div className="Pfp-form-row">
                                <div className="Pfp-form-group">
                                    <label htmlFor="name">First Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name || ''}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="Pfp-form-group">
                                    <label htmlFor="surname">Last Name</label>
                                    <input
                                        type="text"
                                        id="surname"
                                        name="surname"
                                        value={formData.surname || ''}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <div className="Pfp-form-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email || ''}
                                    onChange={handleInputChange}
                                    disabled
                                />
                                <small>Email cannot be changed</small>
                            </div>

                            <div className="Pfp-form-row">
                                <div className="Pfp-form-group">
                                    <label htmlFor="dateOfBirth">Date of Birth</label>
                                    <input
                                        type="date"
                                        id="dateOfBirth"
                                        name="dateOfBirth"
                                        value={formData.dateOfBirth || ''}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="Pfp-form-group">
                                    <label htmlFor="gender">Gender</label>
                                    <select
                                        id="gender"
                                        name="gender"
                                        value={formData.gender || ''}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Select gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                        <option value="Prefer not to say">Prefer not to say</option>
                                    </select>
                                </div>
                            </div>

                            <div className="Pfp-form-group">
                                <label htmlFor="phoneNumber">Phone Number</label>
                                <input
                                    type="tel"
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    value={formData.phoneNumber || ''}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="Pfp-form-group">
                                <label htmlFor="address">Address</label>
                                <input
                                    type="text"
                                    id="address"
                                    name="address"
                                    value={formData.address || ''}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="Pfp-form-group">
                                <label htmlFor="nationality">Nationality</label>
                                <input
                                    type="text"
                                    id="nationality"
                                    name="nationality"
                                    value={formData.nationality || ''}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="Pfp-form-group">
                                <label htmlFor="bio">Bio</label>
                                <textarea
                                    id="bio"
                                    name="bio"
                                    value={formData.bio || ''}
                                    onChange={handleInputChange}
                                    rows="4"
                                ></textarea>
                            </div>

                            <div className="Pfp-form-group">
                                <label htmlFor="profilePicture">Profile Picture URL</label>
                                <input
                                    type="text"
                                    id="profilePicture"
                                    name="profilePicture"
                                    value={formData.profilePicture || ''}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="Pfp-form-actions">
                                <button type="submit" className="Pfp-save-button">Save Changes</button>
                                {user && user.id && (
                                    <button type="button" className="Pfp-cancel-button" onClick={toggleEdit}>Cancel</button>
                                )}
                            </div>
                        </form>
                    ) : (
                        <div className="Pfp-info">
                            <div className="Pfp-header-row">
                                <h2>{user && user.name ? `${user.name} ${user.surname || ''}` : 'Complete Your Profile'}</h2>
                                <button className="Pfp-edit-button" onClick={toggleEdit}>Edit Profile</button>
                            </div>

                            <div className="Pfp-section">
                                <h3>Personal Information</h3>
                                <div className="Pfp-info-box">
                                    <div className="Pfp-info-item">
                                        <span className="Pfp-info-label">Email:</span>
                                        <span className="Pfp-info-value">{user && user.email}</span>
                                    </div>
                                    <div className="Pfp-info-item">
                                        <span className="Pfp-info-label">Date of Birth:</span>
                                        <span className="Pfp-info-value">{user && user.dateOfBirth || 'Not specified'}</span>
                                    </div>
                                    <div className="Pfp-info-item">
                                        <span className="Pfp-info-label">Gender:</span>
                                        <span className="Pfp-info-value">{user && user.gender || 'Not specified'}</span>
                                    </div>
                                    <div className="Pfp-info-item">
                                        <span className="Pfp-info-label">Nationality:</span>
                                        <span className="Pfp-info-value">{user && user.nationality || 'Not specified'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="Pfp-section">
                                <h3>Contact Information</h3>
                                <div className="Pfp-info-box">
                                    <div className="Pfp-info-item">
                                        <span className="Pfp-info-label">Phone Number:</span>
                                        <span className="Pfp-info-value">{user && user.phoneNumber || 'Not specified'}</span>
                                    </div>
                                    <div className="Pfp-info-item">
                                        <span className="Pfp-info-label">Address:</span>
                                        <span className="Pfp-info-value">{user && user.address || 'Not specified'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="Pfp-section">
                                <h3>About Me</h3>
                                <div className="Pfp-info-box">
                                    <div className="Pfp-bio-content">
                                        {user && user.bio || 'No bio provided yet.'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;