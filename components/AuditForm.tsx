"use client";

import { useEffect, useState } from "react";
import ScoreCard from "./ScoreCard";
import AuditSection from "./AuditSection";
import BiggestLeakCard from "./BiggestLeakCard";
import BreakdownChart from "./BreakdownChart";
import SectionDistributionChart from "./SectionDistributionChart";
const [email, setEmail] = useState("");
const [leadMessage, setLeadMessage] = useState("");

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
  quickWins: string[];
  strategicFixes: string[];
  sections: AuditSectionType[];
  topFixes: string[];
};

export default function AuditForm() {
  const [url, setUrl] = useState("");
  const [shareLink, setShareLink] = useState("");
  const [keyword, setKeyword] = useState("");
  const [goal, setGoal] = useState("Lead Generation");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AuditResponse | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
  const params = new URLSearchParams(window.location.search);

  const savedUrl = params.get("url");
  const savedKeyword = params.get("keyword");
  const savedGoal = params.get("goal");

  if (savedUrl) setUrl(savedUrl);
  if (savedKeyword) setKeyword(savedKeyword);
  if (savedGoal) setGoal(savedGoal);

  if (window.location.search) {
    setShareLink(window.location.href);
  }
}, []);

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
      const params = new URLSearchParams();
      params.set("url", url);
      if (keyword) params.set("keyword", keyword);
      if (goal) params.set("goal", goal);
      
      const newUrl = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
      
      window.history.replaceState({}, "", `?${params.toString()}`);
      setShareLink(newUrl);

    } catch (err: any) {
      setError(err.message || "Audit failed");
    } finally {
      setLoading(false);
    }
  };
  const handleLeadCapture = () => {
  setLeadMessage("");

  if (!email.trim()) {
    setLeadMessage("Please enter your email.");
    return;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email)) {
    setLeadMessage("Please enter a valid email address.");
    return;
  }

  setLeadMessage(`Thanks! Audit report capture ready for ${email}`);
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
            quickWins={result.quickWins}
            strategicFixes={result.strategicFixes}
          />
          <div className="share-inline">
  <button
    type="button"
    className="secondary-button"
    onClick={async () => {
      await navigator.clipboard.writeText(window.location.href);
      alert("Link copied");
    }}
  >
    🔗 Copy Shareable Link
  </button>
</div>
<div className="card lead-capture-card">
  <div className="lead-capture-content">
    <div>
      <p className="lead-kicker">Get This Audit in Your Inbox</p>
      <h3 className="lead-title">Save and share this report later</h3>
      <p className="lead-text">
        Enter your email to keep a copy of this audit for future reference or
        team review.
      </p>
    </div>

    <div className="lead-form-row">
      <input
        type="email"
        className="input"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button
        type="button"
        className="button lead-button"
        onClick={handleLeadCapture}
      >
        Send Report
      </button>
    </div>

    {leadMessage && <p className="lead-message">{leadMessage}</p>}
  </div>
</div>

          <BiggestLeakCard
            title={result.biggestLeak.title}
            score={result.biggestLeak.score}
            finding={result.biggestLeak.finding}
            recommendation={result.biggestLeak.recommendation}
          />
          <BreakdownChart sections={result.sections} />

          <div className="section-grid">
  {result.sections.map((section, index) => (
    <AuditSection key={index} section={section} />
  ))}

  <SectionDistributionChart sections={result.sections} />
</div>
        </>
      )}
    </div>
  );
}