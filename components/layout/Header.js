"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navigation, site } from "@/content/site";
import { cx } from "@/lib/content";

export function Header() {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const [active, setActive] = useState(null);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Track which section is in view to mark the current nav item.
  useEffect(() => {
    if (!onHome) return undefined;
    const sections = navigation
      .map((item) => document.getElementById(item.id))
      .filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [onHome]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const current = navigation.find((item) => item.id === active);
  const href = (id) => (onHome ? `#${id}` : `/#${id}`);

  return (
    <header
      data-intro-hide=""
      style={{ "--intro-delay": "600ms" }}
      className={cx(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled || open ? "border-b border-line bg-ink/92 backdrop-blur-sm" : "border-b border-transparent",
      )}
    >
      <div className="container-x flex h-[var(--header-h)] items-center justify-between gap-6">
        <Link href="/" className="group flex items-center gap-3" aria-label={`${site.name} — home`}>
          <Monogram />
          <span className="label hidden text-steel-300 transition-colors group-hover:text-paper sm:inline">
            {site.name}
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {navigation.map((item) => (
              <li key={item.id}>
                <a
                  href={href(item.id)}
                  aria-current={active === item.id ? "location" : undefined}
                  className={cx(
                    "label flex items-center gap-2 px-3 py-2 transition-colors",
                    active === item.id ? "text-paper" : "text-steel-400 hover:text-paper",
                  )}
                >
                  <span className={active === item.id ? "text-signal" : "text-steel-500"}>
                    {item.index}
                  </span>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-4 lg:hidden">
          {current ? (
            <span className="label text-steel-400" aria-hidden="true">
              <span className="text-signal">{current.index}</span> / {current.label}
            </span>
          ) : null}
          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
            className="label flex min-h-11 items-center gap-2 border border-line-strong px-3 text-paper"
          >
            <span aria-hidden="true" className="relative block h-2.5 w-4">
              <span
                className={cx(
                  "absolute left-0 h-px w-4 bg-current transition-transform duration-300",
                  open ? "top-1/2 rotate-45" : "top-0",
                )}
              />
              <span
                className={cx(
                  "absolute left-0 h-px w-4 bg-current transition-transform duration-300",
                  open ? "top-1/2 -rotate-45" : "bottom-0",
                )}
              />
            </span>
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      <nav
        id="mobile-nav"
        aria-label="Primary"
        hidden={!open}
        className="border-t border-line bg-ink lg:hidden"
      >
        <ul className="container-x py-4">
          {navigation.map((item) => (
            <li key={item.id} className="border-b border-line last:border-0">
              <a
                href={href(item.id)}
                onClick={() => setOpen(false)}
                className="flex items-baseline gap-4 py-4"
              >
                <span className="label text-signal">{item.index}</span>
                <span className="display text-2xl">{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

function Monogram() {
  return (
    <span className="relative grid size-9 place-items-center border border-line-strong transition-colors group-hover:border-signal">
      <span className="display text-[0.8rem] tracking-normal">{site.initials}</span>
      {/* registration ticks */}
      <span aria-hidden="true" className="absolute -left-px -top-px size-1.5 border-l border-t border-signal" />
      <span aria-hidden="true" className="absolute -bottom-px -right-px size-1.5 border-b border-r border-signal" />
    </span>
  );
}
