import { Navigate, useSearchParams } from "react-router-dom";

function ProtectedRoute({ children }) {
    const [searchParams] = useSearchParams();

    const tokenFromUrl = searchParams.get("token");
    const tokenFromStorage = localStorage.getItem("token");

    if (tokenFromUrl) {
        localStorage.setItem("token", tokenFromUrl);

        // Remove token from URL
        window.history.replaceState(
            {},
            document.title,
            "/dashboard"
        );

        return children;
    }

    if (!tokenFromStorage) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default ProtectedRoute;