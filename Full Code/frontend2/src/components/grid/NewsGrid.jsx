import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NewsBox, { BoxSizes } from './NewsBox';
import './NewsGrid.css';

const API_BASE_URL = 'https://ucankus-deploy2.onrender.com/api';

const NewsGrid = ({ layout = 'standard', categoryFilter = null }) => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [categories, setCategories] = useState([]);
    const [featuredArticles, setFeaturedArticles] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                let articlesEndpoint = `${API_BASE_URL}/news`;
                let params = { page: currentPage, size: 12 };

                if (categoryFilter) {
                    articlesEndpoint = `${API_BASE_URL}/news/category/${categoryFilter}`;
                }

                const articlesResponse = await axios.get(articlesEndpoint, { params });
                const featuredResponse = await axios.get(`${API_BASE_URL}/news/featured`, {
                    params: { limit: 5 }
                });

                if (articlesResponse.data && articlesResponse.data.content) {
                    setArticles(articlesResponse.data.content);
                    setCurrentPage(articlesResponse.data.currentPage);
                    setTotalPages(articlesResponse.data.totalPages);

                    const uniqueCategories = [...new Set(articlesResponse.data.content
                        .map(article => article.category)
                        .filter(category => category))];
                    setCategories(uniqueCategories);
                } else {
                    setError('Invalid data format received from API');
                }

                if (featuredResponse.data) {
                    setFeaturedArticles(featuredResponse.data);
                }

                setLoading(false);
            } catch (err) {
                console.error('Fetch Error:', err);
                setError(`Failed to fetch articles: ${err.message}`);
                setLoading(false);
            }
        };

        fetchData();
    }, [currentPage, categoryFilter]);

    const handleCategoryClick = (category) => {
        window.location.href = `/category/${category}`;
    };

    const loadMoreArticles = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(currentPage + 1);
        }
    };

    if (loading && articles.length === 0) {
        return (
            <div className="ngm-loading-container">
                <div className="ngm-loading-spinner"></div>
                <div>Loading latest news...</div>
            </div>
        );
    }

    if (error && articles.length === 0) {
        return <div className="ngm-error-message">{error}</div>;
    }

    if (!articles || articles.length === 0) {
        return <div className="ngm-no-articles">No articles available at this time</div>;
    }

    const displayArticles = [
        ...featuredArticles,
        ...articles.filter(article => !featuredArticles.some(featured => featured.id === article.id))
    ];

    const layouts = {
        standard: () => (
            <div className="ngm-news-container">
                <header className="ngm-news-header">
                    <div className="ngm-logo">NEWSWATCH</div>
                    <nav className="ngm-categories-nav">
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

                <div className="ngm-breaking-news-ticker">
                    <span className="ngm-ticker-label">BREAKING</span>
                    <div className="ngm-ticker-content">
                        {displayArticles[0]?.title || 'Latest updates from around the world'}
                    </div>
                </div>

                <div className="ngm-news-grid ngm-news-grid-standard">
                    {displayArticles.length > 0 && (
                        <div className="ngm-news-grid-hero">
                            <NewsBox article={displayArticles[0]} size={BoxSizes.HERO} />
                        </div>
                    )}

                    <div className="ngm-news-grid-small-boxes">
                        {displayArticles.slice(1, 9).map((article, index) => (
                            <div key={article.id || index} className="ngm-news-grid-small-item">
                                <NewsBox
                                    article={article}
                                    size={BoxSizes.SMALL}
                                    showSummary={true}
                                    truncateLines={2}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="ngm-news-sidebar">
                    <div className="ngm-sidebar-section">
                        <h3 className="ngm-sidebar-heading">TOP STORIES</h3>
                        {displayArticles.slice(0, 5).map((article, index) => (
                            <div
                                key={`sidebar-${article.id || index}`}
                                className="ngm-sidebar-item"
                                onClick={() => window.location.href = `/news/${article.slug || article.id}`}>
                                <span className="ngm-sidebar-number">{index + 1}</span>
                                <span className="ngm-sidebar-title">{article.title}</span>
                            </div>
                        ))}
                    </div>

                    <div className="ngm-sidebar-section">
                        <h3 className="ngm-sidebar-heading">TRENDING TOPICS</h3>
                        <div className="ngm-trending-tags">
                            {Array.from(new Set(displayArticles
                                .flatMap(article => article.tags || [])
                                .filter(tag => tag)))
                                .slice(0, 6)
                                .map((tag, index) => (
                                    <span
                                        key={`tag-${index}`}
                                        className="ngm-trending-tag"
                                        onClick={() => window.location.href = `/tag/${tag}`}>
                                        #{tag}
                                    </span>
                                ))}
                        </div>
                    </div>
                </div>

                {currentPage < totalPages - 1 && (
                    <div className="ngm-load-more-container">
                        <button className="ngm-load-more-button" onClick={loadMoreArticles}>
                            {loading ? 'Loading...' : 'Load More Articles'}
                        </button>
                    </div>
                )}
            </div>
        ),
        homepage: () => (
            <div className="ngm-news-container">
                <header className="ngm-news-header">
                    <div className="ngm-logo">NEWSWATCH</div>
                    <nav className="ngm-categories-nav">
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

                <div className="ngm-breaking-news-ticker">
                    <span className="ngm-ticker-label">BREAKING</span>
                    <div className="ngm-ticker-content">
                        {displayArticles[0]?.title || 'Latest via Latest updates from around the world'}
                    </div>
                </div>

                <div className="ngm-news-grid ngm-news-grid-homepage">
                    {displayArticles.length > 0 && (
                        <div className="ngm-news-grid-hero">
                            <NewsBox article={displayArticles[0]} size={BoxSizes.HERO} />
                        </div>
                    )}

                    <div className="ngm-news-grid-small-boxes">
                        {displayArticles.slice(1, 9).map((article, index) => (
                            <div key={article.id || index} className="ngm-news-grid-small-item">
                                <NewsBox
                                    article={article}
                                    size={BoxSizes.SMALL}
                                    showSummary={true}
                                    truncateLines={2}
                                />
                            </div>
                        ))}
                    </div>

                    {currentPage < totalPages - 1 && (
                        <div className="ngm-load-more-container">
                            <button className="ngm-load-more-button" onClick={loadMoreArticles}>
                                {loading ? 'Loading...' : 'Load More Articles'}
                            </button>
                        </div>
                    )}
                </div>

                <div className="ngm-news-sidebar">
                    <div className="ngm-sidebar-section">
                        <h3 className="ngm-sidebar-heading">TOP STORIES</h3>
                        {displayArticles.slice(0, 5).map((article, index) => (
                            <div
                                key={`sidebar-${article.id || index}`}
                                className="ngm-sidebar-item"
                                onClick={() => window.location.href = `/news/${article.slug || article.id}`}>
                                <span className="ngm-sidebar-number">{index + 1}</span>
                                <span className="ngm-sidebar-title">{article.title}</span>
                            </div>
                        ))}
                    </div>

                    <div className="ngm-sidebar-section">
                        <h3 className="ngm-sidebar-heading">TRENDING TOPICS</h3>
                        <div className="ngm-trending-tags">
                            {Array.from(new Set(displayArticles
                                .flatMap(article => article.tags || [])
                                .filter(tag => tag)))
                                .slice(0, 6)
                                .map((tag, index) => (
                                    <span
                                        key={`tag-${index}`}
                                        className="ngm-trending-tag"
                                        onClick={() => window.location.href = `/tag/${tag}`}>
                                        #{tag}
                                    </span>
                                ))}
                        </div>
                    </div>
                </div>
            </div>
        ),
    };

    return layouts[layout] ? layouts[layout]() : layouts.standard();
};

export default NewsGrid;