
import { useState } from "react";
import { motion } from "motion/react";
import {
    Copy,
    Check,
    Link2,
    Send,
    Sparkles,
} from "lucide-react";
import { createInvitation } from "../services/rsvpService";

export default function InvitationLinkGenerator() {
    const [name, setName] = useState("");
    const [role, setRole] = useState("ninang");
    const [generatedLink, setGeneratedLink] = useState("");
    const [copied, setCopied] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState("");

    const generateLink = async () => {
        const guestName = name.trim();

        if (!guestName) {
            alert("Please enter the guest's name.");
            return;
        }

        setIsGenerating(true);
        setError("");

        try {
            const token = await createInvitation({
                name: guestName,
                role,
            });

            const baseUrl = window.location.origin;
            const params = new URLSearchParams({
                name: guestName,
                role,
                token,
            });

            setGeneratedLink(`${baseUrl}/?${params.toString()}`);
            setCopied(false);
        } catch (generationError) {
            setGeneratedLink("");
            setError(generationError.message || "Unable to create the invitation.");
        } finally {
            setIsGenerating(false);
        }
    };

    const copyLink = async () => {
        if (!generatedLink) return;

        try {
            await navigator.clipboard.writeText(generatedLink);
            setCopied(true);
        } catch {
            alert("Unable to copy. Please copy the link manually.");
        }
    };

    const shareMessenger = () => {
        if (!generatedLink) return;

        const message =
            `You're invited to Aezrael Cate's Christening! 🎀\n\n` +
            `Open your special invitation:\n${generatedLink}`;

        // Open Messenger so the sender can choose a recipient.
        // The invitation message is copied separately for pasting.
        window.open(
            "https://www.messenger.com/",
            "_blank",
            "noopener,noreferrer"
        );

        if (navigator.clipboard?.writeText) {
            navigator.clipboard.writeText(message).catch(() => { });
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-xl rounded-4xl border border-white bg-white/85 p-6 shadow-2xl shadow-pink-200/50 backdrop-blur-xl sm:p-10"
        >
            <div className="text-center">
                <Sparkles
                    size={35}
                    className="mx-auto text-gold"
                />

                <h1
                    className="mt-4 text-5xl text-[#d46b9c]"
                    style={{ fontFamily: "'Great Vibes', cursive" }}
                >
                    Invitation Generator
                </h1>

                <p className="mt-3 text-sm text-gray-500">
                    Create a personalized invitation for
                    Aezrael Cate's Ninong and Ninang.
                </p>
            </div>

            <div className="mt-9 space-y-6">
                <div>
                    <label
                        htmlFor="guest-name"
                        className="mb-2 block text-sm font-medium text-gray-600"
                    >
                        Guest Name
                    </label>

                    <input
                        id="guest-name"
                        type="text"
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                            setGeneratedLink("");
                        }}
                        placeholder="e.g. Maria Santos"
                        maxLength={80}
                        className="w-full rounded-xl border border-pink-200 bg-pink-50/50 px-4 py-3 outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
                    />
                </div>

                <div>
                    <p className="mb-3 text-sm font-medium text-gray-600">
                        Invitation Role
                    </p>

                    <div className="grid grid-cols-2 gap-3">
                        {["ninong", "ninang"].map((item) => (
                            <button
                                key={item}
                                type="button"
                                onClick={() => {
                                    setRole(item);
                                    setGeneratedLink("");
                                }}
                                className={`rounded-xl border px-4 py-3 font-medium capitalize transition ${role === item
                                    ? "border-pink-400 bg-pink-100 text-pink-600"
                                    : "border-gray-200 bg-white text-gray-500"
                                    }`}
                            >
                                {item === "ninong" ? "🤵 Ninong" : "🎀 Ninang"}
                            </button>
                        ))}
                    </div>
                </div>

                <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={generateLink}
                    disabled={isGenerating}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-linear-to-r from-pink-400 to-pink-500 px-6 py-3 font-medium text-white shadow-lg shadow-pink-200 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <Link2 size={18} />
                    {isGenerating ? "Creating Invitation..." : "Generate Invitation Link"}
                </motion.button>

                {error && (
                    <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-600">
                        {error}
                    </p>
                )}

                {generatedLink && (
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-2xl border border-pink-100 bg-pink-50 p-4"
                    >
                        <p className="mb-2 text-xs font-medium text-pink-500">
                            YOUR PERSONALIZED LINK
                        </p>

                        <input
                            readOnly
                            value={generatedLink}
                            aria-label="Generated invitation link"
                            className="w-full rounded-lg border border-pink-100 bg-white p-3 text-sm text-gray-600"
                        />

                        <div className="mt-4 grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={copyLink}
                                className="flex items-center justify-center gap-2 rounded-xl bg-white px-3 py-3 text-sm text-pink-500 shadow-sm"
                            >
                                {copied ? <Check size={17} /> : <Copy size={17} />}
                                {copied ? "Copied!" : "Copy Link"}
                            </button>

                            <button
                                type="button"
                                onClick={shareMessenger}
                                className="flex items-center justify-center gap-2 rounded-xl bg-pink-500 px-3 py-3 text-sm text-white"
                            >
                                <Send size={17} />
                                Messenger
                            </button>
                        </div>

                        <a
                            href={generatedLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-4 block text-center text-sm text-pink-500 underline"
                        >
                            Preview Invitation
                        </a>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}
