import { useState, useEffect } from 'react';
import './Ad.css';
import { useAdContext } from './AdContext.jsx';

// Make sure this base URL matches your actual backend URL
// If you're running backend locally, it might be something like https://deploy-backend-wtwc.onrender.com
const API_BASE_URL = 'https://deploy-backend-wtwc.onrender.com';

export default function Ad() {
    const { refreshAds } = useAdContext();
    const [ad, setAd] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [noAds, setNoAds] = useState(false);

    useEffect(() => {
        const fetchRandomAd = async (retries = 3) => {
            for (let i = 0; i < retries; i++) {
                try {
                    setLoading(true);
                    // Add proper headers and ensure CORS is enabled
                    const response = await fetch(`${API_BASE_URL}/api/ads/random?t=${Date.now()}`, {
                        method: 'GET',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        },
                    });
                    console.log('Random ad response:', response);

                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    const data = await response.json();
                    console.log('Random ad data:', data);

                    if (data.message === 'No ads available' || !data) {
                        setNoAds(true);
                        setAd(null);
                    } else if (!data.name || (!data.pictures && !data.videos)) {
                        setNoAds(true);
                        setAd(null);
                    } else {
                        setAd(data);
                        setNoAds(false);
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

        fetchRandomAd();
        const intervalId = setInterval(fetchRandomAd, 30 * 1000); // Refresh every 30 seconds for testing

        return () => clearInterval(intervalId);
    }, [refreshAds]);

    if (loading) {
        return (
            <div className="ad-container ad-loading fixed-bottom-ad">
                <p className="ad-loading-text">Loading advertisement...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="ad-container ad-error fixed-bottom-ad">
                <p className="ad-error-text">Error: {error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="retry-button"
                >
                    Retry
                </button>
            </div>
        );
    }

    if (noAds || !ad) {
        return (
            <div className="ad-container ad-error fixed-bottom-ad">
                <p className="ad-error-text">No advertisements available</p>
            </div>
        );
    }

    const handleAdClick = () => {
        if (ad.link) {
            window.open(ad.link, '_blank', 'noopener noreferrer');
        }
    };

    // Handle media URL extraction (supports both string and object formats)
    const mediaUrl = ad.pictures && ad.pictures.length > 0
        ? (typeof ad.pictures[0] === 'object' ? ad.pictures[0].url : ad.pictures[0])
        : null;
    const videoUrl = ad.videos && ad.videos.length > 0
        ? (typeof ad.videos[0] === 'object' ? ad.videos[0].url : ad.videos[0])
        : null;

    return (
        <div
            className="ad-container fixed-bottom-ad"
            onClick={handleAdClick}
            role="banner"
            aria-label="Advertisement"
        >
            <div className="ad-inner">
                <div className="ad-media">
                    {mediaUrl ? (
                        <img
                            src={mediaUrl}
                            alt={ad.name}
                            className="ad-media-content"
                        />
                    ) : videoUrl ? (
                        <div className="ad-media-video-wrapper">
                            <video
                                src={videoUrl}
                                className="ad-media-content"
                                muted
                                autoPlay
                                loop
                            />
                        </div>
                    ) : (
                        <div className="ad-media-placeholder">
                            <img
                                src="/api/placeholder/120/90"
                                alt="placeholder"
                                className="ad-media-content"
                            />
                        </div>
                    )}
                </div>
                <div className="ad-content frame">
                    <div>
                        <h3 className="ad-title">{ad.name || 'Advertisement'}</h3>
                        <p className="ad-description">{ad.description || ''}</p>
                    </div>
                    <div className="ad-footer">
                        <span className="ad-sponsored">Sponsored</span>
                        <span className="ad-hostname">{ad.link || ''}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}