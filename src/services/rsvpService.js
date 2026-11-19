
import { supabase } from "../lib/supabase";

export async function submitRSVP({
    token,
    answer,
    message = "",
}) {
    if (!token) {
        throw new Error("Missing invitation token.");
    }

    if (!["yes", "love"].includes(answer)) {
        throw new Error("Please select an RSVP answer.");
    }

    if (message.length > 500) {
        throw new Error("Message must not exceed 500 characters.");
    }

    const { data, error } = await supabase.rpc(
        "submit_rsvp",
        {
            p_token: token,
            p_answer: answer,
            p_message: message.trim() || null,
        }
    );

    if (error) {
        console.error("RSVP submission error:", error);
        throw new Error(error.message);
    }

    if (!data?.success) {
        throw new Error("RSVP submission was not confirmed.");
    }

    return data;
}
