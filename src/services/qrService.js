
import QRCode from "qrcode";

export function getQRInvitationURL(invitationURL) {
    if (!invitationURL) {
        throw new Error("Invitation URL is required.");
    }

    const url = new URL(invitationURL);

    if (!["https:", "http:"].includes(url.protocol)) {
        throw new Error("Invalid invitation URL.");
    }

    const token = url.searchParams.get("token");

    if (
        !token ||
        !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(token)
    ) {
        throw new Error("Invalid invitation token.");
    }

    // Remove unnecessary URL parameters.
    // Guest name and role are retrieved securely
    // from Supabase using the invitation token.
    url.search = "";
    url.searchParams.set("token", token);
    url.hash = "";

    return url.toString();
}

export async function generateInvitationQR(invitationURL) {
    const secureURL = getQRInvitationURL(invitationURL);

    return QRCode.toDataURL(secureURL, {
        errorCorrectionLevel: "H",
        margin: 3,
        width: 600,
        color: {
            dark: "#352A32",
            light: "#FFFFFF",
        },
    });
}
