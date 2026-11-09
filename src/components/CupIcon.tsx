export function CupIcon({ className = "h-14 w-14" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 64 64"
      className={className}
      fill="none"
      stroke="#F28C00"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M24 10c-3 3 3 5 0 9M33 8c-3 3 3 6 0 10" />
      <path d="M14 26h30v6c0 8-6.5 14-15 14s-15-6-15-14z" />
      <path d="M44 29h4a5 5 0 0 1 0 10h-5" />
      <path d="M10 52h38" />
    </svg>
  );
}