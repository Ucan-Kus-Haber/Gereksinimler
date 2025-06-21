 import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './404.css'; // We'll create this CSS file next

const NotFound = () => {
    useEffect(() => {
        // Create star elements dynamically for the background
        const createStars = () => {
            const container = document.querySelector('.stars-container');
            if (container) {
                for (let i = 0; i < 100; i++) {
                    const star = document.createElement('div');
                    star.className = 'star';
                    star.style.top = `${Math.random() * 100}%`;
                    star.style.left = `${Math.random() * 100}%`;
                    star.style.animationDelay = `${Math.random() * 10}s`;
                    star.style.animationDuration = `${Math.random() * 3 + 2}s`;
                    container.appendChild(star);
                }
            }
        };

        createStars();

        return () => {
            // Cleanup function for unmounting
            const container = document.querySelector('.stars-container');
            if (container) {
                container.innerHTML = '';
            }
        };
    }, []);

    return (
        <div className="not-found-container">
            <div className="stars-container"></div>
            <div className="content">
                <h1 className="error-code">4<span className="zero-pulse">0</span>4</h1>
                <div className="spaceship">
                    <div className="spaceship-body"></div>
                    <div className="window"></div>
                    <div className="engine left"></div>
                    <div className="engine right"></div>
                    <div className="light"></div>
                </div>
                <h2 className="title">Lost in Space</h2>
                <p className="message">The page you're looking for has drifted into deep space.</p>
                <Link to="/" className="home-button">
                    <span>Return to Earth</span>
                    <div className="rocket">🚀</div>
                </Link>
            </div>
        </div>
    );
};

export default NotFound;