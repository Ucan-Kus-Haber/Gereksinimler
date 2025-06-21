// services/CommentService.js
const API_BASE_URL = 'https://ucankus-backend.onrender.com/api';

class CommentService {

    // Get comments for a news article
    static async getCommentsByArticle(articleId, page = 0, size = 10) {
        try {
            const response = await fetch(
                `${API_BASE_URL}/comments/news/${articleId}?page=${page}&size=${size}`
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching comments:', error);
            throw error;
        }
    }

    // Create a new comment
    static async createComment(articleId, commentData) {
        try {
            const formData = new FormData();
            formData.append('authorName', commentData.authorName);
            formData.append('authorEmail', commentData.authorEmail);
            formData.append('content', commentData.content);

            const response = await fetch(
                `${API_BASE_URL}/comments/news/${articleId}`,
                {
                    method: 'POST',
                    body: formData
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create comment');
            }

            return await response.json();
        } catch (error) {
            console.error('Error creating comment:', error);
            throw error;
        }
    }

    // Create a reply to a comment
    static async createReply(commentId, replyData) {
        try {
            const formData = new FormData();
            formData.append('authorName', replyData.authorName);
            formData.append('authorEmail', replyData.authorEmail);
            formData.append('content', replyData.content);

            const response = await fetch(
                `${API_BASE_URL}/comments/${commentId}/reply`,
                {
                    method: 'POST',
                    body: formData
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create reply');
            }

            return await response.json();
        } catch (error) {
            console.error('Error creating reply:', error);
            throw error;
        }
    }

    // Like a comment
    static async likeComment(commentId) {
        try {
            const response = await fetch(
                `${API_BASE_URL}/comments/${commentId}/like`,
                {
                    method: 'POST'
                }
            );

            if (!response.ok) {
                throw new Error('Failed to like comment');
            }

            return await response.json();
        } catch (error) {
            console.error('Error liking comment:', error);
            throw error;
        }
    }

    // Get a specific comment
    static async getComment(commentId) {
        try {
            const response = await fetch(`${API_BASE_URL}/comments/${commentId}`);

            if (!response.ok) {
                throw new Error('Comment not found');
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching comment:', error);
            throw error;
        }
    }

    // Admin functions
    static async getCommentsByStatus(status, page = 0, size = 10) {
        try {
            const response = await fetch(
                `${API_BASE_URL}/comments/admin/status/${status}?page=${page}&size=${size}`
            );

            if (!response.ok) {
                throw new Error('Failed to fetch comments by status');
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching comments by status:', error);
            throw error;
        }
    }

    static async approveComment(commentId) {
        try {
            const response = await fetch(
                `${API_BASE_URL}/comments/admin/${commentId}/approve`,
                {
                    method: 'PUT'
                }
            );

            if (!response.ok) {
                throw new Error('Failed to approve comment');
            }

            return await response.json();
        } catch (error) {
            console.error('Error approving comment:', error);
            throw error;
        }
    }

    static async rejectComment(commentId) {
        try {
            const response = await fetch(
                `${API_BASE_URL}/comments/admin/${commentId}/reject`,
                {
                    method: 'PUT'
                }
            );

            if (!response.ok) {
                throw new Error('Failed to reject comment');
            }

            return await response.json();
        } catch (error) {
            console.error('Error rejecting comment:', error);
            throw error;
        }
    }

    static async deleteComment(commentId) {
        try {
            const response = await fetch(
                `${API_BASE_URL}/comments/admin/${commentId}`,
                {
                    method: 'DELETE'
                }
            );

            if (!response.ok) {
                throw new Error('Failed to delete comment');
            }

            return await response.json();
        } catch (error) {
            console.error('Error deleting comment:', error);
            throw error;
        }
    }
}

export default CommentService;