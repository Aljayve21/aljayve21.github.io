
import { motion } from "motion/react";
import { Crown } from "lucide-react";

export default function PrincessCrown() {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.5, rotate: -15 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, type: "spring" }}
            className="relative mx-auto flex w-fit justify-center"
        >
            <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
            >
                <Crown
                    size={76}
                    strokeWidth={1.2}
                    className="text-gold drop-shadow-lg"
                />
            </motion.div>
        </motion.div>
    );
}
