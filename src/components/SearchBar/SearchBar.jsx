import { Mic, Search } from "lucide-react";
import { React, useState } from "react";

function SearchBar() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    console.log('Searching for:', searchQuery);
    // API call yaha hogi
  };

  return (
    <div className="flex items-center flex-1 max-w-xl mx-2 sm:mx-4">
      <div className="flex items-center w-full">
        <div className="flex items-center flex-1 border border-gray-300 rounded-l-full px-3 sm:px-4 py-1.5 sm:py-2">
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full outline-none text-sm sm:text-base"
          />
        </div>
        <button 
          onClick={handleSearch}
          className="px-4 sm:px-6 py-1.5 sm:py-2.5 bg-gray-50 border border-l-0 border-gray-300 rounded-r-full hover:bg-gray-100"
        >
          <Search className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
      <button className="ml-2 sm:ml-4 p-2 hover:bg-gray-100 rounded-full hidden sm:block">
        <Mic className="w-5 h-5" />
      </button>
    </div>
  );
};

export default SearchBar