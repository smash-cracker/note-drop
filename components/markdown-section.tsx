"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Bold, Italic, Underline } from "lucide-react";
import { remark } from "remark";
import html from "remark-html";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { ModeToggle } from "@/components/ui/mode-toggle";

type MarkdownSectionProps = {
  slug: string;
  initialMarkdown: string;
  initialHtml: string;
};

export function MarkdownSection({
  slug,
  initialMarkdown,
  initialHtml,
}: MarkdownSectionProps) {
  const [activeTab, setActiveTab] = useState<"markdown" | "preview">(
    "markdown"
  );
  const [markdown, setMarkdown] = useState(initialMarkdown);
  const [rendered, setRendered] = useState(initialHtml);
  const [toggleValue, setToggleValue] = useState<string | undefined>(undefined);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lastSavedRef = useRef(initialMarkdown);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [saveState, setSaveState] = useState<"saved" | "saving" | "error">(
    "saved"
  );
  const isMountedRef = useRef(true);
  const currentSlugRef = useRef(slug);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    currentSlugRef.current = slug;
  }, [slug]);

  useEffect(() => {
    lastSavedRef.current = initialMarkdown;
    setMarkdown(initialMarkdown);
    setRendered(initialHtml);
    setToggleValue(undefined);
    setSaveState("saved");

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }
  }, [initialMarkdown, initialHtml, slug]);

  useEffect(() => {
    let shouldUpdate = true;

    remark()
      .use(html)
      .process(markdown)
      .then((file) => {
        if (shouldUpdate) {
          setRendered(String(file));
        }
      })
      .catch(() => {
        if (shouldUpdate) {
          setRendered(markdown);
        }
      });

    return () => {
      shouldUpdate = false;
    };
  }, [markdown]);

  useEffect(() => {
    if (markdown === lastSavedRef.current) {
      return;
    }

    setSaveState("saving");

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        const currentSlug = currentSlugRef.current;
        const response = await fetch(`/api/pages/${currentSlug}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ markdown }),
        });

        if (!response.ok) {
          throw new Error(`Failed to save page (${response.status})`);
        }

        lastSavedRef.current = markdown;

        if (isMountedRef.current) {
          setSaveState("saved");
        }
      } catch (error) {
        console.error(error);
        if (isMountedRef.current) {
          setSaveState("error");
        }
      } finally {
        saveTimeoutRef.current = null;
      }
    }, 600);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = null;
      }
    };
  }, [markdown]);

  const applyFormat = ({
    prefix,
    suffix = prefix,
    placeholder,
  }: {
    prefix: string;
    suffix?: string;
    placeholder: string;
  }) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const { selectionStart, selectionEnd, value } = textarea;
    const selected = value.slice(selectionStart, selectionEnd);
    const snippet = selected || placeholder;
    const wrapped = `${prefix}${snippet}${suffix}`;
    const nextValue =
      value.slice(0, selectionStart) + wrapped + value.slice(selectionEnd);

    setMarkdown(nextValue);

    requestAnimationFrame(() => {
      const start = selectionStart + prefix.length;
      const end = start + snippet.length;
      textarea.focus();
      textarea.setSelectionRange(start, end);
    });
  };

  const handleToggleChange = (value: string | undefined) => {
    if (!value) {
      setToggleValue(undefined);
      return;
    }

    if (value === "bold") {
      applyFormat({ prefix: "**", placeholder: "bold text" });
    }

    if (value === "italic") {
      applyFormat({ prefix: "*", placeholder: "italic text" });
    }

    if (value === "strikethrough") {
      applyFormat({ prefix: "~~", placeholder: "strikethrough" });
    }

    setToggleValue(undefined);
  };

  const statusLabel =
    saveState === "saving"
      ? "Saving..."
      : saveState === "error"
        ? "Save failed"
        : "Saved";

  const statusColor =
    saveState === "error"
      ? "text-destructive"
      : "text-muted-foreground";

  return (
    <section className="flex min-h-screen flex-col bg-background text-foreground">
      <Tabs
        value={activeTab}
        onValueChange={(value) =>
          setActiveTab((value as "markdown" | "preview") ?? "markdown")
        }
        className="flex flex-1 flex-col gap-0"
      >
        <div className="border-b border-border bg-card/60 px-4 py-4 backdrop-blur sm:px-6">
          <div className="flex flex-col gap-4 sm:grid sm:grid-cols-[auto_1fr_auto] sm:items-center sm:gap-6">
            <div className="flex items-center gap-2">
              <Image
                src="/clipboard-lite.svg"
                alt="Notepad logo"
                width={28}
                height={28}
                className="dark:hidden"
                priority
              />
              <Image
                src="/clipboard-dark.svg"
                alt="Notepad logo"
                width={28}
                height={28}
                className="hidden dark:block"
                priority
              />
              <span className="text-sm font-semibold uppercase tracking-widest">
                note drop
              </span>
            </div>
            <div className="flex justify-center">
              <ToggleGroup
                type="single"
                value={toggleValue}
                onValueChange={handleToggleChange}
                aria-label="Formatting options"
                disabled={activeTab === "preview"}
              >
                <ToggleGroupItem value="bold" aria-label="Toggle bold">
                  <Bold className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="italic" aria-label="Toggle italic">
                  <Italic className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="strikethrough"
                  aria-label="Toggle strikethrough"
                >
                  <Underline className="h-4 w-4" />
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
            <div className="flex w-full flex-wrap items-center justify-between gap-3 sm:w-auto sm:justify-end">
              <ModeToggle />
              <span className={`text-xs ${statusColor}`}>{statusLabel}</span>
              <TabsList className="w-full bg-muted/60 backdrop-blur sm:w-fit">
                <TabsTrigger value="markdown">Markdown</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>
            </div>
          </div>
        </div>
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex flex-1 flex-col px-4 py-6 sm:px-6 sm:py-10">
            <TabsContent value="markdown" className="flex flex-1 flex-col">
              <label
                htmlFor="markdown-input"
                className="sr-only"
              >
                Markdown
              </label>
              <div className="flex flex-1">
                <textarea
                  ref={textareaRef}
                  id="markdown-input"
                  value={markdown}
                  onChange={(event) => setMarkdown(event.target.value)}
                  className="flex-1 min-h-[250px] resize-none rounded-lg border border-border bg-card px-3 py-3 font-mono text-sm text-foreground shadow-inner focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:min-h-[300px] sm:px-4"
                  spellCheck={false}
                />
              </div>
            </TabsContent>
            <TabsContent value="preview" className="flex flex-1 flex-col">
              <span className="sr-only">
                Preview
              </span>
              <div
                className="flex-1 min-h-[250px] overflow-y-auto rounded-lg border border-border bg-card/80 px-3 py-6 sm:min-h-[300px] sm:px-4"
                dangerouslySetInnerHTML={{ __html: rendered }}
              />
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </section>
  );
}
