import { ChevronRight, Clock, Film, History, Home, ListVideo, PlaySquare, ThumbsUp } from 'lucide-react';
import React from 'react'

function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black opacity-50 z-10"
          onClick={onClose}
        ></div>
      )}

      {/* Mini Sidebar - Always visible on desktop */}
      <aside className="hidden lg:block fixed left-0 top-14 bottom-0 bg-white z-30 w-18 overflow-y-auto overflow-x-hidden">
        <div className="py-4 flex flex-col items-center gap-4">
          <div className="flex flex-col items-center gap-1 hover:bg-gray-100 cursor-pointer rounded-lg py-4 px-2 w-full">
            <Home className="w-6 h-6" />
            <span className="text-[10px] text-center">Home</span>
          </div>
          
          <div className="flex flex-col items-center gap-1 hover:bg-gray-100 cursor-pointer rounded-lg py-4 px-2 w-full">
            <Film className="w-6 h-6" />
            <span className="text-[10px] text-center">Shorts</span>
          </div>
          
          <div className="flex flex-col items-center gap-1 hover:bg-gray-100 cursor-pointer rounded-lg py-4 px-2 w-full">
            <PlaySquare className="w-6 h-6" />
            <span className="text-[10px] text-center">Subscriptions</span>
          </div>
          
          <div className="w-16 border-t border-gray-300 my-2"></div>
          
          <div className="flex flex-col items-center gap-1 hover:bg-gray-100 cursor-pointer rounded-lg py-4 px-2 w-full">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
            <span className="text-[10px] text-center">You</span>
          </div>
        </div>
      </aside>
      
      {/* Full Sidebar opens on click */}
      <aside className={`
        fixed left-0 top-14 bottom-0 bg-white z-50 overflow-y-auto
        transition-transform duration-300 ease-in-out w-60
        ${isOpen ? 'translate-x-0' : '-translate-x-[100%]'}
      `}>
        <div className="py-2">
          {/* Home */}
          <div className="flex items-center gap-6 px-6 py-2.5 hover:bg-gray-100 cursor-pointer">
            <Home className="w-6 h-6 flex-shrink-0" />
            <span className="font-medium">Home</span>
          </div>
          
          {/* Shorts */}
          <div className="flex items-center gap-6 px-6 py-2.5 hover:bg-gray-100 cursor-pointer">
            <Film className="w-6 h-6 flex-shrink-0" />
            <span className="font-medium">Shorts</span>
          </div>
          
          {/* Subscriptions */}
          <div className="flex items-center gap-6 px-6 py-2.5 hover:bg-gray-100 cursor-pointer">
            <PlaySquare className="w-6 h-6 flex-shrink-0" />
            <span className="font-medium">Subscriptions</span>
          </div>
        </div>

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
      </aside>
    </>
  );
};

export default Sidebar