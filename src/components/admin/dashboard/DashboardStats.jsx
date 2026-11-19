
import { motion } from "motion/react";
import {
    Users,
    CheckCircle2,
    Heart,
    Clock3,
} from "lucide-react";

const cards = [
    {
        key: "total",
        label: "Total Invitations",
        icon: Users,
        color: "text-[#c99b54]",
        background: "bg-amber-50",
    },
    {
        key: "accepted",
        label: "Accepted",
        icon: CheckCircle2,
        color: "text-emerald-600",
        background: "bg-emerald-50",
    },
    {
        key: "declined",
        label: "Declined",
        icon: Heart,
        color: "text-rose-500",
        background: "bg-rose-50",
    },
    {
        key: "pending",
        label: "Pending",
        icon: Clock3,
        color: "text-violet-500",
        background: "bg-violet-50",
    },
];

export default function DashboardStats({ stats }) {
    return (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {cards.map((card, index) => {
                const Icon = card.icon;

                return (
                    <motion.div
                        key={card.key}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.08 }}
                        className="rounded-2xl border border-white bg-white/90 p-4 shadow-lg shadow-pink-200/20 sm:p-5"
                    >
                        <div
                            className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.background} ${card.color}`}
                        >
                            <Icon size={21} />
                        </div>

                        <p className="mt-4 text-3xl font-semibold text-gray-800">
                            {stats[card.key] ?? 0}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                            {card.label}
                        </p>
                    </motion.div>
                );
            })}
        </div>
    );
}
