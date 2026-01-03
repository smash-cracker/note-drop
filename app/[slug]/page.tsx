import { Metadata, ResolvingMetadata } from "next";
import { remark } from "remark";
import html from "remark-html";

import { MarkdownSection } from "@/components/markdown-section";
import { getPageMarkdown } from "@/lib/page-store";

export const dynamic = "force-dynamic";

async function markdownToHtml(markdown: string): Promise<string> {
  const result = await remark().use(html).process(markdown);
  return result.toString();
}

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const markdown = await getPageMarkdown(slug);

  // Default values
  if (!markdown) {
    return {
      title: "Untitled Page",
      description: "Start writing your notes...",
    };
  }

  // Extract title from first line if it's a header
  const lines = markdown.split("\n");
  let title = slug.charAt(0).toUpperCase() + slug.slice(1);
  let description = "";

  if (lines.length > 0 && lines[0].startsWith("# ")) {
    title = lines[0].replace("# ", "").trim();
    description = lines.slice(1).join(" ").substring(0, 160).trim();
  } else {
    description = markdown.substring(0, 160).trim();
  }

  // Clean up description (remove markdown syntax ideally, but basic trimming helps)
  description = description.replace(/[#*`]/g, "");

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;

  const storedMarkdown =
    (await getPageMarkdown(slug)) ??
    "# Untitled Page\n\nStart writing your markdown here...";
  const htmlContent = await markdownToHtml(storedMarkdown);

  return (
    <MarkdownSection
      slug={slug}
      initialMarkdown={storedMarkdown}
      initialHtml={htmlContent}
    />
  );
}