import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { ThumbsUp, ThumbsDown, MoreVertical } from 'lucide-react';
import CommentForm from './CommentForm';

/**
 * CommentItem Component
 * Displays a single comment with actions (like, dislike, edit, delete)
 * 
 * Props:
 * - comment: comment object containing content, user info, likes, etc.
 * - onEdit: function to call when editing comment
 * - onDelete: function to call when deleting comment
 */
function CommentItem({ comment, onEdit, onDelete }) {
    const { user } = useSelector(state => state.auth); // Current logged-in user
    const [isEditing, setIsEditing] = useState(false); // Editing mode
    const [showMenu, setShowMenu] = useState(false);   // Dropdown menu visibility
    const [liked, setLiked] = useState(false);        // Like state
    const [disliked, setDisliked] = useState(false);  // Dislike state

    // Determine if current user is the comment owner
    const isOwner = user && (
        user.id === comment.userId ||
        user._id === comment.userId ||
        user.id === comment.user?._id ||
        user._id === comment.user?._id
    );

    /**
     * Handle editing comment
     */
    const handleEdit = (newContent) => {
        onEdit(comment.id || comment.commentId, newContent);
        setIsEditing(false);
    };

    /**
     * Handle deleting comment
     */
    const handleDelete = () => {
        if (window.confirm('Delete comment permanently?')) {
            onDelete(comment.id || comment.commentId);
        }
        setShowMenu(false);
    };

    /**
     * Handle like button click
     */
    const handleLike = () => {
        if (disliked) setDisliked(false);
        setLiked(!liked);
    };

    /**
     * Handle dislike button click
     */
    const handleDislike = () => {
        if (liked) setLiked(false);
        setDisliked(!disliked);
    };

    /**
     * Render user avatar with fallback to initials
     */
    const renderAvatar = () => {
        if (comment.userAvatar) {
            return (
                <img
                    src={comment.userAvatar?.url || comment.userAvatar}
                    alt={comment.userName}
                    loading="lazy"
                    className="w-10 h-10 rounded-full object-cover"
                    onError={(e) => {
                        // Fallback to initial if image fails
                        e.target.style.display = 'none';
                        const initial = comment.userName?.charAt(0).toUpperCase() || '?';
                        e.target.parentElement.innerHTML = `
                            <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                                <span class="text-white font-semibold text-sm">${initial}</span>
                            </div>
                        `;
                    }}
                />
            );
        }

        // Default avatar fallback
        return (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                    {comment.userName?.charAt(0).toUpperCase() || '?'}
                </span>
            </div>
        );
    };

    return (
        <div className="flex gap-4 py-3">
            {/* User Avatar */}
            <div className="flex-shrink-0">{renderAvatar()}</div>

            <div className="flex-1 min-w-0">
                {/* User Name and Timestamp */}
                <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">@{comment.userName || 'unknown'}</span>
                    <span className="text-xs text-gray-600">{comment.createdAt || 'Recently'}</span>

                    {/* Dropdown menu for comment owner */}
                    {isOwner && (
                        <div className="ml-auto relative">
                            <button
                                onClick={() => setShowMenu(!showMenu)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <MoreVertical className="w-4 h-4 text-gray-600" />
                            </button>

                            {showMenu && (
                                <>
                                    {/* Click outside overlay */}
                                    <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)}></div>

                                    {/* Menu options */}
                                    <div className="absolute right-0 top-10 bg-white shadow-lg rounded-lg py-2 z-20 w-32 border border-gray-200">
                                        <button
                                            onClick={() => {
                                                setIsEditing(true);
                                                setShowMenu(false);
                                            }}
                                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
                                        >
                                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                                            </svg>
                                            Edit
                                        </button>
                                        <button
                                            onClick={handleDelete}
                                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 text-red-600 flex items-center gap-2"
                                        >
                                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                                            </svg>
                                            Delete
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>

                {/* Comment Content or Edit Form */}
                {isEditing ? (
                    <div className="mt-2">
                        <CommentForm
                            initialValue={comment.content || comment.text}
                            isEditing
                            onSubmit={handleEdit}
                            onCancel={() => setIsEditing(false)}
                        />
                    </div>
                ) : (
                    <>
                        {/* Comment Text */}
                        <p className="text-sm whitespace-pre-wrap break-words mb-2">{comment.content || comment.text}</p>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2">
                            {/* Like */}
                            <button
                                onClick={handleLike}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors ${liked ? 'bg-gray-100' : ''}`}
                            >
                                <ThumbsUp className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
                                {((comment.likes || 0) + (liked ? 1 : 0)) > 0 && (
                                    <span className="text-xs font-medium">{(comment.likes || 0) + (liked ? 1 : 0)}</span>
                                )}
                            </button>

                            {/* Dislike */}
                            <button
                                onClick={handleDislike}
                                className={`p-1.5 rounded-full hover:bg-gray-100 transition-colors ${disliked ? 'bg-gray-100' : ''}`}
                            >
                                <ThumbsDown className={`w-4 h-4 ${disliked ? 'fill-current' : ''}`} />
                            </button>

                            {/* Reply button - can be implemented later */}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default CommentItem;