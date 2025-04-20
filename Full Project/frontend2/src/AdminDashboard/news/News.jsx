// src/pages/Dashboard/News.jsx
import { useState, useEffect } from 'react';
import './News.css';

// Add API base URL configuration
const API_BASE_URL = 'https://deploy-backend2-jcl1.onrender.com';

const News = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [categories, setCategories] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [editingArticle, setEditingArticle] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        author: '',
        category: '',
        summary: '',
        source: '',
        tags: [],
        featured: false,
        status: 'DRAFT',
        image: null,
        video: null
    });

    // Fetch news articles
    useEffect(() => {
        fetchArticles();
        fetchCategories();
    }, [currentPage, filter]);

    const fetchArticles = async () => {
        setLoading(true);
        try {
            let endpoint = `${API_BASE_URL}/api/news/all`;
            const params = new URLSearchParams({
                page: currentPage,
                size: 10
            });

            console.log('Fetching articles from:', `${endpoint}?${params}`);

            const response = await fetch(`${endpoint}?${params}`);
            console.log('Articles response status:', response.status);

            if (!response.ok) {
                throw new Error(`Failed to fetch articles: ${response.status}`);
            }

            const data = await response.json();
            console.log('Articles data received:', data);

            // Ensure data.content exists before setting it
            if (data && data.content) {
                setNews(data.content);
                setTotalPages(data.totalPages || 0);
            } else if (Array.isArray(data)) {
                // Handle case where API returns array directly
                setNews(data);
                // Calculate totalPages based on array length and page size
                setTotalPages(Math.ceil(data.length / 10));
            } else {
                console.error('Unexpected data format:', data);
                setNews([]);
            }
        } catch (error) {
            console.error('Error fetching news articles:', error);
                        setNews([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            console.log('Fetching categories...');
            const response = await fetch(`${API_BASE_URL}/api/categories`);
            console.log('Categories response status:', response.status);

            if (!response.ok) {
                throw new Error(`Failed to fetch categories: ${response.status}`);
            }

            const data = await response.json();
            console.log('Categories data received:', data);

            // Handle different possible response formats
            if (Array.isArray(data)) {
                setCategories(data);
            } else if (data && typeof data === 'object' && data.content && Array.isArray(data.content)) {
                setCategories(data.content);
            } else {
                console.error('Unexpected categories data format:', data);
                setCategories([]);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
            setCategories([]);
        }
    };

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
        setCurrentPage(0); // Reset to first page when filter changes
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (files && files[0]) {
            setFormData({
                ...formData,
                [name]: files[0]
            });
        }
    };

    const handleTagsChange = (e) => {
        const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
        setFormData({
            ...formData,
            tags
        });
    };

    const resetForm = () => {
        setFormData({
            title: '',
            content: '',
            author: '',
            category: '',
            summary: '',
            source: '',
            tags: [],
            featured: false,
            status: 'DRAFT',
            image: null,
            video: null
        });
        setEditingArticle(null);
    };

    const handleAddNew = () => {
        resetForm();
        setShowForm(true);
    };

    const handleEdit = (article) => {
        setFormData({
            title: article.title || '',
            content: article.content || '',
            author: article.author || '',
            category: article.category || '',
            summary: article.summary || '',
            source: article.source || '',
            tags: article.tags || [],
            featured: article.featured || false,
            status: article.status || 'DRAFT',
            image: null,
            video: null
        });
        setEditingArticle(article);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this article?')) return;

        try {
            const response = await fetch(`${API_BASE_URL}/api/news/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                fetchArticles();
            } else {
                throw new Error(`Failed to delete article: ${response.status}`);
            }
        } catch (error) {
            console.error('Error deleting article:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formDataObj = new FormData();

        // Append all form fields to FormData
        Object.keys(formData).forEach(key => {
            if (key === 'tags' && Array.isArray(formData[key])) {
                formData[key].forEach(tag => formDataObj.append('tags', tag));
            } else if (key === 'image' || key === 'video') {
                if (formData[key]) {
                    formDataObj.append(key, formData[key]);
                }
            } else {
                formDataObj.append(key, formData[key]);
            }
        });

        try {
            const url = editingArticle
                ? `${API_BASE_URL}/api/news/${editingArticle.id}`
                : `${API_BASE_URL}/api/news`;

            const method = editingArticle ? 'PUT' : 'POST';

            console.log(`Submitting article to ${url} using ${method}`);

            const response = await fetch(url, {
                method,
                body: formDataObj,
            });

            if (!response.ok) {
                throw new Error(`Failed to save article: ${response.status}`);
            }

            fetchArticles();
            setShowForm(false);
            resetForm();

        } catch (error) {
            console.error('Error saving article:', error);
        }
    };

    const filteredNews = news.filter(item => {
        const matchesFilter = filter === 'all' || item.status === filter;
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.author && item.author.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesFilter && matchesSearch;
    });

    const statusBadgeClass = (status) => {
        switch(status) {
            case 'PUBLISHED': return 'published';
            case 'DRAFT': return 'draft';
            case 'PENDING': return 'pending';
            default: return '';
        }
    };

    return (
        <div className="news-page">
            {showForm ? (
                <div className="article-form-container">
                    <div className="form-header">
                        <h2>{editingArticle ? 'Edit Article' : 'Add New Article'}</h2>
                        <button className="close-btn" onClick={() => setShowForm(false)}>×</button>
                    </div>

                    <form onSubmit={handleSubmit} className="article-form">
                        <div className="form-group">
                            <label htmlFor="title">Title*</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                required
                                className="form-control"
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="author">Author*</label>
                                <input
                                    type="text"
                                    id="author"
                                    name="author"
                                    value={formData.author}
                                    onChange={handleInputChange}
                                    required
                                    className="form-control"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="category">Category*</label>
                                <select
                                    id="category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    required
                                    className="form-control"
                                >
                                    <option value="">Select a category</option>
                                    {categories.length > 0 ? (
                                        categories.map(category => (
                                            <option key={category.id} value={category.name || category.id}>
                                                {category.name}
                                            </option>
                                        ))
                                    ) : (
                                        <option value="" disabled>No categories available</option>
                                    )}
                                </select>
                                {categories.length === 0 && (
                                    <small className="text-danger">
                                        No categories loaded. Please try refreshing the page.
                                    </small>
                                )}
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="summary">Summary</label>
                            <input
                                type="text"
                                id="summary"
                                name="summary"
                                value={formData.summary}
                                onChange={handleInputChange}
                                className="form-control"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="content">Content*</label>
                            <textarea
                                id="content"
                                name="content"
                                value={formData.content}
                                onChange={handleInputChange}
                                required
                                className="form-control"
                                rows="10"
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="source">Source URL</label>
                                <input
                                    type="text"
                                    id="source"
                                    name="source"
                                    value={formData.source}
                                    onChange={handleInputChange}
                                    className="form-control"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="tags">Tags (comma separated)</label>
                                <input
                                    type="text"
                                    id="tags"
                                    name="tags"
                                    value={formData.tags.join(', ')}
                                    onChange={handleTagsChange}
                                    className="form-control"
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="status">Status*</label>
                                <select
                                    id="status"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    required
                                    className="form-control"
                                >
                                    <option value="DRAFT">Draft</option>
                                    <option value="PENDING">Pending</option>
                                    <option value="PUBLISHED">Published</option>
                                </select>
                            </div>

                            <div className="form-group checkbox-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        name="featured"
                                        checked={formData.featured}
                                        onChange={handleInputChange}
                                    />
                                    Featured Article
                                </label>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="image">Featured Image</label>
                                <input
                                    type="file"
                                    id="image"
                                    name="image"
                                    onChange={handleFileChange}
                                    className="form-control"
                                    accept="image/*"
                                />
                                {editingArticle && editingArticle.imageUrl && (
                                    <div className="current-media">
                                        <p>Current image: <a href={editingArticle.imageUrl} target="_blank" rel="noopener noreferrer">View image</a></p>
                                    </div>
                                )}
                            </div>

                            <div className="form-group">
                                <label htmlFor="video">Video</label>
                                <input
                                    type="file"
                                    id="video"
                                    name="video"
                                    onChange={handleFileChange}
                                    className="form-control"
                                    accept="video/*"
                                />
                                {editingArticle && editingArticle.videoUrl && (
                                    <div className="current-media">
                                        <p>Current video: <a href={editingArticle.videoUrl} target="_blank" rel="noopener noreferrer">View video</a></p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="form-actions">
                            <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
                            <button type="submit" className="submit-btn">Save Article</button>
                        </div>
                    </form>
                </div>
            ) : (
                <>
                    <div className="page-header">
                        <h1>News Management</h1>
                        <button className="primary-btn" onClick={handleAddNew}>Add New Article</button>
                    </div>

                    <div className="filter-controls">
                        <div className="search-control">
                            <input
                                type="text"
                                placeholder="Search news..."
                                value={searchQuery}
                                onChange={handleSearch}
                                className="search-input"
                            />
                        </div>
                        <div className="filter-control">
                            <label htmlFor="status-filter">Status:</label>
                            <select
                                id="status-filter"
                                value={filter}
                                onChange={handleFilterChange}
                                className="filter-select"
                            >
                                <option value="all">All</option>
                                <option value="PUBLISHED">Published</option>
                                <option value="PENDING">Pending</option>
                                <option value="DRAFT">Draft</option>
                            </select>
                        </div>
                    </div>

                    {loading ? (
                        <div className="loading">
                            <div className="spinner"></div>
                            <p>Loading news data...</p>
                        </div>
                    ) : (
                        <>
                            <div className="news-table-container">
                                <table className="news-table">
                                    <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Category</th>
                                        <th>Author</th>
                                        <th>Date</th>
                                        <th>Status</th>
                                        <th>Featured</th>
                                        <th>Views</th>
                                        <th>Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {filteredNews.length > 0 ? (
                                        filteredNews.map(item => (
                                            <tr key={item.id}>
                                                <td>
                                                    <div className="article-title">
                                                        {item.imageUrl && (
                                                            <div className="thumbnail">
                                                                <img src={item.imageUrl} alt={item.title} />
                                                            </div>
                                                        )}
                                                        <span>{item.title}</span>
                                                    </div>
                                                </td>
                                                <td>{item.category}</td>
                                                <td>{item.author}</td>
                                                <td>{new Date(item.publishedAt || item.createdAt).toLocaleDateString()}</td>
                                                <td>
                                                        <span className={`status-badge ${statusBadgeClass(item.status)}`}>
                                                            {item.status}
                                                        </span>
                                                </td>
                                                <td>
                                                        <span className={`featured-badge ${item.featured ? 'yes' : 'no'}`}>
                                                            {item.featured ? 'Yes' : 'No'}
                                                        </span>
                                                </td>
                                                <td>{item.viewCount || 0}</td>
                                                <td>
                                                    <div className="action-buttons">
                                                        <button
                                                            className="edit-btn"
                                                            onClick={() => handleEdit(item)}
                                                            title="Edit article"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            className="view-btn"
                                                            onClick={() => window.open(`/news/${item.slug || item.id}`, '_blank')}
                                                            title="View article"
                                                        >
                                                            View
                                                        </button>
                                                        <button
                                                            className="delete-btn"
                                                            onClick={() => handleDelete(item.id)}
                                                            title="Delete article"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="8" className="no-results">No news articles found</td>
                                        </tr>
                                    )}
                                    </tbody>
                                </table>
                            </div>

                            {totalPages > 1 && (
                                <div className="pagination">
                                    <button
                                        onClick={() => handlePageChange(Math.max(0, currentPage - 1))}
                                        disabled={currentPage === 0}
                                        className="pagination-btn"
                                    >
                                        Previous
                                    </button>

                                    {[...Array(totalPages).keys()].map(page => (
                                        <button
                                            key={page}
                                            onClick={() => handlePageChange(page)}
                                            className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                                        >
                                            {page + 1}
                                        </button>
                                    ))}

                                    <button
                                        onClick={() => handlePageChange(Math.min(totalPages - 1, currentPage + 1))}
                                        disabled={currentPage === totalPages - 1}
                                        className="pagination-btn"
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default News;