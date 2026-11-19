
import { useState } from "react";

import {
    AlertTriangle,
    Loader2,
    Trash2,
    X,
} from "lucide-react";

import {
    deleteInvitation,
} from "../../../services/adminDashboardService";

import { useToast } from "../../ui/ToastProvider";
import { useModalFocus } from "../../../hooks/useModalFocus";

export default function GuestDeleteModal({
    guest,
    onClose,
    onDeleted,
}) {
    const { showToast } = useToast();

    const [deleting, setDeleting] = useState(false);

    const modalRef = useModalFocus({
        onClose,
        disabled: deleting,
    });

    const handleDelete = async () => {
        if (deleting) return;

        setDeleting(true);

        try {
            await deleteInvitation(guest.id);
        } catch (error) {
            showToast({
                type: "error",
                title: "Delete Failed",
                message:
                    error.message ||
                    "Unable to delete guest.",
            });

            setDeleting(false);
            return;
        }

        showToast({
            type: "success",
            title: "Guest Deleted!",
            message: `${guest.guest_name}'s invitation was deleted successfully.`,
        });

        try {
            await onDeleted?.();
        } catch {
            showToast({
                type: "info",
                title: "Dashboard Refresh Failed",
                message:
                    "Guest was deleted. Refresh the dashboard to update the list.",
            });
        } finally {
            setDeleting(false);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-110 flex items-center justify-center bg-black/50 p-4">
            <div
                ref={modalRef}
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="delete-guest-title"
                aria-describedby="delete-guest-description"
                tabIndex={-1}
                className="w-full max-w-md rounded-[28px] bg-white p-6 shadow-2xl outline-none sm:p-8"
            >
                <div className="flex items-start justify-between">
                    <div className="rounded-2xl bg-red-50 p-3 text-red-500">
                        <AlertTriangle size={27} />
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={deleting}
                        aria-label="Close delete confirmation"
                        className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500 disabled:opacity-50"
                    >
                        <X size={20} />
                    </button>
                </div>

                <h2
                    id="delete-guest-title"
                    className="mt-5 text-xl font-semibold text-gray-800"
                >
                    Delete Guest?
                </h2>

                <p
                    id="delete-guest-description"
                    className="mt-3 text-sm leading-6 text-gray-600"
                >
                    Are you sure you want to delete{" "}
                    <strong>{guest.guest_name}</strong>?
                    This will permanently remove the invitation,
                    invalidate its QR code, and delete any
                    associated RSVP response.
                </p>

                <div className="mt-7 flex gap-3">
                    <button
                        type="button"
                        disabled={deleting}
                        onClick={onClose}
                        className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-gray-600 transition-colors hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500 disabled:opacity-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        disabled={deleting}
                        onClick={handleDelete}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-3 text-white transition-colors hover:bg-red-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 disabled:opacity-50"
                    >
                        {deleting ? (
                            <Loader2
                                size={17}
                                className="animate-spin"
                            />
                        ) : (
                            <Trash2 size={17} />
                        )}

                        {deleting
                            ? "Deleting..."
                            : "Delete Guest"}
                    </button>
                </div>
            </div>
        </div>
    );
}
