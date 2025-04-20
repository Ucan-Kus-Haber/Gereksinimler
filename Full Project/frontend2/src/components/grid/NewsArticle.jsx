import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './NewsArticle.css';

const API_BASE_URL = 'https://deploy-backend2-jcl1.onrender.com/api';

const NewsArticle = () => {
    const { slug } = useParams();
    const navigate = useNavigate();

    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [relatedArticles, setRelatedArticles] = useState([]);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                setLoading(true);

                const response = await axios.get(`${API_BASE_URL}/news/slug/${slug}`);
                setArticle(response.data);

                if (response.data && response.data.category) {
                    const relatedResponse = await axios.get(
                        `${API_BASE_URL}/news/category/${response.data.category}`,
                        { params: { page: 0, size: 4 } }
                    );

                    if (relatedResponse.data && relatedResponse.data.content) {
                        const filtered = relatedResponse.data.content.filter(
                            relatedArticle => relatedArticle.id !== response.data.id
                        );
                        setRelatedArticles(filtered);
                    }
                }

                setLoading(false);
            } catch (err) {
                console.error('Error fetching article:', err);
                setError(`Failed to load article: ${err.message}`);
                setLoading(false);
            }
        };

        if (slug) {
            fetchArticle();
        }
    }, [slug]);

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const verifyImageUrl = (url) => {
        if (!url) return null;
        if (url.startsWith('http://') || url.startsWith('https://')) {
            return url;
        }
        return 'https://pub-cab830fe342c4f9480be11e8b3347409.r2.dev/e0419d68-d383-4e39-a60d-8caf434d2394-Warface_240519_2334.jpg';
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <div>Loading article...</div>
            </div>
        );
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    if (!article) {
        return <div className="not-found">Article not found</div>;
    }

    const fallbackImage = 'https://pub-cab830fe342c4f9480be11e8b3347409.r2.dev/e0419d68-d383-4e39-a60d-8caf434d2394-Warface_240519_2334.jpg';
    const articleImage = verifyImageUrl(article.imageUrl) || fallbackImage;

    return (
        <div className="article-page">
            <div className="article-container">
                <div className="breadcrumb">
                    <span onClick={() => navigate('/')}>Home</span>
                    <span> &gt; </span>
                    <span onClick={() => navigate(`/category/${article.category}`)}>{article.category}</span>
                    <span> &gt; </span>
                    <span>{article.title}</span>
                </div>

                <header className="article-header">
                    <h1 className="article-title">{article.title}</h1>
                    {article.summary && (
                        <div className="article-summary">{article.summary}</div>
                    )}
                    <div className="article-meta">
                        <div className="article-author">By {article.author}</div>
                        <div className="article-date">
                            {formatDate(article.publishedAt || article.createdAt)}
                        </div>
                        <div className="article-views">{article.viewCount} views</div>
                    </div>
                </header>

                {articleImage && (
                    <div className="article-featured-image">
                        <img
                            src={articleImage}
                            alt={article.title}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = fallbackImage;
                            }}
                        />
                    </div>
                )}

                <div className="article-content">
                    <div dangerouslySetInnerHTML={{ __html: article.content }} />
                </div>

                <div className="article-actions" style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                    <button className="article-action-button" title="Like">
                        👍
                    </button>
                    <button className="article-action-button" title="Dislike">
                        👎
                    </button>
                    <button className="article-action-button" title="Add to Favorites">
                        ⭐
                    </button>
                </div>

                {article.videoUrl && (
                    <div className="article-video">
                        <h3>Related Video</h3>
                        {article.videoUrl.endsWith('.mp4') ||
                        article.videoUrl.endsWith('.webm') ||
                        article.videoUrl.endsWith('.mov') ? (
                            <video
                                controls
                                src={article.videoUrl}
                                poster={articleImage}
                                style={{ maxWidth: '100%' }}
                            >
                                Your browser does not support the video tag.
                            </video>
                        ) : (
                            <div className="video-fallback">
                                <p>Video format not supported or video not available</p>
                                <a href={article.videoUrl} target="_blank" rel="noopener noreferrer">
                                    Open video in new tab
                                </a>
                            </div>
                        )}
                    </div>
                )}

                {article.tags && article.tags.length > 0 && (
                    <div className="article-tags">
                        <h3>Topics</h3>
                        <div className="tags-container">
                            {article.tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="article-tag"
                                    onClick={() => navigate(`/tag/${tag}`)}
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {article.source && (
                    <div className="article-source">
                        <strong>Source:</strong> {article.source}
                    </div>
                )}
            </div>

            {relatedArticles.length > 0 && (
                <div className="related-articles">
                    <h2>Related Articles</h2>
                    <div className="related-articles-grid">
                        {relatedArticles.slice(0, 3).map((relArticle) => {
                            const relArticleImage = verifyImageUrl(relArticle.imageUrl) || fallbackImage;

                            return (
                                <div
                                    key={relArticle.id}
                                    className="related-article"
                                    onClick={() => navigate(`/news/${relArticle.slug || relArticle.id}`)}
                                >
                                    <div className="related-article-image">
                                        <img
                                            src={relArticleImage}
                                            alt={relArticle.title}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = fallbackImage;
                                            }}
                                        />
                                    </div>
                                    <div className="related-article-content">
                                        <h3>{relArticle.title}</h3>
                                        <div className="related-article-date">
                                            {formatDate(relArticle.publishedAt || relArticle.createdAt)}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NewsArticle;