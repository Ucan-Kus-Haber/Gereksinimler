import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SmallNewsGrid.css';

const SmallNewsGrid = ({ articles }) => {
    const navigate = useNavigate();

    // Default image if none is available
    const defaultImage = 'https://pub-cab830fe342c4f9480be11e8b3347409.r2.dev/e0419d68-d383-4e39-a60d-8caf434d2394-Warface_240519_2334.jpg';

    // Format date to a readable format
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    };

    // Handle click on a news item
    const handleNewsClick = (slug, id) => {
        navigate(`/news/${slug || id}`);
    };

    return (
        <div className="small-news-grid-container">
            <div className="small-news-grid">
                {articles && articles.slice(0, 9).map((article, index) => {
                    const imageUrl = article.imageUrl &&
                    (article.imageUrl.startsWith('http://') || article.imageUrl.startsWith('https://'))
                        ? article.imageUrl
                        : defaultImage;

                    const displayDate = formatDate(article.publishedAt || article.createdAt);

                    return (
                        <div
                            key={article.id || index}
                            className="news-item"
                            onClick={() => handleNewsClick(article.slug, article.id)}
                        >
                            <div className="news-image-container">
                                <img
                                    src={imageUrl}
                                    alt={article.title}
                                    className="news-image"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = defaultImage;
                                    }}
                                />
                                {article.category && (
                                    <span className="news-category">{article.category}</span>
                                )}
                                {article.videoUrl && (
                                    <div className="video-duration">{article.duration || "2:27"}</div>
                                )}
                            </div>
                            <h3 className="news-title">{article.title}</h3>
                            <div className="news-meta">
                                {article.author && <span className="news-author">{article.author}</span>}
                                {displayDate && <span className="news-date">{displayDate}</span>}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SmallNewsGrid;