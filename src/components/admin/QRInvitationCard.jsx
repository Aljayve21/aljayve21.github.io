
import { useEffect, useRef, useState } from "react";
import { toPng } from "html-to-image";
import { Crown, Heart, Download, Loader2 } from "lucide-react";
import { generateInvitationQR } from "../../services/qrService";

export default function QRInvitationCard({
    guestName,
    role,
    invitationURL,
}) {
    const cardRef = useRef(null);
    const [qrImage, setQrImage] = useState("");
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;

        async function loadQR() {
            setLoading(true);
            setQrImage("");
            setError("");

            try {
                const image = await generateInvitationQR(
                    invitationURL
                );

                if (active) setQrImage(image);
            } catch (err) {
                if (active) {
                    setError(err.message || "Unable to generate QR.");
                }
            } finally {
                if (active) setLoading(false);
            }
        }

        loadQR();

        return () => {
            active = false;
        };
    }, [invitationURL]);

    const displayRole =
        role?.toLowerCase() === "ninong"
            ? "Ninong"
            : "Ninang";

    const handleDownload = async () => {
        if (!cardRef.current || !qrImage || downloading) {
            return;
        }

        setDownloading(true);
        setError("");

        try {
            const image = await toPng(cardRef.current, {
                pixelRatio: 3,
                backgroundColor: "#fff1f6",
                cacheBust: false,
            });

            const link = document.createElement("a");
            link.download = `Aezrael-Cate-Invitation-${displayRole}.png`;
            link.href = image;
            link.click();
        } catch {
            setError("Unable to download the invitation card.");
        } finally {
            setDownloading(false);
        }
    };

    return (
        <div className="mx-auto w-full max-w-md">
            <div
                ref={cardRef}
                className="relative overflow-hidden bg-[#fff1f6] p-6 text-center text-[#a45279] sm:p-8"
            >
                <div className="rounded-[28px] border-2 border-[#e8c58e] bg-[#fffafc] px-5 py-9">
                    <Crown
                        size={42}
                        strokeWidth={1.3}
                        className="mx-auto text-gold"
                    />

                    <p className="mt-5 text-[10px] font-semibold tracking-[0.25em] text-[#bb7190]">
                        YOU'RE SPECIALLY INVITED
                    </p>

                    <h2
                        className="mt-5 text-5xl text-[#ce6e9b]"
                        style={{
                            fontFamily: "'Great Vibes', cursive",
                        }}
                    >
                        Aezrael Cate
                    </h2>

                    <p className="mt-3 text-xs text-[#9e7584]">
                        My Christening Celebration
                    </p>

                    <div className="mx-auto mt-7 flex w-fit items-center justify-center rounded-2xl border border-[#f2c7d9] bg-white p-3">
                        {loading ? (
                            <Loader2
                                size={50}
                                className="animate-spin text-pink-400"
                            />
                        ) : qrImage ? (
                            <img
                                src={qrImage}
                                alt={`Invitation QR for ${guestName}`}
                                width={210}
                                height={210}
                                className="block h-52.5 w-52.5 "
                            />
                        ) : (
                            <p className="text-xs text-red-500">
                                QR unavailable
                            </p>
                        )}
                    </div>

                    <p className="mt-5 text-sm font-semibold text-[#ce6e9b]">
                        Scan to Open Your Invitation
                    </p>

                    <div className="mt-7 rounded-2xl bg-[#ffe0eb] px-4 py-5">
                        <p className="text-sm">
                            Dear {guestName}
                        </p>

                        <p
                            className="mt-3 text-3xl"
                            style={{
                                fontFamily: "'Great Vibes', cursive",
                            }}
                        >
                            Will you be my {displayRole}?
                        </p>
                    </div>

                    <Heart
                        size={19}
                        fill="currentColor"
                        className="mx-auto mt-7 text-pink-400"
                    />

                    <p className="mt-3 text-xs text-[#9e7584]">
                        December 2026
                    </p>

                    <p className="mt-2 text-xs text-[#9e7584]">
                        Exact Date & Venue To Be Announced
                    </p>

                    <p
                        className="mt-6 text-2xl text-[#ce6e9b]"
                        style={{
                            fontFamily: "'Great Vibes', cursive",
                        }}
                    >
                        With love, Aezrael Cate
                    </p>
                </div>
            </div>

            {error && (
                <p role="alert" className="mt-3 text-center text-sm text-red-600">
                    {error}
                </p>
            )}

            <button
                type="button"
                disabled={!qrImage || loading || downloading}
                onClick={handleDownload}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-linear-to-r from-pink-400 to-pink-500 px-6 py-3 font-semibold text-white shadow-lg shadow-pink-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
                {downloading ? (
                    <Loader2 size={18} className="animate-spin" />
                ) : (
                    <Download size={18} />
                )}

                {downloading
                    ? "Preparing PNG..."
                    : "Download Invitation Card"}
            </button>
        </div>
    );
}
