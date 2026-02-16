import { SC, FT } from "../theme";

const steps = [
  {
    label: "Fed raises rates",
    desc: "US Treasury bond yields rise, making them more attractive",
  },
  {
    label: "Global capital shifts",
    desc: "FIIs sell Indian equities, convert rupees to dollars, buy US bonds",
  },
  {
    label: "Rupee weakens",
    desc: "Selling pressure on rupee makes imports (oil, electronics) costlier, inflation rises",
  },
  {
    label: "RBI responds",
    desc: "May raise the repo rate to defend the rupee and control inflation",
  },
  {
    label: "Indian discount rates rise",
    desc: "DCF fair values of all Indian assets compress",
  },
  {
    label: "Asset prices fall",
    desc: "Stocks, real estate, and bonds all face downward pressure",
  },
];

export default function TransmissionChain() {
  return (
    <div
      style={{
        background: SC.bgSubtle,
        border: `2.5px solid ${SC.border}`,
        borderRadius: 14,
        padding: "clamp(20px, 3vw, 32px)",
      }}
    >
      <h3
        style={{
          fontFamily: FT.display,
          fontSize: 20,
          color: SC.text,
          margin: "0 0 10px",
        }}
      >
        The Full Chain: Fed Decision to Your Portfolio
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {steps.map((s, i) => (
          <div key={i}>
            <div
              style={{
                display: "flex",
                gap: 16,
                alignItems: "center",
                padding: "14px 0",
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                  fontFamily: FT.mono,
                  fontWeight: 700,
                  color: SC.build,
                  background: SC.bg,
                  border: `2.5px solid ${SC.border}`,
                  flexShrink: 0,
                }}
              >
                {i + 1}
              </div>
              <div>
                <div
                  style={{
                    fontFamily: FT.body,
                    fontSize: 15,
                    color: SC.text,
                    fontWeight: 600,
                  }}
                >
                  {s.label}
                </div>
                <div
                  style={{
                    fontFamily: FT.body,
                    fontSize: 13,
                    color: SC.textSecondary,
                    lineHeight: 1.5,
                  }}
                >
                  {s.desc}
                </div>
              </div>
            </div>
            {i < steps.length - 1 && (
              <div
                style={{
                  marginLeft: 21,
                  width: 2,
                  height: 16,
                  background: SC.borderLight,
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
