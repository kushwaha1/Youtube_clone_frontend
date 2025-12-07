import { Bell, ChevronDown, Menu, Search, User, Video, X } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import youtube from "../../assets/youtube.png";
import SearchBar from '../SearchBar/SearchBar';
import AuthModal from '../AuthModal/AuthModal';
import CreateChannelModal from '../Channel/CreateChannelModal';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../utils/AuthSlice';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { getMyChannel } from '../../services/api';

function Header({ onMenuClick, onSearch }) {
  // Redux setup
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector(state => state.auth);

  // Modal states
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCreateChannelModalOpen, setIsCreateChannelModalOpen] = useState(false);

  // User data
  const [userChannel, setUserChannel] = useState(null);

  // Mobile UI state
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  // Fetch user's channel when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchUserChannel();
    } else {
      setUserChannel(null);
    }
  }, [isAuthenticated]);

  // API call to get user's channel data
  const fetchUserChannel = async () => {
    try {
      const response = await getMyChannel();
      setUserChannel(response.channel || null);
    } catch {
      setUserChannel(null);
    }
  };

  // Handle user logout
  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    setIsDropdownOpen(false);
    setUserChannel(null);
  };

  // Navigate to channel or open creation modal
  const handleViewChannel = () => {
    if (userChannel) {
      navigate(`/channel/${userChannel.id}`);
    } else {
      setIsCreateChannelModalOpen(true);
    }
    setIsDropdownOpen(false);
  };

  // After channel creation, update state and navigate
  const handleChannelCreated = (newChannel) => {
    setIsCreateChannelModalOpen(false);
    setUserChannel(newChannel);
    toast.success('Channel created successfully!');
    navigate(`/channel/${newChannel.id}`);
  };

  return (
    <>
      {/* Main Header - Fixed at top */}
      <header className="flex items-center justify-between px-2 sm:px-4 py-2 bg-white fixed top-0 left-0 right-0 z-50 h-14">

        {/* LEFT SECTION: Menu button & YouTube logo */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button onClick={onMenuClick} className="p-2 hover:bg-gray-100 rounded-full">
            <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <Link to="/">
            <div className="flex items-center gap-1">
              <img src={youtube} alt="YouTube" loading="lazy" className="w-7 sm:w-9" />
              <span className="hidden sm:block text-lg font-semibold">YouTube</span>
            </div>
          </Link>
        </div>

        {/* CENTER SECTION: Search bar (desktop only) */}
        <div className="hidden md:flex flex-1 justify-center">
          <SearchBar onSearch={onSearch} />
        </div>

        {/* RIGHT SECTION: Action icons & profile */}
        <div className="flex items-center gap-1 sm:gap-2">

          {/* Mobile search icon */}
          <button onClick={() => setShowMobileSearch(true)} className="md:hidden p-2">
            <Search className="w-5 h-5" />
          </button>

          {/* Show upload & notification icons only when logged in */}
          {isAuthenticated && (
            <>
              <Link to="/upload">
                <button className="hidden sm:block p-2 hover:bg-gray-100 rounded-full">
                  <Video />
                </button>
              </Link>
              <button className="hidden sm:block p-2 hover:bg-gray-100 rounded-full">
                <Bell />
              </button>
            </>
          )}

          {/* Profile dropdown OR Sign In button */}
          {isAuthenticated ? (
            <div className="relative">
              {/* Profile button */}
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full flex items-center gap-2"
              >
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} loading="lazy" className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover" />
                ) : (
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">{user?.name?.charAt(0).toUpperCase()}</span>
                  </div>
                )}
                <span className="hidden lg:block text-sm font-medium text-gray-700 max-w-[120px] truncate">{user?.userName}</span>
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <>
                  {/* Backdrop to close dropdown on click outside */}
                  <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)}></div>

                  {/* Dropdown content - SCROLLABLE with max-height */}
                  <div className="absolute right-0 top-12 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-[calc(100vh-80px)] overflow-y-auto">

                    {/* User profile section */}
                    <div className="px-4 py-3 border-b border-gray-200 sticky top-0 bg-white z-10">
                      <div className="flex items-center gap-3">
                        {user?.avatar ? (
                          <img src={user.avatar} alt={user.name} loading="lazy" className="w-10 h-10 rounded-full object-cover" />
                        ) : (
                          <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold">{user?.name?.charAt(0).toUpperCase()}</span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm truncate">{user?.name}</p>
                          <p className="text-xs text-gray-600 truncate">@{user?.userName}</p>
                        </div>
                      </div>
                      <button onClick={handleViewChannel} className="text-blue-600 text-sm mt-2 hover:underline">
                        {userChannel ? 'View your channel' : 'Create a channel'}
                      </button>
                    </div>

                    {/* Primary actions */}
                    <div className="py-2">
                      <button onClick={handleViewChannel} className="w-full px-4 py-2 hover:bg-gray-100 flex items-center gap-3 text-sm text-left">
                        <User className="w-5 h-5" />
                        <span>{userChannel ? 'Your channel' : 'Create a channel'}</span>
                      </button>

                      <button className="w-full px-4 py-2 hover:bg-gray-100 flex items-center gap-3 text-sm text-left">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                        </svg>
                        <span>Google Account</span>
                      </button>

                      <button className="w-full px-4 py-2 hover:bg-gray-100 flex items-center gap-3 text-sm text-left">
                        <ChevronDown className="w-5 h-5" />
                        <span>Switch account</span>
                        <ChevronDown className="w-4 h-4 ml-auto" />
                      </button>

                      <button onClick={handleLogout} className="w-full px-4 py-2 hover:bg-gray-100 flex items-center gap-3 text-sm text-left">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
                        </svg>
                        <span>Sign out</span>
                      </button>
                    </div>

                    {/* YouTube Studio & Purchases */}
                    <div className="border-t border-gray-200 py-2">
                      <button className="w-full px-4 py-2 hover:bg-gray-100 flex items-center gap-3 text-sm text-left">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 3v9.28c-.47-.17-.97-.28-1.5-.28C8.01 12 6 14.01 6 16.5S8.01 21 10.5 21c2.31 0 4.2-1.75 4.45-4H15V6h4V3h-7z" />
                        </svg>
                        <span>YouTube Studio</span>
                      </button>

                      <button className="w-full px-4 py-2 hover:bg-gray-100 flex items-center gap-3 text-sm text-left">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z" />
                        </svg>
                        <span>Purchases and memberships</span>
                      </button>
                    </div>

                    {/* Settings & Preferences */}
                    <div className="border-t border-gray-200 py-2">
                      <button className="w-full px-4 py-2 hover:bg-gray-100 flex items-center gap-3 text-sm text-left">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                        </svg>
                        <span>Your data in YouTube</span>
                      </button>

                      <button className="w-full px-4 py-2 hover:bg-gray-100 flex items-center gap-3 text-sm text-left">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z" />
                        </svg>
                        <span>Appearance: Device theme</span>
                        <ChevronDown className="w-4 h-4 ml-auto" />
                      </button>

                      <button className="w-full px-4 py-2 hover:bg-gray-100 flex items-center gap-3 text-sm text-left">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z" />
                        </svg>
                        <span>Language: English</span>
                        <ChevronDown className="w-4 h-4 ml-auto" />
                      </button>

                      <button className="w-full px-4 py-2 hover:bg-gray-100 flex items-center gap-3 text-sm text-left">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                        </svg>
                        <span>Location: India</span>
                        <ChevronDown className="w-4 h-4 ml-auto" />
                      </button>

                      <button className="w-full px-4 py-2 hover:bg-gray-100 flex items-center gap-3 text-sm text-left">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-5 14H4v-4h11v4zm0-5H4V9h11v4zm5 5h-4V9h4v9z" />
                        </svg>
                        <span>Keyboard shortcuts</span>
                      </button>
                    </div>

                    {/* Help & Support - DUPLICATE REMOVED */}
                    <div className="border-t border-gray-200 py-2">
                      <button className="w-full px-4 py-2 hover:bg-gray-100 flex items-center gap-3 text-sm text-left">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94L14.4 2.81c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
                        </svg>
                        <span>Settings</span>
                      </button>
                      <button className="w-full px-4 py-2 hover:bg-gray-100 flex items-center gap-3 text-sm text-left">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z" />
                        </svg>
                        <span>Help</span>
                      </button>
                      <button className="w-full px-4 py-2 hover:bg-gray-100 flex items-center gap-3 text-sm text-left">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 12h-2v-2h2v2zm0-4h-2V6h2v4z" />
                        </svg>
                        <span>Send feedback</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            // Sign In button
            <button onClick={() => setIsAuthModalOpen(true)} className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full flex gap-1.5 items-center">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-[#176AD7] flex items-center justify-center">
                <User className="w-4 h-4 sm:w-5 sm:h-5 text-[#176AD7]" />
              </div>
              <span className='text-[#176AD7]'>Sign In</span>
            </button>
          )}
        </div>
      </header>

      {/* Mobile Search Overlay */}
      {showMobileSearch && (
        <div className="md:hidden absolute inset-0 bg-white flex items-center px-2 gap-2 z-50">
          <button onClick={() => setShowMobileSearch(false)} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <SearchBar
              onSearch={(query) => {
                onSearch?.(query);
                setShowMobileSearch(false);
              }}
            />
          </div>
        </div>
      )}

      {/* Modals */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} initialMode="login" />
      <CreateChannelModal
        isOpen={isCreateChannelModalOpen}
        onClose={() => setIsCreateChannelModalOpen(false)}
        onSuccess={handleChannelCreated}
      />
    </>
  );
}

export default Header;