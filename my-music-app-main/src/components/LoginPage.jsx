import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = () => {
        if (!email || !password) {
            setError("Email and Password are required!");
            return;
        }

        if (email !== "vishnu@gmail.com" || password !== "test") {
            setError("Invalid email or password!");
            return;
        }

        localStorage.setItem("isAuthenticated", "true");
        navigate("/");
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
            <h1 className="text-3xl mb-4">Login to Play Songs</h1>

            <div className="flex flex-col space-y-3 w-80">
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="p-2 rounded bg-gray-800 border border-gray-600 text-white"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="p-2 rounded bg-gray-800 border border-gray-600 text-white"
                />
                {error && <p className="text-red-500">{error}</p>}

                <button
                    onClick={handleLogin}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg"
                >
                    Login
                </button>
            </div>
        </div>
    );
};

export default LoginPage;
