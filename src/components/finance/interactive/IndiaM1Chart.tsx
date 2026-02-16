import {
  ComposedChart, Bar, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { SC, FT, Card, Prose, tooltipStyle, axisTickStyle } from "../theme";
import { m1VsMarkets } from "../data";

const legendStyle = { fontFamily: FT.label, fontSize: 11 };

export default function IndiaM1Chart() {
  return (
    <Card>
      <h3 style={{ fontFamily: FT.display, fontSize: 20, color: SC.text, margin: "0 0 6px" }}>
        India M1 vs Nifty 50
      </h3>
      <Prose style={{ fontSize: 13 }}>
        Same pattern. India's M1 grew ~70% from 2020 to 2024. Nifty roughly doubled.
      </Prose>
      <ResponsiveContainer width="100%" height={280}>
        <ComposedChart data={m1VsMarkets}>
          <CartesianGrid strokeDasharray="3 3" stroke={SC.borderLight} opacity={0.6} />
          <XAxis dataKey="year" tick={axisTickStyle} />
          <YAxis yAxisId="m1" tick={axisTickStyle} tickFormatter={(v: number) => `${v}L Cr`} />
          <YAxis yAxisId="nifty" orientation="right" tick={axisTickStyle} />
          <Tooltip {...tooltipStyle} />
          <Legend wrapperStyle={legendStyle} />
          <Bar yAxisId="m1" dataKey="indiaM1" name="India M1 (L Cr)" fill={SC.borderLight} radius={[3, 3, 0, 0]} />
          <Line yAxisId="nifty" type="monotone" dataKey="nifty" name="Nifty 50" stroke={SC.invest} strokeWidth={2.5} dot={{ r: 3, fill: SC.invest }} />
        </ComposedChart>
      </ResponsiveContainer>
    </Card>
  );
}
