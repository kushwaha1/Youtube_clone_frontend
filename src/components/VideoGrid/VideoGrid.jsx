import React from "react";
import VideoCard from "../VideoCard/VideoCard";

/**
 * VideoGrid Component
 * Renders a responsive grid of video cards.
 * 
 * Props:
 * - videos: Array of video objects to display
 */
function VideoGrid({ videos }) {
  return (
    <div className="p-3 sm:p-4 lg:p-6">
      {/* Grid layout:
          - 1 column on small screens
          - 2 columns on medium screens
          - 3 columns on large and extra-large screens
          - Responsive gaps between items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3 sm:gap-4">
        {videos.map((video) => (
          <VideoCard 
            key={video.videoId}  // Unique key for React rendering
            video={video}        // Pass video object to VideoCard
          />
        ))}
      </div>
    </div>
  );
}

export default VideoGrid;