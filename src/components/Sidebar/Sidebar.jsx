import { ChevronRight, Clock, Film, History, Home, ListVideo, PlaySquare, ThumbsUp } from 'lucide-react';
import React from 'react'

function Sidebar({ isOpen, onClose }) {
  // Assuming user is not signed in for now
  const isUserSignedIn = false;

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
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
          
          {isUserSignedIn && (
            <div className="flex flex-col items-center gap-1 hover:bg-gray-100 cursor-pointer rounded-lg py-4 px-2 w-full">
              <PlaySquare className="w-6 h-6" />
              <span className="text-[10px] text-center">Subscriptions</span>
            </div>
          )}
          
          <div className="w-16 border-t border-gray-300 my-2"></div>
          
          <div className="flex flex-col items-center gap-1 hover:bg-gray-100 cursor-pointer rounded-lg py-4 px-2 w-full">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
            <span className="text-[10px] text-center">You</span>
          </div>

          <div className="flex flex-col items-center gap-1 hover:bg-gray-100 cursor-pointer rounded-lg py-4 px-2 w-full">
            <History className="w-6 h-6" />
            <span className="text-[10px] text-center">History</span>
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
          <div className="flex items-center gap-6 px-6 py-2.5 hover:bg-gray-100 cursor-pointer bg-gray-100">
            <Home className="w-6 h-6 flex-shrink-0" />
            <span className="font-medium">Home</span>
          </div>
          
          {/* Shorts */}
          <div className="flex items-center gap-6 px-6 py-2.5 hover:bg-gray-100 cursor-pointer">
            <Film className="w-6 h-6 flex-shrink-0" />
            <span className="font-medium">Shorts</span>
          </div>
        </div>

        {!isUserSignedIn && (
          <>
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

            <div className="border-t border-gray-200 py-4 px-6">
              <p className="text-sm mb-4">Sign in to like videos, comment and subscribe.</p>
              <button className="flex items-center gap-2 border border-gray-300 rounded-full px-4 py-2 text-blue-600 font-medium hover:bg-blue-50">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
                Sign in
              </button>
            </div>

            <div className="border-t border-gray-200 py-4">
              <div className="px-6 mb-2">
                <h3 className="font-semibold text-base">Explore</h3>
              </div>
              
              <div className="flex items-center gap-6 px-6 py-2.5 hover:bg-gray-100 cursor-pointer">
                <svg className="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
                </svg>
                <span className="font-medium">Shopping</span>
              </div>
              
              <div className="flex items-center gap-6 px-6 py-2.5 hover:bg-gray-100 cursor-pointer">
                <svg className="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                </svg>
                <span className="font-medium">Music</span>
              </div>
              
              <div className="flex items-center gap-6 px-6 py-2.5 hover:bg-gray-100 cursor-pointer">
                <svg className="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 3v2h-2V3H8v2H6V3H4v18h2v-2h2v2h8v-2h2v2h2V3h-2zM8 17H6v-2h2v2zm0-4H6v-2h2v2zm0-4H6V7h2v2zm10 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2z"/>
                </svg>
                <span className="font-medium">Films</span>
              </div>
            </div>
          </>
        )}

        {isUserSignedIn && (
          <>
            <div className="flex items-center gap-6 px-6 py-2.5 hover:bg-gray-100 cursor-pointer">
              <PlaySquare className="w-6 h-6 flex-shrink-0" />
              <span className="font-medium">Subscriptions</span>
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
          </>
        )}
      </aside>
    </>
  );
};

export default Sidebar