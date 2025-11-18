import { ChevronRight, Clock, Compass, Home, PlaySquare, ThumbsUp } from 'lucide-react';
import React from 'react'

function Sidebar({isOpen}) {
  return (
    <aside className={`${isOpen ? 'w-60' : 'w-20'} border-r border-gray-200 overflow-y-auto fixed left-0 top-14 bottom-0 bg-white transition-all duration-300 z-40`}>
      <div className="py-2">
        <div className={`flex items-center gap-6 px-6 py-2 hover:bg-gray-100 cursor-pointer ${!isOpen && 'justify-center px-0'}`}>
          <Home className="w-6 h-6" />
          {isOpen && <span className="font-medium">Home</span>}
        </div>
        <div className={`flex items-center gap-6 px-6 py-2 hover:bg-gray-100 cursor-pointer ${!isOpen && 'justify-center px-0'}`}>
          <Compass className="w-6 h-6" />
          {isOpen && <span className="font-medium">Explore</span>}
        </div>
        <div className={`flex items-center gap-6 px-6 py-2 hover:bg-gray-100 cursor-pointer ${!isOpen && 'justify-center px-0'}`}>
          <PlaySquare className="w-6 h-6" />
          {isOpen && <span className="font-medium">Shorts</span>}
        </div>
      </div>

      {isOpen && (
        <>
          <div className="border-t border-gray-200 py-2 mt-2">
            <div className="flex items-center gap-6 px-6 py-2 hover:bg-gray-100 cursor-pointer">
              <Clock className="w-6 h-6" />
              <span className="font-medium">History</span>
            </div>
            <div className="flex items-center gap-6 px-6 py-2 hover:bg-gray-100 cursor-pointer">
              <PlaySquare className="w-6 h-6" />
              <span className="font-medium">Your videos</span>
            </div>
            <div className="flex items-center gap-6 px-6 py-2 hover:bg-gray-100 cursor-pointer">
              <Clock className="w-6 h-6" />
              <span className="font-medium">Watch Later</span>
            </div>
            <div className="flex items-center gap-6 px-6 py-2 hover:bg-gray-100 cursor-pointer">
              <ThumbsUp className="w-6 h-6" />
              <span className="font-medium">Liked videos</span>
            </div>
          </div>

          <div className="border-t border-gray-200 py-2 mt-2">
            <div className="px-6 py-2">
              <h3 className="font-semibold mb-2">Subscriptions</h3>
              {['Tech Academy', 'Code Master', 'Design Pro', 'Quick Learn'].map((channel, i) => (
                <div key={i} className="flex items-center gap-3 py-2 hover:bg-gray-100 cursor-pointer rounded">
                  <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full"></div>
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
  );
};

export default Sidebar