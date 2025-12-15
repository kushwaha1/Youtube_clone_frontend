import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { Settings, Camera, Upload } from 'lucide-react';
import { updateAvatar, updateChannel } from '../../services/api';
import { useSubscription } from '../../hook/useSubscription';
import { updateUser } from '../../utils/authSlice';

function ChannelHeader({ channelData, onChannelUpdate }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Check user login status from redux
    const { isAuthenticated } = useSelector(state => state.auth);

    // Subscription hook
    const { isSubscribed, subscriberCount, toggleSubscription } = useSubscription(channelData?.id, channelData?.subscribers);

    // Loading states
    const [loading, setLoading] = useState(false);

    // Upload states
    const [uploadingBanner, setUploadingBanner] = useState(false);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);

    // Manage dropdown state
    const [showManageDropdown, setShowManageDropdown] = useState(false);

    /* ------------------ Banner Upload ------------------ */
    const handleBannerUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) return toast.error('Image size should be less than 5MB');
        if (!file.type.startsWith('image/')) return toast.error('Please upload an image file');

        setUploadingBanner(true);
        try {
            const formData = new FormData();
            formData.append('channelBanner', file);
            await updateChannel(channelData.id, formData);
            toast.success('Banner updated successfully!');
            if(onChannelUpdate) {
                onChannelUpdate();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update banner');
        } finally {
            setUploadingBanner(false);
        }
    };

    /* ------------------ Avatar Upload ------------------ */
    const handleAvatarUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) return toast.error('Image size should be less than 5MB');
        if (!file.type.startsWith('image/')) return toast.error('Please upload an image file');

        setUploadingAvatar(true);
        try {
            const formData = new FormData();
            formData.append('avatar', file);

            const res = await updateAvatar(formData);
            dispatch(updateUser(res.data)); // update redux user

            toast.success('Avatar updated successfully!');
            if(onChannelUpdate) {
                onChannelUpdate();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update avatar');
        } finally {
            setUploadingAvatar(false);
        }
    };

    // Format subscriber count
    const formatSubscribers = (count) => {
        if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
        if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
        return count.toString();
    };

    // Handle subscribe button click with loading
    const handleSubscribeClick = async () => {
        if (!isAuthenticated) {
            return toast.error('Please login to subscribe');
        }
        setLoading(true);
        try {
            await toggleSubscription();
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {/* Channel Banner */}
            <div className="h-32 sm:h-48 lg:h-64 relative overflow-hidden bg-gradient-to-r from-gray-200 to-gray-300 group">
                {(channelData.banner || channelData.banner?.url) && (
                    <img
                        src={channelData.banner?.url || channelData.banner}
                        alt="Channel Banner"
                        loading="lazy"
                        className="w-full h-full object-cover"
                        onError={(e) => e.currentTarget.style.display = "none"}
                    />
                )}
                {channelData.isOwner && (
                    <label className="absolute inset-0 flex items-center justify-center bg-black opacity-0 group-hover:opacity-50 transition-all duration-300 cursor-pointer">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center gap-2">
                            {uploadingBanner ? (
                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white"></div>
                            ) : (
                                <>
                                    <Camera className="w-12 h-12 text-white" />
                                    <span className="text-white font-medium">Update Banner</span>
                                </>
                            )}
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleBannerUpload}
                            disabled={uploadingBanner}
                            className="hidden"
                        />
                    </label>
                )}
            </div>

            {/* Channel Info Section */}
            <div className="px-4 sm:px-6 lg:px-16 py-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    {/* Channel Avatar */}
                    <div className="flex-shrink-0 relative group">
                        {channelData.avatar ? (
                            <img
                                src={channelData.avatar?.url || channelData.avatar}
                                alt={channelData.name}
                                loading="lazy"
                                className="w-20 h-20 sm:w-32 sm:h-32 rounded-full object-cover"
                                onError={(e) => e.currentTarget.style.display = "none"}
                            />
                        ) : (
                            <div className="w-20 h-20 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-3xl">
                                {channelData?.name?.substring(0, 2).toUpperCase()}
                            </div>
                        )}
                        {channelData.isOwner && (
                            <label className="absolute inset-0 flex items-center justify-center bg-black opacity-0 hover:opacity-60 rounded-full transition-all duration-300 cursor-pointer">
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    {uploadingAvatar ? (
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                                    ) : (
                                        <Camera className="w-8 h-8 text-white" />
                                    )}
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarUpload}
                                    disabled={uploadingAvatar}
                                    className="hidden"
                                />
                            </label>
                        )}
                    </div>

                    {/* Channel Details */}
                    <div className="flex-1 min-w-0">
                        <h1 className="text-2xl sm:text-3xl font-bold">{channelData.name}</h1>
                        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mt-1">
                            <span>{channelData.handle}</span>
                            <span>•</span>
                            <span>{formatSubscribers(subscriberCount)} subscribers</span>
                            <span>•</span>
                            <span>{channelData.totalVideos} videos</span>
                        </div>

                        {channelData.description && channelData.description !== 'No description' && (
                            <p className="text-sm text-gray-700 mt-2 line-clamp-2">
                                {channelData.description}
                            </p>
                        )}

                        {channelData.links && channelData.links.length > 0 && (
                            <div className="flex gap-2 mt-2">
                                {channelData.links.map((link, index) => (
                                    <a
                                        key={index}
                                        href={`https://${link}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-blue-600 hover:underline"
                                    >
                                        {link}
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 flex-shrink-0">
                        {channelData.isOwner ? (
                            <>
                                <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full font-medium transition-colors">
                                    <Settings className="w-5 h-5" />
                                    <span className="hidden sm:inline">Customize</span>
                                </button>

                                <div className="relative">
                                    <button
                                        onClick={() => setShowManageDropdown(!showManageDropdown)}
                                        className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full font-medium transition-colors"
                                    >
                                        <span className="hidden sm:inline">Manage videos</span>
                                        <span className="sm:hidden">Manage</span>
                                    </button>

                                    {showManageDropdown && (
                                        <>
                                            <div className="fixed inset-0 z-40" onClick={() => setShowManageDropdown(false)}></div>
                                            <div className="absolute right-0 left-0 mt-2 bg-white shadow-xl rounded-lg py-1 z-50 w-44 sm:w-48">
                                                <button
                                                    onClick={() => {
                                                        navigate('/upload');
                                                        setShowManageDropdown(false);
                                                    }}
                                                    className="w-full px-4 sm:px-2 py-2.5 text-left text-sm hover:bg-gray-100 flex items-center gap-2 transition-colors"
                                                >
                                                    <Upload className="w-4 h-4 flex-shrink-0" />
                                                    <span className="whitespace-nowrap">Upload video</span>
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </>
                        ) : (
                            <button
                                onClick={handleSubscribeClick}
                                disabled={loading}
                                className={`px-6 py-2 rounded-full font-medium transition-colors disabled:opacity-50 ${isSubscribed
                                    ? 'bg-gray-100 hover:bg-gray-200 text-black'
                                    : 'bg-black hover:bg-gray-800 text-white'
                                    }`}
                            >
                                {loading ? 'Loading...' : isSubscribed ? 'Subscribed' : 'Subscribe'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChannelHeader;