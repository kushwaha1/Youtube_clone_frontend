import { Bell, Menu, User, Video } from 'lucide-react'
import React from 'react'
import youtube from "../../assets/youtube.png"
import SearchBar from '../SearchBar/SearchBar'

function Header({ onMenuClick }) {
  return (
    <>
      {/* Header */}
      <header className="flex items-center justify-between px-2 sm:px-4 py-2 bg-white fixed top-0 left-0 right-0 z-50 h-14">
        <div className="flex items-center gap-2 sm:gap-4">
          <button onClick={onMenuClick} className="p-2 hover:bg-gray-100 rounded-full">
            <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <div className="flex items-center gap-1">
            <img src={youtube} alt="Youtube" width="40" height="30" />
            <span className="text-xl font-semibold">YouTube</span>
          </div>
        </div>

        <SearchBar />

        <div className="flex items-center gap-1 sm:gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-full hidden sm:block">
            <Video className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full hidden sm:block">
            <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <button className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-purple-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
          </button>
        </div>
      </header>
    </>
  )
}

export default Header