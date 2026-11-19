
import { supabase } from "../lib/supabase";

const PAGE_SIZE = 500;

export async function getDashboardData() {
    const invitations = [];
    let from = 0;

    // Fetch all invitations in pages.
    while (true) {
        const { data, error } = await supabase
            .from("invitations")
            .select(`
        id,
        guest_name,
        role,
        token,
        status,
        created_at,
        rsvp_responses (
          id,
          answer,
          message,
          submitted_at
        )
      `)
            .order("created_at", { ascending: false })
            .range(from, from + PAGE_SIZE - 1);

        if (error) {
            throw new Error(error.message);
        }

        const batch = data || [];
        invitations.push(...batch);

        if (batch.length < PAGE_SIZE) break;

        from += PAGE_SIZE;
    }

    const stats = {
        total: invitations.length,
        accepted: invitations.filter(
            (item) => item.status === "accepted"
        ).length,
        declined: invitations.filter(
            (item) => item.status === "declined"
        ).length,
        pending: invitations.filter(
            (item) => item.status === "pending"
        ).length,
    };

    return { invitations, stats };
}

export async function createInvitation({
    guestName,
    role,
}) {
    const name = guestName.trim();

    if (!name || name.length > 100) {
        throw new Error(
            "Guest name must be between 1 and 100 characters."
        );
    }

    if (!["ninong", "ninang"].includes(role)) {
        throw new Error("Invalid invitation role.");
    }

    // Database generates the token and status.
    const { error } = await supabase
        .from("invitations")
        .insert({
            guest_name: name,
            role,
        });

    if (error) {
        throw new Error(error.message);
    }

    // Fetch the newly created invitation separately
    // through the admin-only SELECT policy.
    return { success: true };
}


export function buildInvitationLink(invitation) {
    if (!invitation?.token) {
        throw new Error("Invitation token is missing.");
    }

    const siteUrl =
        import.meta.env.VITE_PUBLIC_SITE_URL ||
        window.location.origin;

    const url = new URL("/", siteUrl);

    url.searchParams.set("token", invitation.token);

    return url.toString();
}


export async function updateInvitation({
    id,
    guestName,
    role,
}) {
    const name = guestName?.trim();

    if (!id) {
        throw new Error("Invitation ID is required.");
    }

    if (!name || name.length > 100) {
        throw new Error(
            "Guest name must be between 1 and 100 characters."
        );
    }

    if (!["ninong", "ninang"].includes(role)) {
        throw new Error("Invalid invitation role.");
    }

    const { data, error } = await supabase
        .from("invitations")
        .update({
            guest_name: name,
            role,
        })
        .eq("id", id)
        .select("id, guest_name, role")
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return data;
}


export async function deleteInvitation(id) {
    if (!id) {
        throw new Error("Invitation ID is required.");
    }

    const { data, error } = await supabase
        .from("invitations")
        .delete()
        .eq("id", id)
        .select("id")
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return data;
}

