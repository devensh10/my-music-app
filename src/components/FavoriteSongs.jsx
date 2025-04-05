import { Heart } from "lucide-react";

const FavoriteSongs = ({ favorites, handleRemoveFromFavorites }) => {
    return (
        <div className="mt-10">
            <h2 className="text-3xl font-bold mb-4">❤️ Favorite Songs</h2>
            {favorites.length === 0 ? (
                <p className="text-lg text-gray-400">No favorite songs added yet.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favorites.map((song) => (
                        <div key={song.id} className="bg-gray-800 p-4 rounded-xl shadow-md flex items-center space-x-4 hover:bg-gray-700 transition duration-300">
                            <img src={song.image?.[2]?.url} alt={song.name} className="w-20 h-20 rounded-lg" />
                            <div className="flex-1">
                                <h3 className="text-xl font-bold">{song.name}</h3>
                                <p className="text-gray-400 text-sm">{song.artists?.primary?.[0]?.name || "Unknown Artist"}</p>
                            </div>
                            <button onClick={() => handleRemoveFromFavorites(song.id)} className="text-red-500 text-xl">
                                <Heart fill="red" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FavoriteSongs;