import { SC, FT } from "../theme";

interface Props {
  number: string;
  label: string;
}

export default function SectionDivider({ number, label }: Props) {
  return (
    <div
      style={{
        padding: "60px 0 10px",
        display: "flex",
        alignItems: "center",
        gap: 16,
      }}
    >
      <span
        style={{
          fontFamily: FT.mono,
          fontSize: 13,
          color: SC.build,
          fontWeight: 700,
          background: SC.bgSubtle,
          border: `2.5px solid ${SC.build}`,
          width: 36,
          height: 36,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 8,
        }}
      >
        {number}
      </span>
      <span
        style={{
          fontFamily: FT.mono,
          fontSize: 11,
          letterSpacing: 3,
          textTransform: "uppercase",
          color: SC.build,
        }}
      >
        {label}
      </span>
      <div
        style={{
          flex: 1,
          height: 2,
          background: `linear-gradient(90deg, ${SC.build}, transparent)`,
        }}
      />
    </div>
  );
}
