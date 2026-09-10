const PATHS: Record<string, string> = {
  monitor: "M4 3h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2zM8 21h8M12 17v4",
  globe: "M2 12a10 10 0 1 0 20 0a10 10 0 1 0-20 0zM2 12h20M12 2a15 15 0 0 1 4 10 15 15 0 0 1-4 10 15 15 0 0 1-4-10A15 15 0 0 1 12 2",
  building: "M6 2h12a2 2 0 0 1 2 2v18H4V4a2 2 0 0 1 2-2zM9 22v-4h6v4M9 6h1M14 6h1M9 10h1M14 10h1M9 14h1M14 14h1",
  user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M8 7a4 4 0 1 0 8 0a4 4 0 1 0-8 0z",
  network: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71",
  phone: "M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4c0-1.1.9-2 2-2zM12 18h.01",
  zap: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
  cloud: "M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z",
  wifi: "M5 12.55a11 11 0 0 1 14 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01",
  target: "M2 12a10 10 0 1 0 20 0a10 10 0 1 0-20 0zM7 12a5 5 0 1 0 10 0a5 5 0 1 0-10 0zM10 12a2 2 0 1 0 4 0a2 2 0 1 0-4 0z",
  mail: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6",
  lock: "M5 11h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7c0-1.1.9-2 2-2zM7 11V7a5 5 0 0 1 10 0v4",
  search: "M11 3a8 8 0 1 0 0 16 8 8 0 1 0 0-16zM21 21l-4.35-4.35",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  clock: "M2 12a10 10 0 1 0 20 0a10 10 0 1 0-20 0zM12 6v6l4 2",
  power: "M18.36 6.64a9 9 0 1 1-12.73 0M12 2v10",
  clipboard: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6c0-1.1.9-2 2-2h2M8 2h8v4H8V2z",
  barchart: "M12 20V10M18 20V4M6 20v-4",
  check: "M20 6L9 17l-5-5",
  file: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8",
  activity: "M22 12h-4l-3 9L9 3l-3 9H2",
  plus: "M12 5v14M5 12h14",
  arrowLeft: "M19 12H5M12 19l-7-7 7-7",
  chevron: "M9 18l6-6-6-6",
  chevronDown: "M6 9l6 6 6-6",
  menu: "M3 6h18M3 12h18M3 18h18",
  x: "M18 6L6 18M6 6l12 12",
  copy: "M9 9h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V11c0-1.1.9-2 2-2zM5 15H4a2 2 0 0 1-2-2V3c0-1.1.9-2 2-2h10a2 2 0 0 1 2 2v1",
  layers: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
  sliders: "M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6",
};

export function Icon({
  name,
  size = 18,
  color = "currentColor",
  className,
  title,
}: {
  name: string;
  size?: number;
  color?: string;
  className?: string;
  /** Passe apenas quando o ícone carrega significado sozinho; caso contrário fica decorativo. */
  title?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      focusable="false"
      style={{ display: "inline-block", verticalAlign: "middle", flexShrink: 0 }}
    >
      <path d={PATHS[name] || ""} />
    </svg>
  );
}
