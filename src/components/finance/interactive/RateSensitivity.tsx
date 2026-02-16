import { SC, FT, Card, Prose, Callout } from "../theme";

export default function RateSensitivity() {
  const calc = (cf: number, g: number, r: number, n: number) =>
    Array.from({ length: n }, (_, i) => cf * Math.pow(1 + g, i + 1) / Math.pow(1 + r, i + 1))
      .reduce((a, b) => a + b, 0);

  const itcL = Math.round(calc(100, 0.05, 0.08, 10));
  const itcH = Math.round(calc(100, 0.05, 0.14, 10));
  const zL = Math.round(calc(10, 0.5, 0.08, 10));
  const zH = Math.round(calc(10, 0.5, 0.14, 10));
  const itcD = Math.round((itcL - itcH) / itcL * 100);
  const zD = Math.round((zL - zH) / zL * 100);

  const items = [
    { name: "ITC", drop: itcD, color: SC.invest, sub: "Dividend Stock" },
    { name: "Zomato", drop: zD, color: SC.build, sub: "Growth Stock" },
  ];

  return (
    <Card accent={SC.build}>
      <div style={{ fontFamily: FT.mono, fontSize: 10, letterSpacing: 2, color: SC.build, marginBottom: 6 }}>
        THE BIG REVEAL
      </div>
      <h3 style={{ fontFamily: FT.display, fontSize: 22, color: SC.text, margin: "0 0 6px" }}>
        Rate Hikes Don't Hit All Stocks Equally
      </h3>
      <Prose>When discount rates jump from 8% to 14%, both lose value. But look at the difference:</Prose>

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 20 }}>
        {items.map(s => (
          <div key={s.name} style={{
            flex: 1, minWidth: 200, background: SC.bgSubtle,
            border: `2.5px solid ${SC.border}`, borderRadius: 12,
            padding: 24, textAlign: "center",
          }}>
            <div style={{ fontFamily: FT.display, fontSize: 18, color: SC.text, margin: "8px 0 2px" }}>
              {s.name}
            </div>
            <div style={{ fontFamily: FT.label, fontSize: 11, color: SC.textMuted, marginBottom: 6 }}>
              {s.sub}
            </div>
            <div style={{ fontFamily: FT.mono, fontSize: 38, color: s.color, fontWeight: 700 }}>
              -{s.drop}%
            </div>
            <div style={{ fontFamily: FT.mono, fontSize: 11, color: SC.textMuted }}>fair value drop</div>
          </div>
        ))}
      </div>

      <Callout
        color={SC.build}
        text={`ITC loses ~${itcD}% because most of its cash comes in the near future (big dividends now). Zomato loses ~${zD}% because nearly all its value depends on profits 5-10 years away -- distant cash flows get crushed by higher discount rates. This is exactly why Zomato fell ~55% in 2022 when rates rose globally, while ITC actually went up.`}
      />
    </Card>
  );
}
