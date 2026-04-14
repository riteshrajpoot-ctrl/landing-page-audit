type Section = {
  title: string;
  score: number;
  findings: string[];
  recommendations: string[];
};

function getSectionTone(score: number) {
  if (score >= 16) return "excellent";
  if (score >= 12) return "good";
  if (score >= 8) return "average";
  return "poor";
}

export default function AuditSection({ section }: { section: Section }) {
  const tone = getSectionTone(section.score);
  const width = `${(section.score / 20) * 100}%`;

  return (
    <div className="card audit-section">
      <div className="audit-section-top">
        <div>
          <h3 className="audit-section-title">{section.title}</h3>
          <div className={`audit-badge ${tone}`}>{section.score}/20</div>
        </div>
      </div>

      <div className="progress-wrap">
        <div className="progress-track">
          <div className={`progress-fill ${tone}`} style={{ width }} />
        </div>
      </div>

      <div className="audit-block">
        <h4 className="list-title">Findings</h4>
        <div className="insight-list">
          {section.findings.map((item, idx) => (
            <div className="insight-item neutral" key={idx}>
              {item}
            </div>
          ))}
        </div>
      </div>

      <div className="audit-block">
        <h4 className="list-title">Recommendations</h4>
        <div className="insight-list">
          {section.recommendations.map((item, idx) => (
            <div className={`insight-item ${tone}`} key={idx}>
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}