import type { SVGProps } from 'react';

export function EcoSwapLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 20"
      width="100"
      height="20"
      aria-label="EcoSwap Logo"
      {...props}
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: 'hsl(var(--primary))', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: 'hsl(var(--accent))', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <text
        x="0"
        y="15"
        fontFamily="var(--font-geist-sans), Arial, sans-serif"
        fontSize="16"
        fontWeight="bold"
        fill="url(#logoGradient)"
      >
        EcoSwap
      </text>
      <path d="M78 5 Q 80 2, 82 5 T 86 5" stroke="hsl(var(--primary))" strokeWidth="1.2" fill="none" />
      <path d="M80 9 Q 82 6, 84 9 T 88 9" stroke="hsl(var(--accent))" strokeWidth="1.2" fill="none" />
    </svg>
  );
}
