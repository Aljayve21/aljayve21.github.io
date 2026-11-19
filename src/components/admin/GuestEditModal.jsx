
import { useState } from "react";
import { X, Save, Loader2 } from "lucide-react";

import {
    updateInvitation,
} from "../../services/adminDashboardService";

import { useToast } from "../ui/ToastProvider";
import { useModalFocus } from "../../hooks/useModalFocus";

export default function GuestEditModal({
    guest,
    onClose,
    onSaved,
}) {
    const { showToast } = useToast();

    const [name, setName] = useState(guest.guest_name);
    const [role, setRole] = useState(guest.role);
    const [saving, setSaving] = useState(false);

    const modalRef = useModalFocus({
        onClose,
        disabled: saving,
    });

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (saving) return;

        const trimmedName = name.trim();

        if (!trimmedName) {
            showToast({
                type: "error",
                title: "Invalid Guest Name",
                message: "Guest name cannot be empty.",
            });
            return;
        }

        setSaving(true);

        try {
            await updateInvitation({
                id: guest.id,
                guestName: trimmedName,
                role,
            });
        } catch (error) {
            showToast({
                type: "error",
                title: "Update Failed",
                message:
                    error.message ||
                    "Unable to update guest.",
            });

            setSaving(false);
            return;
        }

        showToast({
            type: "success",
            title: "Guest Updated!",
            message: `${trimmedName}'s information was saved successfully.`,
        });

        try {
            await onSaved?.();
        } catch {
            showToast({
                type: "info",
                title: "Dashboard Refresh Failed",
                message:
                    "Guest was updated. Refresh the dashboard to see the changes.",
            });
        } finally {
            setSaving(false);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-110 flex items-center justify-center bg-black/50 p-4">
            <div
                ref={modalRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="edit-guest-title"
                aria-describedby="edit-guest-description"
                tabIndex={-1}
                className="w-full max-w-md rounded-[28px] border border-white bg-white p-6 shadow-2xl outline-none sm:p-8"
            >
                <div className="flex items-center justify-between">
                    <h2
                        id="edit-guest-title"
                        className="text-xl font-semibold text-[#a86c80]"
                    >
                        Edit Guest
                    </h2>

                    <button
                        type="button"
                        disabled={saving}
                        onClick={onClose}
                        aria-label="Close edit guest modal"
                        className="rounded-full bg-pink-50 p-2 text-pink-500 transition-colors hover:bg-pink-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500 disabled:opacity-50"
                    >
                        <X size={20} />
                    </button>
                </div>

                <p
                    id="edit-guest-description"
                    className="mt-2 text-sm text-gray-500"
                >
                    Update the guest's name or invitation role.
                </p>

                <form
                    onSubmit={handleSubmit}
                    className="mt-6 space-y-5"
                >
                    <div>
                        <label
                            htmlFor="edit-guest-name"
                            className="mb-2 block text-sm font-medium text-gray-600"
                        >
                            Guest Name
                        </label>

                        <input
                            id="edit-guest-name"
                            required
                            maxLength={100}
                            disabled={saving}
                            value={name}
                            onChange={(event) =>
                                setName(event.target.value)
                            }
                            className="w-full rounded-xl border border-pink-200 bg-pink-50/50 px-4 py-3 outline-none focus:border-pink-400 focus-visible:ring-2 focus-visible:ring-pink-300 disabled:opacity-50"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="edit-guest-role"
                            className="mb-2 block text-sm font-medium text-gray-600"
                        >
                            Invitation Role
                        </label>

                        <select
                            id="edit-guest-role"
                            value={role}
                            disabled={saving}
                            onChange={(event) =>
                                setRole(event.target.value)
                            }
                            className="w-full rounded-xl border border-pink-200 bg-white px-4 py-3 outline-none focus-visible:ring-2 focus-visible:ring-pink-300 disabled:opacity-50"
                        >
                            <option value="ninang">
                                Ninang
                            </option>

                            <option value="ninong">
                                Ninong
                            </option>
                        </select>
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            disabled={saving}
                            onClick={onClose}
                            className="flex-1 rounded-xl border border-pink-200 px-4 py-3 text-pink-600 transition-colors hover:bg-pink-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500 disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={saving || !name.trim()}
                            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-pink-500 px-4 py-3 text-white transition-colors hover:bg-pink-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500 disabled:opacity-50"
                        >
                            {saving ? (
                                <Loader2
                                    size={17}
                                    className="animate-spin"
                                />
                            ) : (
                                <Save size={17} />
                            )}

                            {saving
                                ? "Saving..."
                                : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
