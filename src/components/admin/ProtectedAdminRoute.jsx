
import { useAuth } from "../../contexts/AuthContext";
import AdminLoginPage from "../../pages/AdminLoginPage";
import { Loader2, Crown } from "lucide-react";

export default function ProtectedAdminRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <main className="flex min-h-screen flex-col items-center justify-center bg-[#fff0f6]">
                <Crown size={42} className="mb-5 text-gold" />
                <Loader2
                    size={30}
                    className="animate-spin text-pink-500"
                />
                <p className="mt-4 text-sm text-[#a86c80]">
                    Verifying administrator access...
                </p>
            </main>
        );
    }

    if (!user) {
        return <AdminLoginPage />;
    }

    return children;
}
