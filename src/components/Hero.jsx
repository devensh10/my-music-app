import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Play, Pause, Plus, Trash, Volume2 } from "lucide-react";

const SongsList = () => {
    const [songs, setSongs] = useState([]);
    const [playlist, setPlaylist] = useState([]);
    const [currentSong, setCurrentSong] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(1);
    const [searchQuery, setSearchQuery] = useState("Believer");
    const audioRef = useRef(new Audio());

    useEffect(() => {
        const fetchSongs = async () => {
            try {
                const response = await axios.get(`https://saavn.dev/api/search/songs?query=${searchQuery}`);
                if (response.data.data?.results) {
                    setSongs(response.data.data.results);
                }
            } catch (error) {
                console.error("Error fetching songs:", error);
            }
        };
        fetchSongs();
    }, [searchQuery]);

    const getSongUrl = (downloadUrls) => {
        return downloadUrls?.[0]?.link || "";
    };

    const handlePlayPause = (song) => {
        const songUrl = getSongUrl(song.downloadUrl);
        if (!songUrl.endsWith(".mp4") && !songUrl.includes(".flac")) {
            console.error("Invalid audio file:", songUrl);
            return;
        }
        if (currentSong === songUrl) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        } else {
            audioRef.current.src = songUrl;
            audioRef.current.play();
            setCurrentSong(songUrl);
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

    const handleVolumeChange = (event) => {
        const newVolume = event.target.value;
        setVolume(newVolume);
        audioRef.current.volume = newVolume;
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8 flex flex-col items-center">
            <h1 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                🎵 Music Player
            </h1>
            <input
                type="text"
                placeholder="Search Songs..."
                className="p-2 rounded-lg bg-gray-800 text-white mb-6 w-1/2"
                onChange={(e) => setSearchQuery(e.target.value)}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
                <div className="bg-gray-800 p-6 rounded-xl shadow-md border border-gray-700">
                    <h2 className="text-2xl font-semibold mb-4 text-blue-400">Available Songs</h2>
                    <div className="space-y-4">
                        {songs.length > 0 ? (
                            songs.map((song) => {
                                const songUrl = getSongUrl(song.downloadUrl);
                                return (
                                    <div key={song.id} className="flex items-center bg-gray-700 p-4 rounded-lg shadow-md hover:bg-gray-600">
                                        <img src={song.image[2]?.url} alt={song.name} className="w-16 h-16 rounded-lg" />
                                        <div className="ml-4 flex-1">
                                            <h3 className="text-lg font-bold">{song.name}</h3>
                                            <p className="text-gray-400 text-sm">{song.artists.primary[0]?.name}</p>
                                        </div>
                                        <button onClick={() => handlePlayPause(song)} className="text-white bg-purple-600 px-3 py-2 rounded-lg hover:bg-purple-700">
                                            {currentSong === songUrl && isPlaying ? <Pause size={16} /> : <Play size={16} />}
                                        </button>
                                        <button onClick={() => addToPlaylist(song)} className="ml-2 text-white bg-green-500 px-3 py-2 rounded-lg hover:bg-green-600">
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                );
                            })
                        ) : (
                            <p className="text-gray-400">Loading songs...</p>
                        )}
                    </div>
                </div>

                <div className="bg-gray-800 p-6 rounded-xl shadow-md border border-gray-700">
                    <h2 className="text-2xl font-semibold mb-4 text-pink-400">My Playlist</h2>
                    {playlist.length > 0 ? (
                        <ul className="space-y-4">
                            {playlist.map((song) => {
                                const songUrl = getSongUrl(song.downloadUrl);
                                return (
                                    <li key={song.id} className="flex items-center bg-gray-700 p-4 rounded-lg shadow-md hover:bg-gray-600">
                                        <img src={song.image[2]?.url} alt={song.name} className="w-16 h-16 rounded-lg" />
                                        <div className="ml-4 flex-1">
                                            <h3 className="text-lg font-bold">{song.name}</h3>
                                            <p className="text-gray-400 text-sm">{song.artists.primary[0]?.name}</p>
                                        </div>
                                        <button onClick={() => handlePlayPause(song)} className="text-white bg-purple-600 px-3 py-2 rounded-lg hover:bg-purple-700">
                                            {currentSong === songUrl && isPlaying ? <Pause size={16} /> : <Play size={16} />}
                                        </button>
                                        <button onClick={() => removeFromPlaylist(song.id)} className="ml-2 text-white bg-red-500 px-3 py-2 rounded-lg hover:bg-red-600">
                                            <Trash size={16} />
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    ) : (
                        <p className="text-gray-400">No songs in playlist.</p>
                    )}
                </div>
            </div>

            {currentSong && (
                <div className="fixed bottom-4 bg-gray-800 p-4 rounded-lg flex items-center shadow-lg">
                    <button onClick={() => handlePlayPause({ downloadUrl: [{ link: currentSong }] })} className="text-white bg-purple-600 px-3 py-2 rounded-lg hover:bg-purple-700">
                        {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                    </button>
                    <input type="range" min="0" max="1" step="0.1" value={volume} onChange={handleVolumeChange} className="ml-4" />
                    <Volume2 size={20} className="text-white ml-2" />
                </div>
            )}
        </div>
    );
};

export default SongsList;