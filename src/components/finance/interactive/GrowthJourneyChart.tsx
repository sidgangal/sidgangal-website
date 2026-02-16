import {
  AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine,
} from "recharts";
import { SC, FT, Card, Prose, tooltipStyle, axisTickStyle } from "../theme";
import { growthJourney } from "../data";

const legendStyle = { fontFamily: FT.label, fontSize: 11 };

export default function GrowthJourneyChart() {
  return (
    <Card>
      <h3 style={{ fontFamily: FT.display, fontSize: 20, color: SC.text, margin: "0 0 6px" }}>
        100 Invested in 2021 -- Where Is It Now?
      </h3>
      <Prose style={{ fontSize: 13 }}>
        Growth stocks are a rollercoaster -- Zomato dropped to 45 before recovering to 230. Value stocks are a slow train.
      </Prose>
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={growthJourney}>
          <defs>
            <linearGradient id="gz" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={SC.build} stopOpacity={0.12} />
              <stop offset="95%" stopColor={SC.build} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gi" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={SC.invest} stopOpacity={0.12} />
              <stop offset="95%" stopColor={SC.invest} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gc" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={SC.thrive} stopOpacity={0.12} />
              <stop offset="95%" stopColor={SC.thrive} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={SC.borderLight} opacity={0.6} />
          <XAxis dataKey="year" tick={axisTickStyle} />
          <YAxis tick={axisTickStyle} />
          <Tooltip {...tooltipStyle} />
          <Legend wrapperStyle={legendStyle} />
          <ReferenceLine y={100} stroke={SC.textMuted} strokeDasharray="3 3" />
          <Area type="monotone" dataKey="zomato" name="Zomato" stroke={SC.build} fill="url(#gz)" strokeWidth={2.5} />
          <Area type="monotone" dataKey="itc" name="ITC" stroke={SC.invest} fill="url(#gi)" strokeWidth={2.5} />
          <Area type="monotone" dataKey="coalIndia" name="Coal India" stroke={SC.thrive} fill="url(#gc)" strokeWidth={2.5} />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}
