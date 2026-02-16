import { SC, FT } from "../theme";

interface Props {
  name: string;
  type: string;
  price: string;
  pe: string;
  divYield: string;
  revGrowth: string;
  method: string;
  tagline: string;
  children: React.ReactNode;
  analogy: string;
  insight: string;
  color?: "build" | "invest" | "thrive";
}

const colorMap = {
  build: SC.build,
  invest: SC.invest,
  thrive: SC.thrive,
};

export default function StockProfile({
  name,
  type,
  price,
  pe,
  divYield,
  revGrowth,
  method,
  tagline,
  children,
  analogy,
  insight,
  color = "build",
}: Props) {
  const accentColor = colorMap[color];
  const metrics: [string, string][] = [
    ["P/E Ratio", pe],
    ["Div Yield", divYield],
    ["Rev Growth", revGrowth],
    ["Method", method.split("(")[0].trim()],
  ];

  return (
    <div
      style={{
        background: SC.bgSubtle,
        border: `2.5px solid ${SC.border}`,
        borderRadius: 14,
        padding: "clamp(20px, 3vw, 32px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: `linear-gradient(90deg, ${accentColor}, transparent)`,
        }}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 14,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <h3
            style={{
              fontFamily: FT.display,
              fontSize: 24,
              color: SC.text,
              margin: "6px 0 4px",
            }}
          >
            {name}
          </h3>
          <span
            style={{
              fontFamily: FT.mono,
              fontSize: 10,
              color: accentColor,
              background: SC.bg,
              padding: "3px 10px",
              borderRadius: 20,
              letterSpacing: 1.5,
              textTransform: "uppercase",
              border: `1px solid ${SC.borderLight}`,
            }}
          >
            {type}
          </span>
        </div>
        <div style={{ textAlign: "right" }}>
          <div
            style={{
              fontFamily: FT.mono,
              fontSize: 24,
              color: SC.text,
              fontWeight: 700,
            }}
          >
            {price}
          </div>
          <div
            style={{
              fontFamily: FT.mono,
              fontSize: 11,
              color: SC.textMuted,
            }}
          >
            {tagline}
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 8,
          marginBottom: 18,
          padding: "14px 0",
          borderTop: `2.5px solid ${SC.border}`,
          borderBottom: `2.5px solid ${SC.border}`,
        }}
      >
        {metrics.map(([l, v]) => (
          <div key={l} style={{ textAlign: "center" }}>
            <div
              style={{
                fontFamily: FT.mono,
                fontSize: 9,
                color: SC.textMuted,
                letterSpacing: 1,
                textTransform: "uppercase",
              }}
            >
              {l}
            </div>
            <div
              style={{
                fontFamily: FT.mono,
                fontSize: 13,
                color: SC.text,
                fontWeight: 600,
                marginTop: 3,
              }}
            >
              {v}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          fontFamily: FT.body,
          fontSize: 14.5,
          color: SC.textSecondary,
          lineHeight: 1.75,
          marginBottom: 14,
        }}
      >
        {children}
      </div>

      <div
        style={{
          background: SC.bg,
          borderRadius: 10,
          padding: "14px 16px",
          border: `2px solid ${SC.borderLight}`,
          marginBottom: 14,
        }}
      >
        <div
          style={{
            fontFamily: FT.mono,
            fontSize: 9,
            letterSpacing: 1.5,
            color: SC.textMuted,
            marginBottom: 6,
          }}
        >
          THE ANALOGY
        </div>
        <p
          style={{
            fontFamily: FT.body,
            fontSize: 14,
            color: SC.text,
            margin: 0,
            lineHeight: 1.6,
            fontStyle: "italic",
          }}
        >
          {analogy}
        </p>
      </div>

      <div
        style={{
          background: SC.bgSubtle,
          border: `2.5px solid ${SC.borderLight}`,
          borderLeft: `4px solid ${accentColor}`,
          borderRadius: 10,
          padding: "16px 20px",
          margin: "20px 0 0",
        }}
      >
        <p
          style={{
            fontFamily: FT.body,
            fontSize: 14.5,
            color: SC.text,
            margin: 0,
            lineHeight: 1.7,
          }}
        >
          {insight}
        </p>
      </div>
    </div>
  );
}
