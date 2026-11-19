
/* eslint-disable react/only-export-components */
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";

import {
    getInvitationByToken,
} from "../services/invitationService";

const InvitationContext = createContext(null);

function getTokenFromURL() {
    const params = new URLSearchParams(
        window.location.search
    );

    return params.get("token")?.trim() || null;
}

export function InvitationProvider({ children }) {
    const [guest, setGuest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [requestId, setRequestId] = useState(0);

    const refreshInvitation = useCallback(async () => {
        const token = getTokenFromURL();

        setLoading(true);
        setError("");

        try {
            const verifiedGuest =
                await getInvitationByToken(token);

            setGuest(verifiedGuest);
            return verifiedGuest;
        } catch (err) {
            setGuest(null);
            setError(
                err.message || "Unable to verify invitation."
            );

            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Used after a successful RSVP submission.
    const markResponded = useCallback(
        (answer, message = "") => {
            setGuest((current) => {
                if (!current) return null;

                return {
                    ...current,
                    status:
                        answer === "yes" ? "accepted" : "declined",
                    hasResponded: true,
                    response: {
                        answer,
                        message,
                        submittedAt: new Date().toISOString(),
                    },
                };
            });
        },
        []
    );

    useEffect(() => {
        let active = true;

        const load = async () => {
            const token = getTokenFromURL();

            setLoading(true);
            setError("");

            try {
                const verifiedGuest =
                    await getInvitationByToken(token);

                if (active) {
                    setGuest(verifiedGuest);
                }
            } catch (err) {
                if (active) {
                    setGuest(null);
                    setError(
                        err.message || "Unable to verify invitation."
                    );
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };

        load();

        return () => {
            active = false;
        };
    }, [requestId]);

    const retry = useCallback(() => {
        setRequestId((current) => current + 1);
    }, []);

    return (
        <InvitationContext.Provider
            value={{
                guest,
                loading,
                error,
                refreshInvitation,
                markResponded,
                retry,
                isVerified: Boolean(guest),
                hasResponded: guest?.hasResponded ?? false,
            }}
        >
            {children}
        </InvitationContext.Provider>
    );
}

export function useInvitation() {
    const context = useContext(InvitationContext);

    if (!context) {
        throw new Error(
            "useInvitation must be used inside InvitationProvider"
        );
    }

    return context;
}
