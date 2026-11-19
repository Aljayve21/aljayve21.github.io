
import { supabase } from "../lib/supabase";

export async function checkSupabaseConnection() {
    try {
        const { error } = await supabase.auth.getSession();

        if (error) {
            return {
                success: false,
                message: error.message,
            };
        }

        return {
            success: true,
            message: "Supabase Auth client initialized successfully.",
        };
    } catch (error) {
        return {
            success: false,
            message: error.message || "Connection check failed.",
        };
    }
}
