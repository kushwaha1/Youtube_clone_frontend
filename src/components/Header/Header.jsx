import { Bell, Menu, Mic, Search, User, Video } from 'lucide-react'
import React from 'react'
import youtube from "../../assets/youtube.png"
import SearchBar from '../SearchBar/SearchBar'

function Header({ onMenuClick }) {
  return (
    <div className='min-h-screen flex flex-col bg-white'>
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-white fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center gap-4">
          <button onClick={onMenuClick} className="p-2 hover:bg-gray-100 rounded-full">
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-1">
            <img src={youtube} alt="Youtube" width="40" height="30" />
            <span className="text-xl font-semibold">YouTube</span>
          </div>
        </div>

        <SearchBar />

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