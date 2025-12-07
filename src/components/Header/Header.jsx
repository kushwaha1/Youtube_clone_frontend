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
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector(state => state.auth);

  // Modal & dropdown states
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCreateChannelModalOpen, setIsCreateChannelModalOpen] = useState(false);

  // User's channel info
  const [userChannel, setUserChannel] = useState(null);

  // Mobile search overlay
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  // Fetch user's channel if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchUserChannel();
    } else {
      setUserChannel(null);
    }
  }, [isAuthenticated]);

  const fetchUserChannel = async () => {
    try {
      const response = await getMyChannel();
      setUserChannel(response.channel || null);
    } catch {
      setUserChannel(null); // User has no channel yet
    }
  };

  // Logout user
  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    setIsDropdownOpen(false);
    setUserChannel(null);
  };

  // Handle channel view or creation
  const handleViewChannel = () => {
    if (userChannel) {
      navigate(`/channel/${userChannel.id}`);
    } else {
      setIsCreateChannelModalOpen(true);
    }
    setIsDropdownOpen(false);
  };

  // Update state after channel creation
  const handleChannelCreated = (newChannel) => {
    setIsCreateChannelModalOpen(false);
    setUserChannel(newChannel);
    toast.success('Channel created successfully!');
    navigate(`/channel/${newChannel.id}`);
  };

  return (
    <>
      {/* Header */}
      <header className="flex items-center justify-between px-2 sm:px-4 py-2 bg-white fixed top-0 left-0 right-0 z-50 h-14">
        
        {/* LEFT: Menu & Logo */}
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

        {/* CENTER: Desktop Search */}
        <div className="hidden md:flex flex-1 justify-center">
          <SearchBar onSearch={onSearch} />
        </div>

        {/* RIGHT: Icons, Profile & Mobile Search */}
        <div className="flex items-center gap-1 sm:gap-2">

          {/* Mobile Search Button */}
          <button onClick={() => setShowMobileSearch(true)} className="md:hidden p-2">
            <Search className="w-5 h-5" />
          </button>

          {/* Authenticated Icons */}
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

          {/* Profile / Sign In */}
          {isAuthenticated ? (
            <div className="relative">
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
                  {/* Overlay to close dropdown */}
                  <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)}></div>

                  <div className="absolute right-0 top-12 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50">
                    
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gray-200">
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

                    {/* Menu Actions */}
                    <div className="py-2">
                      <button className="w-full px-4 py-2 hover:bg-gray-100 flex items-center gap-3 text-sm">
                        Google Account
                      </button>
                      <button className="w-full px-4 py-2 hover:bg-gray-100 flex items-center gap-3 text-sm">
                        Switch account <ChevronDown className="w-4 h-4 ml-auto" />
                      </button>
                      <button onClick={handleLogout} className="w-full px-4 py-2 hover:bg-gray-100 flex items-center gap-3 text-sm">
                        Sign out
                      </button>
                    </div>

                    {/* Settings / Help / Feedback */}
                    <div className="border-t border-gray-200 py-2">
                      <button className="w-full px-4 py-2 hover:bg-gray-100 flex items-center gap-3 text-sm">Settings</button>
                      <button className="w-full px-4 py-2 hover:bg-gray-100 flex items-center gap-3 text-sm">Help</button>
                      <button className="w-full px-4 py-2 hover:bg-gray-100 flex items-center gap-3 text-sm">Send feedback</button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            // Sign In Button
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

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} initialMode="login" />

      {/* Create Channel Modal */}
      <CreateChannelModal
        isOpen={isCreateChannelModalOpen}
        onClose={() => setIsCreateChannelModalOpen(false)}
        onSuccess={handleChannelCreated}
      />
    </>
  );
}

export default Header;