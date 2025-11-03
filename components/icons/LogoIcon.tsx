
import React from 'react';

export const LogoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g fill="#FBBF24">
      <rect x="20" y="30" width="10" height="40" rx="5" />
      <rect x="45" y="20" width="10" height="60" rx="5" />
      <rect x="70" y="40" width="10" height="20" rx="5" />
    </g>
    <circle cx="35" cy="50" r="10" fill="#18181B" />
    <circle cx="60" cy="50" r="15" fill="#18181B" />
    <circle cx="85" cy="50" r="8" fill="#18181B" />
    <rect x="10" y="10" width="80" height="80" rx="10" stroke="#FBBF24" strokeWidth="4" />
  </svg>
);
