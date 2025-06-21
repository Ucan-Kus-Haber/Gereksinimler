import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './NewsDetail.css';

const NewsDetail = () => {
    const { slugOrId } = useParams();
    const navigate = useNavigate();

    // Article state
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Comments state
    const [comments, setComments] = useState([]);
    const [commentsLoading, setCommentsLoading] = useState(false);
    const [totalComments, setTotalComments] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);

    // Comment form state
    const [commentForm, setCommentForm] = useState({
        authorName: '',
        authorEmail: '',
        content: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');

    // Reply state
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyForm, setReplyForm] = useState({
        authorName: '',
        authorEmail: '',
        content: ''
    });

    // Fetch comments function - made it a useCallback for better performance
    const fetchComments = useCallback(async (page = 0, append = false) => {
        if (!article?.id) return;

        try {
            setCommentsLoading(true);
            const response = await fetch(
                `https://ucankus-deploy2.onrender.com/api/comments/news/${article.id}?page=${page}&size=10`
            );

            if (!response.ok) {
                throw new Error('Failed to load comments');
            }

            const data = await response.json();

            if (append) {
                // For "Load More" functionality
                setComments(prev => [...prev, ...(data.content || [])]);
            } else {
                // For initial load or refresh
                setComments(data.content || []);
            }

            setTotalComments(data.totalComments || 0);
        } catch (err) {
            console.error('Error loading comments:', err);
        } finally {
            setCommentsLoading(false);
        }
    }, [article?.id]);

    // Refresh comments function
    const refreshComments = useCallback(() => {
        setCurrentPage(0);
        fetchComments(0, false);
    }, [fetchComments]);

    // Fetch article
    useEffect(() => {
        const fetchArticle = async () => {
            try {
                setLoading(true);
                const endpoint = slugOrId.includes('-')
                    ? `https://ucankus-deploy2.onrender.com/api/news/slug/${slugOrId}`
                    : `https://ucankus-deploy2.onrender.com/api/news/${slugOrId}`;

                const response = await fetch(endpoint);

                if (!response.ok) {
                    throw new Error('Article not found');
                }

                const data = await response.json();
                setArticle(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (slugOrId) {
            fetchArticle();
        }
    }, [slugOrId]);

    // Fetch comments when article loads or page changes
    useEffect(() => {
        if (article?.id) {
            fetchComments(currentPage, currentPage > 0);
        }
    }, [article?.id, currentPage, fetchComments]);

    // Handle comment form submission
    const handleCommentSubmit = async (e) => {
        e.preventDefault();

        if (!commentForm.authorName || !commentForm.authorEmail || !commentForm.content) {
            setSubmitMessage('Please fill in all fields');
            return;
        }

        try {
            setIsSubmitting(true);
            const formData = new FormData();
            formData.append('authorName', commentForm.authorName);
            formData.append('authorEmail', commentForm.authorEmail);
            formData.append('content', commentForm.content);

            const response = await fetch(
                `https://ucankus-deploy2.onrender.com/api/comments/news/${article.id}`,
                {
                    method: 'POST',
                    body: formData
                }
            );

            if (!response.ok) {
                throw new Error('Failed to submit comment');
            }

            setCommentForm({ authorName: '', authorEmail: '', content: '' });
            setSubmitMessage('Comment submitted! It will appear after moderation.');

            // Refresh comments immediately
            refreshComments();

            setTimeout(() => setSubmitMessage(''), 5000);
        } catch (err) {
            setSubmitMessage('Error submitting comment. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle reply submission
    const handleReplySubmit = async (e, commentId) => {
        e.preventDefault();

        if (!replyForm.authorName || !replyForm.authorEmail || !replyForm.content) {
            return;
        }

        try {
            const formData = new FormData();
            formData.append('authorName', replyForm.authorName);
            formData.append('authorEmail', replyForm.authorEmail);
            formData.append('content', replyForm.content);

            const response = await fetch(
                `https://ucankus-deploy2.onrender.com/api/comments/${commentId}/reply`,
                {
                    method: 'POST',
                    body: formData
                }
            );

            if (!response.ok) {
                throw new Error('Failed to submit reply');
            }

            setReplyForm({ authorName: '', authorEmail: '', content: '' });
            setReplyingTo(null);

            // Refresh comments immediately
            refreshComments();
        } catch (err) {
            console.error('Error submitting reply:', err);
        }
    };

    // Handle comment like
    const handleLikeComment = async (commentId) => {
        try {
            const response = await fetch(
                `https://ucankus-deploy2.onrender.com/api/comments/${commentId}/like`,
                { method: 'POST' }
            );

            if (response.ok) {
                // Refresh comments immediately to show updated like count
                refreshComments();
            }
        } catch (err) {
            console.error('Error liking comment:', err);
        }
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Render comment
    const renderComment = (comment) => (
        <div key={comment.id} className="nd-comment">
            <div className="nd-comment-header">
                <div className="nd-comment-author">
                    <strong>{comment.authorName}</strong>
                    <span className="nd-comment-date">{formatDate(comment.createdAt)}</span>
                </div>
                <div className="nd-comment-actions">
                    <button
                        className="nd-comment-like-btn"
                        onClick={() => handleLikeComment(comment.id)}
                    >
                        👍 {comment.likesCount || 0}
                    </button>
                    <button
                        className="nd-comment-reply-btn"
                        onClick={() => setReplyingTo(comment.id)}
                    >
                        Reply
                    </button>
                </div>
            </div>
            <div className="nd-comment-content">
                {comment.content}
            </div>

            {/* Replies */}
            {comment.replies && comment.replies.length > 0 && (
                <div className="nd-comment-replies">
                    {comment.replies.map(reply => (
                        <div key={reply.id} className="nd-comment nd-comment-reply">
                            <div className="nd-comment-header">
                                <div className="nd-comment-author">
                                    <strong>{reply.authorName}</strong>
                                    <span className="nd-comment-date">{formatDate(reply.createdAt)}</span>
                                </div>
                                <button
                                    className="nd-comment-like-btn"
                                    onClick={() => handleLikeComment(reply.id)}
                                >
                                    👍 {reply.likesCount || 0}
                                </button>
                            </div>
                            <div className="nd-comment-content">
                                {reply.content}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Reply form */}
            {replyingTo === comment.id && (
                <form
                    className="nd-reply-form"
                    onSubmit={(e) => handleReplySubmit(e, comment.id)}
                >
                    <div className="nd-form-row">
                        <input
                            type="text"
                            placeholder="Your name"
                            value={replyForm.authorName}
                            onChange={(e) => setReplyForm({...replyForm, authorName: e.target.value})}
                            required
                        />
                        <input
                            type="email"
                            placeholder="Your email"
                            value={replyForm.authorEmail}
                            onChange={(e) => setReplyForm({...replyForm, authorEmail: e.target.value})}
                            required
                        />
                    </div>
                    <textarea
                        placeholder="Write your reply..."
                        value={replyForm.content}
                        onChange={(e) => setReplyForm({...replyForm, content: e.target.value})}
                        required
                        rows="3"
                    />
                    <div className="nd-form-actions">
                        <button type="submit" className="nd-btn nd-btn-primary">
                            Submit Reply
                        </button>
                        <button
                            type="button"
                            className="nd-btn nd-btn-secondary"
                            onClick={() => setReplyingTo(null)}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}
        </div>
    );

    if (loading) {
        return (
            <div className="nd-container">
                <div className="nd-loading">Loading article...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="nd-container">
                <div className="nd-error">
                    <h2>Article Not Found</h2>
                    <p>{error}</p>
                    <button className="nd-btn nd-btn-primary" onClick={() => navigate('/')}>
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    if (!article) {
        return (
            <div className="nd-container">
                <div className="nd-error">Article not found</div>
            </div>
        );
    }

    const defaultImage = 'https://pub-cab830fe342c4f9480be11e8b3347409.r2.dev/e0419d68-d383-4e39-a60d-8caf434d2394-Warface_240519_2334.jpg';
    const displayImage = article.imageUrl && (article.imageUrl.startsWith('http://') || article.imageUrl.startsWith('https://'))
        ? article.imageUrl
        : defaultImage;

    return (
        <div className="nd-container">
            <article className="nd-article">
                {/* Article Header */}
                <header className="nd-article-header">
                    <div className="nd-article-meta">
                        {article.category && (
                            <span className="nd-article-category">{article.category}</span>
                        )}
                        <span className="nd-article-date">
                            {formatDate(article.publishedAt || article.createdAt)}
                        </span>
                        {article.viewCount > 0 && (
                            <span className="nd-article-views">{article.viewCount} views</span>
                        )}
                    </div>
                    <h1 className="nd-article-title">{article.title}</h1>
                    {article.summary && (
                        <p className="nd-article-summary">{article.summary}</p>
                    )}
                    <div className="nd-article-byline">
                        {article.author && <span>By {article.author}</span>}
                        {article.source && <span>Source: {article.source}</span>}
                    </div>
                </header>

                {/* Article Image */}
                {displayImage && (
                    <div className="nd-article-image-container">
                        <img
                            src={displayImage}
                            alt={article.title}
                            className="nd-article-image"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = defaultImage;
                            }}
                        />
                    </div>
                )}

                {/* Article Content */}
                <div className="nd-article-content">
                    <div dangerouslySetInnerHTML={{ __html: article.content }} />
                </div>

                {/* Article Tags */}
                {article.tags && article.tags.length > 0 && (
                    <div className="nd-article-tags">
                        <strong>Tags: </strong>
                        {article.tags.map((tag, index) => (
                            <span key={index} className="nd-article-tag">#{tag}</span>
                        ))}
                    </div>
                )}

                {/* Article Video */}
                {article.videoUrl && (
                    <div className="nd-article-video">
                        <video controls width="100%">
                            <source src={article.videoUrl} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>
                )}

                {/* Article Actions */}
                <div className="nd-article-actions">
                    <button className="nd-action-btn">
                        👍 Like
                    </button>
                    <button className="nd-action-btn">
                        📤 Share
                    </button>
                    <button className="nd-action-btn">
                        ⭐ Save
                    </button>
                </div>
            </article>

            {/* Comments Section */}
            <section className="nd-comments-section">
                <div className="nd-comments-header">
                    <h3>Comments ({totalComments})</h3>
                </div>

                {/* Comment Form */}
                <form className="nd-comment-form" onSubmit={handleCommentSubmit}>
                    <h4>Leave a Comment</h4>
                    {submitMessage && (
                        <div className={`nd-submit-message ${submitMessage.includes('Error') ? 'error' : 'success'}`}>
                            {submitMessage}
                        </div>
                    )}
                    <div className="nd-form-row">
                        <input
                            type="text"
                            placeholder="Your name *"
                            value={commentForm.authorName}
                            onChange={(e) => setCommentForm({...commentForm, authorName: e.target.value})}
                            required
                        />
                        <input
                            type="email"
                            placeholder="Your email *"
                            value={commentForm.authorEmail}
                            onChange={(e) => setCommentForm({...commentForm, authorEmail: e.target.value})}
                            required
                        />
                    </div>
                    <textarea
                        placeholder="Write your comment... *"
                        value={commentForm.content}
                        onChange={(e) => setCommentForm({...commentForm, content: e.target.value})}
                        required
                        rows="5"
                    />
                    <button
                        type="submit"
                        className="nd-btn nd-btn-primary"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Comment'}
                    </button>
                    <p className="nd-form-note">
                        Your email will not be published. Comments are moderated before appearing.
                    </p>
                </form>

                {/* Comments List */}
                <div className="nd-comments-list">
                    {commentsLoading ? (
                        <div className="nd-loading">Loading comments...</div>
                    ) : comments.length > 0 ? (
                        <>
                            {comments.map(renderComment)}
                            {comments.length < totalComments && (
                                <button
                                    className="nd-btn nd-btn-secondary nd-load-more"
                                    onClick={() => setCurrentPage(currentPage + 1)}
                                >
                                    Load More Comments
                                </button>
                            )}
                        </>
                    ) : (
                        <div className="nd-no-comments">
                            <p>No comments yet. Be the first to comment!</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default NewsDetail;