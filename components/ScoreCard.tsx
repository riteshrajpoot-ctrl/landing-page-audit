type Props = {
  score: number;
  grade: string;
  summary: string;
  topFixes: string[];
  quickWins: string[];
  strategicFixes: string[];
};

function getScoreTone(score: number) {
  if (score >= 85) return "excellent";
  if (score >= 70) return "good";
  if (score >= 50) return "average";
  return "poor";
}

export default function ScoreCard({
  score,
  grade,
  summary,
  topFixes,
  quickWins,
  strategicFixes,
}: Props) {
  const tone = getScoreTone(score);

  return (
    <div className="card score-card">
      <div className="score-layout">
        <div className="score-visual-wrap">
          <div className={`score-circle ${tone}`}>
            <div className="score-circle-inner">
              <div className="score-number">{score}</div>
              <div className="score-out-of">/100</div>
            </div>
          </div>
          <div className={`score-grade-badge ${tone}`}>{grade}</div>
        </div>

        <div className="score-content">
          <p className="score-kicker">Landing Page Audit Result</p>
          <h2 className="score-heading">Overall Performance Snapshot</h2>
          <p className="score-summary">{summary}</p>

          <div className="fix-panel">
            <h3 className="fix-title">Top Priority Fixes</h3>
            <div className="fix-chip-wrap">
              {topFixes.map((fix, index) => (
                <div className="fix-chip" key={index}>
                  <span className="fix-chip-index">#{index + 1}</span>
                  <span>{fix}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="fix-columns">
            <div className="fix-column">
              <h4 className="fix-column-title">Quick Wins</h4>
              <div className="fix-list-block">
                {quickWins.length ? (
                  quickWins.map((fix, index) => (
                    <div className="mini-fix-chip quick" key={index}>
                      {fix}
                    </div>
                  ))
                ) : (
                  <div className="mini-fix-chip empty">No quick wins found.</div>
                )}
              </div>
            </div>

            <div className="fix-column">
              <h4 className="fix-column-title">Strategic Improvements</h4>
              <div className="fix-list-block">
                {strategicFixes.length ? (
                  strategicFixes.map((fix, index) => (
                    <div className="mini-fix-chip strategy" key={index}>
                      {fix}
                    </div>
                  ))
                ) : (
                  <div className="mini-fix-chip empty">
                    No strategic improvements found.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}