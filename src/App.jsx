import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/LoginPage";
import Home from "./components/Home";  
import SongsList from "./components/Hero";
import Hearder from "./components/Header";
 
const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<><Home /></>} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </Router>
    );
};

export default App;
