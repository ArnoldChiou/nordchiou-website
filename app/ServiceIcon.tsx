type ServiceIconName = "kb" | "agent" | "bot" | "advisor";

export default function ServiceIcon({ name }: { name: ServiceIconName }) {
  const svgProps = {
    viewBox: "0 0 32 32",
    width: 32,
    height: 32,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    focusable: false,
  };

  switch (name) {
    case "kb":
      return (
        <svg {...svgProps}>
          <path d="M7 3.75h11l5 5V28H7z" />
          <path d="M18 3.75v5h5" />
          <path d="M10.5 11.5h5" />
          <circle cx="13" cy="17" r="3.25" />
          <path d="m15.4 19.4 2.6 2.6" />
          <path d="M10.5 24h4" />
          <path className="si-accent" d="M17.5 24h2.75" />
        </svg>
      );
    case "agent":
      return (
        <svg {...svgProps}>
          <circle cx="6" cy="7.5" r="2.5" />
          <circle cx="6" cy="24.5" r="2.5" />
          <circle className="si-accent" cx="16" cy="16" r="2.75" />
          <circle cx="26" cy="16" r="2.5" />
          <path d="M8.5 7.5H12v6.25h1.25" />
          <path d="M8.5 24.5H12v-6.25h1.25" />
          <path d="M18.75 16H23.5" />
          <path d="m21 13.5 2.5 2.5-2.5 2.5" />
        </svg>
      );
    case "bot":
      return (
        <svg {...svgProps}>
          <path d="M6 6.5h20v15H14l-5.5 4v-4H6z" />
          <path d="M12 12.5v5h8v-5z" />
          <path d="M16 10v2.5" />
          <circle cx="14.5" cy="15" r=".75" />
          <circle cx="17.5" cy="15" r=".75" />
          <path className="si-accent" d="M14.25 18.75h3.5" />
        </svg>
      );
    case "advisor":
      return (
        <svg {...svgProps}>
          <circle className="si-accent" cx="16" cy="4.75" r="2.25" />
          <path d="M16 7v21" />
          <path d="M16 9h9l-3 4 3 4h-9" />
          <path d="M16 17H7l3-4-3-4h9" />
          <path d="M10.5 24.5c2.25-2 4.5-2 6.75 0s4.5 2 6.75 0" />
        </svg>
      );
  }
}
