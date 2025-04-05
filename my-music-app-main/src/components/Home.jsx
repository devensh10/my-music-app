import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { Play, Pause, LogOut, LogIn, Volume2, Search, Heart, PlusCircle, Sun, Moon, X, Check } from "lucide-react";
import Hearder from "./Header";

import useDarkMode from "./Hooks/useDarkMode";
import useSearch from "./Hooks/useSearch";

const Home = () => {


    const [currentSong, setCurrentSong] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("isAuthenticated"));
    const [volume, setVolume] = useState(0.5);
    const [progress, setProgress] = useState(0);

    const [favorites, setFavorites] = useState([]);
    const [playlists, setPlaylists] = useState({
        "My Favorites": [],
        "Workout Mix": [],
        "Chill Vibes": []
    });
    const [darkMode, toggleDarkMode] = useDarkMode();
    const [showPlaylistMenu, setShowPlaylistMenu] = useState(null);
    const [newPlaylistName, setNewPlaylistName] = useState("");
    const [showNewPlaylistInput, setShowNewPlaylistInput] = useState(false);

    const navigate = useNavigate();
    const audioRef = useRef(new Audio());
    const playlistMenuRef = useRef(null);
    const { searchQuery, updateSearchQuery, songs, loading, error } = useSearch();


    useEffect(() => {
        updateSearchQuery(searchQuery);
    }, []);


    useEffect(() => {
        const updateProgress = () => {
            if (audioRef.current && currentSong) {
                setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
            }

        };

        audioRef.current.addEventListener("timeupdate", updateProgress);


        audioRef.current.volume = volume;

        return () => {
            audioRef.current.removeEventListener("timeupdate", updateProgress);
        };
    }, [currentSong, volume]);


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (playlistMenuRef.current && !playlistMenuRef.current.contains(event.target)) {
                setShowPlaylistMenu(null);
                setShowNewPlaylistInput(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    //quality select
    const getBestQualityUrl = (downloadUrls) => {
        return downloadUrls?.at(-1)?.url || downloadUrls?.[0]?.url || null;
    };

    // Play/pause
    const handlePlayPause = (song) => {
        if (!isAuthenticated) {
            navigate("/login");
            return;
        }

        const songUrl = getBestQualityUrl(song.downloadUrl);
        if (!songUrl) return console.error("No valid audio URL found!");

        if (currentSong === song.id) {
            isPlaying ? audioRef.current.pause() : audioRef.current.play();
            setIsPlaying(!isPlaying);
        } else {
            audioRef.current.src = songUrl;
            audioRef.current.load();
            audioRef.current.play();
            setCurrentSong(song.id);
            setIsPlaying(true);
        }
    };

    // Favorites songs
    const toggleFavorite = (song) => {
        setFavorites((prev) =>
            prev.some(fav => fav.id === song.id)
                ? prev.filter(fav => fav.id !== song.id)
                : [...prev, song]
        );
    };

    const removeFromFavorites = (songId) => {
        setFavorites((prev) => prev.filter(song => song.id !== songId));
    };

    // Playlist songs
    const addToPlaylist = (song, playlistName) => {
        setPlaylists((prev) => {

            const exists = prev[playlistName]?.some(s => s.id === song.id);

            if (exists) {
                return prev;
            }

            return {
                ...prev,
                [playlistName]: prev[playlistName] ? [...prev[playlistName], song] : [song]
            };
        });


        console.log(`Added "${song.name}" to "${playlistName}"`);


        setShowPlaylistMenu(null);
    };

    const createNewPlaylist = () => {
        if (!newPlaylistName.trim()) return;

        setPlaylists(prev => ({
            ...prev,
            [newPlaylistName]: []
        }));

        if (showPlaylistMenu) {
            const song = songs.find(s => s.id === showPlaylistMenu);
            if (song) {
                addToPlaylist(song, newPlaylistName);
            }
        }

        setNewPlaylistName("");
        setShowNewPlaylistInput(false);
    };

    const removeFromPlaylist = (songId, playlistName) => {
        setPlaylists(prev => ({
            ...prev,
            [playlistName]: prev[playlistName].filter(song => song.id !== songId)
        }));
    };

    const deletePlaylist = (playlistName) => {
        setPlaylists(prev => {
            const newPlaylists = { ...prev };
            delete newPlaylists[playlistName];
            return newPlaylists;
        });
    };

    // login logout
    const handleAuthentication = () => {
        if (isAuthenticated) {
            localStorage.removeItem("isAuthenticated");
            setIsAuthenticated(false);
            audioRef.current.pause();
            setCurrentSong(null);
            setIsPlaying(false);
        } else {
            navigate("/login");
        }
    };

    // Volume 
    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        audioRef.current.volume = newVolume;
    };

    // Toggle playlist  
    const togglePlaylistMenu = (songId) => {
        setShowPlaylistMenu(prev => prev === songId ? null : songId);
        setShowNewPlaylistInput(false);
    };

    return (
        <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"} min-h-screen font-sans transition-colors duration-300`}>
            {/*---------------------- Header --------------------------*/}
            <Hearder />



            <main className="px-6 py-8">
                {/* -------------------Song  card-------------------- */}
                <section className="mb-10">
                    <h2 className="text-2xl font-bold mb-4">Discover Music</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {loading
                            ? [...Array(6)].map((_, index) => (
                                <div
                                    key={index}
                                    className={`flex flex-col ${darkMode ? "bg-black" : "bg-white"} rounded-xl overflow-hidden shadow-lg animate-pulse`}
                                >
                                    <div className="w-full h-48 bg-gray-300 dark:bg-gray-700"></div>
                                    <div className="p-4 flex-1">
                                        <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                                        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
                                    </div>
                                </div>
                            ))
                            : songs.map((song) => (
                                <div
                                    key={song.id}
                                    className={`flex flex-col ${darkMode ? 'bg-black' : 'bg-white'} rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition duration-300 group`}
                                >
                                    <div className="relative">
                                        <img
                                            src={song.image?.[2]?.url || '/placeholder.jpg'}
                                            alt={song.name}
                                            className="w-full h-48 object-cover object-top transition-transform duration-500 group-hover:scale-105"
                                        />

                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <button
                                                onClick={() => handlePlayPause(song)}
                                                className="p-4 bg-green-600 hover:bg-green-500 rounded-full shadow-lg transform transition-transform duration-300 hover:scale-110"
                                            >
                                                {currentSong === song.id && isPlaying ? <Pause size={24} /> : <Play size={24} />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="p-4 flex-1 flex flex-col">
                                        <h3 className="text-xl font-bold line-clamp-1">{song.name}</h3>
                                        <p className="text-gray-400 mb-3">{song.artists?.primary?.[0]?.name || "Unknown Artist"}</p>

                                        <div className="mt-auto flex justify-between items-center">
                                            <button
                                                onClick={() => toggleFavorite(song)}
                                                className={`p-2 rounded-full ${favorites.some(fav => fav.id === song.id) ? 'text-red-500' : 'text-gray-400 hover:text-red-500'} transition-colors`}
                                                title="Add to favorites"
                                            >
                                                <Heart fill={favorites.some(fav => fav.id === song.id) ? "currentColor" : "none"} size={20} />
                                            </button>

                                            <div className="relative">
                                                <button
                                                    onClick={() => togglePlaylistMenu(song.id)}
                                                    className="p-2 text-gray-400 hover:text-blue-400 rounded-full transition-colors"
                                                    title="Add to playlist"
                                                >
                                                    <PlusCircle size={20} />
                                                </button>

                                                {/*------------------- Playlist Dropdown--------------- */}
                                                {showPlaylistMenu === song.id && (
                                                    <div
                                                        ref={playlistMenuRef}
                                                        className="absolute bottom-full right-0 mb-2 w-56 bg-gray-800 rounded-lg shadow-xl z-10 py-2 border border-gray-700"
                                                    >
                                                        <div className="px-3 py-2 border-b border-gray-700 flex justify-between items-center">
                                                            <span className="font-medium">Add to playlist</span>
                                                            <button
                                                                onClick={() => setShowPlaylistMenu(null)}
                                                                className="text-gray-400 hover:text-white"
                                                            >
                                                                <X size={16} />
                                                            </button>
                                                        </div>

                                                        {Object.keys(playlists).map((playlistName) => (
                                                            <button
                                                                key={playlistName}
                                                                onClick={() => addToPlaylist(song, playlistName)}
                                                                className="w-full text-left px-4 py-2 hover:bg-gray-700 flex justify-between items-center"
                                                            >
                                                                <span>{playlistName}</span>
                                                                {playlists[playlistName].some(s => s.id === song.id) && (
                                                                    <Check size={16} className="text-green-500" />
                                                                )}
                                                            </button>
                                                        ))}

                                                        {showNewPlaylistInput ? (
                                                            <div className="px-3 py-2 flex items-center">
                                                                <input
                                                                    type="text"
                                                                    placeholder="Playlist name"
                                                                    value={newPlaylistName}
                                                                    onChange={(e) => setNewPlaylistName(e.target.value)}
                                                                    onKeyPress={(e) => e.key === 'Enter' && createNewPlaylist()}
                                                                    className="flex-1 px-2 py-1 bg-gray-700 rounded text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                                    autoFocus
                                                                />
                                                                <button
                                                                    onClick={createNewPlaylist}
                                                                    className="ml-2 p-1 text-green-500 hover:text-green-400"
                                                                >
                                                                    <Check size={16} />
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <button
                                                                onClick={() => setShowNewPlaylistInput(true)}
                                                                className="w-full text-left px-4 py-2 text-blue-400 hover:bg-gray-700 flex items-center"
                                                            >
                                                                <PlusCircle size={16} className="mr-2" />
                                                                <span>Create new playlist</span>
                                                            </button>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            <button
                                                onClick={() => handlePlayPause(song)}
                                                className="px-3 py-1.5 bg-green-600 hover:bg-green-500 text-white rounded-full flex items-center font-medium text-sm"
                                            >
                                                {currentSong === song.id && isPlaying ? "Pause" : "Play"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                </section>

                {/* -----------------------------Playlists songs ---------------------------------*/}
                <section className="mb-10">
                    <h2 className="text-2xl font-bold mb-4">Your Playlists</h2>

                    {Object.keys(playlists).length === 0 ? (
                        <div className={`${darkMode ? 'bg-black' : 'bg-white'} rounded-xl p-8 text-center`}>
                            <p className="text-gray-400 mb-4">You don't have any playlists yet</p>
                            <button
                                onClick={() => {
                                    setShowNewPlaylistInput(true);
                                    setShowPlaylistMenu('create-new');
                                }}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg inline-flex items-center"
                            >
                                <PlusCircle size={18} className="mr-2" />
                                Create Playlist
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {Object.entries(playlists).map(([playlistName, songs]) => (
                                <div key={playlistName} className={`${darkMode ? 'bg-black' : 'bg-white'} rounded-xl overflow-hidden shadow-lg`}>
                                    <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center">
                                        <h3 className="text-xl font-bold">{playlistName}</h3>
                                        <div className="flex items-center">
                                            <span className="text-gray-400 mr-3">{songs.length} songs</span>
                                            <button
                                                onClick={() => deletePlaylist(playlistName)}
                                                className="text-red-400 hover:text-red-500"
                                                title="Delete playlist"
                                            >
                                                <X size={18} />
                                            </button>
                                        </div>
                                    </div>

                                    {songs.length === 0 ? (
                                        <div className="p-6 text-center text-gray-400">
                                            This playlist is empty
                                        </div>
                                    ) : (
                                        <ul className="divide-y divide-gray-700">
                                            {songs.map((song) => (
                                                <li key={song.id} className="px-6 py-3 flex items-center hover:bg-gray-700">
                                                    <img
                                                        src={song.image?.[0]?.url || '/placeholder.jpg'}
                                                        alt={song.name}
                                                        className="w-12 h-12 rounded object-cover"
                                                    />
                                                    <div className="ml-4 flex-1">
                                                        <p className="font-medium">{song.name}</p>
                                                        <p className="text-sm text-gray-400">{song.artists?.primary?.[0]?.name || "Unknown Artist"}</p>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <button
                                                            onClick={() => handlePlayPause(song)}
                                                            className="p-2 text-green-500 hover:text-green-400 rounded-full"
                                                        >
                                                            {currentSong === song.id && isPlaying ? <Pause size={18} /> : <Play size={18} />}
                                                        </button>
                                                        <button
                                                            onClick={() => removeFromPlaylist(song.id, playlistName)}
                                                            className="p-2 text-gray-400 hover:text-red-400 rounded-full"
                                                            title="Remove from playlist"
                                                        >
                                                            <X size={18} />
                                                        </button>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/*--------------------------- Favorites  songs ------------------------------*/}
                <section className="mb-10">
                    <h2 className="text-2xl font-bold mb-4">Your Favorites</h2>

                    {favorites.length === 0 ? (
                        <div className="bg-gray-800 rounded-xl p-8 text-center">
                            <p className="text-gray-400">You haven't added any favorites yet</p>
                        </div>
                    ) : (
                        <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg">
                            <div className="px-6 py-4 border-b border-gray-700">
                                <h3 className="text-xl font-bold">Favorites ({favorites.length})</h3>
                            </div>

                            <ul className="divide-y divide-gray-700">
                                {favorites.map((song) => (
                                    <li key={song.id} className="px-6 py-3 flex items-center hover:bg-gray-700">
                                        <img
                                            src={song.image?.[0]?.url || '/placeholder.jpg'}
                                            alt={song.name}
                                            className="w-12 h-12 rounded object-cover"
                                        />
                                        <div className="ml-4 flex-1">
                                            <p className="font-medium">{song.name}</p>
                                            <p className="text-sm text-gray-400">{song.artists?.primary?.[0]?.name || "Unknown Artist"}</p>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => handlePlayPause(song)}
                                                className="p-2 text-green-500 hover:text-green-400 rounded-full"
                                            >
                                                {currentSong === song.id && isPlaying ? <Pause size={18} /> : <Play size={18} />}
                                            </button>
                                            <button
                                                onClick={() => removeFromFavorites(song.id)}
                                                className="p-2 text-gray-400 hover:text-red-400 rounded-full"
                                                title="Remove from favorites"
                                            >
                                                <X size={18} />
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </section>
            </main>

            {/*----------------------------------  Player ------------------------*/}
            {currentSong && (
                <footer className={`fixed bottom-0 left-0 right-0 z-20 ${darkMode ? "bg-gray-800" : "bg-white"} shadow-lg py-3 px-6`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => handlePlayPause(songs.find(s => s.id === currentSong))}
                                className="p-3 bg-green-600 hover:bg-green-500 rounded-full"
                            >
                                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                            </button>

                            <div className="flex flex-col">
                                <p className="font-medium">{songs.find(s => s.id === currentSong)?.name || "Unknown"}</p>
                                <p className="text-sm text-gray-400">{songs.find(s => s.id === currentSong)?.artists?.primary?.[0]?.name || "Unknown Artist"}</p>
                            </div>
                        </div>

                        <div className="flex-1 mx-6">
                            <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-green-500"
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <Volume2 size={20} className="text-gray-400" />
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.05"
                                value={volume}
                                onChange={handleVolumeChange}
                                className="w-24 accent-green-500"
                            />
                        </div>
                    </div>
                </footer>
            )}

            {/*------------------------ new playlist-------------------------- */}
            {showPlaylistMenu === 'create-new' && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
                    <div
                        ref={playlistMenuRef}
                        className="bg-gray-800 rounded-lg shadow-xl p-6 w-96 border border-gray-700"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">Create New Playlist</h3>
                            <button
                                onClick={() => {
                                    setShowPlaylistMenu(null);
                                    setShowNewPlaylistInput(false);
                                }}
                                className="text-gray-400 hover:text-white"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <input
                            type="text"
                            placeholder="Playlist name"
                            value={newPlaylistName}
                            onChange={(e) => setNewPlaylistName(e.target.value)}
                            className="w-full px-4 py-2 bg-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                            autoFocus
                        />

                        <div className="flex justify-end">
                            <button
                                onClick={() => {
                                    setShowPlaylistMenu(null);
                                    setShowNewPlaylistInput(false);
                                }}
                                className="px-4 py-2 text-gray-300 hover:text-white mr-2"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    createNewPlaylist();
                                    setShowPlaylistMenu(null);
                                }}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={!newPlaylistName.trim()}
                            >
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;