/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { SearchButton } from "@/components/search-button";

export function SiteNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isRoadmapOpen, setIsRoadmapOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="sticky top-0 z-20 w-full border-b border-slate-200/40 dark:border-white/20 bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto w-full flex h-16 items-center justify-between px-6">
        <div className="mr-4 flex items-center">
          <Link
            href="/"
            className="mr-6 flex items-center space-x-3 font-medium text-lg tracking-tighter"
          >
            <img
              src="/ic-logo.png"
              alt="Implementing Cloud"
              className="w-10 h-10 object-cover rounded-md"
            />
            <div className="flex flex-col">
              <span className="text-slate-900 dark:text-white font-bold text-lg md:text-xl">
                Implementing Cloud
              </span>
              <span className="text-slate-600 dark:text-slate-300 text-xs md:text-sm font-semibold text-pretty">
                Practical Research for Busy Developer
              </span>
            </div>
          </Link>
        </div>

        <div className="flex flex-1 w-full justify-end">
          <nav className="flex items-center space-x-4">
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <Link
                href="/"
                className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Home
              </Link>
              
              {/* Roadmap Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setIsRoadmapOpen(true)}
                onMouseLeave={() => setIsRoadmapOpen(false)}
              >
                <button className="flex items-center text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
                  Roadmap
                  <svg
                    className="ml-1 w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                
                {isRoadmapOpen && (
                  <div className="absolute top-full left-0 w-64 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md shadow-lg py-2 z-50">
                    <Link
                      href="/roadmap/implementing-cloud-service"
                      className="block px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                      Implementing Cloud Service
                    </Link>
                    <Link
                      href="/roadmap/implementing-ai"
                      className="block px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                      Implementing AI
                    </Link>
                  </div>
                )}
              </div>
              
              <Link
                href="/compare"
                className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Compare
              </Link>
              <Link
                href="/notes"
                className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Notes
              </Link>
              <Link
                href="/login"
                className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2 rounded-md hover:bg-slate-700 dark:hover:bg-slate-200 transition-colors"
              >
                Login
              </Link>
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>

            <div className="hidden md:flex items-center space-x-2">
              <SearchButton />
              <ThemeToggle />
            </div>
          </nav>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-slate-200/40 dark:border-white/20 bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700">
          <nav className="px-6 py-4 space-y-3">
            <Link
              href="/"
              className="block text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            
            {/* Mobile Roadmap Dropdown */}
            <div>
              <button
                onClick={() => setIsRoadmapOpen(!isRoadmapOpen)}
                className="flex items-center justify-between w-full text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors py-2"
              >
                Roadmap
                <svg
                  className={`w-4 h-4 transition-transform ${isRoadmapOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              
              {isRoadmapOpen && (
                <div className="ml-4 space-y-2 mt-2">
                  <Link
                    href="/roadmap/implementing-cloud-service"
                    className="block text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors py-1 text-sm"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Implementing Cloud Service
                  </Link>
                  <Link
                    href="/roadmap/implementing-ai"
                    className="block text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors py-1 text-sm"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Implementing AI
                  </Link>
                </div>
              )}
            </div>
            
            <Link
              href="/compare"
              className="block text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Compare
            </Link>
            <Link
              href="/notes"
              className="block text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Notes
            </Link>
            <Link
              href="/login"
              className="block bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2 rounded-md hover:bg-slate-700 dark:hover:bg-slate-200 transition-colors text-center"
              onClick={() => setIsMenuOpen(false)}
            >
              Login
            </Link>
            
            {/* Search and Theme Toggle for Mobile */}
            <div className="pt-3 border-t border-slate-200/40 dark:border-white/20">
              <div className="flex items-center justify-between py-2">
                <span className="text-slate-600 dark:text-slate-300 text-sm">Search & Theme</span>
                <div className="flex items-center space-x-2">
                  <SearchButton />
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
