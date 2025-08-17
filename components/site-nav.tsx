/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteNav() {
  return (
    <header className="sticky top-0 z-20 w-full border-b border-slate-200/40 dark:border-white/20 bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto w-full flex h-16 items-center justify-between px-6">
        <div className="mr-4 flex items-center">
          <Link
            href="/"
            className="mr-6 flex items-center space-x-3 font-medium text-lg tracking-tighter"
          >
            <img
              src="/magicui-logo.png"
              alt="Magic UI"
              className="w-10 h-10 object-cover rounded-md"
            />
            <div className="flex flex-col">
              <span className="text-slate-900 dark:text-white font-bold text-xl">
                Implementing Cloud
              </span>
              <span className="text-slate-600 dark:text-slate-300 text-sm font-light text-pretty">
                Practical Research for Busy Developer
              </span>
            </div>
          </Link>
        </div>

        <div className="flex flex-1 w-full justify-end">
          <nav className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-300">
              <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full">
                500+ Examples
              </span>
            </div>
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
