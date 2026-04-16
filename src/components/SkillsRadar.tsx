import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

const data = [
  { skill: 'Full-Stack', value: 90 },
  { skill: 'Machine\nLearning', value: 85 },
  { skill: 'Computer\nVision', value: 80 },
  { skill: 'Data Eng.', value: 75 },
  { skill: 'AI Systems', value: 78 },
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
      fill="#8B98A8"
      fontSize={10.5}
      fontFamily="'JetBrains Mono', monospace"
      letterSpacing="0.03em"
    >
      {lines.map((line: string, i: number) => (
        <tspan key={i} x={x + dx} dy={i === 0 ? 0 : 14}>
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
          background: '#111722',
          border: '1px solid #1E2A38',
          borderRadius: '8px',
          padding: '0.5rem 0.875rem',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '0.75rem',
        }}
      >
        <p style={{ color: '#8B98A8', marginBottom: '2px' }}>{skill.replace('\n', ' ')}</p>
        <p style={{ color: '#00F5D4', fontWeight: 500 }}>{value}%</p>
      </div>
    );
  }
  return null;
};

export default function SkillsRadar() {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: '280px' }} aria-label="Skills radar chart">
      <ResponsiveContainer width="100%" height={280}>
        <RadarChart data={data} margin={{ top: 16, right: 36, bottom: 16, left: 36 }}>
          <PolarGrid
            stroke="#1E2A38"
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
            stroke="#00F5D4"
            strokeWidth={1.5}
            fill="#00F5D4"
            fillOpacity={0.1}
            dot={{
              r: 3,
              fill: '#00F5D4',
              strokeWidth: 0,
            }}
            activeDot={{
              r: 4,
              fill: '#00F5D4',
              stroke: 'rgba(0,245,212,0.3)',
              strokeWidth: 4,
            }}
          />
          <Tooltip content={<CustomTooltip />} />
        </RadarChart>
      </ResponsiveContainer>

      <p
        style={{
          textAlign: 'center',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '0.6875rem',
          color: '#4A5568',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          marginTop: '0.5rem',
        }}
      >
        Self-assessed proficiency
      </p>
    </div>
  );
}
