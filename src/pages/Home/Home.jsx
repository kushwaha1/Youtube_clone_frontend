import { React, useState } from "react";
import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";
import VideoGrid from "../../components/VideoGrid/VideoGrid";

function Home() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const isUserSignedIn = false; // Add this line

    // Ye data backend se aayega
    const videos = [
        { id: 1, title: "Building a Modern Web App with React", channel: "Tech Academy", views: "1.2M", time: "3 days ago", duration: "15:23", thumbnail: "bg-gradient-to-br from-blue-400 to-purple-500" },
        { id: 2, title: "10 JavaScript Tips Every Developer Should Know", channel: "Code Master", views: "890K", time: "1 week ago", duration: "12:45", thumbnail: "bg-gradient-to-br from-green-400 to-blue-500" },
        { id: 3, title: "CSS Grid vs Flexbox: Complete Guide", channel: "Design Pro", views: "2.1M", time: "2 days ago", duration: "20:15", thumbnail: "bg-gradient-to-br from-pink-400 to-red-500" },
        { id: 4, title: "React Hooks Explained in 30 Minutes", channel: "Quick Learn", views: "1.5M", time: "5 days ago", duration: "28:30", thumbnail: "bg-gradient-to-br from-yellow-400 to-orange-500" },
        { id: 5, title: "Full Stack Development Roadmap 2024", channel: "Career Path", views: "3.2M", time: "1 day ago", duration: "45:12", thumbnail: "bg-gradient-to-br from-indigo-400 to-purple-500" },
        { id: 6, title: "TypeScript Tutorial for Beginners", channel: "Learn Fast", views: "750K", time: "4 days ago", duration: "18:40", thumbnail: "bg-gradient-to-br from-cyan-400 to-blue-500" },
        { id: 7, title: "Node.js Best Practices 2024", channel: "Backend Guru", views: "1.8M", time: "6 days ago", duration: "32:55", thumbnail: "bg-gradient-to-br from-lime-400 to-green-500" },
        { id: 8, title: "UI/UX Design Principles", channel: "Creative Mind", views: "920K", time: "2 days ago", duration: "25:18", thumbnail: "bg-gradient-to-br from-rose-400 to-pink-500" },
        { id: 9, title: "Docker Complete Guide", channel: "DevOps Daily", views: "1.1M", time: "1 week ago", duration: "38:22", thumbnail: "bg-gradient-to-br from-teal-400 to-cyan-500" },
        { id: 10, title: "API Design Best Practices", channel: "Tech Talks", views: "680K", time: "3 days ago", duration: "22:10", thumbnail: "bg-gradient-to-br from-violet-400 to-purple-500" },
        { id: 11, title: "Git and GitHub Masterclass", channel: "Code Academy", views: "2.5M", time: "5 days ago", duration: "41:33", thumbnail: "bg-gradient-to-br from-orange-400 to-red-500" },
        { id: 12, title: "MongoDB Crash Course", channel: "Database Pro", views: "1.3M", time: "4 days ago", duration: "35:45", thumbnail: "bg-gradient-to-br from-emerald-400 to-teal-500" },
    ];

    const categories = ["All", "JavaScript", "React", "CSS", "Node.js", "TypeScript", "Web Development", "Tutorial", "Live", "Music", "Gaming", "News"];

    return (
        <div className="min-h-screen bg-white">
            <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

            <div className="pt-14">
                <Sidebar isOpen={sidebarOpen} />

                <main className="lg:ml-20 pr-2">
                    {/* Categories */}
                    {isUserSignedIn && (
                        <div className="sticky top-14 bg-white border-b border-gray-200 px-4 lg:px-6 py-3 overflow-x-auto z-20">
                            <div className="flex gap-3 w-max">
                                {categories.map((cat, i) => (
                                    <button
                                        key={i}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${i === 0 ? 'bg-black text-white' : 'bg-gray-100 hover:bg-gray-200'
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Show message if not signed in, otherwise show videos */}
                    {!isUserSignedIn ? (
                        <div className="flex items-center justify-center h-[calc(100vh-400px)] px-4">
                            <div className="
                                bg-white 
                                rounded-xl 
                                shadow-[0_4px_16px_rgba(0,0,0,0.12)]
                                px-10 
                                py-8 
                                max-w-2xl 
                                w-full
                                text-center
                                "
                            >
                                <h2 className="text-2xl font-semibold mb-2 text-black">
                                    Try searching to get started
                                </h2>

                                <p className="text-gray-600">
                                    Start watching videos to help us build a feed of videos that you'll love.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <VideoGrid videos={videos} />
                    )}
                </main>
            </div>
        </div>
    );
};

export default Home