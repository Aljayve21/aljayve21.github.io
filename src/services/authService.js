
import { supabase } from "../lib/supabase";

export async function loginAdmin(email, password) {
    const { data, error } =
        await supabase.auth.signInWithPassword({
            email: email.trim(),
            password,
        });

    if (error) {
        throw new Error(error.message);
    }

    if (!data.session) {
        throw new Error("Unable to create login session.");
    }

    // Check administrator authorization.
    const { data: isAdmin, error: adminError } =
        await supabase.rpc("is_admin");

    if (adminError || isAdmin !== true) {
        await supabase.auth.signOut();

        throw new Error(
            "This account is not authorized as an administrator."
        );
    }

    return data.user;
}

export async function logoutAdmin() {
    const { error } = await supabase.auth.signOut();

    if (error) {
        throw new Error(error.message);
    }
}

export async function verifyAdminSession() {
    // getUser validates the session with Supabase Auth.
    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user) {
        return null;
    }

    const { data: isAdmin, error: adminError } =
        await supabase.rpc("is_admin");

    if (adminError || isAdmin !== true) {
        return null;
    }

    return data.user;
}
