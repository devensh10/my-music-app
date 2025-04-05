import { useState, useEffect, useRef } from "react";
import axios from "axios";

const SongsList = () => {
    const [songs, setSongs] = useState([]);
    const [currentSong, setCurrentSong] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(new Audio());

    useEffect(() => {
        const fetchSongs = async () => {
            try {
                const response = await axios.get("https://saavn.dev/api/search/songs?query=Believer");
                setSongs(response.data.data?.results || []);
            } catch (error) {
                console.error("Error fetching songs:", error);
            }
        };
        fetchSongs();
    }, []);

    const getBestQualityUrl = (downloadUrls) => {
        const qualities = ["flac", "320kbps", "160kbps", "96kbps"];
        for (let quality of qualities) {
            const song = downloadUrls?.find((item) => item.quality === quality);
            if (song) return song.link;
        }
        return "";
    };

    const handlePlayPause = (song) => {
        const songUrl = getBestQualityUrl(song.downloadUrl);

        if (!songUrl) {
            console.error("No valid audio URL found!");
            return;
        }

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

    return (
        <div className="p-8 bg-gray-900 text-white min-h-screen">
            <h1 className="text-3xl font-bold text-center mb-6">🎵 Simple Music Player</h1>
            <div className="space-y-4">
                {songs.map((song) => (
                    <div key={song.id} className="flex items-center bg-gray-800 p-4 rounded-lg">
                        <img src={song.image[1]?.url} alt={song.name} className="w-16 h-16 rounded-lg" />
                        <div className="ml-4">
                            <h3 className="text-lg font-semibold">{song.name}</h3>
                            <p className="text-gray-400">{song.artists.primary[0]?.name}</p>
                        </div>
                        <button
                            onClick={() => handlePlayPause(song)}
                            className="ml-auto bg-blue-500 px-4 py-2 rounded-lg"
                        >
                            {currentSong === song.id && isPlaying ? "Pause" : "Play"}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SongsList;





























 















































