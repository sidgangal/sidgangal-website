import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from "recharts";
import { SC, FT, Card, Prose, Strong, Stat, tooltipStyle, axisTickStyle } from "../theme";

export default function DCFVisualizer() {
  const [rate, setRate] = useState(10);
  const data = Array.from({ length: 8 }, (_, i) => {
    const yr = i + 1;
    const pv = Math.round(100 / Math.pow(1 + rate / 100, yr));
    return { year: `Yr ${yr}`, presentValue: pv, lost: 100 - pv };
  });
  const totalPV = data.reduce((s, d) => s + d.presentValue, 0);

  return (
    <Card accent={SC.build}>
      <div style={{ fontFamily: FT.mono, fontSize: 10, letterSpacing: 2, color: SC.build, marginBottom: 6 }}>
        INTERACTIVE
      </div>
      <h3 style={{ fontFamily: FT.display, fontSize: 22, color: SC.text, margin: "0 0 6px" }}>
        See Discounting In Action
      </h3>
      <Prose>
        Imagine someone pays you <Strong>100 every year</Strong> for 8 years. Drag the slider to
        change the discount rate and watch what those future payments are worth{" "}
        <em style={{ color: SC.text }}>today</em>.
      </Prose>

      <div style={{
        display: "flex", alignItems: "center", gap: 16, marginBottom: 24,
        padding: "12px 16px", background: SC.bg, borderRadius: 10,
        border: `2.5px solid ${SC.border}`,
      }}>
        <label style={{ fontFamily: FT.mono, fontSize: 11, color: SC.textMuted, whiteSpace: "nowrap", letterSpacing: 1 }}>
          DISCOUNT RATE
        </label>
        <input
          type="range" min={2} max={20} value={rate}
          onChange={e => setRate(Number(e.target.value))}
          style={{ flex: 1, accentColor: SC.build, height: 6 }}
        />
        <span style={{ fontFamily: FT.mono, fontSize: 24, color: SC.build, fontWeight: 700, minWidth: 55, textAlign: "right" }}>
          {rate}%
        </span>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} barCategoryGap="18%">
          <CartesianGrid strokeDasharray="3 3" stroke={SC.borderLight} opacity={0.6} />
          <XAxis dataKey="year" tick={axisTickStyle} />
          <YAxis tick={axisTickStyle} domain={[0, 110]} />
          <Tooltip {...tooltipStyle} />
          <Bar dataKey="presentValue" name="Worth today" stackId="a" fill={SC.invest} radius={[0, 0, 0, 0]} />
          <Bar dataKey="lost" name="Lost to discounting" stackId="a" fill={SC.thrive} radius={[4, 4, 0, 0]} opacity={0.6} />
        </BarChart>
      </ResponsiveContainer>

      <div style={{
        display: "flex", justifyContent: "center", gap: 40, marginTop: 20,
        padding: "16px 0", borderTop: `2.5px solid ${SC.border}`, flexWrap: "wrap",
      }}>
        <Stat label="Total Future Cash" value="800" color={SC.textSecondary} />
        <Stat label="Worth Today" value={`${totalPV}`} color={SC.invest} />
        <Stat label="Value Lost" value={`${800 - totalPV}`} color={SC.thrive} />
      </div>
    </Card>
  );
}
