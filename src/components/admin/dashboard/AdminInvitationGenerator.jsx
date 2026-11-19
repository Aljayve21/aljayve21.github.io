
import { useState } from "react";
import { motion } from "motion/react";
import { UserPlus, Loader2 } from "lucide-react";

import {
    createInvitation,
} from "../../../services/adminDashboardService";

import { useToast } from "../../ui/ToastProvider";

export default function AdminInvitationGenerator({
    onCreated,
}) {
    const { showToast } = useToast();

    const [guestName, setGuestName] = useState("");
    const [role, setRole] = useState("ninang");
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (saving) return;

        const trimmedName = guestName.trim();

        if (!trimmedName) {
            showToast({
                type: "error",
                title: "Invalid Guest Name",
                message: "Please enter a guest name.",
            });
            return;
        }

        setSaving(true);

        try {
            await createInvitation({
                guestName: trimmedName,
                role,
            });
        } catch (error) {
            showToast({
                type: "error",
                title: "Invitation Creation Failed",
                message:
                    error.message ||
                    "Unable to create invitation.",
            });

            setSaving(false);
            return;
        }

        setGuestName("");

        showToast({
            type: "success",
            title: "Invitation Created!",
            message: `Invitation for ${trimmedName} was created successfully.`,
        });

        try {
            await onCreated?.();
        } catch {
            showToast({
                type: "info",
                title: "Dashboard Refresh Failed",
                message:
                    "Invitation was created. Refresh the dashboard to see the latest records.",
            });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="rounded-[28px] border border-white bg-white/90 p-6 shadow-xl shadow-pink-200/30">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-[#a86c80]">
                <UserPlus size={21} />
                Create Invitation
            </h2>

            <p className="mt-2 text-sm text-gray-500">
                Generate a secure, personalized invitation
                for a Ninong or Ninang.
            </p>

            <form
                onSubmit={handleSubmit}
                className="mt-6 space-y-4"
            >
                <div>
                    <label
                        htmlFor="new-guest-name"
                        className="mb-2 block text-sm font-medium text-gray-600"
                    >
                        Guest Name
                    </label>

                    <input
                        id="new-guest-name"
                        required
                        maxLength={100}
                        disabled={saving}
                        value={guestName}
                        onChange={(event) =>
                            setGuestName(event.target.value)
                        }
                        placeholder="e.g. Maria Santos"
                        className="w-full rounded-xl border border-pink-200 bg-pink-50/40 px-4 py-3 text-sm outline-none focus:border-pink-400 disabled:opacity-60"
                    />
                </div>

                <div>
                    <label
                        htmlFor="new-guest-role"
                        className="mb-2 block text-sm font-medium text-gray-600"
                    >
                        Invitation Role
                    </label>

                    <select
                        id="new-guest-role"
                        value={role}
                        disabled={saving}
                        onChange={(event) =>
                            setRole(event.target.value)
                        }
                        className="w-full rounded-xl border border-pink-200 bg-pink-50/40 px-4 py-3 text-sm outline-none focus:border-pink-400 disabled:opacity-60"
                    >
                        <option value="ninang">Ninang</option>
                        <option value="ninong">Ninong</option>
                    </select>
                </div>

                <motion.button
                    type="submit"
                    disabled={saving || !guestName.trim()}
                    whileTap={{ scale: 0.98 }}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-pink-500 px-5 py-3 font-medium text-white transition-colors hover:bg-pink-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {saving ? (
                        <Loader2
                            size={18}
                            className="animate-spin"
                        />
                    ) : (
                        <UserPlus size={18} />
                    )}

                    {saving
                        ? "Creating..."
                        : "Create Invitation"}
                </motion.button>
            </form>
        </div>
    );
}
