
export function getGuestFromURL() {
    const params = new URLSearchParams(window.location.search);

    const rawName = params.get("name")?.trim() || "";
    const rawRole = params.get("role")?.toLowerCase();

    const role = rawRole === "ninong" ? "Ninong" : "Ninang";

    return {
        name: rawName.slice(0, 80) || "My Dearest",
        role,
    };
}
