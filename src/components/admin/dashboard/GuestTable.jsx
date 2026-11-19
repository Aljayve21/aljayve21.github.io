
import { useMemo, useState } from "react";
import { createPortal } from "react-dom";

import {
    Search,
    Copy,
    Check,
    MessageCircle,
    ChevronDown,
    ChevronUp,
    ChevronLeft,
    ChevronRight,
    ArrowUpDown,
    QrCode,
    Trash2,
    Pencil,
    Users,
} from "lucide-react";

import {
    buildInvitationLink,
} from "../../../services/adminDashboardService";

import { useToast } from "../../ui/ToastProvider";

import QRInvitationModal from "../QRInvitationModal";
import GuestEditModal from "../GuestEditModal";
import GuestDeleteModal from "./GuestDeleteModal";

// ============================================
// CONSTANTS
// ============================================

const PAGE_SIZES = [5, 10, 20, 50];

const statusStyles = {
    accepted: "bg-emerald-100 text-emerald-700",
    declined: "bg-rose-100 text-rose-700",
    pending: "bg-amber-100 text-amber-700",
};

const focusStyles =
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500";

// ============================================
// STATUS BADGE
// ============================================

function StatusBadge({ status }) {
    return (
        <span
            className={`inline-flex shrink-0 rounded-full px-3 py-1 text-xs font-medium capitalize ${statusStyles[status] ||
                "bg-gray-100 text-gray-600"
                }`}
        >
            {status || "Unknown"}
        </span>
    );
}

// ============================================
// ACTION BUTTON
// ============================================

