import { auditLandingPage } from "../../../lib/auditLandingPage";

export async function POST(req: Request) {
  try {
    const { url, keyword, goal } = await req.json();

    if (!url) {
      return Response.json(
        { error: "Landing page URL is required" },
        { status: 400 }
      );
    }

    const result = await auditLandingPage(
      url,
      keyword || "",
      goal || "Lead Generation"
    );

    return Response.json(result);
  } catch (error: any) {
    return Response.json(
      {
        error:
          error.message || "Something went wrong while auditing the landing page",
      },
      { status: 500 }
    );
  }
}