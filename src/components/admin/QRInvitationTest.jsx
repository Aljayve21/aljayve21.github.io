import QRInvitationCard from "./QRInvitationCard";

export default function QRInvitationTest() {
    const validInvitationURL =
        "http://localhost:5173/?name=Joshua&role=ninong&token=62905154-71e2-4a30-8850-e4e061ac5cd6";

    return (
        <div className="mx-auto max-w-lg px-4 py-10">
            <h2 className="mb-6 text-center text-2xl font-bold text-pink-500">
                QR Invitation Test
            </h2>

            <QRInvitationCard
                guestName="Joshua"
                role="ninong"
                invitationURL={validInvitationURL}
            />
        </div>
    );
}