import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import CommentForm from './CommentForm';
import CommentItem from './CommentItem';
import AuthModal from '../AuthModal/AuthModal';
import toast from 'react-hot-toast';
import { getCommentsByVideo, addComment, updateComment, deleteComment } from '../../services/api';

/**
 * CommentSection Component
 * Handles display, addition, editing, and deletion of comments for a video.
 * 
 * Props:
 * - videoId: ID of the video
 * - comments: initial list of comments (optional)
 * - totalComments: total number of comments (optional)
 */
function CommentSection({ videoId, comments: initialComments, totalComments }) {
    const { isAuthenticated, user } = useSelector(state => state.auth);

    const [comments, setComments] = useState(initialComments || []);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    /**
     * Fetch comments when videoId or initialComments change
     */
    useEffect(() => {
        if (initialComments && initialComments.length > 0) {
            setComments(initialComments);
        } else {
            fetchComments();
        }
    }, [videoId, initialComments]);

    /**
     * Fetch comments from API and format for display
     */
    const fetchComments = async () => {
        try {
            setLoading(true);
            setError(null);

            const fetchedComments = await getCommentsByVideo(videoId);

            const formattedComments = fetchedComments.map(comment => ({
                id: comment._id,
                commentId: comment._id,
                userId: comment.user?._id,
                userName: comment.user?.userName || comment.user?.name || 'Unknown User',
                userAvatar: comment.user?.avatar?.url || comment.user?.avatar || null,
                content: comment.text,
                text: comment.text,
                createdAt: formatDate(comment.createdAt),
                timestamp: comment.createdAt,
                likes: 0
            }));

            setComments(formattedComments);
            setLoading(false);
        } catch (err) {
            setError('Failed to load comments');
            setLoading(false);
        }
    };

    /**
     * Format timestamp into human-readable relative time
     */
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffSeconds = Math.floor(diffTime / 1000);
        const diffMinutes = Math.floor(diffTime / (1000 * 60));
        const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const diffWeeks = Math.floor(diffDays / 7);
        const diffMonths = Math.floor(diffDays / 30);
        const diffYears = Math.floor(diffDays / 365);

        if (diffSeconds < 60) return 'Just now';
        if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        if (diffWeeks < 4) return `${diffWeeks} week${diffWeeks > 1 ? 's' : ''} ago`;
        if (diffMonths < 12) return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
        return `${diffYears} year${diffYears > 1 ? 's' : ''} ago`;
    };

    /**
     * Handle adding a new comment
     */
    const handleAddComment = async (content) => {
        if (!isAuthenticated) {
            toast.error('Please login to comment');
            return;
        }

        try {
            const newComment = await addComment(videoId, content);

            const formattedComment = {
                id: newComment._id,
                commentId: newComment._id,
                userId: user.id || user._id,
                userName: user.userName || user.name,
                userAvatar: user.avatar || null,
                content: newComment.text,
                text: newComment.text,
                createdAt: 'Just now',
                timestamp: new Date().toISOString(),
                likes: 0
            };

            setComments([formattedComment, ...comments]);
            toast.success('Comment added');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to add comment');
        }
    };

    /**
     * Handle editing an existing comment
     */
    const handleEditComment = async (commentId, newContent) => {
        try {
            await updateComment(commentId, newContent);

            setComments(comments.map(comment =>
                comment.id === commentId || comment.commentId === commentId
                    ? { ...comment, content: newContent, text: newContent }
                    : comment
            ));
            toast.success('Comment updated');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update comment');
        }
    };

    /**
     * Handle deleting a comment
     */
    const handleDeleteComment = async (commentId) => {
        try {
            await deleteComment(commentId);

            setComments(comments.filter(comment =>
                comment.id !== commentId && comment.commentId !== commentId
            ));
            toast.success('Comment deleted');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete comment');
        }
    };

    return (
        <div className="mt-6 px-2 sm:px-0">
            {/* Comments Header */}
            <div className="flex items-center gap-8 mb-6">
                <h2 className="text-xl font-semibold">{totalComments || comments.length} Comments</h2>
            </div>

            {/* Comment Form */}
            {isAuthenticated ? (
                <div className="mb-6">
                    <CommentForm onSubmit={handleAddComment} />
                </div>
            ) : (
                // Non-authenticated users see a read-only input triggering login modal
                <div className="flex gap-4 mb-6 pb-6 border-b">
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-gray-600" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                    </div>
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Add a comment..."
                            className="w-full border-b border-gray-300 pb-1 text-sm outline-none cursor-pointer"
                            onClick={() => setIsAuthModalOpen(true)}
                            readOnly
                        />
                    </div>
                </div>
            )}

            {/* Comments List */}
            <div>
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    </div>
                ) : error ? (
                    <div className="text-center py-12">
                        <p className="text-red-500 mb-3">{error}</p>
                        <button
                            onClick={fetchComments}
                            className="text-blue-600 hover:underline font-medium text-sm"
                        >
                            Retry
                        </button>
                    </div>
                ) : comments.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No comments yet</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {comments.map(comment => (
                            <CommentItem
                                key={comment.id || comment.commentId}
                                comment={comment}
                                onEdit={handleEditComment}
                                onDelete={handleDeleteComment}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Authentication Modal */}
            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                initialMode="login"
            />
        </div>
    );
}

export default CommentSection;