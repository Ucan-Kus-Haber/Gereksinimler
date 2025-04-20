import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RectangularNewsGrid.css';

const API_BASE_URL = 'http://localhost:8080/api';

const RectangularNewsGrid = ({ categoryFilter = null }) => {
    const [articles, setArticles] = useState([]);
    const [randomArticle, setRandomArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [randomLoading, setRandomLoading] = useState(false);
    const [error, setError] = useState(null);
    const [categories, setCategories] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const fetchArticles = async (page = 0) => {
        try {
            setLoading(true);

            let articlesEndpoint = `${API_BASE_URL}/news`;
            let params = { page: page, size: 9 };

            if (categoryFilter) {
                articlesEndpoint = `${API_BASE_URL}/news/category/${categoryFilter}`;
            }

            const articlesResponse = await axios.get(articlesEndpoint, { params });

            if (articlesResponse.data && articlesResponse.data.content) {
                if (page === 0) {
                    setArticles(articlesResponse.data.content);
                } else {
                    setArticles(prev => [...prev, ...articlesResponse.data.content]);
                }
                setCurrentPage(articlesResponse.data.currentPage);
                setTotalPages(articlesResponse.data.totalPages);

                const uniqueCategories = [...new Set(articlesResponse.data.content
                    .map(article => article.category)
                    .filter(category => category))];
                setCategories(uniqueCategories);
            } else {
                setError('Invalid data format received from API');
            }

            setLoading(false);
        } catch (err) {
            console.error('Fetch Error:', err);
            setError(`Failed to fetch articles: ${err.message}`);
            setLoading(false);
        }
    };

    const fetchRandomArticle = async () => {
        try {
            setRandomLoading(true);
            const response = await axios.get(`${API_BASE_URL}/news/random`);

            if (response.data) {
                setRandomArticle(response.data);
            } else {
                console.error('Invalid random article data');
            }
            setRandomLoading(false);
        } catch (err) {
            console.error('Random Article Fetch Error:', err);
            setRandomLoading(false);
        }
    };

    const fetchRandomArticles = async (count = 9) => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE_URL}/news/random-batch`, {
                params: { count }
            });

            if (response.data && Array.isArray(response.data)) {
                setArticles(response.data);
            } else {
                console.error('Invalid random articles batch data');
            }
            setLoading(false);
        } catch (err) {
            console.error('Random Articles Batch Fetch Error:', err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArticles(0);
        fetchRandomArticle();
    }, [categoryFilter]);

    const handleCategoryClick = (category) => {
        window.location.href = `/category/${category}`;
    };

    const loadMoreArticles = () => {
        if (currentPage < totalPages - 1) {
            fetchArticles(currentPage + 1);
        }
    };

    const refreshRandomArticle = () => {
        fetchRandomArticle();
    };

    const loadRandomArticlesBatch = () => {
        fetchRandomArticles(9);
    };

    if (loading && articles.length === 0) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <div>Loading latest news...</div>
            </div>
        );
    }

    if (error && articles.length === 0) {
        return <div className="error-message">{error}</div>;
    }

    if (!articles || articles.length === 0) {
        return <div className="no-articles">No articles available at this time</div>;
    }

    const displayArticles = articles.slice(0, 9);

    return (
        <div className="rectangular-container">
            <header className="rect-news-header">
                <div className="logo">NEWSWATCH</div>
                <nav className="categories-nav">
                    <ul>
                        <li className={!categoryFilter ? "active" : ""}
                            onClick={() => window.location.href = "/"}>
                            Home
                        </li>
                        {categories.slice(0, 5).map(category => (
                            <li
                                key={category}
                                className={categoryFilter === category ? "active" : ""}
                                onClick={() => handleCategoryClick(category)}>
                                {category}
                            </li>
                        ))}
                        <li>More</li>
                    </ul>
                </nav>
            </header>

            <div className="breaking-news-ticker">
                <span className="ticker-label">BREAKING</span>
                <div className="ticker-content">
                    {articles[0]?.title || 'Latest updates from around the world'}
                </div>
            </div>

            {randomArticle && (
                <div className="random-news-section">
                    <h2 className="random-news-heading">Featured Story</h2>
                    <div className="rectangular-box">
                        <div className="rectangular-image">
                            {randomArticle.imageUrl && (
                                <img
                                    src={randomArticle.imageUrl}
                                    alt={randomArticle.title}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = 'https://pub-cab830fe342c4f9480be11e8b3347409.r2.dev/de7aa2fe-cb60-4a37-b368-309c3f0bee18-download_(1).jpeg';
                                    }}
                                />
                            )}
                        </div>
                        <div className="rectangular-content">
                            <h3 className="rectangular-title">{randomArticle.title}</h3>
                            <p className="rectangular-summary">
                                {randomArticle.summary || randomArticle.content?.substring(0, 100) || 'No description available'}...
                            </p>
                            <span className="rectangular-category">{randomArticle.category}</span>
                            <span className="rectangular-date">
                                {new Date(randomArticle.publishedAt || Date.now()).toLocaleDateString()}
                            </span>
                            <div className="rectangular-actions" style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                <button className="rect-action-button" title="Like">
                                    👍
                                </button>
                                <button className="rect-action-button" title="Dislike">
                                    👎
                                </button>
                                <button className="rect-action-button" title="Add to Favorites">
                                    ⭐
                                </button>
                            </div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                        <button
                            className="random-news-button"
                            onClick={refreshRandomArticle}
                            disabled={randomLoading}
                        >
                            {randomLoading ? 'Loading...' : 'Another Random Story'}
                        </button>
                        <button
                            className="random-news-button"
                            onClick={loadRandomArticlesBatch}
                            disabled={loading}
                        >
                            {loading ? 'Loading...' : 'Refresh All Articles'}
                        </button>
                    </div>
                </div>
            )}

            <div className="rectangular-grid">
                {displayArticles.map((article, index) => (
                    <div key={article.id || index} className="rectangular-item">
                        <div className="rectangular-box">
                            <div className="rectangular-image">
                                {article.imageUrl && (
                                    <img
                                        src={article.imageUrl}
                                        alt={article.title}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'https://pub-cab830fe342c4f9480be11e8b3347409.r2.dev/de7aa2fe-cb60-4a37-b368-309c3f0bee18-download_(1).jpeg';
                                        }}
                                    />
                                )}
                            </div>
                            <div className="rectangular-content">
                                <h3 className="rectangular-title">{article.title}</h3>
                                <p className="rectangular-summary">
                                    {article.summary || article.content?.substring(0, 80) || 'No description available'}...
                                </p>
                                <span className="rectangular-category">{article.category}</span>
                                <span className="rectangular-date">
                                    {new Date(article.publishedAt || Date.now()).toLocaleDateString()}
                                </span>
                                <div className="rectangular-actions" style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                    <button className="rect-action-button" title="Like">
                                        👍
                                    </button>
                                    <button className="rect-action-button" title="Dislike">
                                        👎
                                    </button>
                                    <button className="rect-action-button" title="Add to Favorites">
                                        ⭐
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {currentPage < totalPages - 1 && (
                <div className="load-more-container">
                    <button
                        className="load-more-button"
                        onClick={loadMoreArticles}
                        disabled={loading}
                    >
                        {loading ? 'Loading...' : 'Load More Articles'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default RectangularNewsGrid;