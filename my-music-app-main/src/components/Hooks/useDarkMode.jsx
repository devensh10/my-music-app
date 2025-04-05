import { useSelector, useDispatch } from "react-redux";
import { toggleDarkMode } from "../../slices/darkModeSlice";
const useDarkMode = () => {
    const isDarkMode = useSelector((state) => state.darkMode.isDarkMode);
    const dispatch = useDispatch();

    const toggleMode = () => {
        dispatch(toggleDarkMode()); 
    };

    return [isDarkMode, toggleMode];
};

export default useDarkMode;
