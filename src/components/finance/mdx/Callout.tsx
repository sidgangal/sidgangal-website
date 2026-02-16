import { SC, FT } from "../theme";

interface Props {
  children: React.ReactNode;
  color?: "build" | "invest" | "thrive";
}

const colorMap = {
  build: SC.build,
  invest: SC.invest,
  thrive: SC.thrive,
};

export default function Callout({ children, color = "build" }: Props) {
  return (
    <div
      style={{
        background: SC.bgSubtle,
        border: `2.5px solid ${SC.borderLight}`,
        borderLeft: `4px solid ${colorMap[color]}`,
        borderRadius: 10,
        padding: "16px 20px",
        margin: "20px 0",
      }}
    >
      <div
        style={{
          fontFamily: FT.body,
          fontSize: 14.5,
          color: SC.text,
          margin: 0,
          lineHeight: 1.7,
        }}
      >
        {children}
      </div>
    </div>
  );
}
