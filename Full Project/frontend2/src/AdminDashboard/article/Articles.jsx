// src/pages/Dashboard/Articles.jsx
import { useState } from 'react';
import './Articles.css';

const Articles = () => {
    const [activeTab, setActiveTab] = useState('all');

    const articleCategories = [
        'All', 'Politics', 'Business', 'Technology', 'Science', 'Health', 'Sports', 'Entertainment'
    ];

    const sampleArticles = [
        {
            id: 1,
            title: "The Future of AI in Healthcare",
            excerpt: "Exploring how artificial intelligence is transforming the healthcare sector...",
            category: "Technology",
            author: "Dr. Sarah Johnson",
            date: "April 8, 2025",
            status: "published",
            image: "tech-healthcare.jpg"
        },
        {
            id: 2,
            title: "Global Markets React to New Economic Policies",
            excerpt: "Analysis of how international markets are responding to recently announced economic initiatives...",
            category: "Business",
            author: "Robert Chen",
            date: "April 9, 2025",
            status: "published",
            image: "business-markets.jpg"
        },
        {
            id: 3,
            title: "Climate Change: New Research Findings",
            excerpt: "Scientists reveal groundbreaking research on climate patterns and their implications...",
            category: "Science",
            author: "Emily Watson",
            date: "April 7, 2025",
            status: "draft",
            image: "science-climate.jpg"
        },
        {
            id: 4,
            title: "Championship Finals: Team Analysis",
            excerpt: "In-depth look at the strengths and strategies of the teams competing in the finals...",
            category: "Sports",
            author: "Michael Torres",
            date: "April 10, 2025",
            status: "published",
            image: "sports-finals.jpg"
        },
    ];

    const filteredArticles = activeTab === 'all'
        ? sampleArticles
        : sampleArticles.filter(article => article.category.toLowerCase() === activeTab.toLowerCase());

    return (
        <div className="articles-page">
            <div className="page-header">
                <h1>Articles</h1>
                <div className="header-actions">
                    <button className="secondary-btn">Import Articles</button>
                    <button className="primary-btn">Create New</button>
                </div>
            </div>

            <div className="category-tabs">
                {articleCategories.map(category => (
                    <button
                        key={category}
                        className={`tab-btn ${activeTab === category.toLowerCase() ? 'active' : ''}`}
                        onClick={() => setActiveTab(category.toLowerCase())}
                    >
                        {category}
                    </button>
                ))}
            </div>

            <div className="articles-grid">
                {filteredArticles.map(article => (
                    <div key={article.id} className="article-card">
                        <div className="article-image">
                            <div className="placeholder-image">{article.category}</div>
                            <span className={`article-status ${article.status}`}>{article.status}</span>
                        </div>
                        <div className="article-content">
                            <h3>{article.title}</h3>
                            <p className="article-excerpt">{article.excerpt}</p>
                            <div className="article-meta">
                                <span>{article.author}</span>
                                <span>{article.date}</span>
                            </div>
                        </div>
                        <div className="article-actions">
                            <button className="edit-btn">Edit</button>
                            <button className="view-btn">View</button>
                            <button className="delete-btn">Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Articles;