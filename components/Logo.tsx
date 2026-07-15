export function LogoMark({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
    >
      {/* wave */}
      <path
        d="M4 22q4-6 8 0t8 0 8 0 8 0"
        stroke="var(--ember)"
        strokeWidth={2}
        strokeLinecap="round"
        fill="none"
      />
      {/* flame */}
      <path
        d="M20 6c-2 6-6 8-6 12a6 6 0 1 0 12 0c0-4-4-6-6-12z"
        fill="var(--gold)"
        opacity={0.85}
      />
      <circle cx={20} cy={19} r={2} fill="var(--bone)" opacity={0.9} />
    </svg>
  );
}

export function LogoType() {
  return (
    <span className="font-display text-xl leading-none text-[var(--bone)]">
      Kianda
    </span>
  );
}
