import {
  ComposedChart, Bar, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { SC, FT, Card, Prose, tooltipStyle, axisTickStyle } from "../theme";
import { m1VsMarkets } from "../data";

const legendStyle = { fontFamily: FT.label, fontSize: 11 };

export default function USM1Chart() {
  return (
    <Card>
      <h3 style={{ fontFamily: FT.display, fontSize: 20, color: SC.text, margin: "0 0 6px" }}>
        US M1 Supply vs S&P 500
      </h3>
      <Prose style={{ fontSize: 13 }}>
        M1 expanded ~5x between 2020-2022. Markets followed. The mechanism is direct: more money, more buying, higher prices.
      </Prose>
      <ResponsiveContainer width="100%" height={280}>
        <ComposedChart data={m1VsMarkets}>
          <CartesianGrid strokeDasharray="3 3" stroke={SC.borderLight} opacity={0.6} />
          <XAxis dataKey="year" tick={axisTickStyle} />
          <YAxis yAxisId="m1" tick={axisTickStyle} tickFormatter={(v: number) => `${v}T`} />
          <YAxis yAxisId="sp" orientation="right" tick={axisTickStyle} />
          <Tooltip {...tooltipStyle} />
          <Legend wrapperStyle={legendStyle} />
          <Bar yAxisId="m1" dataKey="usM1" name="US M1 ($T)" fill={SC.borderLight} radius={[3, 3, 0, 0]} />
          <Line yAxisId="sp" type="monotone" dataKey="sp500" name="S&P 500" stroke={SC.build} strokeWidth={2.5} dot={{ r: 3, fill: SC.build }} />
        </ComposedChart>
      </ResponsiveContainer>
    </Card>
  );
}
