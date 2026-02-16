import type { CSSProperties } from "react";

export const SC = {
  bg: "var(--color-parchment)",
  bgSubtle: "var(--color-parchment-dark)",
  card: "var(--color-parchment-dark)",
  border: "var(--color-border)",
  borderLight: "var(--color-border-light)",

  text: "var(--color-ink)",
  textSecondary: "var(--color-ink-light)",
  textMuted: "var(--color-ink-muted)",

  build: "var(--color-build)",
  invest: "var(--color-invest)",
  thrive: "var(--color-thrive)",
};

export const FT = {
  display: "var(--font-heading)",
  body: "var(--font-body)",
  mono: "var(--font-mono)",
  label: "var(--font-label)",
};

export const tooltipStyle = {
  contentStyle: {
    background: SC.bgSubtle,
    border: `2.5px solid ${SC.border}`,
    borderRadius: 8,
    fontFamily: FT.mono,
    fontSize: 12,
  } as CSSProperties,
  labelStyle: { color: SC.textSecondary } as CSSProperties,
};

export const axisTickStyle = {
  fill: SC.textMuted,
  fontSize: 11,
  fontFamily: FT.label,
};

export function SectionDivider({ number, label }: { number: string; label: string }) {
  return (
    <div style={{ padding: "60px 0 10px", display: "flex", alignItems: "center", gap: 16 }}>
      <span style={{ fontFamily: FT.mono, fontSize: 13, color: SC.build, fontWeight: 700, background: SC.bgSubtle, border: `2.5px solid ${SC.build}`, width: 36, height: 36, display: "inline-flex", alignItems: "center", justifyContent: "center", borderRadius: 8 }}>
        {number}
      </span>
      <span style={{ fontFamily: FT.mono, fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: SC.build }}>
        {label}
      </span>
      <div style={{ flex: 1, height: 2, background: `linear-gradient(90deg, ${SC.build}, transparent)` }} />
    </div>
  );
}

export function Title({ children, sub }: { children: React.ReactNode; sub?: string }) {
  return (
    <div style={{ margin: "0 0 8px" }}>
      <h2 style={{ fontFamily: FT.display, fontSize: "clamp(24px, 4vw, 36px)", color: SC.text, margin: 0, lineHeight: 1.2, fontWeight: 400 }}>
        {children}
      </h2>
      {sub && (
        <p style={{ fontFamily: FT.body, fontSize: 16, color: SC.textSecondary, margin: "10px 0 0", lineHeight: 1.65, maxWidth: 700 }}>
          {sub}
        </p>
      )}
    </div>
  );
}

export function Card({ children, accent, style }: { children: React.ReactNode; accent?: string; style?: CSSProperties }) {
  return (
    <div style={{
      background: SC.bgSubtle,
      border: `2.5px solid ${SC.border}`,
      borderRadius: 14,
      padding: "clamp(20px, 3vw, 32px)",
      position: "relative",
      overflow: "hidden",
      ...(accent ? { borderTopColor: accent } : {}),
      ...style,
    }}>
      {children}
    </div>
  );
}

export function Callout({ text, color = SC.build }: { text: string; color?: string }) {
  return (
    <div style={{
      background: SC.bgSubtle,
      border: `2.5px solid ${SC.borderLight}`,
      borderLeft: `4px solid ${color}`,
      borderRadius: 10,
      padding: "16px 20px",
      margin: "20px 0",
    }}>
      <p style={{ fontFamily: FT.body, fontSize: 14.5, color: SC.text, margin: 0, lineHeight: 1.7 }}>{text}</p>
    </div>
  );
}

export function JargonBox({ term, children, color = SC.build }: { term: string; children: React.ReactNode; color?: string }) {
  return (
    <div style={{
      background: SC.bgSubtle,
      border: `2px solid ${SC.borderLight}`,
      borderRadius: 10,
      padding: "14px 18px",
      margin: "16px 0",
      display: "flex",
      gap: 12,
      alignItems: "flex-start",
    }}>
      <span style={{
        fontFamily: FT.mono, fontSize: 10, letterSpacing: 1.5, color, background: SC.bg,
        padding: "3px 8px", borderRadius: 4, whiteSpace: "nowrap", marginTop: 2, fontWeight: 600,
        border: `1px solid ${SC.borderLight}`,
      }}>
        JARGON BUSTER
      </span>
      <p style={{ fontFamily: FT.body, fontSize: 14, color: SC.textSecondary, margin: 0, lineHeight: 1.65 }}>
        <strong style={{ color: SC.text }}>{term}:</strong> {children}
      </p>
    </div>
  );
}

export function Prose({ children, style }: { children: React.ReactNode; style?: CSSProperties }) {
  return (
    <p style={{ fontFamily: FT.body, fontSize: 16, color: SC.textSecondary, lineHeight: 1.75, margin: "0 0 18px", ...style }}>
      {children}
    </p>
  );
}

export function Strong({ children, color = SC.build }: { children: React.ReactNode; color?: string }) {
  return <strong style={{ color, fontWeight: 600 }}>{children}</strong>;
}

export function Stat({ label, value, color = SC.text, sub }: { label: string; value: string; color?: string; sub?: string }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontFamily: FT.mono, fontSize: 10, letterSpacing: 1.5, color: SC.textMuted, textTransform: "uppercase" }}>{label}</div>
      <div style={{ fontFamily: FT.mono, fontSize: 22, color, fontWeight: 700, marginTop: 4 }}>{value}</div>
      {sub && <div style={{ fontFamily: FT.mono, fontSize: 11, color: SC.textMuted, marginTop: 2 }}>{sub}</div>}
    </div>
  );
}
