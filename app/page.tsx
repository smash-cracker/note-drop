import { remark } from "remark";
import html from "remark-html";

import { MarkdownSection } from "@/components/markdown-section";

// Convert markdown to HTML at build/runtime
async function markdownToHtml(markdown: string): Promise<string> {
  const result = await remark().use(html).process(markdown);
  return result.toString();
}

export default async function Home() {
  // Example markdown
  const markdown = `
# Hello World 👋

This is **Markdown** rendered as HTML using *remark-html*.

- Built with Next.js
- Styled with Tailwind CSS
- Converted using remark + remark-html
  `;

  const htmlContent = await markdownToHtml(markdown);

  return (
    <MarkdownSection
      initialMarkdown={markdown}
      initialHtml={htmlContent}
    />
  );
}
