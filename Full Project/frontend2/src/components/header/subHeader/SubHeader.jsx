import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './SubHeader.css';

const SubHeader = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Define all available categories
    const categories = [
        { id: 'breaking', name: 'Breaking News' },
        { id: 'politics', name: 'Politics' },
        { id: 'business', name: 'Business' },
        { id: 'technology', name: 'Technology' },
        { id: 'health', name: 'Health' },
        { id: 'sports', name: 'Sports' },
        { id: 'entertainment', name: 'Entertainment' },
        { id: 'science', name: 'Science' },
        { id: 'world', name: 'World' },
        { id: 'lifestyle', name: 'Lifestyle' }
    ];

    // Check if the current path matches a category
    const isActive = (categoryId) => {
        return location.pathname === `/category/${categoryId}`;
    };

    const handleCategoryClick = (categoryId) => {
        navigate(`/category/${categoryId}`);
    };

    return (
        <div className="subheader">
            <div className="subheader-container">
                <div className="categories-scroll">
                    <div className="categories-wrapper">
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                className={`category-item ${isActive(category.id) ? 'active' : ''}`}
                                onClick={() => handleCategoryClick(category.id)}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubHeader;