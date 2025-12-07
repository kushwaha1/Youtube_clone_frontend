import { PlaySquare } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

function VideoCard({ video }) {
  const navigate = useNavigate();

  /**
   * Format views count to K/M notation
   * @param {number} views - Number of views
   * @returns {string} Formatted views
   */
  const formatViews = (views) => {
    if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M`;
    if (views >= 1_000) return `${(views / 1_000).toFixed(1)}K`;
    return views;
  };

  /**
   * Format upload date to relative time
   * @param {string} dateString - ISO date string
   * @returns {string} Formatted date like '2 days ago'
   */
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  // Navigate to video player page
  const handleVideoClick = () => navigate(`/video/${video.videoId}`);

  // Navigate to channel page without triggering video click
  const handleChannelClick = (e) => {
    e.stopPropagation();
    const uploaderId = video.channel?.channelId;
    if (uploaderId) navigate(`/channel/${uploaderId}`);
  };

  return (
    <div className="cursor-pointer group" onClick={handleVideoClick}>
      {/* Video Thumbnail with hover effect */}
      <div className="relative mb-2">
        <div className="aspect-video rounded-xl overflow-hidden bg-gray-200">
          <img
            src={video.thumbnailUrl?.url || video.thumbnailUrl}
            alt={video.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/400x250?text=No+Thumbnail";
            }}
          />
          {/* Play icon overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-opacity-0 group-hover:bg-opacity-20 transition-all">
            <PlaySquare className="w-12 h-12 sm:w-16 sm:h-16 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </div>

      {/* Video Info */}
      <div className="flex gap-2 sm:gap-3">
        {/* Channel Avatar */}
        <div className="flex-shrink-0 cursor-pointer" onClick={handleChannelClick}>
          <img
            src={video.uploader?.avatar?.url || video.uploader?.avatar || "https://via.placeholder.com/36"}
            alt={video.uploader?.userName || "Channel"}
            loading="lazy"
            className="w-9 h-9 rounded-full object-cover hover:ring-2 hover:ring-gray-300 transition-all"
            onError={(e) => {
              e.target.src =
                "https://ui-avatars.com/api/?name=" +
                encodeURIComponent(video.uploader?.userName || "User") +
                "&background=ef4444&color=fff";
            }}
          />
        </div>

        {/* Video Details */}
        <div className="flex-1 min-w-0">
          {/* Video Title */}
          <h3 className="font-medium text-sm sm:text-base line-clamp-2 mb-1 group-hover:text-gray-700">
            {video.title}
          </h3>

          {/* Channel Name (clickable) */}
          <p
            className="text-xs sm:text-sm text-gray-600 hover:text-gray-900 cursor-pointer w-fit"
            onClick={handleChannelClick}
          >
            {video.channel?.channelName || video.uploader?.userName || "Unknown Channel"}
          </p>

          {/* Views and Upload Date */}
          <p className="text-xs sm:text-sm text-gray-600">
            {formatViews(video.views)} views • {formatDate(video.uploadDate)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default VideoCard;