import React, { useState } from 'react';
import './Complaint.css';

const Complaint = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        complaint: ''
    });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.name.trim() && formData.email.includes('@') && formData.complaint.trim()) {
            console.log('Submitting complaint:', formData);
            setSubmitted(true);
            setFormData({ name: '', email: '', complaint: '' });
            setTimeout(() => setSubmitted(false), 5000);
        }
    };

    return (
        <div className="complaint-page">
            <div className="complaint-container">
                <h1 className="complaint-title">Submit a Complaint</h1>
                <p className="complaint-description">
                    We value your feedback. Please use the form below to submit any complaints or concerns, and our team will address them promptly.
                </p>
                <div className="complaint-form-container">
                    <div className="complaint-form">
                        <div className="form-group">
                            <label htmlFor="name" className="form-label">Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="Your name"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="Your email address"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="complaint" className="form-label">Complaint Details</label>
                            <textarea
                                id="complaint"
                                name="complaint"
                                value={formData.complaint}
                                onChange={handleChange}
                                className="form-textarea"
                                placeholder="Describe your complaint"
                                rows="6"
                                required
                            ></textarea>
                        </div>
                        <button
                            onClick={handleSubmit}
                            className="form-button"
                        >
                            Submit Complaint
                        </button>
                        {submitted && (
                            <div className="submission-message">
                                Thank you for your submission! We will review your complaint and get back to you soon.
                            </div>
                        )}
                    </div>
                </div>
                <div className="complaint-footer">
                    <div className="footer-copyright">
                        © {new Date().getFullYear()} UcanKusHaber. All rights reserved.
                    </div>
                    <div className="footer-legal-links">
                        <a href="/terms">Terms of Use</a>
                        <a href="/privacy">Privacy Policy</a>
                        <a href="/cookies">Cookie Policy</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Complaint;   