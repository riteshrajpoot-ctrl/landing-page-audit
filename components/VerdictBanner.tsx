type Props = {
  score: number;
  grade: string;
  biggestLeakTitle: string;
  strongCount: number;
  weakCount: number;
};

function getVerdictTone(score: number) {
  if (score >= 85) return "excellent";
  if (score >= 70) return "good";
  if (score >= 50) return "average";
  return "poor";
}

export default function VerdictBanner({
  score,
  grade,
  biggestLeakTitle,
  strongCount,
  weakCount,
}: Props) {
  const tone = getVerdictTone(score);

  return (
    <div className={`card verdict-banner ${tone}`}>
      <div className="verdict-main">
        <div>
          <p className="verdict-kicker">Landing Page Audit Verdict</p>
          <h2 className="verdict-title">{grade}</h2>
          <p className="verdict-subtitle">
            Overall score: <strong>{score}/100</strong>
          </p>
        </div>

        <div className="verdict-pills">
          <div className="verdict-pill">
            <span className="verdict-pill-label">Biggest Risk</span>
            <span className="verdict-pill-value">{biggestLeakTitle}</span>
          </div>

          <div className="verdict-pill">
            <span className="verdict-pill-label">Strong Sections</span>
            <span className="verdict-pill-value">{strongCount}</span>
          </div>

          <div className="verdict-pill">
            <span className="verdict-pill-label">Weak Sections</span>
            <span className="verdict-pill-value">{weakCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}