function ActionButton({
    icon: Icon,
    label,
    onClick,
    variant = "pink",
}) {
    const styles = {
        pink:
            "border-pink-100 bg-pink-50 text-pink-600 hover:bg-pink-100",
        neutral:
            "border-gray-100 bg-gray-50 text-gray-600 hover:bg-gray-100",
        danger:
            "border-red-100 bg-red-50 text-red-500 hover:bg-red-100",
    };

    return (
        <button
            type="button"
            onClick={onClick}
            title={label}
            aria-label={label}
            className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition-colors duration-200 ${focusStyles} ${styles[variant]}`}
        >
            <Icon size={18} aria-hidden="true" />
        </button>
    );
}

// ============================================
// RSVP DETAILS
// ============================================

function RSVPDetails({
    response,
    expanded,
    onToggle,
    guestId,
    guestName,
    view,
}) {
    if (!response) {
        return (
            <span className="text-xs text-gray-400">
                No response
            </span>
        );
    }

    const detailsId = `rsvp-${view}-${guestId}`;

    return (
        <div className="min-w-0">
            <button
                type="button"
                onClick={onToggle}
                aria-expanded={expanded}
                aria-controls={detailsId}
                aria-label={`${expanded ? "Hide" : "Show"
                    } RSVP details for ${guestName}`}
                className={`inline-flex min-h-11 items-center gap-2 rounded-lg px-1 text-sm font-medium text-[#a86c80] transition-colors hover:text-pink-600 ${focusStyles}`}
            >
                <MessageCircle
                    size={16}
                    aria-hidden="true"
                />

                RSVP Details

                {expanded ? (
                    <ChevronUp
                        size={15}
                        aria-hidden="true"
                    />
                ) : (
                    <ChevronDown
                        size={15}
                        aria-hidden="true"
                    />
                )}
            </button>

            <div
                id={detailsId}
                hidden={!expanded}
                className="mt-3 max-w-full rounded-xl bg-pink-50 p-3 text-xs leading-6 text-gray-600"
            >
                <p>
                    <strong>Answer: </strong>
                    {response.answer === "yes"
                        ? "Accepted"
                        : "Sent love"}
                </p>

                <p className="guest-text mt-1 whitespace-pre-wrap wrap-break-word">
                    <strong>Message: </strong>
                    {response.message || "No message"}
                </p>

                {response.submitted_at && (
                    <p className="mt-2 text-gray-400">
                        {new Date(
                            response.submitted_at
                        ).toLocaleString()}
                    </p>
                )}
            </div>
        </div>
    );
}

// ============================================
// GUEST TABLE
// ============================================

export default function GuestTable({
    invitations = [],
    onChanged,
}) {
    const { showToast } = useToast();

    // ----------------------------------------
    // FILTER STATES
    // ----------------------------------------

    const [search, setSearch] = useState("");

    const [statusFilter, setStatusFilter] =
        useState("all");

    // ----------------------------------------
    // SORTING & PAGINATION STATES
    // ----------------------------------------

    const [sortBy, setSortBy] = useState("newest");

    const [pageSize, setPageSize] = useState(5);

    const [currentPage, setCurrentPage] =
        useState(1);

    // ----------------------------------------
    // UI STATES
    // ----------------------------------------

    const [expandedId, setExpandedId] =
        useState(null);

    const [copiedId, setCopiedId] =
        useState(null);

    const [selectedQRGuest, setSelectedQRGuest] =
        useState(null);

    const [editingGuest, setEditingGuest] =
        useState(null);

    const [deletingGuest, setDeletingGuest] =
        useState(null);

    // ========================================
    // FILTERING & SORTING
    // ========================================

    const filtered = useMemo(() => {
        const searchTerm = search
            .trim()
            .toLocaleLowerCase();

        const results = invitations.filter(
            (guest) => {
                const matchesSearch =
                    (guest.guest_name || "")
                        .toLocaleLowerCase()
                        .includes(searchTerm);

                const matchesStatus =
                    statusFilter === "all" ||
                    guest.status === statusFilter;

                return (
                    matchesSearch &&
                    matchesStatus
                );
            }
        );

        results.sort((a, b) => {
            if (sortBy === "name-asc") {
                return (a.guest_name || "").localeCompare(
                    b.guest_name || ""
                );
            }

            if (sortBy === "name-desc") {
                return (b.guest_name || "").localeCompare(
                    a.guest_name || ""
                );
            }

            const dateA =
                Date.parse(a.created_at) || 0;

            const dateB =
                Date.parse(b.created_at) || 0;

            if (sortBy === "oldest") {
                return dateA - dateB;
            }

            return dateB - dateA;
        });

        return results;
    }, [
        invitations,
        search,
        statusFilter,
        sortBy,
    ]);

    // ========================================
    // PAGINATION
    // ========================================

    const totalPages = Math.max(
        1,
        Math.ceil(filtered.length / pageSize)
    );

    const safePage = Math.min(
        currentPage,
        totalPages
    );

    const startIndex =
        (safePage - 1) * pageSize;

    const paginatedGuests = filtered.slice(
        startIndex,
        startIndex + pageSize
    );

    const showingFrom =
        filtered.length === 0
            ? 0
            : startIndex + 1;

    const showingTo = Math.min(
        startIndex + pageSize,
        filtered.length
    );

    // ========================================
    // FILTER HANDLERS
    // ========================================

    const handleSearchChange = (event) => {
        setSearch(event.target.value);
        setCurrentPage(1);
    };

    const handleStatusChange = (event) => {
        setStatusFilter(event.target.value);
        setCurrentPage(1);
    };

    const handleSortChange = (event) => {
        setSortBy(event.target.value);
        setCurrentPage(1);
    };

    const handlePageSizeChange = (event) => {
        setPageSize(Number(event.target.value));
        setCurrentPage(1);
    };

    // ========================================
    // PAGINATION HANDLERS
    // ========================================

    const goToPreviousPage = () => {
        setCurrentPage(
            Math.max(1, safePage - 1)
        );
    };

    const goToNextPage = () => {
        setCurrentPage(
            Math.min(totalPages, safePage + 1)
        );
    };

    // ========================================
    // COPY INVITATION LINK
    // ========================================

    const copyLink = async (guest) => {
        try {
            const invitationURL =
                buildInvitationLink(guest);

            await navigator.clipboard.writeText(
                invitationURL
            );

            setCopiedId(guest.id);

            showToast({
                type: "success",
                title: "Invitation Link Copied!",
                message: `Invitation link for ${guest.guest_name} is ready to share.`,
            });
        } catch {
            showToast({
                type: "error",
                title: "Copy Failed",
                message:
                    "Unable to copy invitation link. Check clipboard permissions.",
            });
        }
    };

    // ========================================
    // GENERATE QR CARD
    // ========================================

    const openQRCard = (guest) => {
        try {
            if (!guest.token) {
                throw new Error(
                    "Invitation token is missing."
                );
            }

            const invitationURL =
                buildInvitationLink(guest);

            setSelectedQRGuest({
                ...guest,
                invitationURL,
            });
        } catch (error) {
            showToast({
                type: "error",
                title: "QR Card Error",
                message:
                    error.message ||
                    "Unable to open QR card.",
            });
        }
    };

    // ========================================
    // GUEST ACTIONS
    // ========================================

    const renderActions = (guest) => (
        <div
            role="group"
            aria-label={`Actions for ${guest.guest_name}`}
            className="guest-actions flex flex-wrap items-center gap-2"
        >
            <ActionButton
                icon={
                    copiedId === guest.id
                        ? Check
                        : Copy
                }
                label={
                    copiedId === guest.id
                        ? `Invitation link copied for ${guest.guest_name}`
                        : `Copy link for ${guest.guest_name}`
                }
                onClick={() => copyLink(guest)}
            />

            <ActionButton
                icon={QrCode}
                label={`Generate QR for ${guest.guest_name}`}
                onClick={() => openQRCard(guest)}
            />

            <ActionButton
                icon={Pencil}
                label={`Edit ${guest.guest_name}`}
                onClick={() =>
                    setEditingGuest(guest)
                }
                variant="neutral"
            />

            <ActionButton
                icon={Trash2}
                label={`Delete ${guest.guest_name}`}
                onClick={() =>
                    setDeletingGuest(guest)
                }
                variant="danger"
            />
        </div>
    );

    // ========================================
    // RSVP RENDER HELPER
    // ========================================

    const renderRSVP = (guest, view) => {
        const response =
            guest.rsvp_responses?.[0];

        const expanded =
            expandedId === guest.id;

        return (
            <RSVPDetails
                response={response}
                expanded={expanded}
                guestId={guest.id}
                guestName={guest.guest_name}
                view={view}
                onToggle={() =>
                    setExpandedId(
                        expanded
                            ? null
                            : guest.id
                    )
                }
            />
        );
    };

    // ========================================
    // RENDER
    // ========================================

    return (
        <>
            <section
                aria-labelledby="guest-management-title"
                className="admin-card min-w-0 overflow-hidden rounded-[28px] border border-white bg-white/90 shadow-xl shadow-pink-200/30"
            >
                {/* HEADER */}
                <div className="p-4 sm:p-6">
                    <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                            <h2
                                id="guest-management-title"
                                className="text-lg font-semibold text-[#a86c80]"
                            >
                                Guest Management
                            </h2>

                            <p className="mt-1 text-sm leading-6 text-gray-500">
                                Manage invitation links,
                                QR cards, and RSVP responses.
                            </p>
                        </div>

                        <div
                            aria-hidden="true"
                            className="shrink-0 rounded-2xl bg-pink-50 p-3 text-pink-500"
                        >
                            <Users size={22} />
                        </div>
                    </div>

                    {/* SEARCH & FILTERS */}
                    <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_auto_auto]">
                        <div className="relative min-w-0">
                            <Search
                                size={17}
                                aria-hidden="true"
                                className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
                            />

                            <input
                                type="search"
                                value={search}
                                onChange={
                                    handleSearchChange
                                }
                                placeholder="Search guest name..."
                                aria-label="Search guests"
                                className={`w-full min-w-0 rounded-xl border border-pink-200 bg-white py-3 pr-4 pl-10 text-sm outline-none focus:border-pink-400 ${focusStyles}`}
                            />
                        </div>

                        <select
                            value={statusFilter}
                            onChange={
                                handleStatusChange
                            }
                            aria-label="Filter by RSVP status"
                            className={`min-w-0 rounded-xl border border-pink-200 bg-white px-4 py-3 text-sm outline-none focus:border-pink-400 ${focusStyles}`}
                        >
                            <option value="all">
                                All Statuses
                            </option>

                            <option value="accepted">
                                Accepted
                            </option>

                            <option value="declined">
                                Declined
                            </option>

                            <option value="pending">
                                Pending
                            </option>
                        </select>

                        <div className="relative min-w-0 sm:col-span-2 lg:col-span-1">
                            <ArrowUpDown
                                size={16}
                                aria-hidden="true"
                                className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-pink-500"
                            />

                            <select
                                value={sortBy}
                                onChange={
                                    handleSortChange
                                }
                                aria-label="Sort guests"
                                className={`w-full min-w-0 rounded-xl border border-pink-200 bg-white py-3 pr-4 pl-10 text-sm text-gray-600 outline-none focus:border-pink-400 ${focusStyles}`}
                            >
                                <option value="newest">
                                    Newest First
                                </option>

                                <option value="oldest">
                                    Oldest First
                                </option>

                                <option value="name-asc">
                                    Name A–Z
                                </option>

                                <option value="name-desc">
                                    Name Z–A
                                </option>
                            </select>
                        </div>
                    </div>

                    <p
                        role="status"
                        className="mt-4 text-xs text-[#a86c80]"
                    >
                        {filtered.length} matching guest
                        {filtered.length !== 1
                            ? "s"
                            : ""}
                    </p>
                </div>

                {/* DESKTOP TABLE */}
                <div className="hidden max-w-full overflow-x-auto md:block">
                    <table className="w-full min-w-175 text-left text-sm">
                        <caption className="sr-only">
                            Guest invitations, RSVP statuses,
                            and management actions
                        </caption>

                        <thead className="bg-pink-50 text-xs uppercase tracking-wider text-[#a86c80]">
                            <tr>
                                <th
                                    scope="col"
                                    className="px-5 py-4"
                                >
                                    Guest
                                </th>

                                <th
                                    scope="col"
                                    className="px-5 py-4"
                                >
                                    Role
                                </th>

                                <th
                                    scope="col"
                                    className="px-5 py-4"
                                >
                                    Status
                                </th>

                                <th
                                    scope="col"
                                    className="px-5 py-4"
                                >
                                    RSVP
                                </th>

                                <th
                                    scope="col"
                                    className="px-5 py-4"
                                >
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {paginatedGuests.map(
                                (guest) => (
                                    <tr
                                        key={guest.id}
                                        className="border-t border-pink-100 align-top transition-colors hover:bg-pink-50/30"
                                    >
                                        <th
                                            scope="row"
                                            className="px-5 py-5 text-left font-medium text-gray-700"
                                        >
                                            <span className="guest-text wrap-break-word">
                                                {guest.guest_name}
                                            </span>
                                        </th>

                                        <td className="px-5 py-5 capitalize text-gray-500">
                                            {guest.role}
                                        </td>

                                        <td className="px-5 py-5">
                                            <StatusBadge
                                                status={guest.status}
                                            />
                                        </td>

                                        <td className="px-5 py-5">
                                            {renderRSVP(
                                                guest,
                                                "desktop"
                                            )}
                                        </td>

                                        <td className="px-5 py-5">
                                            {renderActions(guest)}
                                        </td>
                                    </tr>
                                )
                            )}
                        </tbody>
                    </table>
                </div>

                {/* MOBILE GUEST CARDS */}
                <div className="space-y-3 px-3 pb-5 sm:px-4 md:hidden">
                    {paginatedGuests.map(
                        (guest) => (
                            <article
                                key={guest.id}
                                className="admin-card min-w-0 rounded-2xl border border-pink-100 bg-white p-4 shadow-sm shadow-pink-100/50"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0 flex-1">
                                        <h3 className="guest-text min-w-0 font-semibold text-gray-700">
                                            {guest.guest_name}
                                        </h3>

                                        <p className="mt-1 text-xs capitalize text-gray-500">
                                            {guest.role}
                                        </p>
                                    </div>

                                    <StatusBadge
                                        status={guest.status}
                                    />
                                </div>

                                {/* RSVP */}
                                <div className="mt-4 min-w-0 border-t border-pink-100 pt-4">
                                    {renderRSVP(
                                        guest,
                                        "mobile"
                                    )}
                                </div>

                                {/* ACTIONS */}
                                <div className="mt-4 min-w-0 border-t border-pink-100 pt-4">
                                    <p className="mb-2 text-xs font-medium text-[#a86c80]">
                                        Guest Actions
                                    </p>

                                    {renderActions(guest)}
                                </div>
                            </article>
                        )
                    )}
                </div>

                {/* EMPTY FILTER STATE */}
                {filtered.length === 0 && (
                    <div
                        role="status"
                        className="px-5 py-10 text-center text-sm text-gray-400"
                    >
                        {invitations.length === 0
                            ? "No guests added yet."
                            : "No matching guests found."}
                    </div>
                )}

                {/* PAGINATION FOOTER */}
                <div className="space-y-4 border-t border-pink-100 px-4 py-4 sm:px-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="text-xs leading-5 text-gray-500">
                            Showing {showingFrom}–
                            {showingTo} of{" "}
                            {filtered.length} matching guests
                            {" "}({invitations.length} total)
                        </p>

                        <div className="flex items-center gap-2">
                            <label
                                htmlFor="guest-page-size"
                                className="text-xs text-gray-500"
                            >
                                Per page
                            </label>

                            <select
                                id="guest-page-size"
                                value={pageSize}
                                onChange={
                                    handlePageSizeChange
                                }
                                className={`rounded-lg border border-pink-200 bg-white px-3 py-2 text-xs text-gray-600 ${focusStyles}`}
                            >
                                {PAGE_SIZES.map(
                                    (size) => (
                                        <option
                                            key={size}
                                            value={size}
                                        >
                                            {size}
                                        </option>
                                    )
                                )}
                            </select>
                        </div>
                    </div>

                    {/* PAGE NAVIGATION */}
                    <nav
                        aria-label="Guest pagination"
                        className="flex items-center justify-center gap-2"
                    >
                        <button
                            type="button"
                            onClick={
                                goToPreviousPage
                            }
                            disabled={
                                safePage === 1
                            }
                            aria-label="Previous page"
                            className={`inline-flex h-11 w-11 items-center justify-center rounded-xl border border-pink-200 bg-white text-pink-600 disabled:cursor-not-allowed disabled:opacity-40 ${focusStyles}`}
                        >
                            <ChevronLeft
                                size={18}
                                aria-hidden="true"
                            />
                        </button>

                        <span
                            aria-live="polite"
                            className="min-w-24 text-center text-sm font-medium text-[#a86c80]"
                        >
                            Page {safePage} of{" "}
                            {totalPages}
                        </span>

                        <button
                            type="button"
                            onClick={
                                goToNextPage
                            }
                            disabled={
                                safePage === totalPages
                            }
                            aria-label="Next page"
                            className={`inline-flex h-11 w-11 items-center justify-center rounded-xl border border-pink-200 bg-white text-pink-600 disabled:cursor-not-allowed disabled:opacity-40 ${focusStyles}`}
                        >
                            <ChevronRight
                                size={18}
                                aria-hidden="true"
                            />
                        </button>
                    </nav>
                </div>
            </section>

            {/* QR MODAL */}
            {selectedQRGuest &&
                createPortal(
                    <QRInvitationModal
                        guest={
                            selectedQRGuest
                        }
                        onClose={() =>
                            setSelectedQRGuest(
                                null
                            )
                        }
                    />,
                    document.body
                )}

            {/* EDIT MODAL */}
            {editingGuest &&
                createPortal(
                    <GuestEditModal
                        guest={
                            editingGuest
                        }
                        onClose={() =>
                            setEditingGuest(
                                null
                            )
                        }
                        onSaved={
                            onChanged
                        }
                    />,
                    document.body
                )}

            {/* DELETE MODAL */}
            {deletingGuest &&
                createPortal(
                    <GuestDeleteModal
                        guest={
                            deletingGuest
                        }
                        onClose={() =>
                            setDeletingGuest(
                                null
                            )
                        }
                        onDeleted={
                            onChanged
                        }
                    />,
                    document.body
                )}
        </>
    );
}
