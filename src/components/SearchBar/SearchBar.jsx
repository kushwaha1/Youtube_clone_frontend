import { Mic, Search, X } from "lucide-react";
import { useState, useEffect } from "react";

function SearchBar({ onSearch }) {
  const [searchQuery, setSearchQuery] = useState('');

  /**
   * Debounce effect: triggers search only after user stops typing for 500ms
   * Helps reduce unnecessary API calls or filtering on every keystroke
   */
  useEffect(() => {
    if (!searchQuery.trim()) return; // Don't search if query is empty

    const delaySearch = setTimeout(() => {
      if (onSearch) {
        onSearch(searchQuery.trim()); // Call search function passed via props
      }
    }, 500); // 500ms delay

    // Cleanup previous timeout if user types again within 500ms
    return () => clearTimeout(delaySearch);
  }, [searchQuery, onSearch]);

  /**
   * Handle search immediately on pressing search button or Enter key
   */
  const handleSearch = () => {
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery && onSearch) {
      onSearch(trimmedQuery);
    }
  };

  /**
   * Clear search input and reset search results
   */
  const handleClear = () => {
    setSearchQuery('');       // Reset input field
    if (onSearch) onSearch(''); // Reset search results (show all)
  };

  return (
    <div className="flex items-center flex-1 max-w-xl mx-2 sm:mx-4">
      <div className="flex items-center w-full max-w-xl">
        {/* Search input container */}
        <div className="flex items-center flex-1 border border-gray-300 rounded-l-full px-3 sm:px-4 py-1.5 sm:py-2 relative">
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()} // Enter key triggers search
            className="w-full outline-none text-sm sm:text-base pr-8"
          />

          {/* Clear input button */}
          {searchQuery && (
            <button
              onClick={handleClear}
              className="absolute right-2 p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          )}
        </div>

        {/* Search button */}
        <button
          onClick={handleSearch}
          className="px-4 sm:px-6 py-2 sm:py-2.5 bg-gray-50 border border-l-0 border-gray-300 rounded-r-full hover:bg-gray-100 transition-colors"
        >
          <Search className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>

      {/* Microphone button (optional voice search) */}
      <button className="ml-2 sm:ml-4 p-2 hover:bg-gray-100 rounded-full hidden sm:block">
        <Mic className="w-5 h-5" />
      </button>
    </div>
  );
}

export default SearchBar;