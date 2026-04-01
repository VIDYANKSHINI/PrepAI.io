export function PrepLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Brain outline */}
      <path
        d="M24 6C16.268 6 10 12.268 10 20c0 4.418 2.015 8.365 5.172 10.97V36a2 2 0 002 2h13.656a2 2 0 002-2v-5.03C36.985 28.365 38 24.418 38 20c0-7.732-6.268-14-14-14z"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Brain center line */}
      <path
        d="M24 10v22"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Brain left curves */}
      <path
        d="M24 14c-3 0-6 1.5-7 4M24 20c-4 0-8 1-9 4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Brain right curves */}
      <path
        d="M24 14c3 0 6 1.5 7 4M24 20c4 0 8 1 9 4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Microphone stem */}
      <path
        d="M24 38v6"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Microphone base */}
      <path
        d="M19 44h10"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  )
}
