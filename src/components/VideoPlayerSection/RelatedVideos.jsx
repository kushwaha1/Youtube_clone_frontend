import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getAllVideos } from '../../services/api';

/**
 * RelatedVideos Component
 * Displays related videos with category filter and horizontal scroll
 * @param {string} currentVideoId - Current video ID to exclude from list
 * @param {string} currentCategory - Current video category
 */
function RelatedVideos({ currentVideoId, currentCategory }) {
    const navigate = useNavigate();
    const scrollContainerRef = useRef(null);

    // Component states
    const [relatedVideos, setRelatedVideos] = useState([]); // Videos to display
    const [allVideos, setAllVideos] = useState([]);         // All fetched videos
    const [loading, setLoading] = useState(true);           // Loading state
    const [selectedCategory, setSelectedCategory] = useState('All'); // Selected category
    const [showLeftArrow, setShowLeftArrow] = useState(false);       // Show left scroll arrow
    const [showRightArrow, setShowRightArrow] = useState(true);      // Show right scroll arrow

    // Categories list
    const categories = [
        'All', 'JavaScript', 'React', 'CSS', 'Node.js', 'TypeScript',
        'Web Development', 'Tutorial', 'Live', 'Music', 'Gaming', 'News'
    ];

    /**
     * Fetch all videos from API on component mount or when current video changes
     */
    useEffect(() => {
        fetchRelatedVideos();
    }, [currentVideoId]);

    /**
     * Filter videos by selected category whenever category changes or all videos update
     */
    useEffect(() => {
        filterVideosByCategory();
    }, [selectedCategory, allVideos]);

    /**
     * Add resize listener to check arrows for scroll container
     */
    useEffect(() => {
        checkArrows();
        window.addEventListener('resize', checkArrows);
        return () => window.removeEventListener('resize', checkArrows);
    }, [selectedCategory]);

    /**
     * Fetch all videos and remove current video
     */
    const fetchRelatedVideos = async () => {
        try {
            setLoading(true);
            const data = await getAllVideos();
            const filtered = data.filter(v => v.videoId !== currentVideoId); // Exclude current video
            setAllVideos(filtered);
        } catch (error) {
            console.error('Error fetching related videos:', error);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Filter videos by selected category and limit to 20
     */
    const filterVideosByCategory = () => {
        if (selectedCategory === 'All') {
            setRelatedVideos(allVideos.slice(0, 20));
        } else {
            const filtered = allVideos.filter(v => v.category === selectedCategory);
            setRelatedVideos(filtered.slice(0, 20));
        }
    };

    /**
     * Check whether scroll arrows should be displayed
     */
    const checkArrows = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            setShowLeftArrow(scrollLeft > 5);
            setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 5);
        }
    };

    /**
     * Scroll left by 200px
     */
    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
            setTimeout(checkArrows, 300); // Recheck arrows after scrolling
        }
    };

    /**
     * Scroll right by 200px
     */
    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
            setTimeout(checkArrows, 300); // Recheck arrows after scrolling
        }
    };

    /**
     * Format views number (e.g., 1200 -> 1.2K)
     */
    const formatViews = (views) => {
        if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
        if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
        return views;
    };

    /**
     * Format upload date relative to today
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

    /**
     * Navigate to clicked video page
     */
    const handleVideoClick = (videoId) => {
        navigate(`/video/${videoId}`);
        window.scrollTo(0, 0);
    };

    // Show loading spinner
    if (loading) {
        return (
            <div className="space-y-3">
                <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {/* Category Filter with Scroll Arrows */}
            <div className="relative px-6">
                {/* Left Arrow */}
                {showLeftArrow && (
                    <button
                        onClick={scrollLeft}
                        className="absolute left-0 top-4 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-1.5 hover:bg-gray-100 transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                )}

                {/* Category Chips */}
                <div
                    ref={scrollContainerRef}
                    onScroll={checkArrows}
                    className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide scroll-smooth"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
                                selectedCategory === category
                                    ? 'bg-black text-white'
                                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Right Arrow */}
                {showRightArrow && (
                    <button
                        onClick={scrollRight}
                        className="absolute right-0 top-4 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-1.5 hover:bg-gray-100 transition-colors"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                )}
            </div>

            {/* Related Videos List */}
            {relatedVideos.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No videos found</p>
            ) : (
                relatedVideos.map(video => (
                    <div
                        key={video.videoId}
                        onClick={() => handleVideoClick(video.videoId)}
                        className="flex gap-2 cursor-pointer hover:bg-gray-100 rounded-lg p-2 transition-colors"
                    >
                        {/* Video Thumbnail */}
                        <div className="relative w-40 flex-shrink-0">
                            <img
                                src={video.thumbnailUrl?.url || video.thumbnailUrl}
                                alt={video.title}
                                loading="lazy"
                                className="w-full aspect-video rounded-lg object-cover"
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/160x90?text=No+Thumbnail';
                                }}
                            />
                        </div>

                        {/* Video Info */}
                        <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm line-clamp-2 mb-1">
                                {video.title}
                            </h4>
                            <p className="text-xs text-gray-600">
                                {video.channel?.channelName || video.uploader?.userName}
                            </p>
                            <p className="text-xs text-gray-600">
                                {formatViews(video.views)} views • {formatDate(video.uploadDate)}
                            </p>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

export default RelatedVideos;