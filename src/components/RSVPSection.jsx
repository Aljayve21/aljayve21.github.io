
import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
    Crown,
    Heart,
    Mail,
    Send,
    CheckCircle2,
    Sparkles,
    Copy,
    RefreshCw,
} from "lucide-react";

import { useInvitation } from "../contexts/InvitationContext";
import { submitRSVP } from "../services/rsvpService";

export default function RSVPSection() {
    const {
        guest,
        isVerified,
        hasResponded,
        markResponded,
        refreshInvitation,
    } = useInvitation();

    const [answer, setAnswer] = useState("");
    const [message, setMessage] = useState("");
    const [copied, setCopied] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [submitError, setSubmitError] = useState("");

    // Prevent rapid duplicate submissions.
    const submissionLock = useRef(false);

    if (!isVerified || !guest) {
        return null;
    }

    const savedResponse = guest.response;

    const finalAnswer = hasResponded
        ? savedResponse?.answer
        : answer;

    const finalMessage = hasResponded
        ? savedResponse?.message || ""
        : message;

    const createRSVPMessage = () => {
        const response =
            finalAnswer === "yes"
                ? `Yes! I'd love to be Aezrael Cate's ${guest.role}!`
                : "Sending my love and blessings to Aezrael Cate!";

        return [
            "AEZRAEL CATE - CHRISTENING RSVP",
            "",
            `Name: ${guest.name}`,
            `Role: ${guest.role}`,
            `Response: ${response}`,
            finalMessage.trim()
                ? `Message: ${finalMessage.trim()}`
                : "",
            "",
            "December 2026 - Date & Venue TBA",
        ]
            .filter(Boolean)
            .join("\n");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            !answer ||
            !guest.token ||
            hasResponded ||
            submissionLock.current
        ) {
            return;
        }

        submissionLock.current = true;
        setIsSubmitting(true);
        setSubmitError("");

        try {
            // Recheck database status before submitting.
            const latest = await refreshInvitation();

            if (latest.hasResponded) {
                setSubmitError(
                    "Your RSVP has already been recorded."
                );
                return;
            }

            await submitRSVP({
                token: latest.token,
                answer,
                message,
            });

            // Only update local state after
            // Supabase confirms success.
            markResponded(answer, message.trim());
            setCopied(false);
        } catch (error) {
            // A response may have been saved in another tab,
            // or the request may have succeeded before a
            // network interruption.
            try {
                const latest = await refreshInvitation();

                if (latest.hasResponded) {
                    setSubmitError("");
                    return;
                }
            } catch {
                // Keep the original submission error.
            }

            setSubmitError(
                error.message ||
                "Unable to submit RSVP. Please try again."
            );
        } finally {
            submissionLock.current = false;
            setIsSubmitting(false);
        }
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(
                createRSVPMessage()
            );

            setCopied(true);
        } catch {
            alert(
                "Unable to copy. Please copy the message manually."
            );
        }
    };

    const handleMessenger = async () => {
        const text = createRSVPMessage();

        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
        } catch {
            // Messenger can still be opened.
        }

        window.open(
            "https://www.messenger.com/",
            "_blank",
            "noopener,noreferrer"
        );
    };

    const handleRefresh = async () => {
        setIsRefreshing(true);
        setSubmitError("");

        try {
            await refreshInvitation();
        } catch (error) {
            setSubmitError(
                error.message ||
                "Unable to refresh RSVP status."
            );
        } finally {
            setIsRefreshing(false);
        }
    };

    return (
        <section
            id="rsvp"
            className="relative z-10 px-4 py-20 sm:py-28"
        >
            <div className="mx-auto max-w-xl">
                <AnimatePresence mode="wait">
                    {!hasResponded ? (
                        <motion.div
                            key="rsvp-form"
                            initial={{
                                opacity: 0,
                                y: 35,
                            }}
                            whileInView={{
                                opacity: 1,
                                y: 0,
                            }}
                            exit={{
                                opacity: 0,
                                scale: 0.95,
                            }}
                            viewport={{ once: true }}
                            className="relative overflow-hidden rounded-[36px] border border-white/80 bg-white/85 p-6 text-center shadow-[0_25px_80px_rgba(219,112,147,0.18)] backdrop-blur-xl sm:p-10"
                        >
                            <div className="pointer-events-none absolute inset-3 rounded-[28px] border border-[#e8c58e]/40" />

                            <div className="relative z-10">
                                <Crown
                                    size={48}
                                    strokeWidth={1.3}
                                    className="mx-auto text-gold"
                                />

                                <p className="mt-6 text-xs uppercase tracking-[0.25em] text-pink-400">
                                    A Little Question From Aezrael Cate
                                </p>

                                <h2
                                    className="mt-5 text-5xl leading-tight text-[#d46b9c] sm:text-6xl"
                                    style={{
                                        fontFamily:
                                            "'Great Vibes', cursive",
                                    }}
                                >
                                    Will you be my {guest.role}?
                                </h2>

                                <p className="mt-5 text-sm text-[#a86c80]">
                                    Dear {guest.name},
                                </p>

                                <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-gray-500">
                                    I'm still little, but I would
                                    love to have you by my side
                                    as I grow. Will you be part
                                    of my special journey?
                                </p>

                                <form
                                    onSubmit={handleSubmit}
                                    className="mt-8 space-y-5"
                                >
                                    <div className="grid gap-3">
                                        <button
                                            type="button"
                                            disabled={isSubmitting}
                                            onClick={() =>
                                                setAnswer("yes")
                                            }
                                            aria-pressed={
                                                answer === "yes"
                                            }
                                            className={`flex items-center justify-center gap-3 rounded-2xl border-2 px-5 py-4 text-sm font-medium transition disabled:opacity-60 ${answer === "yes"
                                                ? "border-pink-400 bg-pink-100 text-pink-600"
                                                : "border-pink-100 bg-white text-gray-500 hover:border-pink-300"
                                                }`}
                                        >
                                            <Heart
                                                size={20}
                                                fill={
                                                    answer === "yes"
                                                        ? "currentColor"
                                                        : "none"
                                                }
                                            />
                                            Yes, I'd Love To!
                                        </button>

                                        <button
                                            type="button"
                                            disabled={isSubmitting}
                                            onClick={() =>
                                                setAnswer("love")
                                            }
                                            aria-pressed={
                                                answer === "love"
                                            }
                                            className={`flex items-center justify-center gap-3 rounded-2xl border-2 px-5 py-4 text-sm font-medium transition disabled:opacity-60 ${answer === "love"
                                                ? "border-pink-400 bg-pink-100 text-pink-600"
                                                : "border-pink-100 bg-white text-gray-500 hover:border-pink-300"
                                                }`}
                                        >
                                            <Mail size={20} />
                                            Send My Love
                                        </button>
                                    </div>

                                    <div className="text-left">
                                        <label
                                            htmlFor="rsvp-message"
                                            className="mb-2 block text-sm font-medium text-[#a86c80]"
                                        >
                                            A message for baby (optional)
                                        </label>

                                        <textarea
                                            id="rsvp-message"
                                            value={message}
                                            disabled={isSubmitting}
                                            onChange={(e) =>
                                                setMessage(e.target.value)
                                            }
                                            placeholder="Write your sweet wishes here..."
                                            rows={4}
                                            maxLength={500}
                                            className="w-full resize-none rounded-2xl border border-pink-200 bg-pink-50/50 px-4 py-3 text-sm text-gray-600 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 disabled:opacity-60"
                                        />
                                    </div>

                                    {submitError && (
                                        <p
                                            role="alert"
                                            className="rounded-xl bg-red-50 p-3 text-sm text-red-600"
                                        >
                                            {submitError}
                                        </p>
                                    )}

                                    <motion.button
                                        type="submit"
                                        disabled={
                                            !answer ||
                                            isSubmitting ||
                                            !guest.token
                                        }
                                        whileHover={
                                            answer && !isSubmitting
                                                ? { scale: 1.03 }
                                                : {}
                                        }
                                        whileTap={
                                            answer && !isSubmitting
                                                ? { scale: 0.97 }
                                                : {}
                                        }
                                        className="flex w-full items-center justify-center gap-2 rounded-full bg-linear-to-r from-pink-400 to-pink-500 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-pink-200 transition disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <Send size={18} />
                                        {isSubmitting
                                            ? "Submitting RSVP..."
                                            : "Submit My Response"}
                                    </motion.button>
                                </form>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="rsvp-success"
                            initial={{
                                opacity: 0,
                                scale: 0.8,
                                y: 30,
                            }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                                y: 0,
                            }}
                            exit={{
                                opacity: 0,
                                scale: 0.9,
                            }}
                            transition={{
                                type: "spring",
                                stiffness: 120,
                                damping: 15,
                            }}
                            className="rounded-[36px] border border-white bg-white/90 p-8 text-center shadow-2xl shadow-pink-200/40 sm:p-12"
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{
                                    delay: 0.2,
                                    type: "spring",
                                }}
                            >
                                <CheckCircle2
                                    size={65}
                                    className="mx-auto text-pink-400"
                                />
                            </motion.div>

                            <Sparkles
                                size={28}
                                className="mx-auto mt-5 text-gold"
                            />

                            <h2
                                className="mt-5 text-6xl text-[#d46b9c]"
                                style={{
                                    fontFamily:
                                        "'Great Vibes', cursive",
                                }}
                            >
                                Thank You!
                            </h2>

                            <p className="mt-5 text-sm leading-7 text-gray-600">
                                {finalAnswer === "yes"
                                    ? `Thank you, ${guest.name}! Aezrael Cate is so blessed to have you as her ${guest.role}.`
                                    : `Thank you for your love and blessings, ${guest.name}!`}
                            </p>

                            <p className="mt-4 text-sm font-medium text-[#a86c80]">
                                Your RSVP has been recorded.
                            </p>

                            {savedResponse?.submittedAt && (
                                <p className="mt-2 text-xs text-gray-400">
                                    Submitted on{" "}
                                    {new Date(
                                        savedResponse.submittedAt
                                    ).toLocaleString()}
                                </p>
                            )}

                            {finalMessage && (
                                <div className="mt-5 rounded-2xl bg-pink-50 p-4 text-left">
                                    <p className="text-xs font-medium text-[#a86c80]">
                                        Your message for Aezrael Cate
                                    </p>

                                    <p className="mt-2 whitespace-pre-wrap wrap-break-word text-sm text-gray-600">
                                        {finalMessage}
                                    </p>
                                </div>
                            )}

                            <div className="mt-8 space-y-3">
                                <button
                                    type="button"
                                    onClick={handleMessenger}
                                    className="flex w-full items-center justify-center gap-2 rounded-full bg-pink-500 px-5 py-3 text-sm font-medium text-white"
                                >
                                    <Send size={17} />
                                    Open Messenger
                                </button>

                                <button
                                    type="button"
                                    onClick={handleCopy}
                                    className="flex w-full items-center justify-center gap-2 rounded-full border border-pink-200 bg-white px-5 py-3 text-sm font-medium text-pink-500"
                                >
                                    <Copy size={17} />
                                    {copied
                                        ? "Message Copied!"
                                        : "Copy RSVP Message"}
                                </button>

                                <button
                                    type="button"
                                    disabled={isRefreshing}
                                    onClick={handleRefresh}
                                    className="mx-auto flex items-center justify-center gap-2 pt-3 text-xs text-gray-400 hover:text-pink-500 disabled:opacity-60"
                                >
                                    <RefreshCw
                                        size={14}
                                        className={
                                            isRefreshing
                                                ? "animate-spin"
                                                : ""
                                        }
                                    />
                                    Refresh RSVP Status
                                </button>

                                {submitError && (
                                    <p
                                        role="alert"
                                        className="text-xs text-red-600"
                                    >
                                        {submitError}
                                    </p>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}
