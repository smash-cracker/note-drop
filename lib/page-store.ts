import { promises as fs } from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "pages.json");

type PageStore = Record<string, string>;

async function ensureDataFile(): Promise<void> {
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify({}, null, 2), "utf8");
  }
}

async function readStore(): Promise<PageStore> {
  await ensureDataFile();
  const raw = await fs.readFile(DATA_FILE, "utf8");
  try {
    return JSON.parse(raw) as PageStore;
  } catch {
    return {};
  }
}

async function writeStore(store: PageStore): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(store, null, 2), "utf8");
}

export async function getPageMarkdown(slug: string): Promise<string | null> {
  const store = await readStore();
  return store[slug] ?? null;
}

export async function savePageMarkdown(
  slug: string,
  markdown: string
): Promise<void> {
  const store = await readStore();
  store[slug] = markdown;
  await writeStore(store);
}
