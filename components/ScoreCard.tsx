type Props = {
  score: number;
  grade: string;
  summary: string;
  topFixes: string[];
};

export default function ScoreCard({
  score,
  grade,
  summary,
  topFixes,
}: Props) {
  return (
    <div className="card score-card">
      <div className="score-top">
        <div>
          <p className="score-kicker">Overall Audit Score</p>
          <h2 className="score-number">{score}/100</h2>
          <div className="score-grade">{grade}</div>
          <p className="score-summary">{summary}</p>
        </div>

        <div>
          <h3 className="fix-title">Top Fixes</h3>
          <ul className="fix-list">
            {topFixes.map((fix, index) => (
              <li key={index}>{fix}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}