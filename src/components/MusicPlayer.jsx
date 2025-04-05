import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Play, Pause, Plus, Trash, Search } from "lucide-react";

const MusicPlayer = () => {
    const [songs, setSongs] = useState([]);
    const [playlist, setPlaylist] = useState([]);
    const [currentSong, setCurrentSong] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [searchQuery, setSearchQuery] = useState("Believer");
    const audioRef = useRef(new Audio());
    const navigate = useNavigate();

    useEffect(() => {
        if (!localStorage.getItem("isAuthenticated")) {
            navigate("/login");
        }
    }, [navigate]);

    useEffect(() => {
        const fetchSongs = async () => {
            try {
                const response = await axios.get(`https://saavn.dev/api/search/songs?query=${searchQuery}`);
                setSongs(response.data.data?.results || []);
            } catch (error) {
                console.error("Error fetching songs:", error);
            }
        };
        fetchSongs();
    }, [searchQuery]);

    const handlePlayPause = (song) => {
        const songUrl = song.downloadUrl?.[0]?.link || "";
        if (!songUrl) return;

        if (currentSong === song.id) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        } else {
            audioRef.current.src = songUrl;
            audioRef.current.play();
            setCurrentSong(song.id);
            setIsPlaying(true);
        }
    };

    const addToPlaylist = (song) => {
        if (!playlist.some((item) => item.id === song.id)) {
            setPlaylist([...playlist, song]);
        }
    };

    const removeFromPlaylist = (songId) => {
        setPlaylist(playlist.filter((song) => song.id !== songId));
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            <h1 className="text-4xl font-bold text-center mb-6 text-purple-400">🎶 Music Player</h1>
            
            {/* Search Bar */}
            <div className="flex justify-center mb-6">
                <input 
                    type="text" 
                    placeholder="Search for songs..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="p-3 rounded-lg bg-gray-800 text-white border-none focus:ring-2 focus:ring-purple-500"
                />
                <button className="ml-2 bg-purple-600 px-4 py-3 rounded-lg hover:bg-purple-500">
                    <Search size={20} />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Available Songs */}
                <div className="bg-gray-800 p-6 rounded-xl shadow-xl">
                    <h2 className="text-xl font-bold mb-4">Available Songs</h2>
                    {songs.map((song) => (
                        <div key={song.id} className="flex items-center p-4 rounded-xl hover:bg-gray-700 transition duration-300">
                            <img src={song.image[2]?.url} alt={song.name} className="w-16 h-16 rounded-lg shadow-md" />
                            <div className="ml-4 flex-1">
                                <h3 className="text-lg font-bold text-purple-300">{song.name}</h3>
                                <p className="text-gray-400 text-sm">{song.artists.primary[0]?.name}</p>
                            </div>
                            <button onClick={() => handlePlayPause(song)} className="bg-purple-600 px-3 py-2 rounded-lg mx-2 hover:bg-purple-500">
                                {currentSong === song.id && isPlaying ? <Pause size={18} /> : <Play size={18} />}
                            </button>
                            <button onClick={() => addToPlaylist(song)} className="bg-green-500 px-3 py-2 rounded-lg hover:bg-green-400">
                                <Plus size={18} />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Now Playing */}
                <div className="bg-gray-800 p-6 rounded-xl shadow-xl flex flex-col items-center">
                    <h2 className="text-xl font-bold mb-4">Now Playing</h2>
                    {currentSong ? (
                        <div className="text-center">
                            <img src={songs.find(song => song.id === currentSong)?.image[2]?.url} className="w-40 h-40 rounded-xl shadow-lg mb-4" />
                            <h3 className="text-lg font-bold">{songs.find(song => song.id === currentSong)?.name}</h3>
                            <p className="text-gray-400">{songs.find(song => song.id === currentSong)?.artists.primary[0]?.name}</p>
                            <button onClick={() => handlePlayPause(songs.find(song => song.id === currentSong))} className="bg-purple-600 px-4 py-2 rounded-lg mt-4 hover:bg-purple-500">
                                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                            </button>
                        </div>
                    ) : (
                        <p className="text-gray-400">No song playing.</p>
                    )}
                </div>

                {/* Playlist */}
                <div className="bg-gray-800 p-6 rounded-xl shadow-xl">
                    <h2 className="text-xl font-bold mb-4">My Playlist</h2>
                    {playlist.length > 0 ? (
                        playlist.map((song) => (
                            <div key={song.id} className="flex items-center p-4 rounded-xl hover:bg-gray-700 transition duration-300">
                                <img src={song.image[2]?.url} alt={song.name} className="w-16 h-16 rounded-lg shadow-md" />
                                <div className="ml-4 flex-1">
                                    <h3 className="text-lg font-bold text-green-300">{song.name}</h3>
                                    <p className="text-gray-400 text-sm">{song.artists.primary[0]?.name}</p>
                                </div>
                                <button onClick={() => handlePlayPause(song)} className="bg-purple-600 px-3 py-2 rounded-lg mx-2 hover:bg-purple-500">
                                    {currentSong === song.id && isPlaying ? <Pause size={18} /> : <Play size={18} />}
                                </button>
                                <button onClick={() => removeFromPlaylist(song.id)} className="bg-red-500 px-3 py-2 rounded-lg hover:bg-red-400">
                                    <Trash size={18} />
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-400 text-center">No songs in playlist.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MusicPlayer;