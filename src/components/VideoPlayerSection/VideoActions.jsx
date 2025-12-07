import React, { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown, Share2, Download } from 'lucide-react';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { toggleVideoLike, toggleVideoDislike, getLikeStatus } from '../../services/api';

/**
 * VideoActions Component
 * Handles Like, Dislike, Share, and Download actions for a video
 * @param {object} videoData - Video information including likes, dislikes, title, and videoUrl
 */
function VideoActions({ videoData }) {
    const { isAuthenticated } = useSelector(state => state.auth);

    //  Component States
    const [liked, setLiked] = useState(false);
    const [disliked, setDisliked] = useState(false);
    const [likeCount, setLikeCount] = useState(videoData.likes || 0);
    const [dislikeCount, setDislikeCount] = useState(videoData.dislikes || 0);
    const [loading, setLoading] = useState(false);        // API loading
    const [statusLoading, setStatusLoading] = useState(true); // Initial like/dislike status loading

    /**
     * Fetch initial like/dislike status if user is authenticated
     */
    useEffect(() => {
        const fetchStatus = async () => {
            if (!isAuthenticated) {
                setStatusLoading(false);
                return;
            }

            try {
                setStatusLoading(true);
                const status = await getLikeStatus(videoData.videoId);
                setLiked(status.hasLiked);
                setDisliked(status.hasDisliked);
            } catch {
                // Ignore errors silently
            } finally {
                setStatusLoading(false);
            }
        };

        fetchStatus();
        setLikeCount(videoData.likes || 0);
        setDislikeCount(videoData.dislikes || 0);
    }, [videoData.videoId, isAuthenticated]);

    /**
     * Format large numbers for display (e.g., 1200 -> 1.2K)
     */
    const formatCount = (count) => {
        if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
        if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
        return count;
    };

    /**
     * Handle Like button click
     * - Optimistically updates UI
     * - Calls API
     * - Reverts if API fails
     */
    const handleLike = async () => {
        if (!isAuthenticated) return toast.error('Please login to like videos');
        if (loading || statusLoading) return;

        const prevState = { liked, disliked, likeCount, dislikeCount };

        try {
            setLoading(true);

            // Optimistic UI update
            if (!liked) {
                setLikeCount(prev => prev + 1);
                if (disliked) {
                    setDislikeCount(prev => Math.max(0, prev - 1));
                    setDisliked(false);
                }
                setLiked(true);
            } else {
                setLikeCount(prev => Math.max(0, prev - 1));
                setLiked(false);
            }

            // API call
            const response = await toggleVideoLike(videoData.videoId);

            // Update with server response
            setLikeCount(response.likes);
            setDislikeCount(response.dislikes);
            setLiked(response.hasLiked);
            setDisliked(response.hasDisliked);

        } catch {
            // Revert UI on error
            setLiked(prevState.liked);
            setDisliked(prevState.disliked);
            setLikeCount(prevState.likeCount);
            setDislikeCount(prevState.dislikeCount);
            toast.error('Failed to like video');
        } finally {
            setLoading(false);
        }
    };

    /**
     * Handle Dislike button click
     * - Optimistically updates UI
     * - Calls API
     * - Reverts if API fails
     */
    const handleDislike = async () => {
        if (!isAuthenticated) return toast.error('Please login to dislike videos');
        if (loading || statusLoading) return;

        const prevState = { liked, disliked, likeCount, dislikeCount };

        try {
            setLoading(true);

            // Optimistic UI update
            if (!disliked) {
                setDislikeCount(prev => prev + 1);
                if (liked) {
                    setLikeCount(prev => Math.max(0, prev - 1));
                    setLiked(false);
                }
                setDisliked(true);
            } else {
                setDislikeCount(prev => Math.max(0, prev - 1));
                setDisliked(false);
            }

            // API call
            const response = await toggleVideoDislike(videoData.videoId);

            // Update with server response
            setLikeCount(response.likes);
            setDislikeCount(response.dislikes);
            setLiked(response.hasLiked);
            setDisliked(response.hasDisliked);

        } catch {
            // Revert UI on error
            setLiked(prevState.liked);
            setDisliked(prevState.disliked);
            setLikeCount(prevState.likeCount);
            setDislikeCount(prevState.dislikeCount);
            toast.error('Failed to dislike video');
        } finally {
            setLoading(false);
        }
    };

    /**
     * Copy video URL to clipboard
     */
    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
    };

    /**
     * Download the video
     */
    const handleDownload = () => {
        const videoUrl = videoData.videoUrl?.url || videoData.videoUrl;
        const link = document.createElement('a');
        link.href = videoUrl;
        link.download = `${videoData.title}.mp4`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="flex items-center gap-2 flex-wrap">
            {/* Like/Dislike Buttons */}
            <div className="flex items-center bg-gray-100 rounded-full overflow-hidden">
                <button
                    onClick={handleLike}
                    disabled={loading || statusLoading}
                    className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 hover:bg-gray-200 transition-colors disabled:opacity-50 ${
                        liked ? 'text-black' : 'text-gray-700'
                    }`}
                >
                    <ThumbsUp
                        className="w-4 h-4 sm:w-5 sm:h-5"
                        fill={liked ? 'black' : 'none'}
                        stroke={liked ? 'black' : 'currentColor'}
                    />
                    <span className="font-medium text-sm sm:text-base">{formatCount(likeCount)}</span>
                </button>

                <div className="w-px h-6 bg-gray-300"></div>

                <button
                    onClick={handleDislike}
                    disabled={loading || statusLoading}
                    className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 hover:bg-gray-200 transition-colors disabled:opacity-50 ${
                        disliked ? 'text-black' : 'text-gray-700'
                    }`}
                >
                    <ThumbsDown
                        className="w-4 h-4 sm:w-5 sm:h-5"
                        fill={disliked ? 'black' : 'none'}
                        stroke={disliked ? 'black' : 'currentColor'}
                    />
                    {dislikeCount > 0 && (
                        <span className="font-medium text-sm sm:text-base">{formatCount(dislikeCount)}</span>
                    )}
                </button>
            </div>

            {/* Share Button */}
            <button
                onClick={handleShare}
                className="flex items-center gap-1 sm:gap-2 bg-gray-100 px-2 sm:px-4 py-2 rounded-full hover:bg-gray-200 transition-colors text-gray-700"
            >
                <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base">Share</span>
            </button>

            {/* Download Button */}
            <button
                onClick={handleDownload}
                className="flex items-center gap-1 sm:gap-2 bg-gray-100 px-2 sm:px-4 py-2 rounded-full hover:bg-gray-200 transition-colors text-gray-700"
            >
                <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base">Download</span>
            </button>
        </div>
    );
}

export default VideoActions;