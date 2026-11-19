
/* eslint-disable react/only-export-components */
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import {
    CheckCircle2,
    AlertCircle,
    Info,
    X,
} from "lucide-react";

const ToastContext = createContext(null);

const toastStyles = {
    success: {
        icon: CheckCircle2,
        iconClass: "text-emerald-500",
        borderClass: "border-emerald-200",
    },
    error: {
        icon: AlertCircle,
        iconClass: "text-rose-500",
        borderClass: "border-rose-200",
    },
    info: {
        icon: Info,
        iconClass: "text-pink-500",
        borderClass: "border-pink-200",
    },
};

function ToastItem({ toast, onClose }) {
    const style =
        toastStyles[toast.type] || toastStyles.info;

    const Icon = style.icon;

    return (
        <motion.div
            layout
            initial={{
                opacity: 0,
                x: 60,
                scale: 0.95,
            }}
            animate={{
                opacity: 1,
                x: 0,
                scale: 1,
            }}
            exit={{
                opacity: 0,
                x: 60,
                scale: 0.95,
            }}
            transition={{
                duration: 0.25,
            }}
            role={toast.type === "error" ? "alert" : "status"}
            className={`pointer-events-auto flex w-full items-start gap-3 rounded-2xl border bg-white p-4 shadow-xl shadow-pink-200/40 ${style.borderClass}`}
        >
            <div className="rounded-xl bg-pink-50 p-2">
                <Icon
                    size={20}
                    className={style.iconClass}
                />
            </div>

            <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-[#a86c80]">
                    {toast.title}
                </p>

                {toast.message && (
                    <p className="mt-1 wrap-break-word text-xs leading-5 text-gray-500">
                        {toast.message}
                    </p>
                )}
            </div>

            <button
                type="button"
                onClick={() => onClose(toast.id)}
                aria-label="Dismiss notification"
                className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-pink-50 hover:text-pink-600"
            >
                <X size={17} />
            </button>
        </motion.div>
    );
}

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);
    const nextId = useRef(0);
    const timers = useRef(new Map());

    const dismissToast = useCallback((id) => {
        const timer = timers.current.get(id);

        if (timer !== undefined) {
            clearTimeout(timer);
            timers.current.delete(id);
        }

        setToasts((previous) =>
            previous.filter((toast) => toast.id !== id)
        );
    }, []);

    const showToast = useCallback(
        ({
            type = "info",
            title,
            message = "",
            duration = 4000,
        }) => {
            const id = ++nextId.current;

            setToasts((previous) => [
                ...previous,
                {
                    id,
                    type,
                    title,
                    message,
                },
            ]);

            if (duration > 0) {
                const timer = setTimeout(() => {
                    dismissToast(id);
                }, duration);

                timers.current.set(id, timer);
            }

            return id;
        },
        [dismissToast]
    );

    useEffect(() => {
        const activeTimers = timers.current;

        return () => {
            activeTimers.forEach((timer) => {
                clearTimeout(timer);
            });

            activeTimers.clear();
        };
    }, []);

    return (
        <ToastContext.Provider
            value={{
                showToast,
                dismissToast,
            }}
        >
            {children}

            {createPortal(
                <div
                    className="pointer-events-none fixed top-4 right-4 left-4 z-9999 flex flex-col items-end gap-3 sm:left-auto sm:w-96"
                    aria-label="Notifications"
                >
                    <AnimatePresence initial={false}>
                        {toasts.map((toast) => (
                            <ToastItem
                                key={toast.id}
                                toast={toast}
                                onClose={dismissToast}
                            />
                        ))}
                    </AnimatePresence>
                </div>,
                document.body
            )}
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);

    if (!context) {
        throw new Error(
            "useToast must be used inside ToastProvider."
        );
    }

    return context;
}
