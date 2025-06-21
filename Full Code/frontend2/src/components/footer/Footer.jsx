import React, { useState } from 'react';
import './Footer.css';

const Footer = () => {
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (email.trim() && email.includes('@')) {
            console.log('Subscribing email:', email);
            setSubscribed(true);
            setEmail('');
            setTimeout(() => setSubscribed(false), 5000);
        }
    };

    return (
        <footer className="footer">
            <div className="footer-container">
                {/* Top Section with columns */}
                <div className="footer-top">
                    {/* Brand & About Us */}
                    <div className="footer-col">
                        <div className="footer-brand">
                            <img src="/logo.png" alt="News Portal Logo" className="footer-logo" />
                            <span className="footer-brand-name">UcanKusHaber</span>
                        </div>
                        <p className="footer-description">
                            Delivering breaking news, insightful analysis, and diverse perspectives from around the world.
                        </p>
                        <div className="social-links">
                            <a href="https://facebook.com" aria-label="Facebook">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                                </svg>
                            </a>
                            <a href="https://twitter.com" aria-label="Twitter">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                                </svg>
                            </a>
                            <a href="https://instagram.com" aria-label="Instagram">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                                </svg>
                            </a>
                            <a href="https://youtube.com" aria-label="YouTube">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                                    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Categories */}
                    <div className="footer-col">
                        <h3>Categories</h3>
                        <ul className="footer-links">
                            <li><a href="/category/breaking">Breaking News</a></li>
                            <li><a href="/category/politics">Politics</a></li>
                            <li><a href="/category/business">Business</a></li>
                            <li><a href="/category/technology">Technology</a></li>
                            <li><a href="/category/health">Health</a></li>
                            <li><a href="/category/entertainment">Entertainment</a></li>
                            <li><a href="/category/sports">Sports</a></li>
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div className="footer-col">
                        <h3>Company</h3>
                        <ul className="footer-links">
                            <li><a href="/about">About Us</a></li>
                            <li><a href="/contact">Contact</a></li>
                            <li><a href="/careers">Careers</a></li>
                            <li><a href="/advertise">Advertise</a></li>
                            <li><a href="/ethics">Ethics Policy</a></li>
                            <li><a href="/corrections">Corrections</a></li>
                            <li><a href="/complaint">Complaint</a></li>
                        </ul>
                    </div>

                    {/* Newsletter Subscription */}
                    <div className="footer-col">
                        <h3>Newsletter</h3>
                        <p>Subscribe to our newsletter for daily updates</p>
                        <div className="newsletter-form">
                            <div className="input-group">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Your email address"
                                    required
                                />
                                <button onClick={handleSubscribe}>Subscribe</button>
                            </div>
                            {subscribed && (
                                <div className="subscription-message">Thank you for subscribing!</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="footer-divider"></div>

                {/* Bottom Section */}
                <div className="footer-bottom">
                    <div className="footer-copyright">
                        © {new Date().getFullYear()} UcanKusHaber. All rights reserved.
                    </div>
                    <div className="footer-legal-links">
                        <a href="complaint"> Complaint </a>
                        <a href="/terms">Terms of Use</a>
                        <a href="/privacy">Privacy Policy</a>
                        <a href="/cookies">Cookie Policy</a>
                        <a href="/gdpr">GDPR</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;