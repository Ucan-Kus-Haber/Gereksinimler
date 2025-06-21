import React from 'react';
import { useNavigate } from "react-router-dom";
import { categories } from '../../../data/categories'; // Import from your main categories file

// Convert database categories to dropdown format for compatibility
export const categoriesData = categories.map(category => ({
    id: category.slug,
    name: category.name,
    description: category.description,
    _id: category._id,
    subcategories: [] // Add subcategories here if needed in future
}));

// Reusable CategoriesDropdown component with navigation
const CategoriesDropdown = ({ isVisible, onClose }) => {
    const navigate = useNavigate();

    if (!isVisible) return null;

    const handleCategoryClick = (categorySlug, categoryId) => {
        // Navigate using the slug for clean URLs
        navigate(`/category/${categorySlug}`, {
            state: {
                categoryId: categoryId,
                categorySlug: categorySlug
            }
        });

        // Close the dropdown after navigation
        if (onClose) {
            onClose();
        }
    };

    return (
        <div className="categories-dropdown">
            <div className="categories-dropdown-container">
                <div className="categories-dropdown-header">
                    <h3>Kategorilere Göz At</h3>
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
                        <div key={category._id} className="category-column">
                            <h4
                                className="category-title"
                                onClick={() => handleCategoryClick(category.id, category._id)}
                            >
                                <span
                                    className="category-link"
                                    style={{ cursor: 'pointer' }}
                                >
                                    {category.name}
                                </span>
                            </h4>
                            <p className="category-description">
                                {category.description}
                            </p>
                            {category.subcategories && category.subcategories.length > 0 && (
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
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <div className="categories-dropdown-overlay" onClick={onClose}></div>
        </div>
    );
};

export default CategoriesDropdown;