import { Mic, Search } from "lucide-react";
import { React, useState } from "react";

function SearchBar() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    console.log('Searching for:', searchQuery);
    // API call yaha hogi
  };

  return (
    <div className="flex items-center flex-1 max-w-2xl mx-4">
      <div className="flex items-center w-full">
        <div className="flex items-center flex-1 border border-gray-300 rounded-l-full px-4 py-2">
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full outline-none"
          />
        </div>
        <button 
          onClick={handleSearch}
          className="px-6 py-2.5 bg-gray-50 border border-l-0 border-gray-300 rounded-r-full hover:bg-gray-100"
        >
          <Search className="w-5 h-5" />
        </button>
      </div>
      <button className="ml-4 p-2 hover:bg-gray-100 rounded-full">
        <Mic className="w-5 h-5" />
      </button>
    </div>
  );
};

export default SearchBar