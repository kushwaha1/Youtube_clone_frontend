import React, { useState, useEffect } from "react";
import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";
import VideoGrid from "../../components/VideoGrid/VideoGrid";
import { getAllVideos, searchVideos, getVideosByCategory } from "../../services/api";

/**
 * Home Component
 * Main landing page for displaying videos with category filtering and search functionality
 */
function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false); // Sidebar toggle
  const [videos, setVideos] = useState([]);             // Videos to display
  const [loading, setLoading] = useState(false);        // Loading state
  const [selectedCategory, setSelectedCategory] = useState("All"); // Currently selected category
  const [searchQuery, setSearchQuery] = useState("");   // Search query

  // Predefined categories for filtering
  const categories = [
    "All",
    "JavaScript",
    "React",
    "CSS",
    "Node.js",
    "TypeScript",
    "Web Development",
    "Tutorial",
    "Live",
    "Music",
    "Gaming",
    "News",
  ];

  /**
   * Fetch videos whenever category or search query changes
   */
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);

        // Priority 1: Search query
        if (searchQuery.trim()) {
          const data = await searchVideos(searchQuery);
          setVideos(data || []);
        } 
        // Priority 2: Category filter (excluding "All")
        else if (selectedCategory && selectedCategory !== "All") {
          const data = await getVideosByCategory(selectedCategory);
          setVideos(data || []);
        } 
        // Priority 3: Default - fetch all videos
        else {
          const data = await getAllVideos();
          setVideos(data || []);
        }
      } catch (err) {
        console.error("Error fetching videos:", err);
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [selectedCategory, searchQuery]);

  /**
   * Handle category button click
   * @param {string} category 
   */
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setSearchQuery(""); // Clear search when category changes
  };

  /**
   * Handle search from Header component
   * @param {string} query 
   */
  const handleSearch = (query) => {
    if (!query || query.trim() === "") {
      // Reset to default if search cleared
      setSearchQuery("");
      setSelectedCategory("All");
    } else {
      setSearchQuery(query.trim());
      setSelectedCategory(""); // Deselect category when searching
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header 
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        onSearch={handleSearch}
      />

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="lg:ml-20 pt-18">
        {/* Category Filter Bar */}
        <div className="sticky top-14 bg-white border-b border-gray-200 px-4 lg:px-6 py-3 overflow-x-auto z-20">
          <div className="flex gap-3 w-max">
            {categories.map((cat, i) => (
              <button
                key={i}
                onClick={() => handleCategoryClick(cat)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? "bg-black text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : videos.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20">
            <svg
              className="w-24 h-24 text-gray-300 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            <p className="text-gray-600 text-lg">
              {searchQuery
                ? `No videos found for "${searchQuery}"`
                : `No videos found in ${selectedCategory}`}
            </p>
          </div>
        ) : (
          /* Videos Grid */
          <VideoGrid videos={videos} />
        )}
      </main>
    </div>
  );
}

export default Home;