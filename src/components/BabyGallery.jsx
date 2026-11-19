
import { motion } from "motion/react";
import { Camera, Heart, Sparkles } from "lucide-react";
import { event } from "../config/event";

export default function BabyGallery() {
    return (
        <section
            id="gallery"
            className="relative z-10 px-4 py-20 sm:py-28"
        >
            <div className="mx-auto max-w-6xl">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-12 text-center"
                >
                    <Camera
                        size={30}
                        className="mx-auto mb-4 text-gold"
                    />

                    <p className="text-xs uppercase tracking-[0.3em] text-pink-400">
                        Precious Little Moments
                    </p>

                    <h2
                        className="mt-4 text-5xl text-[#d46b9c] sm:text-6xl"
                        style={{ fontFamily: "'Great Vibes', cursive" }}
                    >
                        Meet Our Princess
                    </h2>

                    <p className="mt-4 text-sm text-gray-500">
                        A little bundle of joy, loved beyond words.
                    </p>
                </motion.div>

                <div
                    className={`grid gap-6 ${event.photos.length === 1
                        ? "mx-auto max-w-md grid-cols-1"
                        : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                        }`}
                >
                    {event.photos.map((photo, index) => (
                        <motion.figure
                            key={photo.id}
                            initial={{ opacity: 0, y: 40, scale: 0.95 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.12 }}
                            whileHover={{ y: -6 }}
                            className="group rounded-[28px] border border-white bg-white/80 p-3 shadow-xl shadow-pink-200/40"
                        >
                            <div className="overflow-hidden rounded-[20px]">
                                <motion.img
                                    src={photo.src}
                                    alt={photo.alt}
                                    loading="lazy"
                                    whileHover={{ scale: 1.06 }}
                                    transition={{ duration: 0.4 }}
                                    className="aspect-square w-full object-cover"
                                />
                            </div>

                            <figcaption className="flex items-center justify-center gap-2 py-5 text-sm font-medium text-[#a86c80]">
                                <Heart
                                    size={15}
                                    fill="currentColor"
                                    className="text-pink-400"
                                />
                                {photo.caption}
                                <Sparkles
                                    size={15}
                                    className="text-gold"
                                />
                            </figcaption>
                        </motion.figure>
                    ))}
                </div>
            </div>
        </section>
    );
}
