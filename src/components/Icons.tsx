import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  d: string | string[];
  fill?: string;
  size?: number;
}

const Icon: React.FC<IconProps> = ({ d, fill, size = 16, ...rest }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill={fill || "none"}
    stroke={fill ? "none" : "currentColor"}
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...rest}
  >
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

export const IconPlay = (p: any) => <Icon {...p} d="M7 5l12 7-12 7V5z" fill="currentColor" />;
export const IconPause = (p: any) => <Icon {...p} d={["M7 5h3v14H7z", "M14 5h3v14h-3z"]} fill="currentColor" />;
export const IconPrev = (p: any) => <Icon {...p} d={["M19 5L9 12l10 7V5z", "M5 5v14"]} fill="currentColor" />;
export const IconNext = (p: any) => <Icon {...p} d={["M5 5l10 7-10 7V5z", "M19 5v14"]} fill="currentColor" />;
export const IconHeart = (p: any) => <Icon {...p} d="M12 21s-7-4.5-9.5-9.5C1 8 3 5 6 5c2 0 3.5 1 6 3.5C14.5 6 16 5 18 5c3 0 5 3 3.5 6.5C19 16.5 12 21 12 21z" />;
export const IconShare = (p: any) => <Icon {...p} d={["M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7", "M16 6l-4-4-4 4", "M12 2v13"]} />;
export const IconShuffle = (p: any) => <Icon {...p} d={["M16 3h5v5", "M4 20l17-17", "M21 16v5h-5", "M15 15l6 6", "M4 4l5 5"]} />;
export const IconVolume = (p: any) => <Icon {...p} d={["M11 5L6 9H2v6h4l5 4V5z", "M19 12c0-2-1-4-2-5", "M22 12c0-3-2-6-4-8"]} />;
export const IconSearch = (p: any) => <Icon {...p} d={["M11 11m-8 0a8 8 0 1 0 16 0a8 8 0 1 0 -16 0", "M21 21l-4.35-4.35"]} />;
export const IconUsers = (p: any) => <Icon {...p} d={["M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2", "M8.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z", "M22 21v-2a4 4 0 0 0-3-3.87", "M15 3.13a4 4 0 0 1 0 7.75"]} />;
export const IconSettings = (p: any) => <Icon {...p} d={["M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0", "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"]} />;
export const IconCast = (p: any) => <Icon {...p} d={["M2 16a5 5 0 0 1 5 5", "M2 12a9 9 0 0 1 9 9", "M2 8a13 13 0 0 1 13 13", "M2 4h20v16h-7"]} />;
export const IconBell = (p: any) => <Icon {...p} d={["M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9", "M13.7 21a2 2 0 0 1-3.4 0"]} />;
export const IconFacebook = (p: any) => <Icon {...p} d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" fill="currentColor" />;
export const IconInstagram = (p: any) => <Icon {...p} d={["M3 7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7z", "M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0", "M17.5 6.5h.01"]} />;
export const IconTwitter = (p: any) => <Icon {...p} d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />;
export const IconYoutube = (p: any) => <Icon {...p} d="M22 8.6a3 3 0 0 0-2.1-2.1C18 6 12 6 12 6s-6 0-7.9.5A3 3 0 0 0 2 8.6 31 31 0 0 0 1.5 12a31 31 0 0 0 .5 3.4 3 3 0 0 0 2.1 2.1C6 18 12 18 12 18s6 0 7.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .5-3.4 31 31 0 0 0-.5-3.4z M10 15.5l5-3.5-5-3.5v7z" fill="currentColor" />;
