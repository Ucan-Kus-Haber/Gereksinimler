import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import NewsBox, { BoxSizes } from '../grid/NewsBox';
import { categoriesData } from '../header/Categories/Categories';
import Header from '../header/Header';
import SubHeader from '../header/subHeader/SubHeader';
import './Category.css';

const API_BASE_URL = 'https://deploy-backend2-jcl1.onrender.com/api';

const Category = () => {
    const { categoryId, subcategoryId } = useParams();
    const navigate = useNavigate();

    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [categoryInfo, setCategoryInfo] = useState({
        name: '',
        description: '',
        subcategories: []
    });

    useEffect(() => {
        const category = categoriesData.find(cat => cat.id === categoryId);

        if (category) {
            if (subcategoryId) {
                const subcategory = category.subcategories.find(sub => sub.id === subcategoryId);
                if (subcategory) {
                    setCategoryInfo({
                        name: `${category.name} - ${subcategory.name}`,
                        description: `Latest news and updates in ${subcategory.name} from the ${category.name} section.`,
                        subcategories: category.subcategories
                    });
                } else {
                    navigate('/not-found');
                }
            } else {
                setCategoryInfo({
                    name: category.name,
                    description: `Stay updated with the latest ${category.name} news and developments.`,
                    subcategories: category.subcategories
                });
            }
        } else {
            navigate('/not-found');
        }
    }, [categoryId, subcategoryId, navigate]);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                setLoading(true);

                let endpoint = `${API_BASE_URL}/news/category/${categoryId}`;
                if (subcategoryId) {
                    endpoint = `${API_BASE_URL}/news/category/${categoryId}/${subcategoryId}`;
                }

                const params = { page: currentPage, size: 12 };
                const response = await axios.get(endpoint, { params });

                if (response.data && response.data.content) {
                    setArticles(response.data.content);
                    setCurrentPage(response.data.currentPage);
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

        if (categoryId) {
            fetchArticles();
        }
    }, [categoryId, subcategoryId, currentPage]);

    const loadMoreArticles = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handleSubcategoryClick = (subId) => {
        navigate(`/category/${categoryId}/${subId}`);
    };

    if (loading && articles.length === 0) {
        return (
            <>
                <Header />
                <SubHeader />
                <div className="ctg-container">
                    <div className="ctg-loading">
                        <div className="ctg-spinner"></div>
                        <div>Loading {categoryInfo.name} news...</div>
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
                <div className="ctg-container">
                    <div className="ctg-error">{error}</div>
                </div>
            </>
        );
    }

    if (!articles || articles.length === 0) {
        return (
            <>
                <Header />
                <SubHeader />
                <div className="ctg-container">
                    <div className="ctg-header">
                        <h1>{categoryInfo.name}</h1>
                        <p>{categoryInfo.description}</p>
                    </div>
                    <div className="ctg-empty">No articles available in this category at this time</div>
                </div>
            </>
        );
    }

    return (
        <>
            <Header />
            <SubHeader />
            <div className="ctg-container">
                <div className="ctg-header">
                    <h1>{categoryInfo.name}</h1>
                    <p>{categoryInfo.description}</p>
                </div>

                {!subcategoryId && categoryInfo.subcategories && categoryInfo.subcategories.length > 0 && (
                    <div className="ctg-subnav">
                        {categoryInfo.subcategories.map((sub) => (
                            <button
                                key={sub.id}
                                className="ctg-subbtn"
                                onClick={() => handleSubcategoryClick(sub.id)}
                            >
                                {sub.name}
                            </button>
                        ))}
                    </div>
                )}

                <div className="ctg-content">
                    <div className="ctg-main">
                        {articles.length > 0 && (
                            <div className="ctg-featured">
                                <NewsBox article={articles[0]} size={BoxSizes.HERO} />
                            </div>
                        )}

                        <div className="ctg-grid">
                            {articles.slice(1).map((article, index) => (
                                <div key={article.id || index} className="ctg-item">
                                    <NewsBox
                                        article={article}
                                        size={index < 2 ? BoxSizes.MEDIUM : BoxSizes.SMALL}
                                        showSummary={true}
                                        truncateLines={2}
                                    />
                                </div>
                            ))}
                        </div>

                        {currentPage < totalPages - 1 && (
                            <div className="ctg-loadmore">
                                <button className="ctg-btn" onClick={loadMoreArticles}>
                                    {loading ? 'Loading...' : 'Load More'}
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="ctg-sidebar">
                        <div className="ctg-section">
                            <h3 className="ctg-popular">POPULAR IN {categoryInfo.name.toUpperCase()}</h3>
                            {articles.slice(0, 5).map((article, index) => (
                                <div
                                    key={`sidebar-${article.id || index}`}
                                    className="ctg-sidebaritem"
                                    onClick={() => navigate(`/news/${article.slug || article.id}`)}
                                >
                                    <span className="ctg-number">{index + 1}</span>
                                    <span className="ctg-title">{article.title}</span>
                                </div>
                            ))}
                        </div>

                        <div className="ctg-section">
                            <h3 className="ctg-trending">TRENDING TOPICS</h3>
                            <div className="ctg-tags">
                                {Array.from(new Set(articles
                                    .flatMap(article => article.tags || [])
                                    .filter(tag => tag)))
                                    .slice(0, 6)
                                    .map((tag, index) => (
                                        <span
                                            key={`tag-${index}`}
                                            className="ctg-tag"
                                            onClick={() => navigate(`/tag/${tag}`)}
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

export default Category;