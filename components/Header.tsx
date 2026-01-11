"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const nav = [
    { href: "#home", label: "Home" },
    { href: "#about", label: "About" },
    { href: "#collection", label: "Library" },
  ];

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur border-b border-gray-200"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <Image
            src="/logo-cropped.png"
            alt="Talib ul Mola Academy"
            width={48}
            height={48}
            className="object-contain"
            priority
          />
          <div className="leading-tight">
            <p className="text-sm font-semibold text-brand-900">
              Talib ul Mola Academy
            </p>
            <p className="text-xs text-text-muted">
              Digital Library
            </p>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-brand-800 hover:text-brand-900 transition"
            >
              {item.label}
            </a>
          ))}

          <a
            href="#access"
            className="ml-2 px-4 py-2 rounded-md bg-brand-900 text-white text-sm font-medium hover:bg-brand-800 transition"
          >
            Access Library
          </a>
        </nav>

        {/* Mobile */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-brand-900"
          aria-label="Menu"
        >
          <svg width="24" height="24" fill="none" stroke="currentColor">
            <path strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-200"
          >
            <nav className="flex flex-col px-4 py-4 gap-3">
              {nav.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="text-sm font-medium text-brand-800"
                >
                  {item.label}
                </a>
              ))}
              <a
                href="#access"
                className="mt-2 px-4 py-2 rounded-md bg-brand-900 text-white text-sm font-medium text-center"
              >
                Access Library
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
