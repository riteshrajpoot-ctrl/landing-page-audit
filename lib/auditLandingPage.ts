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

  const buttonMatches = [
    ...html.matchAll(/<(button|a)[^>]*>([\s\S]*?)<\/(button|a)>/gi),
  ];

  const buttons = buttonMatches
    .map((match) => match[2].replace(/<[^>]+>/g, "").trim())
    .filter(Boolean);

  const formCount = (html.match(/<form/gi) || []).length;
  const fieldCount =
    (html.match(/<input/gi) || []).length +
    (html.match(/<textarea/gi) || []).length +
    (html.match(/<select/gi) || []).length;

  const bodyText = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
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

  let speedScore = 20;
  const speedFindings: string[] = [];
  const speedRecommendations: string[] = [];

  const htmlSizeKb = Buffer.byteLength(html, "utf8") / 1024;
  const scriptCount = (html.match(/<script/gi) || []).length;
  const imageCount = (html.match(/<img/gi) || []).length;
  const iframeCount = (html.match(/<iframe/gi) || []).length;
  const stylesheetCount =
    (html.match(/<link[^>]+stylesheet/gi) || []).length;

  if (htmlSizeKb > 300) {
    speedScore -= 5;
    speedFindings.push(
      `Large HTML payload detected (${Math.round(htmlSizeKb)} KB).`
    );
    speedRecommendations.push(
      "Reduce unnecessary markup and compress page resources."
    );
  } else {
    speedFindings.push(`HTML size looks manageable (${Math.round(htmlSizeKb)} KB).`);
  }

  if (scriptCount > 12) {
    speedScore -= 5;
    speedFindings.push(`Heavy script usage detected (${scriptCount} scripts).`);
    speedRecommendations.push(
      "Reduce non-essential scripts and defer unused JavaScript."
    );
  }

  if (imageCount > 20) {
    speedScore -= 4;
    speedFindings.push(`High image count detected (${imageCount} images).`);
    speedRecommendations.push(
      "Compress images and lazy-load below-the-fold assets."
    );
  }

  if (iframeCount > 0) {
    speedScore -= 2;
    speedFindings.push(`Embedded iframe content found (${iframeCount} iframe(s)).`);
    speedRecommendations.push(
      "Minimize heavy embeds that can slow initial page rendering."
    );
  }

  if (stylesheetCount > 5) {
    speedScore -= 2;
    speedFindings.push(
      `Multiple stylesheets detected (${stylesheetCount} CSS files).`
    );
    speedRecommendations.push(
      "Reduce CSS requests and remove unused styles where possible."
    );
  }

  sections.push({
    title: "Page Speed",
    score: Math.max(speedScore, 0),
    findings: speedFindings.length ? speedFindings : ["No major speed issues detected."],
    recommendations: speedRecommendations.length
      ? speedRecommendations
      : ["Page structure looks reasonably lightweight."],
  });

  let mobileScore = 20;
  const mobileFindings: string[] = [];
  const mobileRecommendations: string[] = [];

  const hasViewportMeta = /<meta[^>]+name=["']viewport["'][^>]*>/i.test(html);
  const inlineWidthCount = (html.match(/width=["']\d+["']/gi) || []).length;
  const inlineFixedPxCount = (html.match(/:\s*\d+px/gi) || []).length;

  if (!hasViewportMeta) {
    mobileScore -= 8;
    mobileFindings.push("Viewport meta tag is missing.");
    mobileRecommendations.push(
      "Add a viewport meta tag for proper mobile responsiveness."
    );
  } else {
    mobileFindings.push("Viewport meta tag is present.");
  }

  if (fieldCount > 7) {
    mobileScore -= 4;
    mobileFindings.push("Long forms can create friction on mobile devices.");
    mobileRecommendations.push(
      "Shorten forms to improve mobile completion rate."
    );
  }

  if (inlineWidthCount > 10 || inlineFixedPxCount > 25) {
    mobileScore -= 4;
    mobileFindings.push("Multiple fixed-width elements may hurt mobile flexibility.");
    mobileRecommendations.push(
      "Avoid rigid widths and use responsive layout styling."
    );
  }

  if (buttons.length === 0) {
    mobileScore -= 2;
    mobileFindings.push("No prominent tap-friendly CTA elements were detected.");
    mobileRecommendations.push(
      "Use clear, large tap-friendly CTA buttons for mobile users."
    );
  }

  if (bodyText.length > 4000) {
    mobileScore -= 2;
    mobileFindings.push("Very dense content may be harder to scan on small screens.");
    mobileRecommendations.push(
      "Break content into smaller sections for easier mobile reading."
    );
  }

  sections.push({
    title: "Mobile Friendliness",
    score: Math.max(mobileScore, 0),
    findings: mobileFindings.length
      ? mobileFindings
      : ["No major mobile issues detected."],
    recommendations: mobileRecommendations.length
      ? mobileRecommendations
      : ["Page appears reasonably mobile-friendly."],
  });

  const totalScore = Math.round(
    sections.reduce((sum, section) => sum + section.score, 0) / sections.length * 5
  );

  let grade = "Needs Improvement";
  if (totalScore >= 85) grade = "Excellent";
  else if (totalScore >= 70) grade = "Good";
  else if (totalScore >= 50) grade = "Average";

  const biggestProblem = [...sections].sort((a, b) => a.score - b.score)[0];

  const topFixes = sections
    .flatMap((section) => section.recommendations)
    .slice(0, 5);

  return {
    score: totalScore,
    grade,
    summary:
      totalScore >= 70
        ? `The page has a decent foundation, but ${biggestProblem.title.toLowerCase()} still needs improvement for better conversion performance.`
        : `The page has visible gaps across messaging, usability, or performance. The biggest issue appears to be ${biggestProblem.title.toLowerCase()}.`,
    sections,
    topFixes,
  };
}