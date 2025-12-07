import React from 'react';

/**
 * 
 * Renders a horizontal tab navigation for a channel page.
 * Highlights the active tab and allows switching tabs via `setActiveTab`.
 * 
 * Props:
 * - activeTab: string, currently active tab id
 * - setActiveTab: function, updates the active tab
 */
function ChannelTabs({ activeTab, setActiveTab }) {
    // Define the available tabs with id and label
    const tabs = [
        { id: 'home', label: 'Home' },
        { id: 'videos', label: 'Videos' },
        { id: 'shorts', label: 'Shorts' },
        { id: 'live', label: 'Live' },
        { id: 'playlists', label: 'Playlists' },
        { id: 'community', label: 'Community' }
    ];

    return (
        // Container with bottom border
        <div className="border-b border-gray-200 px-4 sm:px-6 lg:px-16">
            {/* Tabs row with horizontal scroll for smaller screens */}
            <div className="flex gap-6 overflow-x-auto scrollbar-hide">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`
                            py-3 px-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors
                            ${activeTab === tab.id
                                ? 'border-black text-black' // Active tab styling
                                : 'border-transparent text-gray-600 hover:text-black' // Inactive tab styling
                            }
                        `}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default ChannelTabs;