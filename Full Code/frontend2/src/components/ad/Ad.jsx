import { useState, useEffect } from 'react';
import './Promo.css'; // Renamed CSS file
import { usePromoContext } from './PromoContext.jsx'; // Renamed context import

// Make sure this base URL matches your actual backend URL
const API_BASE_URL = 'http://localhost:8080';

export default function Ad() {
    const { refreshPromos } = usePromoContext();
    const [promo, setPromo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [noPromos, setNoPromos] = useState(false);

    useEffect(() => {
        const fetchRandomPromo = async (retries = 3) => {
            for (let i = 0; i < retries; i++) {
                try {
                    setLoading(true);
                    // IMPORTANT: The API endpoint is changed to avoid ad blockers.
                    // You must update your backend to use this route.
                    const response = await fetch(`${API_BASE_URL}/api/promos/random?t=${Date.now()}`, {
                        method: 'GET',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        },
                    });
                    console.log('Random promo response:', response);

                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    const data = await response.json();
                    console.log('Random promo data:', data);

                    if (data.message === 'No promos available' || !data) {
                        setNoPromos(true);
                        setPromo(null);
                    } else if (!data.name || (!data.pictures && !data.videos)) {
                        setNoPromos(true);
                        setPromo(null);
                    } else {
                        setPromo(data);
                        setNoPromos(false);
                    }
                    setLoading(false);
                    return;
                } catch (err) {
                    console.error(`Attempt ${i + 1} failed:`, err);
                    if (i === retries - 1) {
                        setError(err.message);
                        setLoading(false);
                    }
                }
            }
        };

        fetchRandomPromo();
        const intervalId = setInterval(fetchRandomPromo, 30 * 1000);

        return () => clearInterval(intervalId);
    }, [refreshPromos]);

    if (loading) {
        return (
            <div className="promo-container promo-loading fixed-bottom-promo">
                <p className="promo-loading-text">Loading content...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="promo-container promo-error fixed-bottom-promo">
                <p className="promo-error-text">Error: {error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="retry-button"
                >
                    Retry
                </button>
            </div>
        );
    }

    if (noPromos || !promo) {
        return (
            <div className="promo-container promo-error fixed-bottom-promo">
                <p className="promo-error-text">No content available</p>
            </div>
        );
    }

    const handlePromoClick = () => {
        if (promo.link) {
            window.open(promo.link, '_blank', 'noopener noreferrer');
        }
    };

    const mediaUrl = promo.pictures && promo.pictures.length > 0
        ? (typeof promo.pictures[0] === 'object' ? promo.pictures[0].url : promo.pictures[0])
        : null;
    const videoUrl = promo.videos && promo.videos.length > 0
        ? (typeof promo.videos[0] === 'object' ? promo.videos[0].url : promo.videos[0])
        : null;

    return (
        <div
            className="promo-container fixed-bottom-promo"
            onClick={handlePromoClick}
            role="banner"
            aria-label="Promotional Content"
        >
            <div className="promo-inner">
                <div className="promo-media">
                    {mediaUrl ? (
                        <img
                            src={mediaUrl}
                            alt={promo.name}
                            className="promo-media-content"
                        />
                    ) : videoUrl ? (
                        <div className="promo-media-video-wrapper">
                            <video
                                src={videoUrl}
                                className="promo-media-content"
                                muted
                                autoPlay
                                loop
                            />
                        </div>
                    ) : (
                        <div className="promo-media-placeholder">
                            <img
                                src="/api/placeholder/120/90"
                                alt="placeholder"
                                className="promo-media-content"
                            />
                        </div>
                    )}
                </div>
                <div className="promo-content frame">
                    <div>
                        <h3 className="promo-title">{promo.name || 'Sponsored Content'}</h3>
                        <p className="promo-description">{promo.description || ''}</p>
                    </div>
                    <div className="promo-footer">
                        <span className="promo-sponsored">Sponsored</span>
                        <span className="promo-hostname">{promo.link || ''}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Ad;