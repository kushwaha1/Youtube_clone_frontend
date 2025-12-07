import React, { useState } from 'react';
import { useSelector } from 'react-redux';

/**
 * CommentForm component
 * Reusable input form for adding or editing comments.
 * 
 * Props:
 * - onSubmit: function to call with comment content
 * - initialValue: pre-filled text (for editing)
 * - isEditing: boolean flag to indicate edit mode
 * - onCancel: function to call when cancelling edit
 */
function CommentForm({ onSubmit, initialValue = '', isEditing = false, onCancel }) {
    const { user } = useSelector(state => state.auth); // Get logged-in user from Redux
    const [content, setContent] = useState(initialValue); // Comment input state
    const [isFocused, setIsFocused] = useState(false);   // Track input focus to show buttons

    /**
     * Handle form submission
     */
    const handleSubmit = (e) => {
        e.preventDefault();
        if (content.trim()) {
            onSubmit(content); // Call parent callback
            setContent('');    // Reset input
            setIsFocused(false); // Hide action buttons
        }
    };

    /**
     * Handle cancel action
     */
    const handleCancel = () => {
        setContent(initialValue); // Restore initial value
        setIsFocused(false);      // Hide buttons
        if (onCancel) onCancel(); // Call optional cancel callback
    };

    /**
     * Render user avatar or fallback initial
     */
    const renderAvatar = () => {
        if (user?.avatar) {
            return (
                <img 
                    src={user.avatar} 
                    alt={user.name || user.userName || 'User'} 
                    loading="lazy"
                    className="w-10 h-10 rounded-full object-cover"
                    onError={(e) => {
                        // Hide broken image and show initial fallback
                        e.target.style.display = 'none';
                        const userName = user.name || user.userName || 'User';
                        e.target.parentElement.innerHTML = `
                            <div class="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
                                <span class="text-white font-semibold text-sm">
                                    ${userName.charAt(0).toUpperCase()}
                                </span>
                            </div>
                        `;
                    }}
                />
            );
        }
        // Default avatar fallback
        return (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                    {(user?.name || user?.userName || 'U').charAt(0).toUpperCase()}
                </span>
            </div>
        );
    };

    return (
        <div className="flex gap-4">
            {/* Show avatar only when not editing */}
            {!isEditing && <div className="flex-shrink-0">{renderAvatar()}</div>}

            {/* Comment input form */}
            <form onSubmit={handleSubmit} className="flex-1">
                <input
                    type="text"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    placeholder="Add a comment..."
                    className="w-full border-b border-gray-300 focus:border-b-2 focus:border-black outline-none pb-1 text-sm transition-colors"
                    autoComplete="off"
                />
                
                {/* Action buttons: show on focus or edit mode */}
                {(isFocused || isEditing) && (
                    <div className="flex justify-end gap-2 mt-3">
                        {/* Cancel button */}
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            Cancel
                        </button>

                        {/* Submit button */}
                        <button
                            type="submit"
                            disabled={!content.trim()}
                            className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                                content.trim()
                                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                        >
                            {isEditing ? 'Save' : 'Comment'}
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
}

export default CommentForm;