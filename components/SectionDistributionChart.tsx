"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

type Section = {
  title: string;
  score: number;
  findings: string[];
  recommendations: string[];
};

type Props = {
  sections: Section[];
};

export default function SectionDistributionChart({ sections }: Props) {
  const strong = sections.filter((section) => section.score >= 16).length;
  const medium = sections.filter(
    (section) => section.score >= 12 && section.score < 16
  ).length;
  const weak = sections.filter((section) => section.score < 12).length;

  const data = [
    { name: "Strong", value: strong, color: "#22c55e" },
    { name: "Medium", value: medium, color: "#3b82f6" },
    { name: "Weak", value: weak, color: "#f59e0b" },
  ];

  return (
    <div className="card distribution-card">
      <div className="distribution-header">
        <p className="distribution-kicker">Audit Score Distribution</p>
        <h3 className="distribution-title">Section Health Overview</h3>
      </div>

      <div className="distribution-chart-wrap">
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={95}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="distribution-legend">
        {data.map((item) => (
          <div className="distribution-legend-item" key={item.name}>
            <span
              className="distribution-dot"
              style={{ backgroundColor: item.color }}
            />
            <span className="distribution-label">{item.name}</span>
            <span className="distribution-value">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}