import React from 'react';
import './Categories.css';
import {useNavigate} from "react-router-dom";

// Categories and subcategories data structure
export const categoriesData = [
    {
        id: 'breaking',
        name: 'Breaking News',
        subcategories: [
            { id: 'latest', name: 'Latest Updates' },
            { id: 'developing', name: 'Developing Stories' },
            { id: 'alerts', name: 'News Alerts' }
        ]
    },
    {
        id: 'politics',
        name: 'Politics',
        subcategories: [
            { id: 'national', name: 'National Politics' },
            { id: 'international', name: 'International Relations' },
            { id: 'elections', name: 'Elections' },
            { id: 'policy', name: 'Policy Changes' }
        ]
    },
    {
        id: 'business',
        name: 'Business',
        subcategories: [
            { id: 'economy', name: 'Economy' },
            { id: 'markets', name: 'Markets' },
            { id: 'companies', name: 'Companies' },
            { id: 'startups', name: 'Startups' },
            { id: 'finance', name: 'Finance' }
        ]
    },
    {
        id: 'technology',
        name: 'Technology',
        subcategories: [
            { id: 'gadgets', name: 'Gadgets' },
            { id: 'software', name: 'Software & Apps' },
            { id: 'internet', name: 'Internet' },
            { id: 'ai', name: 'AI & Robotics' },
            { id: 'cybersecurity', name: 'Cybersecurity' }
        ]
    },
    {
        id: 'health',
        name: 'Health',
        subcategories: [
            { id: 'medicine', name: 'Medicine' },
            { id: 'wellness', name: 'Wellness' },
            { id: 'nutrition', name: 'Nutrition' },
            { id: 'fitness', name: 'Fitness' },
            { id: 'mental-health', name: 'Mental Health' }
        ]
    },
    {
        id: 'sports',
        name: 'Sports',
        subcategories: [
            { id: 'football', name: 'Football' },
            { id: 'basketball', name: 'Basketball' },
            { id: 'tennis', name: 'Tennis' },
            { id: 'cricket', name: 'Cricket' },
            { id: 'motorsports', name: 'Motorsports' }
        ]
    },
    {
        id: 'entertainment',
        name: 'Entertainment',
        subcategories: [
            { id: 'movies', name: 'Movies' },
            { id: 'tv', name: 'TV Shows' },
            { id: 'music', name: 'Music' },
            { id: 'celebrity', name: 'Celebrity News' },
            { id: 'arts', name: 'Arts & Culture' }
        ]
    },
    {
        id: 'science',
        name: 'Science',
        subcategories: [
            { id: 'space', name: 'Space' },
            { id: 'environment', name: 'Environment' },
            { id: 'research', name: 'Research' },
            { id: 'discoveries', name: 'Discoveries' }
        ]
    },
    {
        id: 'world',
        name: 'World',
        subcategories: [
            { id: 'europe', name: 'Europe' },
            { id: 'asia', name: 'Asia' },
            { id: 'americas', name: 'Americas' },
            { id: 'africa', name: 'Africa' },
            { id: 'middle-east', name: 'Middle East' }
        ]
    },
    {
        id: 'lifestyle',
        name: 'Lifestyle',
        subcategories: [
            {id: 'food', name: 'Food & Cooking'},
            {id: 'travel', name: 'Travel'},
            {id: 'fashion', name: 'Fashion'},
            {id: 'home', name: 'Home & Garden'},
            {id: 'relationships', name: 'Relationships'}
        ]

    },
    // ... rest of your categories data remains the same
    {
        id: 'lifestyle',
        name: 'Lifestyle',
        subcategories: [
            { id: 'food', name: 'Food & Cooking' },
            { id: 'travel', name: 'Travel' },
            { id: 'fashion', name: 'Fashion' },
            { id: 'home', name: 'Home & Garden' },
            { id: 'relationships', name: 'Relationships' }
        ]
    }
];

// Reusable CategoriesDropdown component with navigation
const CategoriesDropdown = ({ isVisible, onClose }) => {
    const navigate = useNavigate();

    if (!isVisible) return null;

    const handleCategoryClick = (categoryId, subcategoryId = null) => {
        // Construct the URL based on whether it's a category or subcategory
        const url = subcategoryId
            ? `/category/${categoryId}/${subcategoryId}`
            : `/category/${categoryId}`;

        // Navigate to the constructed URL
        navigate(url);

        // Close the dropdown after navigation
        if (onClose) {
            onClose();
        }
    };

    return (
        <div className="categories-dropdown">
            <div className="categories-dropdown-container">
                <div className="categories-dropdown-header">
                    <h3>Browse by Categories</h3>
                    <button
                        className="close-button"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                <div className="categories-grid">
                    {categoriesData.map((category) => (
                        <div key={category.id} className="category-column">
                            <h4
                                className="category-title"
                                onClick={() => handleCategoryClick(category.id)}
                            >
                                <span
                                    className="category-link"
                                    style={{ cursor: 'pointer' }}
                                >
                                    {category.name}
                                </span>
                            </h4>
                            <ul className="subcategory-list">
                                {category.subcategories.map((subcategory) => (
                                    <li key={subcategory.id}>
                                        <span
                                            className="subcategory-link"
                                            onClick={() => handleCategoryClick(category.id, subcategory.id)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            {subcategory.name}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
            <div className="categories-dropdown-overlay" onClick={onClose}></div>
        </div>
    );
};

export default CategoriesDropdown;