const Playlists = ({ playlists }) => {
    return (
        <div className="mt-10 bg-gray-900 p-6 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold text-blue-400 mb-4">🎶 Your Playlists</h2>
            {playlists.length === 0 ? (
                <p className="text-gray-400">No playlists created yet.</p>
            ) : (
                <ul className="space-y-3">
                    {playlists.map((song) => (
                        <li key={song.id} className="text-lg bg-gray-800 p-3 rounded-lg shadow-md">
                            🎵 {song.name} - {song.artists?.primary?.[0]?.name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Playlists;
