
import {
    AlertCircle,
    RefreshCw,
    Users,
} from "lucide-react";

export default function DashboardState({
    type = "empty",
    title,
    message,
    onRetry,
}) {
    const isError = type === "error";

    const Icon = isError ? AlertCircle : Users;

    return (
        <div
            role={isError ? "alert" : "status"}
            className="flex flex-col items-center justify-center rounded-[28px] border border-pink-100 bg-white/90 px-6 py-12 text-center shadow-lg shadow-pink-200/20"
        >
            <div
                className={`mb-5 rounded-2xl p-4 ${isError
                        ? "bg-red-50 text-red-500"
                        : "bg-pink-50 text-pink-500"
                    }`}
            >
                <Icon size={30} />
            </div>

            <h3 className="text-lg font-semibold text-[#a86c80]">
                {title ||
                    (isError
                        ? "Unable to Load Dashboard"
                        : "No Invitations Yet")}
            </h3>

            <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">
                {message ||
                    (isError
                        ? "Something went wrong while loading the dashboard."
                        : "Create your first invitation to start building your guest list.")}
            </p>

            {isError && onRetry && (
                <button
                    type="button"
                    onClick={onRetry}
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-pink-500 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-pink-600"
                >
                    <RefreshCw size={17} />
                    Try Again
                </button>
            )}
        </div>
    );
}
