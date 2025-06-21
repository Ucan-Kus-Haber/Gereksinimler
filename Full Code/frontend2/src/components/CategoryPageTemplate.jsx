// components/CategoryPageTemplate.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import NewsBox, { BoxSizes } from '../components/grid/NewsBox';
import Header from '../components/header/Header';
import SubHeader from '../components/header/subHeader/SubHeader';
import './CategoryPageTemplate.css';

const API_BASE_URL = 'https://ucankus-backend.onrender.com/api';

const CategoryPageTemplate = ({ category, pageTitle, metaDescription }) => {
    const navigate = useNavigate();
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [popularArticles, setPopularArticles] = useState([]);

    useEffect(() => {
        document.title = pageTitle;
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.setAttribute('content', metaDescription);
        }
    }, [pageTitle, metaDescription]);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API_BASE_URL}/news/category/${category._id}`, {
                    params: { page: currentPage, size: 12 }
                });

                if (response.data && response.data.content) {
                    if (currentPage === 0) {
                        setArticles(response.data.content);
                    } else {
                        setArticles(prev => [...prev, ...response.data.content]);
                    }
                    setTotalPages(response.data.totalPages);
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

        const fetchPopularArticles = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/news/popular`, {
                    params: { page: 0, size: 5 }
                });
                if (response.data && response.data.content) {
                    setPopularArticles(response.data.content);
                }
            } catch (err) {
                console.error('Popular articles fetch error:', err);
            }
        };

        if (category && category._id) {
            fetchArticles();
            fetchPopularArticles();
        }
    }, [category, currentPage]);

    const loadMoreArticles = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handleArticleClick = (article) => {
        navigate(`/news/${article.slug || article.id}`);
    };

    const handleTagClick = (tag) => {
        navigate(`/tag/${tag}`);
    };

    if (!category) {
        return (
            <>
                <Header />
                <SubHeader />
                <div className="category-page-container">
                    <div className="category-error">Category not found</div>
                </div>
            </>
        );
    }

    if (loading && articles.length === 0) {
        return (
            <>
                <Header />
                <SubHeader />
                <div className="category-page-container">
                    <div className="category-loading">
                        <div className="category-spinner"></div>
                        <div>Loading {category.name} news...</div>
                    </div>
                </div>
            </>
        );
    }

    if (error && articles.length === 0) {
        return (
            <>
                <Header />
                <SubHeader />
                <div className="category-page-container">
                    <div className="category-error">{error}</div>
                </div>
            </>
        );
    }

    return (
        <>
            <Header />
            <SubHeader />
            <div className="category-page-container">
                <div className="category-header">
                    <h1>{category.name}</h1>
                    <p>{category.description}</p>
                </div>

                <div className="category-content">
                    <div className="category-main">
                        {articles.length > 0 && (
                            <div className="category-featured">
                                <NewsBox
                                    article={articles[0]}
                                    size={BoxSizes.HERO}
                                    onClick={() => handleArticleClick(articles[0])}
                                />
                            </div>
                        )}

                        <div className="category-grid">
                            {articles.slice(1).map((article, index) => (
                                <div key={article.id || index} className="category-item">
                                    <NewsBox
                                        article={article}
                                        size={index < 2 ? BoxSizes.MEDIUM : BoxSizes.SMALL}
                                        showSummary={true}
                                        truncateLines={2}
                                        onClick={() => handleArticleClick(article)}
                                    />
                                </div>
                            ))}
                        </div>

                        {currentPage < totalPages - 1 && (
                            <div className="category-loadmore">
                                <button
                                    className="category-btn"
                                    onClick={loadMoreArticles}
                                    disabled={loading}
                                >
                                    {loading ? 'Loading...' : 'Load More'}
                                </button>
                            </div>
                        )}

                        {articles.length === 0 && !loading && (
                            <div className="category-empty">
                                No articles available in this category at this time
                            </div>
                        )}
                    </div>

                    <div className="category-sidebar">
                        <div className="category-section">
                            <h3 className="category-section-title">POPULAR IN {category.name.toUpperCase()}</h3>
                            {popularArticles.map((article, index) => (
                                <div
                                    key={`sidebar-${article.id || index}`}
                                    className="category-sidebar-item"
                                    onClick={() => handleArticleClick(article)}
                                >
                                    <span className="category-number">{index + 1}</span>
                                    <span className="category-title">{article.title}</span>
                                </div>
                            ))}
                        </div>

                        <div className="category-section">
                            <h3 className="category-section-title">TRENDING TOPICS</h3>
                            <div className="category-tags">
                                {Array.from(new Set(articles
                                    .flatMap(article => article.tags || [])
                                    .filter(tag => tag)))
                                    .slice(0, 8)
                                    .map((tag, index) => (
                                        <span
                                            key={`tag-${index}`}
                                            className="category-tag"
                                            onClick={() => handleTagClick(tag)}
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CategoryPageTemplate;











