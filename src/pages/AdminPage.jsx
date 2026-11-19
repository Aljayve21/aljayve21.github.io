
import { useState } from "react";
import { Crown, LogOut, ArrowLeft } from "lucide-react";

import FloatingHearts from "../components/FloatingHearts";
import RSVPDashboard from "../components/admin/dashboard/RSVPDashboard";
import { useAuth } from "../contexts/AuthContext";
import "../styles/admin-polish.css";

export default function AdminPage() {
    const { user, logout } = useAuth();
    const [logoutError, setLogoutError] = useState("");
    const [loggingOut, setLoggingOut] = useState(false);

    const handleLogout = async () => {
        setLoggingOut(true);
        setLogoutError("");

        try {
            await logout();
            window.location.replace("/admin");
        } catch (error) {
            setLogoutError(error.message || "Unable to sign out.");
            setLoggingOut(false);
        }
    };

    return (
        <main className="relative min-h-screen overflow-hidden bg-linear-to-br from-[#fff7fa] via-[#ffe5ef] to-[#fbd1e2] px-4 py-10 sm:px-6">
            <FloatingHearts />

            <div className="relative z-10 mx-auto max-w-6xl">
                {/* Admin Header */}
                <header className="mb-8 rounded-[28px] border border-white bg-white/80 p-5 shadow-lg shadow-pink-200/30 backdrop-blur-xl sm:p-7">
                    <div className="flex flex-wrap items-center justify-between gap-5">
                        <div className="flex items-center gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-100">
                                <Crown
                                    size={29}
                                    className="text-gold"
                                />
                            </div>

                            <div>
                                <h1
                                    className="text-4xl text-[#d46b9c] sm:text-5xl"
                                    style={{
                                        fontFamily: "'Great Vibes', cursive",
                                    }}
                                >
                                    Aezrael Cate
                                </h1>

                                <p className="mt-1 text-xs uppercase tracking-widest text-[#a86c80]">
                                    Christening Admin Portal
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <div className="hidden text-right sm:block">
                                <p className="text-xs text-gray-400">
                                    Signed in as
                                </p>
                                <p className="max-w-48 truncate text-sm font-medium text-gray-600">
                                    {user?.email}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={handleLogout}
                                disabled={loggingOut}
                                className="flex items-center gap-2 rounded-xl bg-pink-100 px-4 py-3 text-sm font-medium text-pink-600 hover:bg-pink-200 disabled:opacity-60"
                            >
                                <LogOut size={17} />
                                {loggingOut ? "Signing out..." : "Logout"}
                            </button>
                        </div>
                    </div>

                    {logoutError && (
                        <p
                            role="alert"
                            className="mt-4 text-sm text-red-600"
                        >
                            {logoutError}
                        </p>
                    )}
                </header>

                {/* Main Dashboard */}
                <div className="admin-dashboard">
                    <RSVPDashboard />
                </div>



                {/* Footer */}
                <footer className="mt-12 pb-6 text-center">
                    <a
                        href="/"
                        className="inline-flex items-center gap-2 text-sm text-pink-600 hover:underline"
                    >
                        <ArrowLeft size={16} />
                        View Public Invitation
                    </a>

                    <p className="mt-5 text-xs text-[#a86c80]">
                        Aezrael Cate · December 2026
                    </p>
                </footer>
            </div>
        </main>
    );
}
