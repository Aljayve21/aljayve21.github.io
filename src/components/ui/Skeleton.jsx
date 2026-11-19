
export default function Skeleton({
    className = "",
}) {
    return (
        <div
            aria-hidden="true"
            className={`animate-pulse rounded-xl bg-pink-100/70 ${className}`}
        />
    );
}
