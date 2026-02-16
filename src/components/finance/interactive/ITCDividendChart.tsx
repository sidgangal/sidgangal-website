import {
  ComposedChart, Bar, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { SC, FT, Card, Prose, tooltipStyle, axisTickStyle } from "../theme";
import { itcDividendHistory } from "../data";

const legendStyle = { fontFamily: FT.label, fontSize: 11 };

export default function ITCDividendChart() {
  return (
    <Card>
      <h3 style={{ fontFamily: FT.display, fontSize: 20, color: SC.text, margin: "0 0 6px" }}>
        ITC: Dividends Drive the Price
      </h3>
      <Prose style={{ fontSize: 13 }}>
        The stock price follows dividend growth over time. When the company consistently increases what it pays you, the market values it more.
      </Prose>
      <ResponsiveContainer width="100%" height={260}>
        <ComposedChart data={itcDividendHistory}>
          <CartesianGrid strokeDasharray="3 3" stroke={SC.borderLight} opacity={0.6} />
          <XAxis dataKey="year" tick={axisTickStyle} />
          <YAxis yAxisId="l" tick={axisTickStyle} />
          <YAxis yAxisId="r" orientation="right" tick={axisTickStyle} />
          <Tooltip {...tooltipStyle} />
          <Legend wrapperStyle={legendStyle} />
          <Bar yAxisId="l" dataKey="dividend" name="Dividend" fill={SC.invest} radius={[4, 4, 0, 0]} />
          <Line yAxisId="r" type="monotone" dataKey="price" name="Stock Price" stroke={SC.build} strokeWidth={2.5} dot={{ r: 4, fill: SC.build }} />
        </ComposedChart>
      </ResponsiveContainer>
    </Card>
  );
}
