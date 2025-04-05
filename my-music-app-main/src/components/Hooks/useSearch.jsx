import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSearchQuery } from "../../slices/searchSlice";
import axios from "axios";

const useSearch = () => {
    const dispatch = useDispatch();
    const searchQuery = useSelector((state) => state.search.searchQuery);
    const [songs, setSongs] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

 
    const updateSearchQuery = (query) => {
        dispatch(setSearchQuery(query));
    };


    useEffect(() => {
        const fetchSongs = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`https://saavn.dev/api/search/songs?query=${searchQuery}`);
                setSongs(response.data.data?.results || []);
            
                
            } catch (error) {
                setError("Error fetching songs");
            } finally {
                setLoading(false);
            }
        };

        fetchSongs();
    }, [searchQuery]);

    return { searchQuery, songs, loading, error, updateSearchQuery };
};

export default useSearch;
