import { NextResponse } from "next/server";

import { getPageMarkdown, savePageMarkdown } from "@/lib/page-store";

export const dynamic = "force-dynamic";

type RouteParams = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(_: Request, { params }: RouteParams) {
  const { slug } = await params;
  const markdown = (await getPageMarkdown(slug)) ?? "";
  return NextResponse.json({ markdown });
}

export async function PUT(request: Request, { params }: RouteParams) {
  const { slug } = await params;
  try {
    const body = await request.json();
    if (typeof body?.markdown !== "string") {
      return NextResponse.json(
        { error: "Invalid payload" },
        { status: 400 }
      );
    }

    await savePageMarkdown(slug, body.markdown);

    return NextResponse.json({ markdown: body.markdown });
  } catch {
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
