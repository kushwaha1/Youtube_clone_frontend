import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

/**
 * VideoInfo Component
 * Displays video title, channel info, upload stats, and description
 * @param {object} videoData - Video information including title, uploader, channel, views, description
 */
function VideoInfo({ videoData }) {
    const navigate = useNavigate();
    const { user } = useSelector(state => state.auth);

    //  State to toggle full description view
    const [showFullDescription, setShowFullDescription] = useState(false);

    /**
     * Format large numbers for views (e.g., 1200 -> 1.2K)
     * @param {number} views - Number of views
     * @returns {string} Formatted views string
     */
    const formatViews = (views) => {
        if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M views`;
        if (views >= 1000) return `${(views / 1000).toFixed(1)}K views`;
        return `${views} views`;
    };

    /**
     * Format upload date to human-readable relative time
     * @param {string|Date} date - Upload date
     * @returns {string} Relative time (e.g., '3 days ago')
     */
    const formatDate = (date) => {
        const uploadDate = new Date(date);
        const now = new Date();
        const diffTime = Math.abs(now - uploadDate);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
        return `${Math.floor(diffDays / 365)} years ago`;
    };

    /**
     * Navigate to the channel page
     */
    const handleChannelClick = () => {
        const channelId = videoData.channel?.channelId;
        if (channelId) navigate(`/channel/${channelId}`);
    };

    //  Check if the video belongs to the logged-in user
    const isOwnVideo = user?._id === videoData.uploader?.uploaderId;

    return (
        <div className="mt-4">
            {/* Video Title */}
            <h1 className="text-xl font-bold mb-2">{videoData.title}</h1>

            {/* Channel Info and Actions */}
            <div className="flex items-center justify-between mb-4">
                {/* Left: Channel Info */}
                <div className="flex items-center gap-3">
                    <div onClick={handleChannelClick} className="cursor-pointer">
                        <img
                            src={videoData.uploader?.avatar?.url || videoData.uploader?.avatar}
                            alt={videoData.uploader?.userName}
                            loading="lazy"
                            className="w-10 h-10 rounded-full object-cover"
                        />
                    </div>

                    <div>
                        <p
                            onClick={handleChannelClick}
                            className="font-semibold cursor-pointer hover:text-gray-700"
                        >
                            {videoData.channel?.channelName || videoData.uploader?.userName}
                        </p>
                        <p className="text-sm text-gray-600">
                            {videoData.channel?.subscribers || 0} subscribers
                        </p>
                    </div>

                    {/*  Optional Subscribe Button (if not user's own video) */}
                    {/* {!isOwnVideo && (
                        <button className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-colors font-medium ml-4">
                            Subscribe
                        </button>
                    )} */}
                </div>

                {/* Right: Place for VideoActions component (passed from parent) */}
            </div>

            {/* Video Stats and Description */}
            <div className="bg-gray-100 rounded-xl p-4">
                {/* Views and Upload Date */}
                <div className="flex items-center gap-2 text-sm font-semibold mb-2">
                    <span>{formatViews(videoData.views)}</span>
                    <span>•</span>
                    <span>{formatDate(videoData.uploadDate)}</span>
                </div>

                {/* Video Description */}
                <div className={`text-sm ${showFullDescription ? '' : 'line-clamp-2'}`}>
                    {videoData.description || 'No description available'}
                </div>

                {/* Toggle 'more/less' button for long descriptions */}
                {videoData.description && videoData.description.length > 100 && (
                    <button
                        onClick={() => setShowFullDescription(!showFullDescription)}
                        className="text-sm font-semibold mt-2 hover:text-gray-700"
                    >
                        {showFullDescription ? '...less' : '...more'}
                    </button>
                )}
            </div>
        </div>
    );
}

export default VideoInfo;