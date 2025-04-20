// src/components/CommentForm.jsx
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import './CommentSection.css'; // Make sure CSS is imported

function CommentForm({
                         onSubmit,
                         currentUserAvatarUrl,
                         replyingTo, // Optional: { commentId: string|number, authorName: string }
                         onCancelReply, // Optional: function to call when cancelling a reply
                         placeholder = "Add a public comment...",
                         submitButtonText = "Post",
                         replySubmitButtonText = "Reply",
                     }) {
    const [commentText, setCommentText] = useState('');
    const textareaRef = useRef(null); // Ref for focusing

    // Effect to focus and potentially update placeholder when replyingTo changes
    useEffect(() => {
        if (replyingTo && textareaRef.current) {
            textareaRef.current.focus();
            // Optionally, you could pre-fill or change placeholder further
            // setCommentText(`@${replyingTo.authorName} `); // Careful with this UX
        }
        // Reset text if reply is cancelled externally (optional)
        if (!replyingTo && commentText.startsWith('@')) {
            // Or just leave the text as is, user might want to keep it
        }

    }, [replyingTo]); // Rerun when replyingTo changes

    const handleTextChange = (event) => {
        setCommentText(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault(); // Prevent default if wrapped in <form> someday
        const trimmedText = commentText.trim();

        if (!trimmedText) {
            return; // Don't submit empty comments
        }

        onSubmit({
            text: trimmedText,
            // Include parentId if this form submission is intended as a reply
            parentId: replyingTo ? replyingTo.commentId : null,
        });

        // Clear the textarea after successful submission
        setCommentText('');


    };

    const handleCancelClick = () => {
        if (onCancelReply) {
            onCancelReply(); // Call the parent's cancel handler
            setCommentText(''); // Optionally clear text on cancel
        }
    };

    const currentSubmitText = replyingTo ? replySubmitButtonText : submitButtonText;
    const currentPlaceholder = replyingTo
        ? `Replying to @${replyingTo.authorName}...`
        : placeholder;
    const isSubmitDisabled = commentText.trim().length === 0;

    return (
        <div className="Cmt-form">
            {/* Current User Avatar */}
            <div className="Cmt-form-avatar">
                <img
                    src={currentUserAvatarUrl || '/path/to/default-avatar.png'} // Provide a default
                    alt="Your avatar"
                />
            </div>

            {/* Textarea and Actions */}
            <div className="Cmt-form-main">
                {/* Indicate who you're replying to */}
                {replyingTo && (
                    <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>
                        Replying to <strong style={{color: '#333'}}>@{replyingTo.authorName}</strong>
                    </div>
                )}

                <textarea
                    ref={textareaRef}
                    className="Cmt-form-textarea"
                    placeholder={currentPlaceholder}
                    value={commentText}
                    onChange={handleTextChange}
                    aria-label="Comment input"
                    rows="3" // Start with a reasonable height
                />
                <div className="Cmt-form-actions">
                    {/* Show Cancel button only when in reply mode */}
                    {replyingTo && onCancelReply && (
                        <button
                            type="button"
                            className="Cmt-cancel-button"
                            onClick={handleCancelClick}
                        >
                            Cancel Reply
                        </button>
                    )}
                    <button
                        type="button" // Use type="submit" if wrapping in <form>
                        className="Cmt-submit-button"
                        onClick={handleSubmit}
                        disabled={isSubmitDisabled} // Disable if text is empty
                        aria-disabled={isSubmitDisabled}
                    >
                        {currentSubmitText}
                    </button>
                </div>
            </div>
        </div>
    );
}

CommentForm.propTypes = {
    // Function called with { text: string, parentId: string|number|null }
    onSubmit: PropTypes.func.isRequired,
    // URL for the current logged-in user's avatar
    currentUserAvatarUrl: PropTypes.string,
    // Object indicating the comment being replied to, or null/undefined
    replyingTo: PropTypes.shape({
        commentId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        authorName: PropTypes.string.isRequired,
    }),
    // Function to call when the user cancels the "reply" state
    onCancelReply: PropTypes.func,
    // Placeholder text for the textarea
    placeholder: PropTypes.string,
    // Text for the submit button in normal mode
    submitButtonText: PropTypes.string,
    // Text for the submit button when replying
    replySubmitButtonText: PropTypes.string,
};

CommentForm.defaultProps = {
    currentUserAvatarUrl: '/path/to/default-avatar.png', // Default avatar
    replyingTo: null,
    onCancelReply: null,
    placeholder: "Add a public comment...",
    submitButtonText: "Post",
    replySubmitButtonText: "Reply",
};

export default CommentForm;