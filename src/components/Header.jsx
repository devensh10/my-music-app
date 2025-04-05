import React, { useRef, useState } from "react";
import { Play, Pause, LogOut, LogIn, Volume2, Search, Sun, Moon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useDarkMode from "./Hooks/useDarkMode";
import useSearch from "./Hooks/useSearch";

const Hearder = () => {
    const [darkMode, toggleDarkMode] = useDarkMode();
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("isAuthenticated"));
    const { searchQuery, updateSearchQuery } = useSearch();
    const navigate = useNavigate();
    const audioRef = useRef(new Audio());

    ///login logoout
    const handleAuthentication = () => {
        if (isAuthenticated) {
            localStorage.removeItem("isAuthenticated");
            setIsAuthenticated(false);
            audioRef.current.pause();
        } else {
            navigate("/login");
        }
    };

    return (
        <header className="sticky top-0 z-20 backdrop-blur-md bg-opacity-90 px-6 py-4 shadow-md flex justify-between items-center flex-wrap md:flex-nowrap">
            <div className="flex items-center w-full md:w-auto justify-between md:justify-start">
                <h1 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-yellow-400 to-pink-500 bg-clip-text text-transparent">
                    🎵 Music Hub
                </h1>

                <button
                    onClick={toggleDarkMode}
                    className="p-2 bg-gray-700 rounded-full hover:bg-gray-600 md:hidden"
                >
                    {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                </button>
            </div>

            <div className="flex items-center space-x-3 w-full md:w-auto mt-4 md:mt-0">
                <div className="relative w-full md:w-64">
                    <input
                        type="text"
                        placeholder="Search songs..."
                        value={searchQuery}
                        onChange={(e) => updateSearchQuery(e.target.value)}
                        className="px-4 py-2 pl-10 pr-12 rounded-full bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 w-full"
                    />
                    <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
                </div>

                <button
                    onClick={toggleDarkMode}
                    className="p-2 bg-gray-700 rounded-full hover:bg-gray-600 hidden md:block"
                >
                    {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                </button>

                <button
                    onClick={handleAuthentication}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg flex items-center gap-2 font-semibold transition-colors text-sm md:text-base"
                >
                    {isAuthenticated ? <LogOut size={18} /> : <LogIn size={18} />}
                    {isAuthenticated ? "Logout" : "Login"}
                </button>
            </div>
        </header>
    );
};

export default Hearder;
