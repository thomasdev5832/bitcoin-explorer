import { useState } from "react";
import btcLogo from "../../../assets/btc.svg";
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
        <div className="bg-zinc-950 py-4 mt-4 shadow-sm">
            <div className="max-w-[1280px] mx-auto px-2 py-2 border-2 border-gray-600 text-gray-600 bg-zinc-950 hover:border-gray-500  rounded  flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-0 transition">
                <div className="flex flex-row">
                    <img
                        src={btcLogo}
                        alt="Logo"
                        className="w-8 ml-2 object-contain"
                    />
                    <input
                        type="text"
                        placeholder="Search by block, transaction, hash, or address"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="w-full sm:w-[500px] px-4 py-2 caret-orange-400  text-gray-600 bg-zinc-950 focus:outline-none focus:text-white transition"
                    />
                </div>
                <button
                    onClick={handleSearch}
                    className="w-full sm:w-auto flex items-center justify-center px-4 py-2 border-2 bg-zinc-950 border-gray-500 text-gray-400 font-bold hover:border-orange-400 hover:text-orange-400 rounded transition"
                >
                    <FaSearch size={16} />
                </button>
            </div>
        </div>
    );
}
