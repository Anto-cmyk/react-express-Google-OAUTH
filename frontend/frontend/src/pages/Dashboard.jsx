import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Dashboard() {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/login");
                return;
            }

            try {
                const response = await axios.get(
                    "http://localhost:5000/api/user/me",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setUser(response.data.user);

            } catch (error) {
                localStorage.removeItem("token");
                navigate("/login");

            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, [navigate]);

    const logout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-slate-500">
                    Loading...
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-100">

            <nav className="bg-white border-b border-slate-200">

                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

                    <h1 className="text-xl font-bold text-indigo-600">
                        AuthApp
                    </h1>

                    <button
                        onClick={logout}
                        className="rounded-lg bg-red-500 px-4 py-2 text-white text-sm font-semibold hover:bg-red-600"
                    >
                        Logout
                    </button>

                </div>

            </nav>

            <main className="max-w-6xl mx-auto px-6 py-12">

                <div className="bg-white rounded-2xl shadow-sm p-8">

                    <p className="text-sm text-indigo-600 font-semibold mb-2">
                        AUTHENTICATED
                    </p>

                    <h2 className="text-3xl font-bold text-slate-900">
                        Welcome, {user?.name}
                    </h2>

                    <p className="text-slate-500 mt-2">
                        You have successfully accessed the protected page.
                    </p>

                    <div className="mt-8 grid gap-4 md:grid-cols-2">

                        <div className="rounded-xl bg-slate-50 p-5">
                            <p className="text-sm text-slate-500">
                                Name
                            </p>

                            <p className="font-semibold text-slate-900 mt-1">
                                {user?.name}
                            </p>
                        </div>

                        <div className="rounded-xl bg-slate-50 p-5">
                            <p className="text-sm text-slate-500">
                                Email
                            </p>

                            <p className="font-semibold text-slate-900 mt-1">
                                {user?.email}
                            </p>
                        </div>

                    </div>

                </div>

            </main>

        </div>
    );
}

export default Dashboard;