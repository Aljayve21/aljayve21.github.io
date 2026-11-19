
/* eslint-disable react/only-export-components */
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";

import { supabase } from "../lib/supabase";
import {
    loginAdmin,
    logoutAdmin,
    verifyAdminSession,
} from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const refreshAuth = useCallback(async () => {
        try {
            const admin = await verifyAdminSession();
            setUser(admin);
        } catch (error) {
            console.error("Auth verification failed:", error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        let active = true;

        // Auth events can fire while tokens are refreshing.
        // Defer verification outside the auth callback.
        let version = 0;

        const scheduleRefresh = () => {
            const currentVersion = ++version;

            Promise.resolve().then(async () => {
                const admin = await verifyAdminSession();

                if (active && currentVersion === version) {
                    setUser(admin);
                    setLoading(false);
                }
            }).catch((error) => {
                console.error("Auth refresh failed:", error);

                if (active && currentVersion === version) {
                    setUser(null);
                    setLoading(false);
                }
            });
        };

        const { data: { subscription } } =
            supabase.auth.onAuthStateChange(() => {
                scheduleRefresh();
            });

        scheduleRefresh();

        return () => {
            active = false;
            version++;
            subscription.unsubscribe();
        };
    }, []);

    const login = async (email, password) => {
        setLoading(true);

        try {
            const admin = await loginAdmin(email, password);
            setUser(admin);
            return admin;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        await logoutAdmin();
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                logout,
                refreshAuth,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside AuthProvider"
        );
    }

    return context;
}
