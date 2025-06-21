// src/pages/Dashboard/News.jsx
import { useState, useEffect } from 'react';
import './News.css';

// Add API base URL configuration with fallback
const API_BASE_URL =  'https://ucankus-deploy2.onrender.com';

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
    const [error, setError] = useState(null);
    const [categoriesError, setCategoriesError] = useState(null);
    const [submitLoading, setSubmitLoading] = useState(false);
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

    // Fetch news articles with enhanced error handling
    useEffect(() => {
        fetchArticles();
        fetchCategories();
    }, [currentPage, filter]);

    const fetchArticles = async () => {
        setLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams({
                page: currentPage.toString(),
                size: '10'
            });

            console.log('Fetching articles from:', `${API_BASE_URL}/api/news/all?${params}`);

            const response = await fetch(`${API_BASE_URL}/api/news/all?${params}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    // Add CORS headers if needed
                    'Access-Control-Allow-Origin': '*',
                },
                // Add credentials if your backend requires authentication
                // credentials: 'include',
            });

            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);

            if (!response.ok) {
                // Try to get error details from response
                let errorMessage = `HTTP ${response.status}`;
                try {
                    const errorData = await response.text();
                    console.error('Error response body:', errorData);
                    if (errorData) {
                        errorMessage += `: ${errorData}`;
                    }
                } catch (e) {
                    console.error('Could not read error response:', e);
                }
                throw new Error(errorMessage);
            }

            const data = await response.json();
            console.log('Articles data received:', data);

            // Handle different response formats from Spring Boot
            if (data && typeof data === 'object') {
                if (data.content && Array.isArray(data.content)) {
                    // Spring Boot Page response format
                    setNews(data.content);
                    setTotalPages(data.totalPages || 1);
                } else if (Array.isArray(data)) {
                    // Direct array response
                    setNews(data);
                    setTotalPages(Math.ceil(data.length / 10));
                } else if (data.data && Array.isArray(data.data)) {
                    // Custom wrapper format
                    setNews(data.data);
                    setTotalPages(data.totalPages || 1);
                } else {
                    console.error('Unexpected data format:', data);
                    throw new Error('Unexpected data format received from server');
                }
            } else {
                throw new Error('Invalid response format');
            }

        } catch (error) {
            console.error('Error fetching news articles:', error);
            setError(`Failed to fetch articles: ${error.message}. Please check if the backend server is running and the database connection is working.`);

            // Use empty array instead of mock data to avoid confusion
            setNews([]);
            setTotalPages(0);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        setCategoriesError(null);

        try {
            console.log('Fetching categories from:', `${API_BASE_URL}/api/categories`);

            const response = await fetch(`${API_BASE_URL}/api/categories`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            });

            console.log('Categories response status:', response.status);

            if (!response.ok) {
                let errorMessage = `HTTP ${response.status}`;
                try {
                    const errorData = await response.text();
                    console.error('Categories error response:', errorData);
                    if (errorData) {
                        errorMessage += `: ${errorData}`;
                    }
                } catch (e) {
                    console.error('Could not read categories error response:', e);
                }
                throw new Error(errorMessage);
            }

            const data = await response.json();
            console.log('Categories data received:', data);

            // Handle different response formats
            if (Array.isArray(data)) {
                setCategories(data);
            } else if (data && data.content && Array.isArray(data.content)) {
                setCategories(data.content);
            } else if (data && data.data && Array.isArray(data.data)) {
                setCategories(data.data);
            } else {
                console.error('Unexpected categories data format:', data);
                throw new Error('Unexpected categories data format');
            }

        } catch (error) {
            console.error('Error fetching categories:', error);
            setCategoriesError(`Failed to fetch categories: ${error.message}`);
            // Use default categories as fallback
            setCategories(getDefaultCategories());
        }
    };

    // Default categories for fallback
    const getDefaultCategories = () => {
        return [
            { id: '1', name: "Technology" },
            { id: '2', name: "Business" },
            { id: '3', name: "Sports" },
            { id: '4', name: "Politics" },
            { id: '5', name: "Entertainment" },
            { id: '6', name: "Health" },
            { id: '7', name: "Science" }
        ];
    };

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
        setCurrentPage(0);
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
            console.log('Deleting article:', id);

            const response = await fetch(`${API_BASE_URL}/api/news/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                let errorMessage = `HTTP ${response.status}`;
                try {
                    const errorData = await response.text();
                    console.error('Delete error response:', errorData);
                    if (errorData) {
                        errorMessage += `: ${errorData}`;
                    }
                } catch (e) {
                    console.error('Could not read delete error response:', e);
                }
                throw new Error(errorMessage);
            }

            // Refresh the articles list
            fetchArticles();
            console.log('Article deleted successfully');

        } catch (error) {
            console.error('Error deleting article:', error);
            alert(`Failed to delete article: ${error.message}`);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitLoading(true);

        try {
            // Validate required fields
            if (!formData.title.trim()) {
                throw new Error('Title is required');
            }
            if (!formData.content.trim()) {
                throw new Error('Content is required');
            }
            if (!formData.author.trim()) {
                throw new Error('Author is required');
            }
            if (!formData.category.trim()) {
                throw new Error('Category is required');
            }

            const formDataObj = new FormData();

            // Append all form fields to FormData
            formDataObj.append('title', formData.title.trim());
            formDataObj.append('content', formData.content.trim());
            formDataObj.append('author', formData.author.trim());
            formDataObj.append('category', formData.category.trim());
            formDataObj.append('summary', formData.summary.trim());
            formDataObj.append('source', formData.source.trim());
            formDataObj.append('featured', formData.featured);
            formDataObj.append('status', formData.status);

            // Handle tags array
            if (formData.tags && formData.tags.length > 0) {
                formData.tags.forEach(tag => {
                    if (tag.trim()) {
                        formDataObj.append('tags', tag.trim());
                    }
                });
            }

            // Handle file uploads
            if (formData.image) {
                formDataObj.append('image', formData.image);
            }
            if (formData.video) {
                formDataObj.append('video', formData.video);
            }

            const url = editingArticle
                ? `${API_BASE_URL}/api/news/${editingArticle.id}`
                : `${API_BASE_URL}/api/news`;

            const method = editingArticle ? 'PUT' : 'POST';

            console.log(`Submitting article to ${url} using ${method}`);

            const response = await fetch(url, {
                method,
                body: formDataObj,
                // Don't set Content-Type header for FormData, browser will set it automatically with boundary
            });

            console.log('Submit response status:', response.status);

            if (!response.ok) {
                let errorMessage = `HTTP ${response.status}`;
                try {
                    const errorData = await response.text();
                    console.error('Submit error response:', errorData);
                    if (errorData) {
                        errorMessage += `: ${errorData}`;
                    }
                } catch (e) {
                    console.error('Could not read submit error response:', e);
                }
                throw new Error(errorMessage);
            }

            const result = await response.json();
            console.log('Article saved successfully:', result);

            // Refresh the articles list
            fetchArticles();
            setShowForm(false);
            resetForm();

        } catch (error) {
            console.error('Error saving article:', error);
            alert(`Failed to save article: ${error.message}`);
        } finally {
            setSubmitLoading(false);
        }
    };

    const filteredNews = news.filter(item => {
        const matchesFilter = filter === 'all' || item.status === filter;
        const matchesSearch =
            (item.title && item.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
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

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString();
        } catch (error) {
            console.error('Error formatting date:', error);
            return 'Invalid Date';
        }
    };

    return (
        <div className="news-page">
            {/* Error Display */}
            {error && (
                <div className="error-banner">
                    <span>⚠️ {error}</span>
                    <button onClick={() => setError(null)}>×</button>
                </div>
            )}

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
                                placeholder="Enter article title"
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
                                    placeholder="Enter author name"
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
                                    {categories.map(category => (
                                        <option key={category.id} value={category.name}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                                {categoriesError && (
                                    <small className="text-warning">
                                        {categoriesError}
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
                                placeholder="Enter article summary"
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
                                placeholder="Enter article content"
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="source">Source URL</label>
                                <input
                                    type="url"
                                    id="source"
                                    name="source"
                                    value={formData.source}
                                    onChange={handleInputChange}
                                    className="form-control"
                                    placeholder="https://example.com"
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
                                    placeholder="tag1, tag2, tag3"
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
                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={() => setShowForm(false)}
                                disabled={submitLoading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="submit-btn"
                                disabled={submitLoading}
                            >
                                {submitLoading ? (
                                    <>
                                        <span className="spinner-small"></span>
                                        Saving...
                                    </>
                                ) : (
                                    'Save Article'
                                )}
                            </button>
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
                                                                <img
                                                                    src={item.imageUrl}
                                                                    alt={item.title}
                                                                    onError={(e) => {
                                                                        e.target.style.display = 'none';
                                                                    }}
                                                                />
                                                            </div>
                                                        )}
                                                        <span>{item.title}</span>
                                                    </div>
                                                </td>
                                                <td>{item.category}</td>
                                                <td>{item.author}</td>
                                                <td>{formatDate(item.publishedAt || item.createdAt)}</td>
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
                                                            onClick={() => {
                                                                const viewUrl = item.slug
                                                                    ? `/news/${item.slug}`
                                                                    : `/news/${item.id}`;
                                                                window.open(viewUrl, '_blank');
                                                            }}
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
                                            <td colSpan="8" className="no-results">
                                                {error ? 'Unable to load articles. Please check the server connection.' : 'No news articles found'}
                                            </td>
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