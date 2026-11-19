
import { motion } from "motion/react";
import {
    CalendarDays,
    Clock3,
    Church,
    MapPin,
    Heart,
    Sparkles,
} from "lucide-react";

import { event } from "../config/event";

const details = [
    {
        icon: CalendarDays,
        title: "Christening Date",
        value: event.date || event.month,
        subtitle: event.date ? "" : "Exact date to be announced",
    },
    {
        icon: Clock3,
        title: "Ceremony Time",
        value: event.time || "To Be Announced",
        subtitle: "Please check back for updates",
    },
    {
        icon: Church,
        title: "Church Ceremony",
        value: event.church.name,
        subtitle: event.church.address || "Location coming soon",
        mapUrl: event.church.mapUrl,
    },
    {
        icon: MapPin,
        title: "Reception Venue",
        value: event.reception.name,
        subtitle: event.reception.address || "Location coming soon",
        mapUrl: event.reception.mapUrl,
    },
];

export default function ChristeningDetails() {
    return (
        <section
            id="details"
            className="relative z-10 px-4 py-20 sm:py-28"
        >
            <div className="mx-auto max-w-6xl">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-12 text-center"
                >
                    <Sparkles
                        className="mx-auto mb-4 text-gold"
                        size={30}
                    />

                    <p className="text-xs uppercase tracking-[0.3em] text-pink-400">
                        Save The Celebration
                    </p>

                    <h2
                        className="mt-4 text-5xl text-[#d46b9c] sm:text-6xl"
                        style={{ fontFamily: "'Great Vibes', cursive" }}
                    >
                        Christening Details
                    </h2>

                    <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-gray-500">
                        A beautiful day filled with love, prayers,
                        and blessings is coming soon.
                    </p>
                </motion.div>

                <div className="grid gap-5 sm:grid-cols-2">
                    {details.map((detail, index) => {
                        const Icon = detail.icon;

                        return (
                            <motion.div
                                key={detail.title}
                                initial={{ opacity: 0, y: 35 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -5 }}
                                className="relative overflow-hidden rounded-[28px] border border-white/80 bg-white/75 p-7 text-center shadow-xl shadow-pink-200/30 backdrop-blur-md"
                            >
                                <div className="pointer-events-none absolute inset-3 rounded-[20px] border border-[#e8c58e]/30" />

                                <div className="relative z-10">
                                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-pink-100 text-pink-500">
                                        <Icon size={25} strokeWidth={1.5} />
                                    </div>

                                    <h3 className="mt-5 text-sm font-semibold uppercase tracking-wider text-[#a86c80]">
                                        {detail.title}
                                    </h3>

                                    <p
                                        className="mt-3 text-2xl text-[#d46b9c]"
                                        style={{
                                            fontFamily: "'Playfair Display', serif",
                                        }}
                                    >
                                        {detail.value}
                                    </p>

                                    <p className="mt-2 text-xs text-gray-400">
                                        {detail.subtitle}
                                    </p>

                                    {detail.mapUrl && (
                                        <a
                                            href={detail.mapUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-5 inline-flex items-center gap-2 rounded-full bg-pink-100 px-5 py-2 text-xs font-medium text-pink-600 hover:bg-pink-200"
                                        >
                                            <MapPin size={14} />
                                            View Location
                                        </a>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                <div className="mt-12 flex items-center justify-center gap-3 text-pink-400">
                    <Heart size={16} fill="currentColor" />
                    <p className="text-center text-xs tracking-widest">
                        DECEMBER 2026 · WITH LOVE
                    </p>
                    <Heart size={16} fill="currentColor" />
                </div>
            </div>
        </section>
    );
}
