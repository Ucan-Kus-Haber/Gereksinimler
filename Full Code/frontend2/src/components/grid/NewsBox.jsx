import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NewsBox.css';

const SIZES = {
    SMALL: 'small',
    MEDIUM: 'medium',
    LARGE: 'large',
    HERO: 'hero',
};

const NewsBox = ({
                     article,
                     size = SIZES.MEDIUM,
                     showSummary = true,
                     showCategory = true,
                     showAuthor = true,
                     className = '',
                 }) => {
    const navigate = useNavigate();

    if (!article) return null;

    const {
        id,
        title,
        content,
        summary,
        category,
        author,
        publishedAt,
        createdAt,
        imageUrl,
        slug,
        featured,
        tags = [],
        viewCount
    } = article;

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const displayDate = publishedAt ? formatDate(publishedAt) : formatDate(createdAt);

    const getDisplaySummary = () => {
        if (summary) return summary;
        if (content) {
            const maxLength = {
                small: 60,
                medium: 100,
                large: 160,
                hero: 200
            };
            const textLength = maxLength[size] || 100;
            return content.length > textLength
                ? `${content.substring(0, textLength)}...`
                : content;
        }
        return '';
    };

    const handleClick = () => {
        navigate(`/news/${slug || id}`);
    };

    const defaultImage = 'https://pub-cab830fe342c4f9480be11e8b3347409.r2.dev/e0419d68-d383-4e39-a60d-8caf434d2394-Warface_240519_2334.jpg';

    const displayImage = imageUrl && (imageUrl.startsWith('http://') || imageUrl.startsWith('https://'))
        ? imageUrl
        : defaultImage;

    const shouldShowTags = ['large', 'hero'].includes(size) && tags && tags.length > 0;

    return (
        <div
            className={`nwb-news-box nwb-news-box-${size} ${featured ? 'featured' : ''} ${className}`}
            onClick={handleClick}
        >
            <div className="nwb-news-box-image-container">
                <img
                    src={displayImage}
                    alt={title}
                    className="nwb-news-box-image"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = defaultImage;
                    }}
                />
                <div className="nwb-news-box-overlay">
                    {showCategory && category && (
                        <span className="nwb-news-box-category">{category}</span>
                    )}
                    {featured && (
                        <span className="nwb-news-box-featured-badge">FEATURED</span>
                    )}
                    {viewCount > 0 && (
                        <span className="nwb-news-box-view-count">{viewCount} views</span>
                    )}
                </div>
            </div>

            <div className="nwb-news-box-content">
                <h3 className="nwb-news-box-title">{title}</h3>
                {showSummary && getDisplaySummary() && (
                    <p className="nwb-news-box-summary">{getDisplaySummary()}</p>
                )}
                <div className="nwb-news-box-meta">
                    {showAuthor && author && (
                        <span className="nwb-news-box-author">By {author}</span>
                    )}
                    {displayDate && (
                        <span className="nwb-news-box-date">{displayDate}</span>
                    )}
                </div>
                {shouldShowTags && tags.length > 0 && (
                    <div className="nwb-news-box-tags">
                        {tags.slice(0, 3).map((tag, index) => (
                            <span key={index} className="nwb-news-box-tag">
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}
                <div className="nwb-news-box-actions" style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <button className="nwb-action-button" title="Like">
                        👍
                    </button>
                    <button className="nwb-action-button" title="Dislike">
                        👎
                    </button>
                    <button className="nwb-action-button" title="Add to Favorites">
                        ⭐
                    </button>
                </div>
            </div>
        </div>
    );
};

export const BoxSizes = SIZES;
export default NewsBox;