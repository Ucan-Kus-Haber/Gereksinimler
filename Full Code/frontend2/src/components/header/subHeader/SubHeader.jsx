// src/components/SubHeader/SubHeader.jsx

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { categories } from '../../../data/categories';
import './SubHeader.css';

const SubHeader = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Check if the current path matches a category slug
    const isActive = (categorySlug) => {
        // Check both the direct route and the generic category route
        return location.pathname === `/${categorySlug}` ||
            location.pathname === `/category/${categorySlug}`;
    };

    const handleCategoryClick = (categorySlug) => {
        // Navigate directly to the category-specific route
        navigate(`/${categorySlug}`);
    };

    return (
        <div className="subheader">
            <div className="subheader-container">
                <div className="categories-scroll">
                    <div className="categories-wrapper">
                        {categories.map((category) => (
                            <button
                                key={category._id}
                                className={`category-item ${isActive(category.slug) ? 'active' : ''}`}
                                onClick={() => handleCategoryClick(category.slug)}
                                title={category.description}
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