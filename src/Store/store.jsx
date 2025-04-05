import { configureStore } from "@reduxjs/toolkit";
import darkModeReducer from "../slices/darkModeSlice"; 
 import searchReducer from "../slices/searchSlice"
export const store = configureStore({
    reducer: {
        darkMode: darkModeReducer,  
        search: searchReducer,
     
    },
});
