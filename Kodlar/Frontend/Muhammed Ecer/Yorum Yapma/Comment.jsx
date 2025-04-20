// src/components/Comment.jsx
import React from 'react';
import PropTypes from 'prop-types';
import './CommentSection.css'; // Import the CSS

// --- Helper Function for Relative Time (Example) ---
// You might want to use a library like 'date-fns' or 'dayjs' for more robust formatting
const timeAgo = (timestamp) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffInSeconds = Math.floor((now - past) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInWeeks = Math.floor(diffInDays / 7);
    const diffInMonths = Math.floor(diffInDays / 30); // Approximate
    const diffInYears = Math.floor(diffInDays / 365); // Approximate

    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;
    if (diffInWeeks < 4) return `${diffInWeeks}w ago`;
    if (diffInMonths < 12) return `${diffInMonths}mo ago`;
    return `${diffInYears}y ago`;
};
// --- End Helper Function ---

function Comment({ comment, onReply, onLike }) {
    // Basic validation in case comment data is missing
    if (!comment || !comment.author) {
        return null; // Or render some placeholder/error
    }

    const handleReplyClick = () => {
        if (onReply) {
            onReply(comment.id, comment.author.name); // Pass ID and maybe author name
        }
    };

    const handleLikeClick = () => {
        if (onLike) {
            onLike(comment.id); // Pass comment ID to the handler
        }
    };

    const likeButtonClasses = `Cmt-action-link Cmt-like ${comment.userLiked ? 'Cmt-liked' : ''}`;

    return (
        <li className="Cmt-item">
            {/* Avatar */}
            <div className="Cmt-avatar">
                <img
                    src={comment.author.avatarUrl || '/path/to/default-avatar.png'} // Provide a default avatar
                    alt={`${comment.author.name}'s avatar`}
                />
            </div>

            {/* Main Comment Content */}
            <div className="Cmt-content">
                <div className="Cmt-header-info">
                    <span className="Cmt-author">{comment.author.name}</span>
                    <span className="Cmt-timestamp">
                        {comment.timestamp ? timeAgo(comment.timestamp) : ''}
                    </span>
                </div>

                <div className="Cmt-body">
                    {comment.text}
                </div>

                <div className="Cmt-actions">
                    {/* Like Button */}
                    {onLike && ( // Only show if onLike handler is provided
                        <button
                            type="button"
                            onClick={handleLikeClick}
                            className={likeButtonClasses}
                            aria-pressed={comment.userLiked} // Accessibility
                        >
                            Like
                        </button>
                    )}
                    {/* Like Count (optional) */}
                    {typeof comment.likes === 'number' && comment.likes > 0 && (
                        <span className="Cmt-like-count">{comment.likes}</span>
                    )}

                    {/* Reply Button */}
                    {onReply && ( // Only show if onReply handler is provided
                        <button
                            type="button"
                            onClick={handleReplyClick}
                            className="Cmt-action-link Cmt-reply"
                        >
                            Reply
                        </button>
                    )}

                    {/* Add other actions here (e.g., Edit, Delete) with appropriate checks */}
                    {/* Example:
                    {comment.canEdit && <button className="Cmt-action-link">Edit</button>}
                    {comment.canDelete && <button className="Cmt-action-link">Delete</button>}
                    */}
                </div>

                {/* Nested Replies */}
                {comment.replies && comment.replies.length > 0 && (
                    <ul className="Cmt-replies">
                        {comment.replies.map((reply) => (
                            <Comment
                                key={reply.id} // IMPORTANT: Unique key for lists
                                comment={reply}
                                onReply={onReply} // Pass handlers down
                                onLike={onLike}   // Pass handlers down
                            />
                        ))}
                    </ul>
                )}
            </div>
        </li>
    );
}

// --- PropTypes for Type Checking and Documentation ---
Comment.propTypes = {
    comment: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        author: PropTypes.shape({
            name: PropTypes.string.isRequired,
            avatarUrl: PropTypes.string, // Optional, might use default
        }).isRequired,
        text: PropTypes.string.isRequired,
        timestamp: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]).isRequired, // ISO string or Date object
        likes: PropTypes.number, // Optional
        userLiked: PropTypes.bool, // Optional: Tracks if the current logged-in user liked this
        replies: PropTypes.arrayOf(PropTypes.object), // Array of comment objects (recursive structure)
        // Add flags for edit/delete permissions if needed
        // canEdit: PropTypes.bool,
        // canDelete: PropTypes.bool,
    }).isRequired,
    onReply: PropTypes.func, // Function to call when reply button is clicked
    onLike: PropTypes.func, // Function to call when like button is clicked
};

// --- Default Props ---
Comment.defaultProps = {
    onReply: null, // No reply functionality by default unless handler is passed
    onLike: null,  // No like functionality by default unless handler is passed
    comment: {
        likes: 0,
        userLiked: false,
        replies: [],
        // canEdit: false,
        // canDelete: false,
    }
};

export default Comment;