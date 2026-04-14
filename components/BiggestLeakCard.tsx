type Props = {
  title: string;
  score: number;
  finding: string;
  recommendation: string;
};

function getLeakTone(score: number) {
  if (score >= 16) return "good";
  if (score >= 12) return "warning";
  if (score >= 8) return "average";
  return "critical";
}

export default function BiggestLeakCard({
  title,
  score,
  finding,
  recommendation,
}: Props) {
  const tone = getLeakTone(score);

  return (
    <div className={`card biggest-leak-card ${tone}`}>
      <div className="biggest-leak-header">
        <div className="biggest-leak-icon">⚠</div>
        <div>
          <p className="biggest-leak-kicker">Biggest Conversion Leak</p>
          <h3 className="biggest-leak-title">{title}</h3>
        </div>
      </div>

      <div className="biggest-leak-body">
        <div className="biggest-leak-box">
          <p className="biggest-leak-label">Primary Finding</p>
          <p className="biggest-leak-text">{finding}</p>
        </div>

        <div className="biggest-leak-box">
          <p className="biggest-leak-label">What to Fix First</p>
          <p className="biggest-leak-text">{recommendation}</p>
        </div>
      </div>
    </div>
  );
}