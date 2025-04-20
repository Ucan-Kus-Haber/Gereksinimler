// src/pages/Dashboard/Ads.jsx
import { useState, useEffect } from 'react';
import './Ads.css';

// API base URL configuration - this should match your Spring Boot backend
const API_BASE_URL = 'https://deploy-backend2-jcl1.onrender.com';

const Ads = () => {
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [showForm, setShowForm] = useState(false);
    const [editingAd, setEditingAd] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        link: '',
        pictures: [],
        videos: [],
        existingPictures: [],
        existingVideos: []
    });

    // Fetch ads
    useEffect(() => {
        fetchAds();
    }, [currentPage]);

    const fetchAds = async () => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams({
                page: currentPage,
                size: 10
            });

            const endpoint = `${API_BASE_URL}/api/ads`;
            console.log('Fetching ads from:', `${endpoint}?${params}`);

            const response = await fetch(`${endpoint}?${params}`);
            console.log('Ads response status:', response.status);

            if (!response.ok) {
                throw new Error(`Failed to fetch ads: ${response.status}`);
            }

            const data = await response.json();
            console.log('Ads data received:', data);

            // Handle pagination response from Spring Boot
            if (data && typeof data === 'object') {
                if (data.content && Array.isArray(data.content)) {
                    // Standard Spring Boot pagination format
                    setAds(data.content);
                    setTotalPages(data.totalPages || 1);
                } else if (Array.isArray(data)) {
                    // Server returned just an array of ads
                    setAds(data);
                    setTotalPages(Math.ceil(data.length / 10) || 1);
                } else {
                    console.error('Unexpected data format:', data);
                    setAds([]);
                    setTotalPages(1);
                }
            } else {
                console.error('Invalid response data:', data);
                setAds([]);
                setTotalPages(1);
            }
        } catch (error) {
            console.error('Error fetching ads:', error);
            setError(error.message);
            setAds([]);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleFileChange = (e, type) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            // Store the file objects for later upload
            setFormData({
                ...formData,
                [type]: [...formData[type], ...files]
            });
        }
    };

    const removeFile = (type, index) => {
        setFormData({
            ...formData,
            [type]: formData[type].filter((_, i) => i !== index)
        });
    };

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            link: '',
            pictures: [],
            videos: [],
            existingPictures: [],
            existingVideos: []
        });
        setEditingAd(null);
    };

    const handleAddNew = () => {
        resetForm();
        setShowForm(true);
    };

    const handleEdit = (ad) => {
        setFormData({
            name: ad.name || '',
            description: ad.description || '',
            link: ad.link || '',
            pictures: [], // New pictures to upload
            videos: [], // New videos to upload
            existingPictures: ad.pictures || [], // Existing picture URLs
            existingVideos: ad.videos || [] // Existing video URLs
        });
        setEditingAd(ad);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this ad?')) return;

        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/api/ads/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                await fetchAds();
                // Show success notification
                alert('Advertisement deleted successfully');
            } else {
                throw new Error(`Failed to delete ad: ${response.status}`);
            }
        } catch (error) {
            console.error('Error deleting ad:', error);
            setError(error.message);
            alert(`Error deleting advertisement: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formDataObj = new FormData();

        // Add text fields
        formDataObj.append('name', formData.name);
        formDataObj.append('description', formData.description);
        formDataObj.append('link', formData.link);

        // Handle new pictures to upload
        if (formData.pictures && formData.pictures.length > 0) {
            formData.pictures.forEach(picture => {
                if (picture instanceof File) {
                    formDataObj.append('pictures', picture);
                }
            });
        }

        // Handle existing picture URLs
        if (formData.existingPictures && formData.existingPictures.length > 0) {
            formData.existingPictures.forEach(url => {
                formDataObj.append('existingPictures', url);
            });
        }

        // Handle new videos to upload
        if (formData.videos && formData.videos.length > 0) {
            formData.videos.forEach(video => {
                if (video instanceof File) {
                    formDataObj.append('videos', video);
                }
            });
        }

        // Handle existing video URLs
        if (formData.existingVideos && formData.existingVideos.length > 0) {
            formData.existingVideos.forEach(url => {
                formDataObj.append('existingVideos', url);
            });
        }

        try {
            const url = editingAd
                ? `${API_BASE_URL}/api/ads/${editingAd.id}`
                : `${API_BASE_URL}/api/ads`;

            const method = editingAd ? 'PUT' : 'POST';

            console.log(`Submitting ad to ${url} using ${method}`);
            // Log form data for debugging (only in development)
            for (let pair of formDataObj.entries()) {
                console.log(pair[0] + ': ' + pair[1]);
            }

            const response = await fetch(url, {
                method,
                body: formDataObj,
                // Don't set Content-Type header - browser will set it automatically with boundary
            });

            if (!response.ok) {
                let errorMessage = `Failed to save ad: ${response.status}`;
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorMessage;
                } catch (e) {
                    // If response is not JSON, use default error message
                }
                throw new Error(errorMessage);
            }

            const savedAd = await response.json();
            console.log('Ad saved successfully:', savedAd);

            // Add the new ad to the list if not in edit mode
            if (!editingAd) {
                setAds([savedAd, ...ads]);
            } else {
                // Update existing ad in the list
                setAds(ads.map(ad => ad.id === editingAd.id ? savedAd : ad));
            }

            setShowForm(false);
            resetForm();
            alert(`Advertisement ${editingAd ? 'updated' : 'created'} successfully!`);

            // Refresh all ads to ensure we have the latest data
            fetchAds();

        } catch (error) {
            console.error('Error saving ad:', error);
            setError(error.message);
            alert(`Error saving ad: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Get random ad function
    const getRandomAd = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/api/ads/random`);
            if (!response.ok) {
                throw new Error(`Failed to get random ad: ${response.status}`);
            }
            const data = await response.json();
            alert(`Random ad selected: ${data.name}`);
        } catch (error) {
            console.error('Error getting random ad:', error);
            setError(error.message);
            alert('Error getting random ad. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const filteredAds = ads.filter(item =>
        item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="ads-page">
            {showForm ? (
                <div className="ad-form-container">
                    <div className="form-header">
                        <h2>{editingAd ? 'Edit Advertisement' : 'Create New Advertisement'}</h2>
                        <button className="close-btn" onClick={() => setShowForm(false)}>×</button>
                    </div>

                    <form onSubmit={handleSubmit} className="ad-form">
                        <div className="form-group">
                            <label htmlFor="name">Name*</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                className="form-control"
                                placeholder="Enter advertisement name"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="description">Description*</label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                required
                                className="form-control"
                                rows="5"
                                placeholder="Enter detailed description for the advertisement"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="link">Link URL*</label>
                            <input
                                type="url"
                                id="link"
                                name="link"
                                value={formData.link}
                                onChange={handleInputChange}
                                required
                                className="form-control"
                                placeholder="https://example.com"
                            />
                        </div>

                        {/* Existing Pictures Section */}
                        {formData.existingPictures && formData.existingPictures.length > 0 && (
                            <div className="form-group">
                                <label>Existing Pictures</label>
                                <div className="file-preview-grid">
                                    {formData.existingPictures.map((url, index) => (
                                        <div key={`existing-pic-${index}`} className="file-preview-item">
                                            <div className="preview-thumbnail">
                                                <img src={url} alt={`Preview ${index}`} />
                                            </div>
                                            <div className="preview-info">
                                                <span>{url.split('/').pop()}</span>
                                                <button
                                                    type="button"
                                                    className="remove-file-btn"
                                                    onClick={() => removeFile('existingPictures', index)}
                                                >
                                                    <i className="fa fa-times"></i>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* New Pictures Upload Section */}
                        <div className="form-group">
                            <label>Add New Pictures</label>
                            <div className="file-upload-area">
                                <input
                                    type="file"
                                    id="pictures"
                                    onChange={(e) => handleFileChange(e, 'pictures')}
                                    className="file-input"
                                    accept="image/*"
                                    multiple
                                />
                                <label htmlFor="pictures" className="file-upload-btn">
                                    <i className="fa fa-cloud-upload"></i> Choose Pictures
                                </label>
                            </div>
                            {formData.pictures && formData.pictures.length > 0 && (
                                <div className="file-preview-list">
                                    {formData.pictures.map((pic, index) => (
                                        <div key={`new-pic-${index}`} className="file-preview-item">
                                            <span>{pic.name}</span>
                                            <button
                                                type="button"
                                                className="remove-file-btn"
                                                onClick={() => removeFile('pictures', index)}
                                            >
                                                <i className="fa fa-times"></i>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Existing Videos Section */}
                        {formData.existingVideos && formData.existingVideos.length > 0 && (
                            <div className="form-group">
                                <label>Existing Videos</label>
                                <div className="file-preview-list">
                                    {formData.existingVideos.map((url, index) => (
                                        <div key={`existing-video-${index}`} className="file-preview-item video-preview">
                                            <i className="fa fa-film video-icon"></i>
                                            <span>{url.split('/').pop()}</span>
                                            <button
                                                type="button"
                                                className="remove-file-btn"
                                                onClick={() => removeFile('existingVideos', index)}
                                            >
                                                <i className="fa fa-times"></i>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* New Videos Upload Section */}
                        <div className="form-group">
                            <label>Add New Videos</label>
                            <div className="file-upload-area">
                                <input
                                    type="file"
                                    id="videos"
                                    onChange={(e) => handleFileChange(e, 'videos')}
                                    className="file-input"
                                    accept="video/*"
                                    multiple
                                />
                                <label htmlFor="videos" className="file-upload-btn">
                                    <i className="fa fa-film"></i> Choose Videos
                                </label>
                            </div>
                            {formData.videos && formData.videos.length > 0 && (
                                <div className="file-preview-list">
                                    {formData.videos.map((video, index) => (
                                        <div key={`new-video-${index}`} className="file-preview-item">
                                            <i className="fa fa-film video-icon"></i>
                                            <span>{video.name}</span>
                                            <button
                                                type="button"
                                                className="remove-file-btn"
                                                onClick={() => removeFile('videos', index)}
                                            >
                                                <i className="fa fa-times"></i>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="form-actions">
                            <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
                            <button type="submit" className="submit-btn" disabled={loading}>
                                {loading ? (
                                    <>
                                        <div className="button-spinner"></div> Saving...
                                    </>
                                ) : (
                                    'Save Advertisement'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <>
                    <div className="page-header">
                        <div className="header-title">
                            <h1>Advertisement Management</h1>
                            <p>Manage and track all your advertisements in one place</p>
                        </div>
                        <div className="header-actions">
                            <button className="secondary-btn" onClick={getRandomAd} disabled={loading}>
                                <i className="fa fa-random"></i> Get Random Ad
                            </button>
                            <button className="primary-btn" onClick={handleAddNew}>
                                <i className="fa fa-plus"></i> Create New Ad
                            </button>
                        </div>
                    </div>

                    <div className="stats-cards">
                        <div className="stat-card">
                            <div className="stat-icon active">
                                <i className="fa fa-bullhorn"></i>
                            </div>
                            <div className="stat-info">
                                <h3>{ads.length}</h3>
                                <p>Total Ads</p>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon clicks">
                                <i className="fa fa-mouse-pointer"></i>
                            </div>
                            <div className="stat-info">
                                <h3>5,234</h3>
                                <p>Total Clicks</p>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon impressions">
                                <i className="fa fa-eye"></i>
                            </div>
                            <div className="stat-info">
                                <h3>12,587</h3>
                                <p>Impressions</p>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon conversion">
                                <i className="fa fa-chart-line"></i>
                            </div>
                            <div className="stat-info">
                                <h3>4.2%</h3>
                                <p>Conversion Rate</p>
                            </div>
                        </div>
                    </div>

                    <div className="filter-controls">
                        <div className="search-control">
                            <i className="fa fa-search search-icon"></i>
                            <input
                                type="text"
                                placeholder="Search advertisements..."
                                value={searchQuery}
                                onChange={handleSearch}
                                className="search-input"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="error-message">
                            <i className="fa fa-exclamation-circle"></i>
                            <p>{error}</p>
                        </div>
                    )}

                    {loading ? (
                        <div className="loading">
                            <div className="spinner"></div>
                            <p>Loading advertisements...</p>
                        </div>
                    ) : (
                        <>
                            <div className="ads-grid">
                                {filteredAds.length > 0 ? (
                                    filteredAds.map(ad => (
                                        <div key={ad.id || Math.random()} className="ad-card">
                                            <div className="ad-card-header">
                                                <h3 className="ad-title">{ad.name}</h3>
                                                <div className="ad-actions">
                                                    <button
                                                        className="icon-btn edit"
                                                        onClick={() => handleEdit(ad)}
                                                        title="Edit advertisement"
                                                    >
                                                        <i className="fa fa-edit"></i>
                                                    </button>
                                                    <button
                                                        className="icon-btn delete"
                                                        onClick={() => handleDelete(ad.id)}
                                                        title="Delete advertisement"
                                                    >
                                                        <i className="fa fa-trash"></i>
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="ad-content">
                                                {ad.pictures && ad.pictures.length > 0 ? (
                                                    <div className="ad-image">
                                                        <img src={ad.pictures[0]} alt={ad.name} />
                                                    </div>
                                                ) : (
                                                    <div className="ad-image ad-image-placeholder">
                                                        <i className="fa fa-image"></i>
                                                        <span>No image available</span>
                                                    </div>
                                                )}
                                                <div className="ad-description">{ad.description}</div>
                                                <div className="ad-meta">
                                                    <div className="ad-meta-item">
                                                        <i className="fa fa-link"></i>
                                                        <a href={ad.link} target="_blank" rel="noopener noreferrer">Visit Link</a>
                                                    </div>
                                                    <div className="ad-meta-item">
                                                        <i className="fa fa-image"></i>
                                                        <span>{ad.pictures ? ad.pictures.length : 0} Images</span>
                                                    </div>
                                                    <div className="ad-meta-item">
                                                        <i className="fa fa-video"></i>
                                                        <span>{ad.videos ? ad.videos.length : 0} Videos</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="no-results">
                                        <div className="no-results-icon">
                                            <i className="fa fa-search"></i>
                                        </div>
                                        <h3>No advertisements found</h3>
                                        <p>Try adjusting your search or create a new advertisement</p>
                                        <button className="primary-btn" onClick={handleAddNew}>Create New Ad</button>
                                    </div>
                                )}
                            </div>

                            {totalPages > 1 && (
                                <div className="pagination">
                                    <button
                                        onClick={() => handlePageChange(Math.max(0, currentPage - 1))}
                                        disabled={currentPage === 0 || loading}
                                        className="pagination-btn"
                                    >
                                        <i className="fa fa-chevron-left"></i> Previous
                                    </button>

                                    <div className="pagination-info">
                                        Page {currentPage + 1} of {totalPages}
                                    </div>

                                    <button
                                        onClick={() => handlePageChange(Math.min(totalPages - 1, currentPage + 1))}
                                        disabled={currentPage === totalPages - 1 || loading}
                                        className="pagination-btn"
                                    >
                                        Next <i className="fa fa-chevron-right"></i>
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

export default Ads;