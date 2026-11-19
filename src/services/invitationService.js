
import { supabase } from "../lib/supabase";

const UUID_PATTERN =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function getInvitationByToken(token) {
    if (!token || !UUID_PATTERN.test(token)) {
        throw new Error(
            "This invitation link is missing or has an invalid token."
        );
    }

    const { data, error } = await supabase.rpc(
        "get_invitation_by_token",
        { p_token: token }
    );

    if (error) {
        console.error("Invitation lookup failed:", error);
        throw new Error(
            "Unable to verify this invitation. Please try again."
        );
    }

    if (!data?.success) {
        throw new Error(
            "Invitation not found. Please request a valid invitation link."
        );
    }

    if (
        typeof data.guest_name !== "string" ||
        !["ninong", "ninang"].includes(data.role) ||
        !["pending", "accepted", "declined"].includes(data.status)
    ) {
        throw new Error("Invalid invitation data received.");
    }

    return {
        name: data.guest_name,
        role: data.role === "ninong" ? "Ninong" : "Ninang",
        status: data.status,
        hasResponded: data.has_responded === true,
        response: data.response
            ? {
                answer: data.response.answer,
                message: data.response.message,
                submittedAt: data.response.submitted_at,
            }
            : null,
        token,
    };
}
