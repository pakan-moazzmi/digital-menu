export function BeanIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className}>
      <ellipse
        cx="12"
        cy="12"
        rx="6.5"
        ry="9.5"
        transform="rotate(35 12 12)"
        fill="#F28C00"
      />
      <path
        d="M9 18c4-3 4-9 8-12"
        fill="none"
        stroke="#2B1405"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}