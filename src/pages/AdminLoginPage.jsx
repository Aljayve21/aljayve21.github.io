
import { useState } from "react";
import { motion } from "motion/react";
import {
    Crown,
    LockKeyhole,
    Mail,
    Eye,
    EyeOff,
    LogIn,
    ArrowLeft,
} from "lucide-react";

import { useAuth } from "../contexts/AuthContext";

export default function AdminLoginPage() {
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (submitting) return;

        setSubmitting(true);
        setError("");

        try {
            await login(email, password);
            window.location.replace("/admin");
        } catch (err) {
            setError(err.message || "Unable to sign in.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-linear-to-br from-[#fff7fa] via-[#ffe5ef] to-[#fbd1e2] px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 35 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md rounded-4xl border border-white/80 bg-white/85 p-7 shadow-2xl shadow-pink-200/50 backdrop-blur-xl sm:p-10"
            >
                <Crown
                    size={46}
                    className="mx-auto text-gold"
                    strokeWidth={1.5}
                />

                <h1
                    className="mt-5 text-center text-5xl text-[#d46b9c]"
                    style={{ fontFamily: "'Great Vibes', cursive" }}
                >
                    Aezrael Cate
                </h1>

                <p className="mt-3 text-center text-xs uppercase tracking-[0.25em] text-[#a86c80]">
                    Admin Portal
                </p>

                <div className="mt-7 flex items-center justify-center gap-2 text-pink-500">
                    <LockKeyhole size={18} />
                    <span className="text-sm font-medium">
                        Secure Administrator Login
                    </span>
                </div>

                <form onSubmit={handleSubmit} className="mt-7 space-y-5">
                    <div>
                        <label
                            htmlFor="admin-email"
                            className="mb-2 block text-sm font-medium text-gray-600"
                        >
                            Email Address
                        </label>

                        <div className="relative">
                            <Mail
                                size={18}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-400"
                            />

                            <input
                                id="admin-email"
                                type="email"
                                required
                                autoComplete="username"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@example.com"
                                className="w-full rounded-xl border border-pink-200 bg-pink-50/50 py-3 pl-12 pr-4 text-sm outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
                            />
                        </div>
                    </div>

                    <div>
                        <label
                            htmlFor="admin-password"
                            className="mb-2 block text-sm font-medium text-gray-600"
                        >
                            Password
                        </label>

                        <div className="relative">
                            <LockKeyhole
                                size={18}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-400"
                            />

                            <input
                                id="admin-password"
                                type={showPassword ? "text" : "password"}
                                required
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                className="w-full rounded-xl border border-pink-200 bg-pink-50/50 py-3 pl-12 pr-12 text-sm outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword((v) => !v)}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <p
                            role="alert"
                            className="rounded-xl bg-red-50 p-3 text-sm text-red-600"
                        >
                            {error}
                        </p>
                    )}

                    <motion.button
                        type="submit"
                        disabled={submitting}
                        whileHover={!submitting ? { scale: 1.02 } : {}}
                        whileTap={!submitting ? { scale: 0.98 } : {}}
                        className="flex w-full items-center justify-center gap-2 rounded-full bg-linear-to-r from-pink-400 to-pink-500 px-6 py-3.5 font-medium text-white shadow-lg shadow-pink-200 disabled:opacity-60"
                    >
                        <LogIn size={18} />
                        {submitting ? "Signing In..." : "Sign In"}
                    </motion.button>
                </form>

                <a
                    href="/"
                    className="mt-7 flex items-center justify-center gap-2 text-sm text-pink-500 hover:underline"
                >
                    <ArrowLeft size={16} />
                    Back to Invitation
                </a>
            </motion.div>
        </main>
    );
}
