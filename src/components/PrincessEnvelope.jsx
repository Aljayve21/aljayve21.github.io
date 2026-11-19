
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Heart, RotateCcw, Sparkles } from "lucide-react";

import { useInvitation } from "../contexts/InvitationContext";

export default function PrincessEnvelope() {
    const [isOpen, setIsOpen] = useState(false);

    // Verified guest data from Supabase.
    // Never trust URL name/role parameters.
    const { guest, isVerified } = useInvitation();

    if (!isVerified || !guest) {
        return null;
    }

    const guestName = guest.name;
    const role = guest.role;

    return (
        <section
            id="invitation"
            className="relative z-10 flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-20"
        >
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-10 text-center"
            >
                <Sparkles
                    className="mx-auto mb-4 text-gold"
                    size={30}
                />

                <h2
                    className="text-5xl text-[#d46b9c] sm:text-6xl"
                    style={{
                        fontFamily: "'Great Vibes', cursive",
                    }}
                >
                    A Special Invitation
                </h2>

                <p className="mt-3 text-sm text-[#a86c80]">
                    A little message, wrapped with love.
                </p>
            </motion.div>

            <div className="relative flex w-full max-w-lg flex-col items-center">
                <div className="relative flex h-75 w-full max-w-90 items-end justify-center perspective-[1000px]">
                    {/* Envelope body */}
                    <div className="absolute bottom-0 h-55 w-full rounded-xl bg-[#f7a9c5] shadow-[0_20px_55px_rgba(204,92,139,0.25)]" />

                    {/* Envelope back flap */}
                    <motion.div
                        className="absolute bottom-27.5 z-10 h-27.5 w-full origin-bottom bg-[#f5b8d0]"
                        style={{
                            clipPath:
                                "polygon(0 0, 100% 0, 50% 100%)",
                            backfaceVisibility: "hidden",
                        }}
                        animate={{
                            rotateX: isOpen ? 180 : 0,
                            zIndex: isOpen ? 0 : 30,
                        }}
                        transition={{ duration: 0.75 }}
                    />

                    {/* Letter */}
                    <motion.div
                        initial={false}
                        animate={{
                            y: isOpen ? -120 : 0,
                            scale: isOpen ? 1.03 : 0.9,
                        }}
                        transition={{
                            delay: isOpen ? 0.45 : 0,
                            duration: 0.8,
                            type: "spring",
                            stiffness: 90,
                            damping: 16,
                        }}
                        className="absolute bottom-5 z-20 flex h-50 w-[85%] flex-col items-center justify-center rounded-lg border border-[#e8c58e] bg-[#fffaf6] px-4 text-center shadow-md"
                    >
                        <Heart
                            size={20}
                            fill="currentColor"
                            className="mb-3 text-pink-400"
                        />

                        <p className="text-xs uppercase tracking-widest text-gold">
                            Dear {guestName}
                        </p>

                        <h3
                            className="mt-3 text-3xl text-[#d46b9c]"
                            style={{
                                fontFamily: "'Great Vibes', cursive",
                            }}
                        >
                            Will you be my {role}?
                        </h3>

                        <p className="mt-3 text-xs text-gray-500">
                            With love, Aezrael Cate
                        </p>
                    </motion.div>

                    {/* Envelope front */}
                    <div
                        className="pointer-events-none absolute bottom-0 z-30 h-37.5 w-full rounded-b-xl bg-[#f28fb5]"
                        style={{
                            clipPath:
                                "polygon(0 0, 50% 65%, 100% 0, 100% 100%, 0 100%)",
                        }}
                    />

                    {/* Heart seal */}
                    <AnimatePresence>
                        {!isOpen && (
                            <motion.div
                                initial={{ scale: 1 }}
                                exit={{
                                    scale: 0,
                                    opacity: 0,
                                }}
                                className="absolute bottom-25 z-40 flex h-14 w-14 items-center justify-center rounded-full border-4 border-[#f9d8e4] bg-white shadow-lg"
                            >
                                <Heart
                                    size={25}
                                    fill="currentColor"
                                    className="text-pink-400"
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() =>
                        setIsOpen((previous) => !previous)
                    }
                    className="relative z-40 mt-12 flex items-center gap-2 rounded-full bg-linear-to-r from-pink-400 to-pink-500 px-8 py-3 font-medium text-white shadow-lg shadow-pink-200"
                >
                    {isOpen ? (
                        <RotateCcw size={18} />
                    ) : (
                        <Heart size={18} />
                    )}

                    {isOpen
                        ? "Close Invitation"
                        : "Open My Letter"}
                </motion.button>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{
                            opacity: 0,
                            y: 35,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        exit={{
                            opacity: 0,
                            y: 20,
                        }}
                        transition={{ delay: 0.35 }}
                        className="mt-12 w-full max-w-md rounded-[28px] border border-white bg-white/80 p-8 text-center shadow-xl shadow-pink-200/40 backdrop-blur-md"
                    >
                        <p className="text-sm text-gold">
                            Dear {guestName},
                        </p>

                        <h3
                            className="mt-4 text-4xl text-[#d46b9c]"
                            style={{
                                fontFamily:
                                    "'Great Vibes', cursive",
                            }}
                        >
                            Will you be my {role}?
                        </h3>

                        <p className="mt-5 text-sm leading-7 text-gray-600">
                            I'm still little, but I have a big
                            question for you! Will you guide me,
                            pray for me, and be part of my
                            journey as I grow?
                        </p>

                        <div className="my-6 text-pink-400">
                            ♥ ♥ ♥
                        </div>

                        <p className="text-sm font-medium text-[#a86c80]">
                            My Christening — December 2026
                        </p>

                        <p className="mt-2 text-xs text-gray-400">
                            Exact Date & Venue To Be Announced
                        </p>

                        <p
                            className="mt-7 text-3xl text-[#d46b9c]"
                            style={{
                                fontFamily:
                                    "'Great Vibes', cursive",
                            }}
                        >
                            Love, Aezrael Cate
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
