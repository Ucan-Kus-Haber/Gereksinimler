  // Example usage in a parent component (e.g., CommentList.jsx or CommentSection.jsx)
import React, { useState, useEffect } from 'react';
import Comment from './Comment';
import CommentForm from './CommentForm.jsx'; // Assuming you have a form component
import './CommentSection.css';

function CommentSection({ postId }) { // Assuming comments are related to a post
    const [comments, setComments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [replyingTo, setReplyingTo] = useState(null); // { commentId, authorName }

    // Fetch comments effect (replace with your actual API call)
    useEffect(() => {
        setIsLoading(true);
        fetch(`/api/posts/${postId}/comments`) // Replace with your endpoint
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch comments');
                return res.json();
            })
            .then(data => {
                setComments(data); // Assuming API returns array of comment objects
                setError(null);
            })
            .catch(err => {
                console.error("Fetch error:", err);
                setError(err.message);
                setComments([]);
            })
            .finally(() => setIsLoading(false));
    }, [postId]);

    // --- Action Handlers ---
    const handleAddComment = (newCommentData) => {
        // TODO: API call to POST the new comment
        console.log('Adding comment:', newCommentData);
        // Optimistic UI update or re-fetch comments
        // Example optimistic update:
        // const newComment = { ...newCommentData, id: Date.now(), author: { name: 'You', avatarUrl: '...' }, replies: [] };
        // setComments(prev => [newComment, ...prev]);
        // After API success, update with real ID/data or re-fetch
        setReplyingTo(null); // Clear reply state after submitting
    };

    const handleReply = (commentId, authorName) => {
        console.log(`Replying to comment ${commentId} by ${authorName}`);
        setReplyingTo({ commentId, authorName });
        // You might want to focus the comment form here
        // document.getElementById('comment-textarea')?.focus();
    };

    const handleLike = (commentId) => {
        console.log(`Liking comment ${commentId}`);
        // TODO: API call to toggle like status for commentId

        // Example optimistic UI update:
        setComments(prevComments =>
            prevComments.map(comment =>
                updateLikeStatusRecursive(comment, commentId) // Helper needed for recursion
            )
        );
    };

    // Helper function to update like status recursively
    const updateLikeStatusRecursive = (comment, targetId) => {
        if (comment.id === targetId) {
            return {
                ...comment,
                userLiked: !comment.userLiked,
                likes: comment.userLiked ? (comment.likes || 1) - 1 : (comment.likes || 0) + 1,
            };
        }
        if (comment.replies && comment.replies.length > 0) {
            return {
                ...comment,
                replies: comment.replies.map(reply => updateLikeStatusRecursive(reply, targetId)),
            };
        }
        return comment;
    };
    // --- End Action Handlers ---


    return (
        <div className="Cmt-section">
            <div className="Cmt-header">
                <h2>Comments</h2>
                {/* You might want a more dynamic count */}
                <span className="Cmt-count">{comments.length} Comments</span>
            </div>

            {/* Comment Input Form */}
            <CommentForm
                onSubmit={handleAddComment}
                replyingTo={replyingTo} // Pass replyingTo info to the form
                onCancelReply={() => setReplyingTo(null)} // Allow cancelling reply mode
            />

            {/* Loading State */}
            {isLoading && (
                <div className="Cmt-loading-container">
                    <div className="Cmt-loading-spinner"></div>
                    Loading comments...
                </div>
            )}

            {/* Error State */}
            {error && <div className="Cmt-error-message">Error: {error}</div>}

            {/* No Comments State */}
            {!isLoading && !error && comments.length === 0 && (
                <div className="Cmt-no-comments">Be the first to comment!</div>
            )}

            {/* Comment List */}
            {!isLoading && !error && comments.length > 0 && (
                <ul className="Cmt-list">
                    {comments.map(comment => (
                        <Comment
                            key={comment.id}
                            comment={comment}
                            onReply={handleReply}
                            onLike={handleLike}
                        />
                    ))}
                </ul>
            )}

            {/* Optional: Load More Button */}
            {/* {hasMoreComments && <button className="Cmt-load-more">Load More</button>} */}
        </div>
    );
}

export default CommentSection;