import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { Settings, Camera, Upload } from 'lucide-react';
import { updateAvatar, updateChannel } from '../../services/api';
import { useSubscription } from '../../hook/useSubscription';
import { updateUser } from '../../utils/AuthSlice';

function ChannelHeader({ channelData, onChannelUpdate }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Check user login status from redux
    const { isAuthenticated } = useSelector(state => state.auth);

    // Custom hook → handle subscribe / unsubscribe logic
    const { isSubscribed, subscriberCount, toggleSubscription } =
        useSubscription(channelData?.id, channelData?.subscribers);

    // Loading states
    const [loading, setLoading] = useState(false);
    const [uploadingBanner, setUploadingBanner] = useState(false);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);

    // Dropdown toggle for manage videos
    const [showManageDropdown, setShowManageDropdown] = useState(false);

    /* ------------------ Banner Upload ------------------ */
    const handleBannerUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Basic validation
        if (file.size > 5 * 1024 * 1024) return toast.error('Max 5MB allowed');
        if (!file.type.startsWith('image/')) return toast.error('Image only');

        setUploadingBanner(true);
        try {
            const formData = new FormData();
            formData.append('channelBanner', file);

            await updateChannel(channelData.id, formData);
            toast.success('Banner updated');

            onChannelUpdate?.(); // refresh channel data
        } catch (err) {
            toast.error(err.response?.data?.message || 'Banner update failed');
        } finally {
            setUploadingBanner(false);
        }
    };

    /* ------------------ Avatar Upload ------------------ */
    const handleAvatarUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) return toast.error('Max 5MB allowed');
        if (!file.type.startsWith('image/')) return toast.error('Image only');

        setUploadingAvatar(true);
        try {
            const formData = new FormData();
            formData.append('avatar', file);

            const res = await updateAvatar(formData);
            dispatch(updateUser(res.data)); // update redux user

            toast.success('Avatar updated');
            onChannelUpdate?.();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Avatar update failed');
        } finally {
            setUploadingAvatar(false);
        }
    };

    /* ------------------ Helpers ------------------ */
    // Format subscribers count (1.2K / 3.4M)
    const formatSubscribers = (count) => {
        if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
        if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
        return count;
    };

   /* ------------------ Subscribe Button ------------------ */
    const handleSubscribeClick = async () => {
        if (!isAuthenticated) return toast.error('Login required');

        setLoading(true);
        try {
            await toggleSubscription();
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {/* ================= Banner ================= */}
            <div className="h-32 sm:h-48 lg:h-64 relative overflow-hidden bg-gray-200 group">
                {channelData.banner && (
                    <img
                        src={channelData.banner?.url || channelData.banner}
                        alt="Banner"
                        className="w-full h-full object-cover"
                    />
                )}

                {/* Banner Upload (Owner only) */}
                {channelData.isOwner && (
                    <label className="absolute inset-0 flex items-center justify-center
                        bg-black/50 opacity-0 group-hover:opacity-100 cursor-pointer">

                        {uploadingBanner
                            ? <div className="animate-spin h-10 w-10 border-b-2 border-white rounded-full" />
                            : <Camera className="h-10 w-10 text-white" />
                        }

                        <input
                            type="file"
                            accept="image/*"
                            hidden
                            disabled={uploadingBanner}
                            onChange={handleBannerUpload}
                        />
                    </label>
                )}
            </div>

            {/* ================= Channel Info ================= */}
            <div className="px-4 sm:px-6 lg:px-16 py-6">
                <div className="flex flex-col sm:flex-row gap-4">

                    {/* Avatar */}
                    <div className="relative group">
                        <img
                            src={channelData.avatar?.url || channelData.avatar}
                            alt="Avatar"
                            className="w-24 h-24 rounded-full object-cover"
                        />

                        {channelData.isOwner && (
                            <label className="absolute inset-0 flex items-center justify-center
                                bg-black/60 opacity-0 group-hover:opacity-100
                                rounded-full cursor-pointer">

                                {uploadingAvatar
                                    ? <div className="animate-spin h-8 w-8 border-b-2 border-white rounded-full" />
                                    : <Camera className="text-white" />
                                }

                                <input
                                    type="file"
                                    accept="image/*"
                                    hidden
                                    disabled={uploadingAvatar}
                                    onChange={handleAvatarUpload}
                                />
                            </label>
                        )}
                    </div>

                    {/* Channel Details */}
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold">{channelData.name}</h1>

                        <p className="text-sm text-gray-600">
                            {channelData.handle} • {formatSubscribers(subscriberCount)} subscribers • {channelData.totalVideos} videos
                        </p>

                        {channelData.description && (
                            <p className="text-sm mt-2 text-gray-700 line-clamp-2">
                                {channelData.description}
                            </p>
                        )}
                    </div>

                    {/* Actions */}
                    {channelData.isOwner ? (
                        <div className="flex gap-2">
                            <button className="btn">
                                <Settings size={18} />
                                Customize
                            </button>

                            <button
                                onClick={() => navigate('/upload')}
                                className="btn"
                            >
                                <Upload size={18} />
                                Upload
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={handleSubscribeClick}
                            disabled={loading}
                            className={`px-6 py-2 rounded-full font-medium
                                ${isSubscribed ? 'bg-gray-200' : 'bg-black text-white'}`}
                        >
                            {loading ? 'Loading...' : isSubscribed ? 'Subscribed' : 'Subscribe'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ChannelHeader;