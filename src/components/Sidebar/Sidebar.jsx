import { ChevronRight, Clock, Film, History, Home, ListVideo, PlaySquare, ThumbsUp } from 'lucide-react';
import React from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';

function Sidebar({ isOpen, onClose }) {
  const { isAuthenticated } = useSelector(state => state.auth);
  const location = useLocation();

  // Check if current page is a video player page
  const isVideoPlayerPage = location.pathname.startsWith('/video/');

  return (
    <>
      {/* Overlay for mobile view */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
        />
      )}

      {/* Mini Sidebar (hidden on video player pages) */}
      {!isVideoPlayerPage && (
        <aside className="hidden lg:block fixed left-0 top-14 bottom-0 bg-white z-30 w-18 overflow-y-auto overflow-x-hidden">
          <div className="py-4 flex flex-col items-center gap-4">
            {/* Home Link */}
            <Link to="/">
              <div className="flex flex-col items-center gap-1 hover:bg-gray-100 cursor-pointer rounded-lg py-4 px-2 w-full">
                <Home className="w-6 h-6" />
                <span className="text-[10px] text-center">Home</span>
              </div>
            </Link>

            {/* Shorts */}
            <div className="flex flex-col items-center gap-1 hover:bg-gray-100 cursor-pointer rounded-lg py-4 px-2 w-full">
              <Film className="w-6 h-6" />
              <span className="text-[10px] text-center">Shorts</span>
            </div>

            {/* Subscriptions (only for authenticated users) */}
            {isAuthenticated && (
              <div className="flex flex-col items-center gap-1 hover:bg-gray-100 cursor-pointer rounded-lg py-4 px-2 w-full">
                <PlaySquare className="w-6 h-6" />
                <span className="text-[10px] text-center">Subscriptions</span>
              </div>
            )}

            <div className="w-16 border-t border-gray-300 my-2"></div>

            {/* User section */}
            <div className="flex flex-col items-center gap-1 hover:bg-gray-100 cursor-pointer rounded-lg py-4 px-2 w-full">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
              <span className="text-[10px] text-center">You</span>
            </div>

            {/* History */}
            <div className="flex flex-col items-center gap-1 hover:bg-gray-100 cursor-pointer rounded-lg py-4 px-2 w-full">
              <History className="w-6 h-6" />
              <span className="text-[10px] text-center">History</span>
            </div>
          </div>
        </aside>
      )}

      {/* Full Sidebar */}
      <aside
        className={`
          fixed left-0 top-14 bottom-0 bg-white z-50 overflow-y-auto
          transition-transform duration-300 ease-in-out w-60
          ${isOpen ? 'translate-x-0' : '-translate-x-[100%]'}
        `}
      >
        <div className="py-2">
          {/* Home */}
          <Link to="/">
            <div className="flex items-center gap-6 px-6 py-2.5 hover:bg-gray-100 cursor-pointer bg-gray-100">
              <Home className="w-6 h-6 flex-shrink-0" />
              <span className="font-medium">Home</span>
            </div>
          </Link>

          {/* Shorts */}
          <div className="flex items-center gap-6 px-6 py-2.5 hover:bg-gray-100 cursor-pointer">
            <Film className="w-6 h-6 flex-shrink-0" />
            <span className="font-medium">Shorts</span>
          </div>
        </div>

        {/* Show content based on authentication */}
        {!isAuthenticated && (
          <>
            {/* User section and History */}
            <div className="border-t border-gray-200 py-4 mt-2">
              <div className="flex items-center gap-6 px-6 py-2.5 hover:bg-gray-100 cursor-pointer">
                <svg className="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
                <span className="font-medium">You</span>
              </div>

              <div className="flex items-center gap-6 px-6 py-2.5 hover:bg-gray-100 cursor-pointer">
                <History className="w-6 h-6 flex-shrink-0" />
                <span className="font-medium">History</span>
              </div>
            </div>

            {/* Sign in prompt */}
            <div className="border-t border-gray-200 py-4 px-6">
              <p className="text-sm mb-4">Sign in to like videos, comment and subscribe.</p>
              <button className="flex items-center gap-2 border border-gray-300 rounded-full px-4 py-2 text-blue-600 font-medium hover:bg-blue-50">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
                Sign in
              </button>
            </div>
          </>
        )}

        {isAuthenticated && (
          <>
            {/* Subscriptions */}
            <div className="flex items-center gap-6 px-6 py-2.5 hover:bg-gray-100 cursor-pointer">
              <PlaySquare className="w-6 h-6 flex-shrink-0" />
              <span className="font-medium">Subscriptions</span>
            </div>

            {/* You section */}
            <div className="border-t border-gray-200 py-2 mt-2">
              <div className="px-6 py-2">
                <h3 className="font-semibold mb-2">You</h3>
              </div>

              <div className="flex items-center gap-6 px-6 py-2 hover:bg-gray-100 cursor-pointer">
                <History className="w-6 h-6 flex-shrink-0" />
                <span className="font-medium">History</span>
              </div>
              <div className="flex items-center gap-6 px-6 py-2 hover:bg-gray-100 cursor-pointer">
                <ListVideo className="w-6 h-6 flex-shrink-0" />
                <span className="font-medium">Playlists</span>
              </div>
              <div className="flex items-center gap-6 px-6 py-2 hover:bg-gray-100 cursor-pointer">
                <PlaySquare className="w-6 h-6 flex-shrink-0" />
                <span className="font-medium">Your videos</span>
              </div>
              <div className="flex items-center gap-6 px-6 py-2 hover:bg-gray-100 cursor-pointer">
                <Clock className="w-6 h-6 flex-shrink-0" />
                <span className="font-medium">Watch Later</span>
              </div>
              <div className="flex items-center gap-6 px-6 py-2 hover:bg-gray-100 cursor-pointer">
                <ThumbsUp className="w-6 h-6 flex-shrink-0" />
                <span className="font-medium">Liked videos</span>
              </div>
            </div>

            {/* Subscriptions list */}
            <div className="border-t border-gray-200 py-2 mt-2">
              <div className="px-6 py-2">
                <h3 className="font-semibold mb-2">Subscriptions</h3>
                {['Tech Academy', 'Code Master', 'Design Pro', 'Quick Learn'].map((channel, i) => (
                  <div key={i} className="flex items-center gap-3 py-2 hover:bg-gray-100 cursor-pointer rounded">
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex-shrink-0"></div>
                    <span className="text-sm">{channel}</span>
                  </div>
                ))}
                <button className="flex items-center gap-2 text-sm mt-2 hover:bg-gray-100 px-2 py-1 rounded">
                  <ChevronRight className="w-4 h-4" />
                  Show more
                </button>
              </div>
            </div>
          </>
        )}
      </aside>
    </>
  );
}

export default Sidebar;