import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Settings } from 'lucide-react';
import { incrementVideoViews } from '../../services/api';

/**
 * Video Player Component
 * @param {string} videoId - ID of the video (for view count)
 * @param {string} videoUrl - URL of the video
 * @param {string} thumbnailUrl - Poster image for video
 * @param {string} title - Video title
 */
function Player({ videoId, videoUrl, thumbnailUrl, title }) {
  const videoRef = useRef(null);

  // Player states
  const [isPlaying, setIsPlaying] = useState(false);  // Play/Pause state
  const [isMuted, setIsMuted] = useState(false);      // Mute/Unmute
  const [volume, setVolume] = useState(1);            // Volume (0-1)
  const [currentTime, setCurrentTime] = useState(0);  // Current time in seconds
  const [duration, setDuration] = useState(0);        // Total duration in seconds
  const [showControls, setShowControls] = useState(true); // Show/Hide controls
  const [isLoading, setIsLoading] = useState(true);   // Loading state
  const [error, setError] = useState(null);           // Error state
  const [viewCounted, setViewCounted] = useState(false); // To avoid multiple view counts

  /**
   * Reset player state when video changes
   */
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setIsLoading(true);
    setError(null);
    setViewCounted(false);
  }, [videoUrl]);

  /**
   * Increment video views when video starts playing
   */
  useEffect(() => {
    if (isPlaying && !viewCounted && videoId) {
      incrementVideoViews(videoId)
        .then(() => setViewCounted(true))
        .catch(() => {}); // Silently ignore error
    }
  }, [isPlaying, viewCounted, videoId]);

  /**
   * Toggle play/pause
   */
  const togglePlay = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => setError('Failed to play video.'));
      }
    }
    setIsPlaying(!isPlaying);
  };

  /**
   * Toggle mute/unmute
   */
  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  /**
   * Change volume
   */
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setIsMuted(newVolume === 0 ? true : false);
    }
  };

  /**
   * Toggle fullscreen
   */
  const toggleFullscreen = () => {
    if (!videoRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      videoRef.current.requestFullscreen();
    }
  };

  /**
   * Update current time
   */
  const handleTimeUpdate = () => {
    if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
  };

  /**
   * Update duration when metadata is loaded
   */
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      setIsLoading(false);
    }
  };

  /**
   * Handle video ended
   */
  const handleEnded = () => setIsPlaying(false);

  /**
   * Seek video
   */
  const handleSeek = (e) => {
    const seekTime = (e.target.value / 100) * duration;
    if (videoRef.current) videoRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  /**
   * Format seconds to MM:SS
   */
  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  /**
   * Handle video errors
   */
  const handleError = () => {
    setError('Failed to load video. The video may be unavailable.');
    setIsLoading(false);
  };

  /**
   * Video can play
   */
  const handleCanPlay = () => {
    setIsLoading(false);
    setError(null);
  };

  /**
   * Video buffering
   */
  const handleWaiting = () => setIsLoading(true);

  /**
   * Video resumed playing after buffering
   */
  const handlePlaying = () => setIsLoading(false);

  return (
    <div
      className="relative w-full bg-black rounded-xl overflow-hidden group mb-4 max-w-full"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(isPlaying ? false : true)}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        className="w-full aspect-video object-contain bg-black"
        poster={thumbnailUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onError={handleError}
        onCanPlay={handleCanPlay}
        onWaiting={handleWaiting}
        onPlaying={handlePlaying}
        onClick={togglePlay}
        crossOrigin="anonymous"
        preload="metadata"
      >
        <source src={videoUrl} type="video/mp4" />
        <source src={videoUrl} type="video/webm" />
        <source src={videoUrl} type="video/ogg" />
        Your browser does not support the video tag.
      </video>

      {/* Loading Spinner */}
      {isLoading && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white mb-4"></div>
            <p className="text-white text-sm">Loading video...</p>
          </div>
        </div>
      )}

      {/* Error Overlay */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-90">
          <div className="text-center text-white p-6 max-w-md">
            <div className="text-6xl mb-4">⚠️</div>
            <p className="text-lg mb-2 font-semibold">Video not available</p>
            <p className="text-sm mb-6 text-gray-300">{error}</p>
            <button
              onClick={() => {
                setError(null);
                setIsLoading(true);
                videoRef.current?.load();
              }}
              className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-full transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Play Button Overlay */}
      {!isPlaying && !isLoading && !error && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-opacity-30 cursor-pointer transition-opacity"
          onClick={togglePlay}
        >
          <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-all hover:scale-110">
            <Play className="w-10 h-10 text-white ml-1" fill="white" />
          </div>
        </div>
      )}

      {/* Controls */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-4 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Progress Bar */}
        <input
          type="range"
          min="0"
          max="100"
          value={(currentTime / duration) * 100 || 0}
          onChange={handleSeek}
          className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer mb-3 accent-red-600"
          style={{
            background: `linear-gradient(to right, #dc2626 0%, #dc2626 ${(currentTime / duration) * 100}%, #4b5563 ${(currentTime / duration) * 100}%, #4b5563 100%)`,
          }}
        />

        {/* Bottom Controls */}
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-4">
            {/* Play/Pause */}
            <button onClick={togglePlay} className="hover:text-red-500 transition-colors" title={isPlaying ? 'Pause' : 'Play'}>
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" fill="white" />}
            </button>

            {/* Volume */}
            <div className="flex items-center gap-2">
              <button onClick={toggleMute} className="hover:text-red-500 transition-colors" title={isMuted ? 'Unmute' : 'Mute'}>
                {isMuted || volume === 0 ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
                className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-white hidden sm:block"
              />
            </div>

            {/* Time */}
            <div className="text-sm">{formatTime(currentTime)} / {formatTime(duration)}</div>
          </div>

          {/* Right-side Controls */}
          <div className="flex items-center gap-4">
            <button className="hover:text-red-500 transition-colors" title="Settings">
              <Settings className="w-5 h-5" />
            </button>
            <button onClick={toggleFullscreen} className="hover:text-red-500 transition-colors" title="Fullscreen">
              <Maximize className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Player;