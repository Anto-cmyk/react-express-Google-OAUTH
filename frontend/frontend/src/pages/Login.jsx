
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

function Login() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState(
        searchParams.get("error")
            ? "Google authentication failed"
            : ""
    );

    const [loading, setLoading] = useState(false);

    // Handle Google OAuth callback
    useEffect(() => {
        const token = searchParams.get("token");

        if (token) {
            localStorage.setItem("token", token);
            navigate("/dashboard", { replace: true });
        }
    }, [searchParams, navigate]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await axios.post(
                "http://localhost:5000/api/auth/login",
                formData
            );

            localStorage.setItem(
                "token",
                response.data.token
            );

            navigate("/dashboard");

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Login failed"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        window.location.href =
            "http://localhost:5000/api/auth/google";
    };

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">

            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

                {/* Header */}
                <div className="text-center mb-8">

                    <h1 className="text-3xl font-bold text-slate-900">
                        Welcome Back
                    </h1>

                    <p className="text-slate-500 mt-2">
                        Login to your account
                    </p>

                </div>

                {/* Error */}
                {error && (
                    <div className="mb-5 rounded-lg bg-red-50 border border-red-200 text-red-600 px-4 py-3 text-sm">
                        {error}
                    </div>
                )}

                {/* Normal Login */}
                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >

                    {/* Email */}
                    <div>

                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            required
                            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                        />

                    </div>

                    {/* Password */}
                    <div>

                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Password
                        </label>

                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            required
                            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                        />

                    </div>

                    {/* Login button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-indigo-600 py-3 text-white font-semibold hover:bg-indigo-700 disabled:opacity-50"
                    >
                        {loading
                            ? "Logging in..."
                            : "Login"}
                    </button>

                </form>

                {/* Divider */}
                <div className="flex items-center gap-3 my-6">

                    <div className="h-px bg-slate-200 flex-1"></div>

                    <span className="text-sm text-slate-400">
                        OR
                    </span>

                    <div className="h-px bg-slate-200 flex-1"></div>

                </div>

                {/* Google Login */}
                <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="w-full flex items-center justify-center gap-3 rounded-lg border border-slate-300 py-3 font-semibold text-slate-700 hover:bg-slate-50 transition"
                >

                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                    >
                        <path
                            fill="#4285F4"
                            d="M21.35 12.23c0-.78-.07-1.53-.23-2.23H12v4.22h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.38Z"
                        />

                        <path
                            fill="#34A853"
                            d="M12 21.5c2.63 0 4.84-.87 6.45-2.35l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.3v2.53A9.74 9.74 0 0 0 12 21.5Z"
                        />

                        <path
                            fill="#FBBC05"
                            d="M6.54 13.59a5.85 5.85 0 0 1 0-3.18V7.88H3.3a9.75 9.75 0 0 0 0 8.24l3.24-2.53Z"
                        />

                        <path
                            fill="#EA4335"
                            d="M12 6.38c1.43 0 2.72.49 3.73 1.45l2.8-2.8C16.84 3.42 14.63 2.5 12 2.5a9.74 9.74 0 0 0-8.7 5.38l3.24 2.53C7.31 8.1 9.46 6.38 12 6.38Z"
                        />
                    </svg>

                    Continue with Google

                </button>

                {/* Register link */}
                <p className="text-center text-sm text-slate-500 mt-6">

                    Don't have an account?{" "}

                    <Link
                        to="/register"
                        className="font-semibold text-indigo-600 hover:text-indigo-700"
                    >
                        Register
                    </Link>

                </p>

            </div>

        </div>
    );
}

export default Login;
 