import { useState } from "react";
import { FaSearch } from "react-icons/fa";

interface SearchBarProps {
    onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
    const [query, setQuery] = useState("");

    const handleSearch = () => {
        if (query.trim()) {
            onSearch(query);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    return (
        <div className="bg-zinc-950 py-4 shadow-sm">
            <div className="max-w-[1280px] mx-auto text-gray-600 bg-zinc-950 hover:border-gray-500  rounded  flex flex-row sm:flex-row items-center transition">
                <input
                    type="text"
                    placeholder="Enter an address, block height, or tx hash"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full sm:w-[550px] px-2 py-2 caret-orange-500  text-gray-600 bg-zinc-950 border-orange-500 border-2 focus:outline-none focus:text-white transition rounded"
                />
                <button
                    onClick={handleSearch}
                    className="flex items-center justify-center px-4 py-3 -ml-2 border-2 bg-orange-500 border-orange-500 text-gray-900 font-bold hover:bg-orange-600 hover:border-orange-600 rounded transition"
                >
                    <FaSearch size={16} />
                </button>
            </div>
        </div>
    );
}
