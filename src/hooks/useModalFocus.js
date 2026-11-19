
import { useEffect, useRef } from "react";

const FOCUSABLE_SELECTOR = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
].join(",");

let activeModalCount = 0;
let originalBodyOverflow = "";
const backgroundStates = new Map();

function lockBackground(modal) {
    if (activeModalCount === 0) {
        originalBodyOverflow =
            document.body.style.overflow;

        document.body.style.overflow = "hidden";

        // Modal portals are mounted directly
        // under document.body.
        const portalRoot = modal.closest(
            "[data-modal-portal]"
        );

        const activeRoot = portalRoot || modal;

        for (const element of document.body.children) {
            if (
                element === activeRoot ||
                element.contains(activeRoot) ||
                element.tagName === "SCRIPT" ||
                element.tagName === "STYLE"
            ) {
                continue;
            }

            backgroundStates.set(element, element.inert);
            element.inert = true;
        }
    }

    activeModalCount += 1;
}

function unlockBackground() {
    activeModalCount = Math.max(
        0,
        activeModalCount - 1
    );

    if (activeModalCount > 0) return;

    document.body.style.overflow =
        originalBodyOverflow;

    for (const [element, wasInert] of backgroundStates) {
        element.inert = wasInert;
    }

    backgroundStates.clear();
}

export function useModalFocus({
    isOpen = true,
    onClose,
    disabled = false,
}) {
    const modalRef = useRef(null);
    const onCloseRef = useRef(onClose);
    const disabledRef = useRef(disabled);

    useEffect(() => {
        onCloseRef.current = onClose;
    }, [onClose]);

    useEffect(() => {
        disabledRef.current = disabled;
    }, [disabled]);

    useEffect(() => {
        if (!isOpen) return;

        const modal = modalRef.current;
        if (!modal) return;

        const previousFocus = document.activeElement;

        const getFocusableElements = () =>
            Array.from(
                modal.querySelectorAll(FOCUSABLE_SELECTOR)
            ).filter(
                (element) =>
                    element.getClientRects().length > 0 &&
                    !element.closest("[inert]")
            );

        lockBackground(modal);

        const focusable = getFocusableElements();

        if (focusable.length > 0) {
            focusable[0].focus();
        } else {
            modal.focus();
        }

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                event.preventDefault();
                event.stopPropagation();

                if (!disabledRef.current) {
                    onCloseRef.current?.();
                }

                return;
            }

            if (event.key !== "Tab") return;

            const elements = getFocusableElements();

            if (elements.length === 0) {
                event.preventDefault();
                modal.focus();
                return;
            }

            const first = elements[0];
            const last = elements[elements.length - 1];
            const active = document.activeElement;

            if (!modal.contains(active)) {
                event.preventDefault();

                (event.shiftKey ? last : first).focus();
                return;
            }

            if (event.shiftKey && active === first) {
                event.preventDefault();
                last.focus();
            } else if (
                !event.shiftKey &&
                active === last
            ) {
                event.preventDefault();
                first.focus();
            }
        };

        document.addEventListener(
            "keydown",
            handleKeyDown,
            true
        );

        return () => {
            document.removeEventListener(
                "keydown",
                handleKeyDown,
                true
            );

            unlockBackground();

            if (
                previousFocus instanceof HTMLElement &&
                previousFocus.isConnected
            ) {
                previousFocus.focus();
            }
        };
    }, [isOpen]);

    return modalRef;
}
