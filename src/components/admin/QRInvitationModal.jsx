
import { X } from "lucide-react";

import QRInvitationCard from "./QRInvitationCard";
import { useModalFocus } from "../../hooks/useModalFocus";

export default function QRInvitationModal({
    guest,
    onClose,
}) {
    const modalRef = useModalFocus({
        isOpen: Boolean(guest),
        onClose,
    });

    if (!guest) return null;

    return (
        <div
            className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 p-4"
            role="presentation"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                    onClose();
                }
            }}
        >
            <div
                ref={modalRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="qr-modal-title"
                aria-describedby="qr-modal-description"
                tabIndex={-1}
                className="max-h-[95vh] w-full max-w-lg overflow-y-auto rounded-[28px] bg-white p-5 shadow-2xl outline-none sm:p-7"
            >
                <div className="mb-5 flex items-center justify-between gap-3">
                    <div>
                        <h2
                            id="qr-modal-title"
                            className="text-lg font-semibold text-[#a86c80]"
                        >
                            QR Invitation Card
                        </h2>

                        <p
                            id="qr-modal-description"
                            className="mt-1 text-xs text-gray-500"
                        >
                            Personalized invitation for{" "}
                            {guest.guest_name}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close QR invitation preview"
                        className="rounded-full bg-pink-50 p-2 text-pink-500 transition-colors hover:bg-pink-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500"
                    >
                        <X size={20} />
                    </button>
                </div>

                <QRInvitationCard
                    guestName={guest.guest_name}
                    role={guest.role}
                    invitationURL={guest.invitationURL}
                />
            </div>
        </div>
    );
}
