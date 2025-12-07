import React, { useState } from 'react';
import { X, Camera } from 'lucide-react';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { createChannel } from '../../services/api';

/**
 *
 * Allows users to create a new channel with a name, handle, and banner.
 *
 * Props:
 * - isOpen: boolean, controls modal visibility
 * - onClose: function, callback to close modal
 * - onSuccess: function, callback when channel creation succeeds
 */
function CreateChannelModal({ isOpen, onClose, onSuccess }) {
    const { user } = useSelector(state => state.auth);

    // State for form inputs
    const [formData, setFormData] = useState({
        channelName: user?.name || '',
        handle: `@${user?.userName || 'user'}`,
        channelBanner: null
    });

    // Preview URL for uploaded banner image
    const [avatarPreview, setAvatarPreview] = useState(null);

    // Loading state for async submit
    const [loading, setLoading] = useState(false);

    // Early return if modal is closed
    if (!isOpen) return null;

    /**
     * Handles input changes for name and handle fields
     * Auto-formats handle to start with '@'
     */
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === 'handle') {
            let formatted = value.trim();
            if (!formatted.startsWith('@')) {
                formatted = '@' + formatted.replace(/^@+/, '');
            }
            setFormData({ ...formData, [name]: formatted });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    /**
     * Handles banner image selection
     * Validates file type and size (<5MB)
     */
    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image size should be less than 5MB');
            return;
        }

        if (!file.type.startsWith('image/')) {
            toast.error('Please upload an image file');
            return;
        }

        setFormData({ ...formData, channelBanner: file });
        setAvatarPreview(URL.createObjectURL(file));
    };

    /**
     * Handles form submission to create a channel
     */
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.channelName.trim()) {
            toast.error('Channel name is required');
            return;
        }

        setLoading(true);

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('channelName', formData.channelName.trim());

            if (formData.channelBanner) {
                formDataToSend.append('channelBanner', formData.channelBanner);
            }

            const response = await createChannel(formDataToSend);

            // Trigger parent callbacks
            onSuccess(response.channel);
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create channel');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100] px-4 py-6"
            onClick={onClose} // Close modal on backdrop click
        >
            <div
                className="bg-white rounded-2xl w-full max-w-xl shadow-2xl relative"
                onClick={(e) => e.stopPropagation()} // Prevent modal close when clicking inside
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b">
                    <h2 className="text-xl font-normal">How you'll appear</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        disabled={loading}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="px-8 py-5">
                    {/* Banner Upload */}
                    <div className="flex flex-col items-center mb-5">
                        <div className="relative mb-2">
                            <div className="w-28 h-28 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                                {avatarPreview ? (
                                    <img
                                        src={avatarPreview}
                                        alt="Channel"
                                        loading="lazy"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <svg
                                        className="w-16 h-16 text-blue-500"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                    >
                                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                    </svg>
                                )}
                            </div>

                            {/* Camera Overlay */}
                            <label className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors border border-gray-200">
                                <Camera className="w-5 h-5 text-gray-700" />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarChange}
                                    className="hidden"
                                    disabled={loading}
                                />
                            </label>
                        </div>

                        <label className="text-blue-600 text-sm font-medium cursor-pointer hover:underline">
                            Select picture
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarChange}
                                className="hidden"
                                disabled={loading}
                            />
                        </label>
                    </div>

                    {/* Channel Name */}
                    <div className="mb-4">
                        <label className="block text-xs text-gray-600 mb-2">Name</label>
                        <input
                            type="text"
                            name="channelName"
                            value={formData.channelName}
                            onChange={handleInputChange}
                            placeholder="Enter your name"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
                            disabled={loading}
                            required
                        />
                    </div>

                    {/* Handle */}
                    <div className="mb-5">
                        <label className="block text-xs text-gray-600 mb-2">Handle</label>
                        <input
                            type="text"
                            name="handle"
                            value={formData.handle}
                            onChange={handleInputChange}
                            placeholder="@yourhandle"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm bg-gray-50"
                            disabled={loading}
                            readOnly
                        />
                    </div>

                    {/* Terms */}
                    <p className="text-xs text-gray-600 leading-snug mb-5">
                        By clicking Create Channel you agree to{' '}
                        <a href="#" className="text-blue-600 hover:underline">
                            YouTube's Terms of Service
                        </a>
                        . Changes made to your name and profile picture are visible only on YouTube and not other Google services.{' '}
                        <a href="#" className="text-blue-600 hover:underline">
                            Learn more
                        </a>
                    </p>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-5 py-2.5 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? 'Creating...' : 'Create channel'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateChannelModal;