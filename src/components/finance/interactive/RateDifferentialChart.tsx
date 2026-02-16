import {
  ComposedChart, Bar, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { SC, FT, Card, Prose, tooltipStyle, axisTickStyle } from "../theme";
import { interestRateData } from "../data";

const legendStyle = { fontFamily: FT.label, fontSize: 11 };

export default function RateDifferentialChart() {
  return (
    <Card>
      <h3 style={{ fontFamily: FT.display, fontSize: 20, color: SC.text, margin: "0 0 6px" }}>
        US Fed vs RBI: The Rate Differential
      </h3>
      <Prose style={{ fontSize: 13 }}>
        When the differential collapsed to just 1%, FII outflows from India accelerated -- the extra return didn't justify the currency and political risk.
      </Prose>
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={interestRateData}>
          <CartesianGrid strokeDasharray="3 3" stroke={SC.borderLight} opacity={0.6} />
          <XAxis dataKey="period" tick={axisTickStyle} angle={-30} textAnchor="end" height={60} />
          <YAxis tick={axisTickStyle} tickFormatter={(v: number) => `${v}%`} />
          <Tooltip {...tooltipStyle} formatter={(v: number) => [`${v}%`, ""]} />
          <Legend wrapperStyle={legendStyle} />
          <Bar dataKey="diff" name="Rate Differential" fill={SC.borderLight} radius={[3, 3, 0, 0]} />
          <Line type="monotone" dataKey="fed" name="US Fed Rate" stroke={SC.build} strokeWidth={2.5} dot={{ r: 3, fill: SC.build }} />
          <Line type="monotone" dataKey="rbi" name="India Repo Rate" stroke={SC.invest} strokeWidth={2.5} dot={{ r: 3, fill: SC.invest }} />
        </ComposedChart>
      </ResponsiveContainer>
    </Card>
  );
}
