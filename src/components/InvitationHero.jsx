
import { motion } from "motion/react";
import { Heart, Sparkles } from "lucide-react";
import PrincessCrown from "./PrincessCrown";

export default function InvitationHero() {
    return (
        <section className="relative z-10 flex min-h-screen items-center justify-center px-4 py-16">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="relative w-full max-w-xl overflow-hidden rounded-[36px] border border-white/80 bg-white/80 p-5 text-center shadow-[0_25px_80px_rgba(219,112,147,0.2)] backdrop-blur-xl sm:p-10"
            >
                <div className="pointer-events-none absolute inset-3 rounded-[28px] border border-[#e8c58e]/40" />

                <div className="relative z-10">
                    <PrincessCrown />

                    <p className="mt-5 text-xs uppercase tracking-[0.3em] text-pink-400">
                        A Little Princess Is Born
                    </p>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="relative mx-auto mt-7 w-full max-w-sm"
                    >
                        <div className="rounded-[28px] border-4 border-white bg-pink-100 p-2 shadow-xl shadow-pink-200/70">
                            <img
                                src="/aezra.png"
                                alt="Aezrael Cate"
                                className="aspect-square w-full rounded-[20px] object-cover"
                            />
                        </div>

                        <motion.div
                            animate={{ rotate: [-10, 10, -10] }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                            className="absolute -right-3 -top-3 text-3xl"
                        >
                            🎀
                        </motion.div>
                    </motion.div>

                    {/* <h1
                        className="mt-8 text-5xl leading-tight text-[#d46b9c] sm:text-7xl"
                        style={{ fontFamily: "'Great Vibes', cursive" }}
                    >
                        Aezrael Cate
                    </h1> */}

                    <div className="my-5 flex items-center justify-center gap-3 text-gold">
                        <span className="h-px w-12 bg-[#e8c58e]" />
                        <Heart size={16} fill="currentColor" />
                        <span className="h-px w-12 bg-[#e8c58e]" />
                    </div>

                    <h2
                        className="text-2xl text-[#a86c80] sm:text-3xl"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        My Christening
                    </h2>

                    <p className="mt-4 text-sm tracking-[0.2em] text-gray-500">
                        DECEMBER 2026
                    </p>

                    <p className="mt-2 text-xs text-gray-400">
                        Date & Venue To Be Announced
                    </p>

                    <motion.button
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() =>
                            document.getElementById("invitation")?.scrollIntoView({
                                behavior: "smooth",
                            })
                        }
                        className="mx-auto mt-9 flex items-center gap-2 rounded-full bg-linear-to-r from-pink-400 to-pink-500 px-8 py-3 font-medium text-white shadow-lg shadow-pink-200"
                    >
                        <Sparkles size={18} />
                        Open My Invitation
                    </motion.button>
                </div>
            </motion.div>
        </section>
    );
}
