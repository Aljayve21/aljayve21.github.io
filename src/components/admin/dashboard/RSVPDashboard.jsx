
import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";

import { RefreshCw, AlertCircle } from "lucide-react";

import {
    getDashboardData,
} from "../../../services/adminDashboardService";

import DashboardStats from "./DashboardStats";
import AdminInvitationGenerator from "./AdminInvitationGenerator";
import GuestTable from "./GuestTable";

import DashboardSkeleton from "./DashboardSkeleton";
import DashboardState from "./DashboardState";

const emptyStats = {
    total: 0,
    accepted: 0,
    declined: 0,
    pending: 0,
};

export default function RSVPDashboard() {
    const [invitations, setInvitations] = useState([]);
    const [stats, setStats] = useState(emptyStats);

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");
    const [refreshError, setRefreshError] = useState("");

    const [hasLoaded, setHasLoaded] = useState(false);

    const mountedRef = useRef(false);
    const requestIdRef = useRef(0);
    const hasLoadedRef = useRef(false);

    const loadDashboard = useCallback(async () => {
        const requestId = ++requestIdRef.current;
        const initialLoad = !hasLoadedRef.current;

        if (initialLoad) {
            setLoading(true);
            setError("");
        } else {
            setRefreshing(true);
            setRefreshError("");
        }

        try {
            const data = await getDashboardData();

            if (
                !mountedRef.current ||
                requestId !== requestIdRef.current
            ) {
                return;
            }

            setInvitations(data.invitations ?? []);
            setStats(data.stats ?? emptyStats);

            setError("");
            setRefreshError("");

            hasLoadedRef.current = true;
            setHasLoaded(true);
        } catch (err) {
            if (
                !mountedRef.current ||
                requestId !== requestIdRef.current
            ) {
                return;
            }

            const message =
                err.message || "Unable to load dashboard.";

            if (initialLoad) {
                setError(message);
            } else {
                setRefreshError(message);
            }

            throw err;
        } finally {
            if (
                mountedRef.current &&
                requestId === requestIdRef.current
            ) {
                setLoading(false);
                setRefreshing(false);
            }
        }
    }, []);

    useEffect(() => {
        mountedRef.current = true;

        // Catch the initial request failure here.
        // The dashboard itself displays the error state.
        const initialLoadTimer = window.setTimeout(() => {
            loadDashboard().catch(() => { });
        }, 0);

        return () => {
            window.clearTimeout(initialLoadTimer);
            mountedRef.current = false;
            requestIdRef.current += 1;
        };
    }, [loadDashboard]);

    const handleRefresh = () => {
        loadDashboard().catch(() => { });
    };

    const showInitialSkeleton =
        loading && !hasLoaded;

    const showInitialError =
        !loading && !hasLoaded && Boolean(error);

    const showEmptyState =
        hasLoaded && invitations.length === 0;

    return (
        <div className="w-full space-y-6">
            {/* Dashboard Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-semibold text-[#a86c80]">
                        RSVP Dashboard
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Aezrael Cate's Christening Invitations
                    </p>
                </div>

                <button
                    type="button"
                    onClick={handleRefresh}
                    disabled={loading || refreshing}
                    className="inline-flex items-center gap-2 rounded-xl border border-pink-200 bg-white px-4 py-2.5 text-sm font-medium text-pink-600 transition-colors hover:bg-pink-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <RefreshCw
                        size={17}
                        className={
                            loading || refreshing
                                ? "animate-spin"
                                : ""
                        }
                    />

                    {loading || refreshing
                        ? "Refreshing..."
                        : "Refresh"}
                </button>
            </div>

            {/* Initial Loading */}
            {showInitialSkeleton && (
                <DashboardSkeleton />
            )}

            {/* Initial Error */}
            {showInitialError && (
                <DashboardState
                    type="error"
                    title="Unable to Load Dashboard"
                    message={error}
                    onRetry={handleRefresh}
                />
            )}

            {/* Loaded Dashboard */}
            {hasLoaded && (
                <>
                    {/* Non-blocking Refresh Error */}
                    {refreshError && (
                        <div
                            role="alert"
                            className="flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-600"
                        >
                            <AlertCircle
                                size={19}
                                className="mt-0.5 shrink-0"
                            />

                            <div className="flex-1">
                                <p className="font-semibold">
                                    Dashboard Refresh Failed
                                </p>

                                <p className="mt-1">
                                    {refreshError}
                                </p>

                                <p className="mt-1 text-xs">
                                    Showing the last successfully
                                    loaded data.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={handleRefresh}
                                disabled={refreshing}
                                className="shrink-0 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-red-600 disabled:opacity-50"
                            >
                                Retry
                            </button>
                        </div>
                    )}

                    {/* Statistics */}
                    <DashboardStats stats={stats} />

                    {/* Create Invitation */}
                    <AdminInvitationGenerator
                        onCreated={loadDashboard}
                    />

                    {/* Guest Management */}
                    {showEmptyState ? (
                        <DashboardState
                            type="empty"
                            title="No Invitations Yet"
                            message="Create your first personalized invitation for Aezrael Cate's christening. Your guest list will appear here."
                        />
                    ) : (
                        <GuestTable
                            invitations={invitations}
                            onChanged={loadDashboard}
                        />
                    )}
                </>
            )}
        </div>
    );
}
