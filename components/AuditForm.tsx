"use client";

import { useEffect, useMemo, useState } from "react";
import ScoreCard from "./ScoreCard";
import AuditSection from "./AuditSection";
import BiggestLeakCard from "./BiggestLeakCard";
import BreakdownChart from "./BreakdownChart";
import SectionDistributionChart from "./SectionDistributionChart";
import VerdictBanner from "./VerdictBanner";
import MetricRow from "./MetricRow";

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

type TabKey =
  | "overview"
  | "conversion"
  | "speed"
  | "mobile"
  | "recommendations";

export default function AuditForm() {
  const [url, setUrl] = useState("");
  const [keyword, setKeyword] = useState("");
  const [goal, setGoal] = useState("Lead Generation");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AuditResponse | null>(null);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [leadMessage, setLeadMessage] = useState("");
  const [activeTab, setActiveTab] = useState<TabKey>("overview");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const savedUrl = params.get("url");
    const savedKeyword = params.get("keyword");
    const savedGoal = params.get("goal");

    if (savedUrl) setUrl(savedUrl);
    if (savedKeyword) setKeyword(savedKeyword);
    if (savedGoal) setGoal(savedGoal);
  }, []);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    setLeadMessage("");
    setActiveTab("overview");

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

      window.history.replaceState({}, "", `?${params.toString()}`);
    } catch (err: any) {
      setError(err.message || "Audit failed");
    } finally {
      setLoading(false);
    }
  };

  const derived = useMemo(() => {
    if (!result) return null;

    const strongCount = result.sections.filter((section) => section.score >= 16).length;
    const weakCount = result.sections.filter((section) => section.score < 12).length;

    const sorted = [...result.sections].sort((a, b) => b.score - a.score);
    const strongestSection = sorted[0]?.title || "N/A";

    const conversionTitles = [
      "Headline Clarity",
      "CTA Strength",
      "Trust Signals",
      "Content Quality",
      "UX and Conversion Flow",
    ];

    const conversionSections = result.sections.filter((section) =>
      conversionTitles.includes(section.title)
    );

    const speedSections = result.sections.filter(
      (section) => section.title === "Page Speed"
    );

    const mobileSections = result.sections.filter(
      (section) => section.title === "Mobile Friendliness"
    );

    return {
      strongCount,
      weakCount,
      strongestSection,
      conversionSections,
      speedSections,
      mobileSections,
    };
  }, [result]);

  const renderTabContent = () => {
    if (!result || !derived) return null;

    if (activeTab === "overview") {
      return (
        <>
          <div className="report-stack">
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
                Copy Audit Link
              </button>
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
          </div>
        </>
      );
    }

    if (activeTab === "conversion") {
      return (
        <div className="section-grid">
          {derived.conversionSections.map((section, index) => (
            <AuditSection key={index} section={section} />
          ))}
        </div>
      );
    }

    if (activeTab === "speed") {
      return (
        <div className="section-grid">
          {derived.speedSections.map((section, index) => (
            <AuditSection key={index} section={section} />
          ))}
          <SectionDistributionChart sections={result.sections} />
        </div>
      );
    }

    if (activeTab === "mobile") {
      return (
        <div className="section-grid">
          {derived.mobileSections.map((section, index) => (
            <AuditSection key={index} section={section} />
          ))}
          <SectionDistributionChart sections={result.sections} />
        </div>
      );
    }

    return (
      <div className="report-stack">
        <div className="card recommendation-panel">
          <div className="recommendation-panel-header">
            <p className="recommendation-kicker">Priority Recommendations</p>
            <h3 className="recommendation-title">Action Plan</h3>
          </div>

          <div className="fix-columns">
            <div className="fix-column">
              <h4 className="fix-column-title">Quick Wins</h4>
              <div className="fix-list-block">
                {result.quickWins.length ? (
                  result.quickWins.map((fix, index) => (
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
                {result.strategicFixes.length ? (
                  result.strategicFixes.map((fix, index) => (
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

        <div className="card lead-capture-card">
          <div className="lead-capture-content">
            <div>
              <p className="lead-kicker">Get This Audit in Your Inbox</p>
              <h3 className="lead-title">Save and share this report later</h3>
              <p className="lead-text">
                Enter your email to keep a copy of this audit for future
                reference or team review.
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
      </div>
    );
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

      {result && derived && (
        <>
          <VerdictBanner
            score={result.score}
            grade={result.grade}
            biggestLeakTitle={result.biggestLeak.title}
            strongCount={derived.strongCount}
            weakCount={derived.weakCount}
          />

          <MetricRow
            score={result.score}
            strongestSection={derived.strongestSection}
            biggestLeakTitle={result.biggestLeak.title}
            strongCount={derived.strongCount}
            weakCount={derived.weakCount}
          />

          <div className="result-tabs">
            <button
              type="button"
              className={`tab-button ${activeTab === "overview" ? "active" : ""}`}
              onClick={() => setActiveTab("overview")}
            >
              Overview
            </button>

            <button
              type="button"
              className={`tab-button ${activeTab === "conversion" ? "active" : ""}`}
              onClick={() => setActiveTab("conversion")}
            >
              Conversion
            </button>

            <button
              type="button"
              className={`tab-button ${activeTab === "speed" ? "active" : ""}`}
              onClick={() => setActiveTab("speed")}
            >
              Speed
            </button>

            <button
              type="button"
              className={`tab-button ${activeTab === "mobile" ? "active" : ""}`}
              onClick={() => setActiveTab("mobile")}
            >
              Mobile
            </button>

            <button
              type="button"
              className={`tab-button ${activeTab === "recommendations" ? "active" : ""}`}
              onClick={() => setActiveTab("recommendations")}
            >
              Recommendations
            </button>
          </div>

          {renderTabContent()}
        </>
      )}
    </div>
  );
}