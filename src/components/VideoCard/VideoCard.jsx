import { PlaySquare } from "lucide-react";
import { React } from "react";

function VideoCard({ video }) {
  const handleVideoClick = () => {
    console.log('Video clicked:', video.id);
  };

  return (
    <div className="cursor-pointer" onClick={handleVideoClick}>
      <div className="relative mb-2">
        <div className={`${video.thumbnail} aspect-video rounded-xl flex items-center justify-center overflow-hidden`}>
          <PlaySquare className="w-12 h-12 sm:w-16 sm:h-16 text-white opacity-0 hover:opacity-100 transition-opacity" />
        </div>
        <span className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-1 py-0.5 rounded font-semibold">
          {video.duration}
        </span>
      </div>
      <div className="flex gap-2 sm:gap-3">
        <div className="w-9 h-9 bg-gradient-to-br from-red-400 to-pink-500 rounded-full flex-shrink-0"></div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm sm:text-base line-clamp-2 mb-1">{video.title}</h3>
          <p className="text-xs sm:text-sm text-gray-600">{video.channel}</p>
          <p className="text-xs sm:text-sm text-gray-600">
            {video.views} views • {video.time}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VideoCard