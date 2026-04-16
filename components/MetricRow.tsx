type Props = {
  score: number;
  strongestSection: string;
  biggestLeakTitle: string;
  strongCount: number;
  weakCount: number;
};

export default function MetricRow({
  score,
  strongestSection,
  biggestLeakTitle,
  strongCount,
  weakCount,
}: Props) {
  const metrics = [
    {
      label: "Overall Score",
      value: `${score}/100`,
    },
    {
      label: "Best Area",
      value: strongestSection,
    },
    {
      label: "Biggest Leak",
      value: biggestLeakTitle,
    },
    {
      label: "Strong vs Weak",
      value: `${strongCount} / ${weakCount}`,
    },
  ];

  return (
    <div className="metric-row">
      {metrics.map((item) => (
        <div className="card metric-card" key={item.label}>
          <p className="metric-card-label">{item.label}</p>
          <h3 className="metric-card-value">{item.value}</h3>
        </div>
      ))}
    </div>
  );
}