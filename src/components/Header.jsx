import { Bell, Menu, Mic, Search, User, Video } from 'lucide-react'
import React from 'react'
import youtube from "../assets/youtube.png"

function Header() {
  return (
    <div className='min-h-screen flex flex-col bg-white'>
        {/* Header */}
      <header className="flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-white fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-1">
            <img src={youtube} alt="Youtube" width="40" height="30" />
            <span className="text-xl font-semibold">YouTube</span>
          </div>
        </div>

        <div className="flex items-center flex-1 max-w-2xl mx-4">
          <div className="flex items-center w-full">
            <div className="flex items-center flex-1 border border-gray-300 rounded-l-full px-4 py-2">
              <input
                type="text"
                placeholder="Search"
                className="w-full outline-none"
              />
            </div>
            <button className="px-6 py-2.5 bg-gray-50 border border-l-0 border-gray-300 rounded-r-full hover:bg-gray-100">
              <Search className="w-5 h-5" />
            </button>
          </div>
          <button className="ml-4 p-2 hover:bg-gray-100 rounded-full">
            <Mic className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Video className="w-6 h-6" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Bell className="w-6 h-6" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
          </button>
        </div>
      </header>
    </div>
  )
}

export default Header