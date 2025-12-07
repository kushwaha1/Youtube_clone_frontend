import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MoreVertical, Pencil, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { getChannelVideos, deleteVideo } from '../../services/api';

/**
 * ChannelVideos Component
 *
 * Displays a list/grid of videos for a channel.
 * Supports sorting, viewing, editing, and deleting videos (if user is owner).
 *
 * Props:
 * - channelId: string, ID of the channel
 * - activeTab: string, current active tab ('home', 'videos', etc.)
 * - isOwner: boolean, indicates if the logged-in user is the channel owner
 */
function ChannelVideos({ channelId, activeTab, isOwner }) {
    const navigate = useNavigate();

    // State for video data
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState('latest'); // Sorting option: latest, popular, oldest
    const [showMenu, setShowMenu] = useState(null); // Tracks which video menu is open

    // Fetch videos when channelId, sortBy, or activeTab changes
    useEffect(() => {
        if (activeTab === 'home' || activeTab === 'videos') {
            fetchVideos();
        }
    }, [channelId, sortBy, activeTab]);

    /**
     * Fetch videos from backend
     */
    const fetchVideos = async () => {
        try {
            setLoading(true);
            const response = await getChannelVideos(channelId, sortBy);
            setVideos(response.videos || []);
        } catch (error) {
            // Error handling
            toast.error('Failed to fetch videos');
            setVideos([]);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Navigate to video page on click
     */
    const handleVideoClick = (videoId) => {
        navigate(`/video/${videoId}`);
    };

    /**
     * Navigate to video edit page
     */
    const handleEditVideo = (videoId) => {
        navigate(`/video/${videoId}/edit`);
        setShowMenu(null);
    };

    /**
     * Delete a video after user confirmation
     */
    const handleDeleteVideo = async (videoId) => {
        if (!window.confirm('Are you sure you want to delete this video?')) return;

        try {
            await deleteVideo(videoId);
            toast.success('Video deleted successfully');
            // Remove deleted video from UI
            setVideos(videos.filter(v => v._id !== videoId));
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete video');
        } finally {
            setShowMenu(null);
        }
    };

    /**
     * Format video duration from seconds to mm:ss
     */
    const formatDuration = (seconds) => {
        if (!seconds) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    /**
     * Format view count for readability
     */
    const formatViews = (views) => {
        if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
        if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
        return views.toString();
    };

    /**
     * Format time since upload
     */
    const formatTimeAgo = (date) => {
        const now = new Date();
        const uploadDate = new Date(date);
        const diffInSeconds = Math.floor((now - uploadDate) / 1000);

        if (diffInSeconds < 60) return 'just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
        if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)} weeks ago`;
        if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
        return `${Math.floor(diffInSeconds / 31536000)} years ago`;
    };

    // Render placeholder for non-video tabs
    if (activeTab !== 'home' && activeTab !== 'videos') {
        return (
            <div className="px-4 sm:px-6 lg:px-16 py-8">
                <p className="text-gray-600 text-center">{activeTab} content coming soon...</p>
            </div>
        );
    }

    return (
        <div className="px-4 sm:px-6 lg:px-16 py-6">
            {/* Sort Buttons */}
            <div className="flex items-center gap-4 mb-6">
                {['latest', 'popular', 'oldest'].map(option => (
                    <button
                        key={option}
                        onClick={() => setSortBy(option)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                            sortBy === option ? 'bg-black text-white' : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                    >
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                    </button>
                ))}
            </div>

            {/* Videos Grid */}
            {loading ? (
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            ) : videos.length === 0 ? (
                <div className="text-center py-12">
                    <svg
                        className="w-24 h-24 mx-auto text-gray-300 mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                    </svg>
                    <p className="text-gray-600 text-lg mb-4">No videos uploaded yet</p>
                    <p className="text-gray-500 text-sm">Start sharing your content with the world!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {videos.map(video => (
                        <div key={video._id} className="cursor-pointer group relative">
                            {/* Thumbnail */}
                            <div className="relative mb-2" onClick={() => handleVideoClick(video._id)}>
                                <img
                                    src={video.thumbnailUrl?.url || video.thumbnailUrl || 'https://via.placeholder.com/640x360/e5e7eb/6b7280?text=No+Thumbnail'}
                                    alt={video.title}
                                    loading="lazy"
                                    className="w-full aspect-video rounded-lg object-cover bg-gray-200 group-hover:scale-105 transition-transform duration-200"
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/640x360/e5e7eb/6b7280?text=No+Thumbnail';
                                    }}
                                />
                                {video.duration && (
                                    <span className="absolute bottom-1 right-1 bg-black bg-opacity-90 text-white text-xs px-1.5 py-0.5 rounded font-semibold">
                                        {formatDuration(video.duration)}
                                    </span>
                                )}
                            </div>

                            {/* Video Info */}
                            <div className="flex gap-2" onClick={() => handleVideoClick(video._id)}>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-medium text-sm line-clamp-2 mb-1 group-hover:text-gray-700">{video.title}</h3>
                                    <p className="text-xs text-gray-600">{formatViews(video.views || 0)} views • {formatTimeAgo(video.createdAt)}</p>
                                </div>
                            </div>

                            {/* Edit/Delete Menu - Only for Owner */}
                            {isOwner && (
                                <div className="absolute top-2 right-2">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowMenu(showMenu === video._id ? null : video._id);
                                        }}
                                        className="p-1.5 bg-black opacity-80 hover:bg-opacity-90 rounded-full text-white group-hover:opacity-100 transition-opacity"
                                    >
                                        <MoreVertical className="w-4 h-4" />
                                    </button>

                                    {showMenu === video._id && (
                                        <>
                                            {/* Backdrop */}
                                            <div className="fixed inset-0 z-10" onClick={() => setShowMenu(null)}></div>
                                            {/* Dropdown Menu */}
                                            <div className="absolute right-0 mt-2 bg-white shadow-xl rounded-lg py-1 z-20 w-40">
                                                <button
                                                    onClick={() => handleEditVideo(video._id)}
                                                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2 transition-colors"
                                                >
                                                    <Pencil className="w-4 h-4" /> Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteVideo(video._id)}
                                                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 text-red-600 flex items-center gap-2 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" /> Delete
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ChannelVideos;