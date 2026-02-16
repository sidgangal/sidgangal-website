import { useState } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from "recharts";
import { SC, FT, Card, Prose, Strong, Stat, tooltipStyle, axisTickStyle } from "../theme";

export default function SilentCrashCalc() {
  const [years, setYears] = useState(10);
  const real = Math.round(100 / Math.pow(1.06, years));
  const data = Array.from({ length: years + 1 }, (_, i) => ({
    year: `Yr ${i}`,
    nominal: 100,
    real: Math.round(100 / Math.pow(1.06, i)),
  }));

  return (
    <Card accent={SC.thrive}>
      <div style={{ fontFamily: FT.mono, fontSize: 10, letterSpacing: 2, color: SC.thrive, marginBottom: 6 }}>
        INTERACTIVE
      </div>
      <h3 style={{ fontFamily: FT.display, fontSize: 22, color: SC.text, margin: "0 0 6px" }}>
        The Silent Real Estate Crash
      </h3>
      <Prose>
        Your property stays at 1 Crore on paper -- that's its{" "}
        <Strong color={SC.textSecondary}>"nominal"</Strong> price (the number you see). But{" "}
        <Strong color={SC.thrive}>"real"</Strong> value means what it can actually{" "}
        <em style={{ color: SC.text }}>buy</em>. With 6% inflation, prices of everything else rise
        while your property stays flat. Drag to see.
      </Prose>

      <div style={{
        display: "flex", alignItems: "center", gap: 16, marginBottom: 20,
        padding: "12px 16px", background: SC.bg, borderRadius: 10,
        border: `2.5px solid ${SC.border}`,
      }}>
        <label style={{ fontFamily: FT.mono, fontSize: 11, color: SC.textMuted, whiteSpace: "nowrap", letterSpacing: 1 }}>
          YEARS FLAT
        </label>
        <input
          type="range" min={3} max={20} value={years}
          onChange={e => setYears(Number(e.target.value))}
          style={{ flex: 1, accentColor: SC.thrive, height: 6 }}
        />
        <span style={{ fontFamily: FT.mono, fontSize: 24, color: SC.thrive, fontWeight: 700, minWidth: 55, textAlign: "right" }}>
          {years} yr
        </span>
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="nomG" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={SC.textMuted} stopOpacity={0.15} />
              <stop offset="95%" stopColor={SC.textMuted} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="realG" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={SC.thrive} stopOpacity={0.15} />
              <stop offset="95%" stopColor={SC.thrive} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={SC.borderLight} opacity={0.6} />
          <XAxis dataKey="year" tick={axisTickStyle} />
          <YAxis tick={axisTickStyle} domain={[0, 110]} tickFormatter={(v: number) => `${v}L`} />
          <Tooltip {...tooltipStyle} formatter={(v: number) => [`${v} Lakhs`, ""]} />
          <Area type="monotone" dataKey="nominal" name="Price on paper (Nominal)" stroke={SC.textMuted} fill="url(#nomG)" strokeWidth={2} strokeDasharray="5 5" />
          <Area type="monotone" dataKey="real" name="Purchasing power (Real)" stroke={SC.thrive} fill="url(#realG)" strokeWidth={2.5} />
        </AreaChart>
      </ResponsiveContainer>

      <div style={{
        display: "flex", justifyContent: "center", gap: 40, marginTop: 16,
        padding: "16px 0", borderTop: `2.5px solid ${SC.border}`, flexWrap: "wrap",
      }}>
        <Stat label="Price on Paper" value="1 Cr" color={SC.textSecondary} />
        <Stat label="Real Value" value={`${real} L`} color={SC.thrive} />
        <Stat label="Purchasing Power Lost" value={`${100 - real} L`} color={SC.thrive} sub={`over ${years} years`} />
      </div>
    </Card>
  );
}
