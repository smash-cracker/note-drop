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