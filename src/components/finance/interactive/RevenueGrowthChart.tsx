import {
  BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { SC, FT, Card, Prose, tooltipStyle, axisTickStyle } from "../theme";
import { revenueGrowth } from "../data";

const legendStyle = { fontFamily: FT.label, fontSize: 11 };

export default function RevenueGrowthChart() {
  return (
    <Card>
      <h3 style={{ fontFamily: FT.display, fontSize: 20, color: SC.text, margin: "0 0 6px" }}>
        Revenue: The Engine Under the Hood
      </h3>
      <Prose style={{ fontSize: 13 }}>
        Zomato's revenue is tiny compared to ITC/Coal India -- but growing at 5-6x the rate. Growth investors pay for this trajectory.
      </Prose>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={revenueGrowth}>
          <CartesianGrid strokeDasharray="3 3" stroke={SC.borderLight} opacity={0.6} />
          <XAxis dataKey="year" tick={axisTickStyle} />
          <YAxis tick={axisTickStyle} tickFormatter={(v: number) => `${Math.round(v / 1000)}K`} />
          <Tooltip {...tooltipStyle} formatter={(v: number) => [`${v.toLocaleString()} Cr`, ""]} />
          <Legend wrapperStyle={legendStyle} />
          <Bar dataKey="coalIndia" name="Coal India" fill={SC.thrive} radius={[3, 3, 0, 0]} />
          <Bar dataKey="itc" name="ITC" fill={SC.invest} radius={[3, 3, 0, 0]} />
          <Bar dataKey="zomato" name="Zomato" fill={SC.build} radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
