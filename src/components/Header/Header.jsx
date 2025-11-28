import { Bell, ChevronDown, Menu, Search, User, Video } from 'lucide-react'
import React, { useState } from 'react'
import youtube from "../../assets/youtube.png"
import SearchBar from '../SearchBar/SearchBar'
import AuthModal from '../AuthModal/AuthModal';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../utils/authSlice';
import toast from 'react-hot-toast';

function Header({ onMenuClick }) {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    setIsDropdownOpen(false);
  };

  return (
    <>
      {/* Header */}
      <header className="flex items-center justify-between px-2 sm:px-4 py-2 bg-white fixed top-0 left-0 right-0 z-50 h-14">
        {/* LEFT */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button onClick={onMenuClick} className="p-2 hover:bg-gray-100 rounded-full">
            <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          <div className="flex items-center gap-1">
            <img src={youtube} className="w-7 sm:w-9" />
            <span className="hidden sm:block text-lg font-semibold">YouTube</span>
          </div>
        </div>

        {/* CENTER */}
        <div className="hidden md:flex flex-1 justify-center">
          <SearchBar />
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <button className="md:hidden p-2">
            <Search className="w-5 h-5" />
          </button>

          <button className="hidden sm:block p-2 hover:bg-gray-100 rounded-full">
            <Video />
          </button>

          <button className="hidden sm:block p-2 hover:bg-gray-100 rounded-full">
            <Bell />
          </button>

          {/* Profile Button */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full"
              >
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsDropdownOpen(false)}
                  ></div>
                  <div className="absolute right-0 top-12 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gray-200">
                      <div className="flex items-center gap-3">
                        {user?.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold">
                              {user?.name?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm truncate">{user?.name}</p>
                          <p className="text-xs text-gray-600 truncate">@{user?.userName}</p>
                        </div>
                      </div>
                      <button className="text-blue-600 text-sm mt-2 hover:underline">
                        View your channel
                      </button>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <button className="w-full px-4 py-2 hover:bg-gray-100 flex items-center gap-3 text-sm">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                        </svg>
                        Google Account
                      </button>
                      <button className="w-full px-4 py-2 hover:bg-gray-100 flex items-center gap-3 text-sm">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                        Switch account
                        <ChevronDown className="w-4 h-4 ml-auto" />
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 hover:bg-gray-100 flex items-center gap-3 text-sm"
                      >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
                        </svg>
                        Sign out
                      </button>
                    </div>

                    <div className="border-t border-gray-200 py-2">
                      <button className="w-full px-4 py-2 hover:bg-gray-100 flex items-center gap-3 text-sm">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94L14.4 2.81c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
                        </svg>
                        Settings
                      </button>
                      <button className="w-full px-4 py-2 hover:bg-gray-100 flex items-center gap-3 text-sm">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                        </svg>
                        Help
                      </button>
                      <button className="w-full px-4 py-2 hover:bg-gray-100 flex items-center gap-3 text-sm">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 12h-2v-2h2v2zm0-4h-2V6h2v4z" />
                        </svg>
                        Send feedback
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-purple-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
            </button>
          )}
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode="login"
      />
    </>
  )
}

export default Header