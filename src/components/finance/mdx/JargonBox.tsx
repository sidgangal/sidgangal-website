import { SC, FT } from "../theme";

interface Props {
  term: string;
  children: React.ReactNode;
  color?: "build" | "invest" | "thrive";
}

const colorMap = {
  build: SC.build,
  invest: SC.invest,
  thrive: SC.thrive,
};

export default function JargonBox({ term, children, color = "build" }: Props) {
  return (
    <div
      style={{
        background: SC.bgSubtle,
        border: `2px solid ${SC.borderLight}`,
        borderRadius: 10,
        padding: "14px 18px",
        margin: "16px 0",
        display: "flex",
        gap: 12,
        alignItems: "flex-start",
      }}
    >
      <span
        style={{
          fontFamily: FT.mono,
          fontSize: 10,
          letterSpacing: 1.5,
          color: colorMap[color],
          background: SC.bg,
          padding: "3px 8px",
          borderRadius: 4,
          whiteSpace: "nowrap",
          marginTop: 2,
          fontWeight: 600,
          border: `1px solid ${SC.borderLight}`,
        }}
      >
        JARGON BUSTER
      </span>
      <div
        style={{
          fontFamily: FT.body,
          fontSize: 14,
          color: SC.textSecondary,
          margin: 0,
          lineHeight: 1.65,
        }}
      >
        <strong style={{ color: SC.text }}>{term}:</strong> {children}
      </div>
    </div>
  );
}
