import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/Sidebar/Sidebar';
import Player from '../../components/VideoPlayerSection/Player';
import VideoActions from '../../components/VideoPlayerSection/VideoActions';
import CommentSection from '../../components/Comments/CommentSection';
import RelatedVideos from '../../components/VideoPlayerSection/RelatedVideos';
import { getVideoById } from '../../services/api';
import { useSubscription } from '../../hook/useSubscription';

function VideoPlayer() {
    const { videoId } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useSelector(state => state.auth);

    // Sidebar state
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Video data and loading/error state
    const [videoData, setVideoData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const channelId = videoData?.channel?.id;    

    const { isSubscribed, subscriberCount, toggleSubscription } = useSubscription(channelId, videoData?.channel?.subscribers);

    // Fetch video data whenever videoId changes
    useEffect(() => {
        fetchVideoData();
    }, [videoId]);

    /**
     * Fetch video data from backend and format it for frontend
     */
    const fetchVideoData = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await getVideoById(videoId);

            // Format the backend response for frontend
            const formattedData = {
                id: response.videoId,
                videoId: response.videoId,
                title: response.title,
                description: response.description,
                videoUrl: response.videoUrl,
                thumbnailUrl: response.thumbnailUrl,
                category: response.category,

                // Channel info
                channel: {
                    id: response.channel?.channelId,
                    channelName: response.channel?.channelName || response.uploader?.userName,
                    subscribers: formatNumber(response.channel?.subscribers || 0),
                    avatar: response.uploader?.avatar,
                    banner: response.channel?.channelBanner
                },

                // Uploader info
                uploader: {
                    id: response.uploader?.uploaderId,
                    name: response.uploader?.name,
                    userName: response.uploader?.userName,
                    email: response.uploader?.email,
                    avatar: response.uploader?.avatar
                },

                // Stats
                views: response.views || 0,
                likes: response.likes,
                dislikes: response.dislikes,
                uploadDate: response.uploadDate,
                uploadTime: formatDate(response.uploadDate),

                // Comments
                comments: response.comments || [],
                totalComments: response.totalComments || 0
            };

            setVideoData(formattedData);
        } catch (err) {
            setError('Failed to load video. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    /**
     * Format numbers for views/subscribers
     * @param {number} num
     * @returns {string} formatted number like 1.2K or 1.5M
     */
    const formatNumber = (num) => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
        return num.toString();
    };

    /**
     * Format upload date to relative time
     * @param {string|Date} dateString
     * @returns {string} e.g., '2 days ago'
     */
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return '1 day ago';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
        return `${Math.floor(diffDays / 365)} years ago`;
    };

    //  Loading State
    if (loading) {
        return (
            <div className="min-h-screen bg-white">
                <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
                <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

                <main className="flex-1 lg:ml-20 pt-14">
                    <div className="flex items-center justify-center h-[calc(100vh-200px)]">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                            <p className="text-gray-600">Loading video...</p>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    //  Error State
    if (error || !videoData) {
        return (
            <div className="min-h-screen bg-white">
                <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
                <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

                <main className="flex-1 lg:ml-20 pt-14">
                    <div className="flex items-center justify-center h-[calc(100vh-200px)]">
                        <div className="text-center">
                            <p className="text-red-500 text-xl mb-4">{error || 'Video not found'}</p>
                            <div className="flex gap-3 justify-center">
                                <button
                                    onClick={fetchVideoData}
                                    className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition-colors"
                                >
                                    Retry
                                </button>
                                <button
                                    onClick={() => navigate('/')}
                                    className="bg-gray-200 text-gray-700 px-6 py-2 rounded-full hover:bg-gray-300 transition-colors"
                                >
                                    Go Home
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    //  Main Video Player Layout
    return (
        <div className="min-h-screen bg-white">
            <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
            <div className="flex pt-14">
                <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

                <main className="flex-1 lg:ml-20">
                    <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 p-2 sm:p-4 lg:p-6 max-w-[100vw] overflow-hidden">

                        {/* Left Column: Video Player + Info + Comments */}
                        <div className="flex-1">
                            <Player
                                videoId={videoData.videoId}
                                videoUrl={typeof videoData.videoUrl === 'object' ? videoData.videoUrl.url : videoData.videoUrl}
                                thumbnailUrl={typeof videoData.thumbnailUrl === 'object' ? videoData.thumbnailUrl.url : videoData.thumbnailUrl}
                                title={videoData.title}
                            />

                            {/* Video Actions and Info */}
                            <div className="mt-4">
                                {/* Channel + Actions Row */}
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                                    {/* Channel Info */}
                                    <div className="flex items-center gap-3">
                                        <div
                                            onClick={() => {
                                                const channelId = videoData.channel?.id;
                                                if (channelId) navigate(`/channel/${channelId}`);
                                            }}
                                            className="cursor-pointer"
                                        >
                                            <img
                                                src={videoData.uploader?.avatar?.url || videoData.uploader?.avatar}
                                                alt={videoData.uploader?.userName}
                                                loading="lazy"
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                        </div>

                                        <div>
                                            <p
                                                onClick={() => {
                                                    const channelId = videoData.channel?.id;
                                                    if (channelId) navigate(`/channel/${channelId}`);
                                                }}
                                                className="font-semibold cursor-pointer hover:text-gray-700"
                                            >
                                                {videoData.channel?.channelName || videoData.uploader?.userName}
                                            </p>

                                            <p className="text-sm text-gray-600">
                                                {subscriberCount} subscribers
                                            </p>
                                        </div>

                                        {/* Subscribe Button if not own video */}
                                        {videoData.uploader?.id !== user?.id && (
                                            <button
                                                onClick={toggleSubscription}
                                                className={`ml-4 px-6 py-2 rounded-full font-medium transition-colors 
                                                ${isSubscribed
                                                        ? 'bg-gray-100 hover:bg-gray-200 text-black'
                                                        : 'bg-black hover:bg-gray-800 text-white'
                                                    }`}
                                            >
                                                {isSubscribed ? 'Subscribed' : 'Subscribe'}
                                            </button>
                                        )}

                                    </div>

                                    {/* Video Actions */}
                                    <VideoActions videoData={videoData} />
                                </div>

                                {/* Stats & Description Box */}
                                <div className="bg-gray-100 rounded-xl p-4">
                                    <div className="flex items-center gap-2 text-sm font-semibold mb-2">
                                        <span>{formatNumber(videoData.views)} views</span>
                                        <span>•</span>
                                        <span>{videoData.uploadTime}</span>
                                    </div>

                                    <div className="text-sm line-clamp-2">
                                        {videoData.description || 'No description available'}
                                    </div>
                                </div>
                            </div>

                            {/* Comment Section */}
                            <CommentSection
                                videoId={videoData.videoId}
                                comments={videoData.comments}
                                totalComments={videoData.totalComments}
                            />
                        </div>

                        {/* Right Column: Related Videos */}
                        <div className="lg:w-96">
                            <RelatedVideos
                                currentVideoId={videoData.videoId}
                                currentCategory={videoData.category}
                            />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default VideoPlayer;