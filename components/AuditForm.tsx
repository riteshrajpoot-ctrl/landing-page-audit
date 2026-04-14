"use client";

import { useState } from "react";
import ScoreCard from "./ScoreCard";
import AuditSection from "./AuditSection";
import BiggestLeakCard from "./BiggestLeakCard";

type AuditSectionType = {
  title: string;
  score: number;
  findings: string[];
  recommendations: string[];
};

type AuditResponse = {
  score: number;
  grade: string;
  summary: string;
  biggestLeak: {
    title: string;
    score: number;
    finding: string;
    recommendation: string;
  };
  sections: AuditSectionType[];
  topFixes: string[];
};

export default function AuditForm() {
  const [url, setUrl] = useState("");
  const [keyword, setKeyword] = useState("");
  const [goal, setGoal] = useState("Lead Generation");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AuditResponse | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url, keyword, goal }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || "Audit failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="card form-card">
        <div className="field-group">
          <label className="label">Landing Page URL</label>
          <input
            className="input"
            type="url"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
        </div>

        <div className="field-group">
          <label className="label">Target Keyword</label>
          <input
            className="input"
            type="text"
            placeholder="e.g. best crm software"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>

        <div className="field-group">
          <label className="label">Business Goal</label>
          <select
            className="select"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
          >
            <option>Lead Generation</option>
            <option>Product Sales</option>
            <option>Demo Booking</option>
            <option>App Installs</option>
            <option>General Conversion</option>
          </select>
        </div>

        <button className="button" type="submit" disabled={loading}>
          {loading ? "Auditing..." : "Audit Landing Page"}
        </button>
      </form>

      {error && <div className="error-box">{error}</div>}

            {result && (
        <>
          <ScoreCard
            score={result.score}
            grade={result.grade}
            summary={result.summary}
            topFixes={result.topFixes}
          />

          <BiggestLeakCard
            title={result.biggestLeak.title}
            score={result.biggestLeak.score}
            finding={result.biggestLeak.finding}
            recommendation={result.biggestLeak.recommendation}
          />

          <div className="section-grid">
            {result.sections.map((section, index) => (
              <AuditSection key={index} section={section} />
            ))}
          </div>
        </>
      )}