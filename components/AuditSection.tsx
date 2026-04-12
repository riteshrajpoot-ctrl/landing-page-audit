type Section = {
  title: string;
  score: number;
  findings: string[];
  recommendations: string[];
};

export default function AuditSection({ section }: { section: Section }) {
  return (
    <div className="card audit-section">
      <div className="audit-section-top">
        <h3 className="audit-section-title">{section.title}</h3>
        <span className="audit-badge">{section.score}/20</span>
      </div>

      <div>
        <h4 className="list-title">Findings</h4>
        <ul className="audit-list">
          {section.findings.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="list-title">Recommendations</h4>
        <ul className="audit-list">
          {section.recommendations.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}