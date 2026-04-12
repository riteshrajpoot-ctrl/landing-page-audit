export async function auditLandingPage(
  url: string,
  keyword: string,
  goal: string
) {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Could not fetch the landing page");
  }

  const html = await response.text();
  const lowerHtml = html.toLowerCase();

const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
const h1 = h1Match ? h1Match[1].replace(/<[^>]+>/g, "").trim() : "";

  const buttonMatches = [...html.matchAll(/<(button|a)[^>]*>([\s\S]*?)<\/(button|a)>/gi),];
  const buttons = buttonMatches
    .map((match) => match[2].replace(/<[^>]+>/g, "").trim())
    .filter(Boolean);

  const formCount = (html.match(/<form/gi) || []).length;
  const fieldCount =
    (html.match(/<input/gi) || []).length +
    (html.match(/<textarea/gi) || []).length +
    (html.match(/<select/gi) || []).length;

  const bodyText = html.replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const keywordLower = keyword.toLowerCase();

  const sections = [];

  let headlineScore = 20;
  const headlineFindings: string[] = [];
  const headlineRecommendations: string[] = [];

  if (!h1) {
    headlineScore -= 10;
    headlineFindings.push("No clear H1 headline found.");
    headlineRecommendations.push(
      "Add one strong headline that explains the offer clearly."
    );
  } else {
    headlineFindings.push(`Main headline found: "${h1}"`);
    if (keyword && !h1.toLowerCase().includes(keywordLower)) {
      headlineScore -= 4;
      headlineFindings.push("Target keyword is not present in the main headline.");
      headlineRecommendations.push(
        "Include the target keyword naturally in the main headline."
      );
    }
    if (h1.length < 6) {
      headlineScore -= 3;
      headlineFindings.push("Headline is too short to communicate value.");
      headlineRecommendations.push(
        "Make the headline more specific and benefit-led."
      );
    }
  }

  sections.push({
    title: "Headline Clarity",
    score: Math.max(headlineScore, 0),
    findings: headlineFindings.length
      ? headlineFindings
      : ["Headline structure looks reasonably strong."],
    recommendations: headlineRecommendations.length
      ? headlineRecommendations
      : ["Headline structure looks reasonably strong."],
  });

  let ctaScore = 20;
  const ctaFindings: string[] = [];
  const ctaRecommendations: string[] = [];

  const ctaKeywords = [
    "buy",
    "start",
    "book",
    "get",
    "try",
    "sign up",
    "request",
    "contact",
    "download",
  ];

  const strongCtas = buttons.filter((btn) =>
    ctaKeywords.some((word) => btn.toLowerCase().includes(word))
  );

  if (strongCtas.length === 0) {
    ctaScore -= 8;
    ctaFindings.push("No strong action-oriented CTA detected.");
    ctaRecommendations.push(
      "Add a clear CTA like Book Demo, Get Started, or Start Free Trial."
    );
  } else {
    ctaFindings.push(`Detected ${strongCtas.length} action-oriented CTA(s).`);
  }

  sections.push({
    title: "CTA Strength",
    score: Math.max(ctaScore, 0),
    findings: ctaFindings.length ? ctaFindings : ["CTA presence looks decent."],
    recommendations: ctaRecommendations.length
      ? ctaRecommendations
      : ["CTA presence looks decent."],
  });

  let trustScore = 20;
  const trustFindings: string[] = [];
  const trustRecommendations: string[] = [];

  const trustWords = [
    "testimonial",
    "review",
    "trusted by",
    "customers",
    "clients",
    "guarantee",
    "case study",
    "secure",
  ];

  const trustHits = trustWords.filter((word) => lowerHtml.includes(word));

  if (trustHits.length === 0) {
    trustScore -= 8;
    trustFindings.push("Very few trust indicators detected.");
    trustRecommendations.push(
      "Add testimonials, client logos, reviews, or trust badges."
    );
  } else {
    trustFindings.push(`Trust signals found: ${trustHits.join(", ")}`);
  }

  sections.push({
    title: "Trust Signals",
    score: Math.max(trustScore, 0),
    findings: trustFindings.length ? trustFindings : ["Trust elements are present."],
    recommendations: trustRecommendations.length
      ? trustRecommendations
      : ["Trust elements are present."],
  });

  let contentScore = 20;
  const contentFindings: string[] = [];
  const contentRecommendations: string[] = [];

  if (bodyText.length < 500) {
    contentScore -= 6;
    contentFindings.push(
      "Page content is thin and may not explain the offer well enough."
    );
    contentRecommendations.push(
      "Add more benefit-led copy, objection handling, and key details."
    );
  } else {
    contentFindings.push("Page has a reasonable amount of text content.");
  }

  sections.push({
    title: "Content Quality",
    score: Math.max(contentScore, 0),
    findings: contentFindings,
    recommendations: contentRecommendations.length
      ? contentRecommendations
      : ["Content depth looks acceptable."],
  });

  let uxScore = 20;
  const uxFindings: string[] = [];
  const uxRecommendations: string[] = [];

  if (goal === "Lead Generation" && formCount === 0) {
    uxScore -= 10;
    uxFindings.push("Lead generation goal selected but no form was found.");
    uxRecommendations.push("Add a visible lead form above the fold.");
  }

  if (fieldCount > 7) {
    uxScore -= 5;
    uxFindings.push("The form appears long and may create friction.");
    uxRecommendations.push(
      "Reduce the number of form fields to improve conversion rate."
    );
  }

  if (uxFindings.length === 0) {
    uxFindings.push("No major UX friction signals detected from the page structure.");
  }

  sections.push({
    title: "UX and Conversion Flow",
    score: Math.max(uxScore, 0),
    findings: uxFindings,
    recommendations: uxRecommendations.length
      ? uxRecommendations
      : ["Form and page flow look reasonably conversion-friendly."],
  });

  const totalScore = sections.reduce((sum, section) => sum + section.score, 0);

  let grade = "Needs Improvement";
  if (totalScore >= 85) grade = "Excellent";
  else if (totalScore >= 70) grade = "Good";
  else if (totalScore >= 50) grade = "Average";

  const topFixes = sections
    .flatMap((section) => section.recommendations)
    .slice(0, 5);

  return {
    score: totalScore,
    grade,
    summary:
      totalScore >= 70
        ? "The landing page has a decent foundation, but there are still opportunities to improve conversion performance."
        : "The page has visible gaps in messaging, trust, CTA clarity, or user flow.",
    sections,
    topFixes,
  };
}