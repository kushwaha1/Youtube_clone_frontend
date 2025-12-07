import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

// Components
import Header from '../../components/Header/Header';
import Sidebar from '../../components/Sidebar/Sidebar';
import ChannelHeader from '../../components/Channel/ChannelHeader';
import ChannelTabs from '../../components/Channel/ChannelTabs';
import ChannelVideos from '../../components/Channel/ChannelVideos';

// API
import { getChannelById } from '../../services/api';

/**
 * 
 * Displays a full channel view including:
 * - Channel header
 * - Channel tabs (Home, Videos, Shorts, etc.)
 * - Channel videos (based on selected tab)
 */
function Channel() {
    const { channelId } = useParams(); // Get channelId from route
    const navigate = useNavigate();
    const { isAuthenticated, user } = useSelector(state => state.auth); // Auth state from Redux

    // Sidebar state
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Channel data
    const [channelData, setChannelData] = useState(null);

    // Loading state
    const [loading, setLoading] = useState(true);

    // Active tab state (Home, Videos, Shorts, etc.)
    const [activeTab, setActiveTab] = useState('home');

    /**
     * Fetch channel data whenever channelId changes
     */
    useEffect(() => {
        fetchChannelData();
    }, [channelId]);

    /**
     * Fetch channel information from API
     */
    const fetchChannelData = async () => {
        try {
            setLoading(true);

            const response = await getChannelById(channelId);
            const channel = response.channel;

            // Format channel data for frontend use
            const formattedChannel = {
                id: channel.id,
                name: channel.channelName,
                handle: `@${channel.owner?.userName || channel.owner?.name || 'user'}`,
                subscribers: channel.subscribers || 0,
                totalVideos: channel.videos?.length || 0,
                description: channel.description || 'No description',

                // Cloudinary URLs or direct fallback
                banner: channel?.channelBanner ?? channel?.channelBanner?.url,
                avatar: channel?.owner?.avatar ?? channel?.owner?.avatar?.url,

                // Determine if current user is channel owner
                isOwner: user?.id === channel.owner?.id,
                owner: channel.owner
            };

            setChannelData(formattedChannel);
        } catch (error) {
            // Handle API errors gracefully
            toast.error(error.response?.data?.message || 'Failed to load channel');
            navigate('/'); // Redirect to home if channel fetch fails
        } finally {
            setLoading(false);
        }
    };

    // Show loading state while fetching channel data
    if (loading) {
        return (
            <div className="min-h-screen bg-white">
                <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
                <div className="flex pt-14">
                    <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                    <main className="flex-1 lg:ml-20 flex items-center justify-center">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                            <p className="text-gray-600">Loading channel...</p>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    // Main channel layout
    return (
        <div className="min-h-screen bg-white">
            {/* Header with sidebar toggle */}
            <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

            <div className="flex pt-14">
                {/* Sidebar */}
                <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

                {/* Main content */}
                <main className="flex-1 lg:ml-20">
                    {channelData && (
                        <>
                            {/* Channel header (banner, avatar, name, stats) */}
                            <ChannelHeader 
                                channelData={channelData}
                                onChannelUpdate={fetchChannelData} // Refresh channel on update
                            />

                            {/* Tabs navigation (Home, Videos, Shorts, etc.) */}
                            <ChannelTabs 
                                activeTab={activeTab} 
                                setActiveTab={setActiveTab}
                            />

                            {/* Channel videos list based on active tab */}
                            <ChannelVideos 
                                channelId={channelId} 
                                activeTab={activeTab}
                                isOwner={channelData.isOwner}
                            />
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}

export default Channel;