
import { useState } from "react";
import { Database, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { checkSupabaseConnection } from "../services/supabaseHealth";

export default function SupabaseConnectionTest() {
    const [status, setStatus] = useState("idle");
    const [message, setMessage] = useState("");

    const handleTest = async () => {
        setStatus("loading");
        setMessage("");

        const result = await checkSupabaseConnection();

        setStatus(result.success ? "success" : "error");
        setMessage(result.message);
    };

    return (
        <div className="rounded-2xl border border-pink-200 bg-white/90 p-6 shadow-lg">
            <div className="flex items-center gap-3">
                <Database className="text-pink-500" size={26} />

                <div>
                    <h3 className="font-semibold text-gray-700">
                        Supabase Connection Test
                    </h3>
                    <p className="text-xs text-gray-400">
                        Lesson 7.2 — Client Initialization
                    </p>
                </div>
            </div>

            <button
                type="button"
                onClick={handleTest}
                disabled={status === "loading"}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-pink-500 px-5 py-3 text-sm font-medium text-white disabled:opacity-60"
            >
                {status === "loading" ? (
                    <Loader2 size={18} className="animate-spin" />
                ) : (
                    <Database size={18} />
                )}

                {status === "loading"
                    ? "Checking..."
                    : "Test Supabase Client"}
            </button>

            {status === "success" && (
                <div className="mt-4 flex items-start gap-2 rounded-xl bg-green-50 p-3 text-sm text-green-700">
                    <CheckCircle2 size={18} className="shrink-0" />
                    <span>{message}</span>
                </div>
            )}

            {status === "error" && (
                <div className="mt-4 flex items-start gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-600">
                    <XCircle size={18} className="shrink-0" />
                    <span>{message}</span>
                </div>
            )}
        </div>
    );
}
