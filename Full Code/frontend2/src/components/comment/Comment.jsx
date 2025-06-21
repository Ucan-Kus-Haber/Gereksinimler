// components/Comment/Comment.jsx
import React, { useState } from 'react';
import CommentService from '../../services/CommentService';
import './Comment.css';

const Comment = ({
                     comment,
                     onReply,
                     onLike,
                     onUpdate,
                     depth = 0,
                     maxDepth = 3
                 }) => {
    const [isReplying, setIsReplying] = useState(false);
    const [replyForm, setReplyForm] = useState({
        authorName: '',
        authorEmail: '',
        content: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const now = new Date();
        const diffInMinutes = Math.floor((now - date) / (1000 * 60));

        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
        if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d ago`;

        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
        });
    };

    const handleReplySubmit = async (e) => {
        e.preventDefault();

        if (!replyForm.authorName || !replyForm.authorEmail || !replyForm.content) {
            setError('Please fill in all fields');
            return;
        }

        try {
            setIsSubmitting(true);
            setError('');

            const reply = await CommentService.createReply(comment.id, replyForm);

            setReplyForm({ authorName: '', authorEmail: '', content: '' });
            setIsReplying(false);

            if (onReply) {
                onReply(reply);
            }

            if (onUpdate) {
                onUpdate();
            }
        } catch (err) {
            setError(err.message || 'Failed to submit reply');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLike = async () => {
        try {
            const updatedComment = await CommentService.likeComment(comment.id);
            if (onLike) {
                onLike(updatedComment);
            }
            if (onUpdate) {
                onUpdate();
            }
        } catch (err) {
            console.error('Error liking comment:', err);
        }
    };

    const handleReplyCancel = () => {
        setIsReplying(false);
        setReplyForm({ authorName: '', authorEmail: '', content: '' });
        setError('');
    };

    return (
        <div className={`comment ${depth > 0 ? 'comment-reply' : ''}`} style={{ marginLeft: `${depth * 20}px` }}>
            <div className="comment-content">
                <div className="comment-header">
                    <div className="comment-author-info">
                        <div className="comment-avatar">
                            {comment.authorName?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <div className="comment-meta">
                            <strong className="comment-author">{comment.authorName}</strong>
                            <span className="comment-date">{formatDate(comment.createdAt)}</span>
                        </div>
                    </div>
                    <div className="comment-actions">
                        <button
                            className="comment-like-btn"
                            onClick={handleLike}
                            title="Like this comment"
                        >
                            👍 {comment.likesCount || 0}
                        </button>
                        {depth < maxDepth && (
                            <button
                                className="comment-reply-btn"
                                onClick={() => setIsReplying(!isReplying)}
                            >
                                Reply
                            </button>
                        )}
                    </div>
                </div>

                <div className="comment-text">
                    {comment.content}
                </div>

                {/* Reply Form */}
                {isReplying && (
                    <form className="reply-form" onSubmit={handleReplySubmit}>
                        {error && (
                            <div className="reply-error">{error}</div>
                        )}
                        <div className="reply-form-row">
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
                        <div className="reply-form-actions">
                            <button
                                type="submit"
                                className="reply-submit-btn"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit Reply'}
                            </button>
                            <button
                                type="button"
                                className="reply-cancel-btn"
                                onClick={handleReplyCancel}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                )}
            </div>

            {/* Nested Replies */}
            {comment.replies && comment.replies.length > 0 && (
                <div className="comment-replies">
                    {comment.replies.map(reply => (
                        <Comment
                            key={reply.id}
                            comment={reply}
                            onReply={onReply}
                            onLike={onLike}
                            onUpdate={onUpdate}
                            depth={depth + 1}
                            maxDepth={maxDepth}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Comment;