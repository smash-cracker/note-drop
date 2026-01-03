
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <main className="flex flex-col items-center gap-8 md:gap-12 animate-in fade-in zoom-in duration-700 slide-in-from-bottom-4">
        <div className="space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl md:text-7xl bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Note Drop
          </h1>
          <p className="mx-auto max-w-[42rem] text-lg text-muted-foreground sm:text-xl leading-relaxed">
            The simplest way to capture your thoughts. <br className="hidden sm:inline" />
            Fast, secure, and distraction-free.
          </p>

          <div className="flex flex-col items-center gap-2 pt-4">
            <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold sm:text-base">
              note.dropeco.dev/<span className="text-primary">any-id</span>
            </code>
            <p className="text-sm text-muted-foreground">access it anywhere</p>
          </div>
        </div>

        <Link
          href="/change-me"
          className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-full bg-primary px-8 font-medium text-primary-foreground transition-all hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 active:scale-95"
        >
          <span className="relative flex items-center gap-2">
            Open Notepad
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </span>
        </Link>
      </main>

      <footer className="absolute bottom-8 text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Note Drop. All rights reserved.</p>
      </footer>
    </div>
  );
}
