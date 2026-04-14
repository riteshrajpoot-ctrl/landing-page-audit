type Section = {
  title: string;
  score: number;
  findings: string[];
  recommendations: string[];
};

type Props = {
  sections: Section[];
};

function getTone(score: number) {
  if (score >= 16) return "excellent";
  if (score >= 12) return "good";
  if (score >= 8) return "average";
  return "poor";
}

export default function BreakdownChart({ sections }: Props) {
  const sortedSections = [...sections].sort((a, b) => b.score - a.score);

  return (
    <div className="card breakdown-card">
      <div className="breakdown-header">
        <p className="breakdown-kicker">Performance Breakdown</p>
        <h3 className="breakdown-title">Section Ranking</h3>
      </div>

      <div className="breakdown-list">
        {sortedSections.map((section, index) => {
          const width = `${(section.score / 20) * 100}%`;
          const tone = getTone(section.score);

          return (
            <div className="breakdown-row" key={`${section.title}-${index}`}>
              <div className="breakdown-row-top">
                <div className="breakdown-name-wrap">
                  <span className="breakdown-rank">#{index + 1}</span>
                  <span className="breakdown-name">{section.title}</span>
                </div>
                <span className={`breakdown-score ${tone}`}>
                  {section.score}/20
                </span>
              </div>

              <div className="breakdown-track">
                <div
                  className={`breakdown-fill ${tone}`}
                  style={{ width }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}