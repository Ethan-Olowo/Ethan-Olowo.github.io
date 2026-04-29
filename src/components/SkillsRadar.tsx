import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

const data = [
  { skill: 'Backend', value: 80 },
  { skill: 'Machine\nLearning', value: 90 },
  { skill: 'Frontend', value: 74 },
  { skill: 'Data Eng.', value: 82 },
  { skill: 'AI Systems', value: 80 },
  { skill: 'DevOps', value: 68 },
];

// Custom angle axis tick for clean, mono-styled labels
const CustomTick = ({ x, y, payload, cx, cy }: any) => {
  // Determine if text needs repositioning to avoid clipping
  const lines = String(payload.value).split('\n');
  const dx = x > cx ? 4 : x < cx ? -4 : 0;
  const dy = y > cy ? 4 : y < cy ? -4 : 0;
  const anchor = x > cx + 5 ? 'start' : x < cx - 5 ? 'end' : 'middle';

  return (
    <text
      x={x + dx}
      y={y + dy}
      textAnchor={anchor}
      dominantBaseline="central"
      fill="var(--muted)"
      fontSize={10.5}
      fontFamily="'JetBrains Mono', monospace"
      letterSpacing="0.03em">
      {lines.map((line: string, i: number) => (
        <tspan
          key={i}
          x={x + dx}
          dy={i === 0 ? 0 : 14}>
          {line}
        </tspan>
      ))}
    </text>
  );
};

// Custom tooltip
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload?.length) {
    const { skill, value } = payload[0].payload;
    return (
      <div
        style={{
          background: "var(--bg)",
          border: "1px solid var(--border)",
          borderRadius: "8px",
          padding: "0.5rem 0.875rem",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "0.75rem",
        }}>
        <p style={{ color: "var(--muted)", marginBottom: "2px" }}>
          {skill.replace("\n", " ")}
        </p>
        <p style={{ color: "var(--accent)", fontWeight: 500 }}>{value}%</p>
      </div>
    );
  }
  return null;
};

export default function SkillsRadar() {
  return (
    <div
      style={{ width: "100%", height: "100%", minHeight: "280px" }}
      aria-label="Skills radar chart">
      <ResponsiveContainer
        width="100%"
        height={280}>
        <RadarChart
          data={data}
          margin={{ top: 16, right: 36, bottom: 16, left: 36 }}>
          <PolarGrid
            stroke="var(--border)"
            strokeDasharray="3 3"
            strokeWidth={1}
          />
          <PolarAngleAxis
            dataKey="skill"
            tick={<CustomTick />}
            tickLine={false}
          />
          <Radar
            name="Skills"
            dataKey="value"
            stroke="var(--accent)"
            strokeWidth={1.5}
            fill="var(--accent)"
            fillOpacity={0.1}
            dot={{
              r: 3,
              fill: "var(--accent)",
              strokeWidth: 0,
            }}
            activeDot={{
              r: 4,
              fill: "var(--accent)",
              stroke: "rgba(var(--accent-rgb), 0.3)",
              strokeWidth: 4,
            }}
          />
          <Tooltip content={<CustomTooltip />} />
        </RadarChart>
      </ResponsiveContainer>

      <p
        style={{
          textAlign: "center",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "0.6875rem",
          color: "var(--muted)",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          marginTop: "0.5rem",
        }}>
        Self-assessed proficiency
      </p>
    </div>
  );
}
