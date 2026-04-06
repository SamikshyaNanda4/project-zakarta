"use client";

import { useState, useRef, useEffect } from "react";
import { Menu, X, LogOut, ChevronDown } from "lucide-react";

export type NavUser = {
  name: string;
  email: string;
  image?: string | null;
};

export type NavLink = {
  href: string;
  label: string;
};

export type NavbarProps = {
  user?: NavUser | null;
  links?: NavLink[];
  onSignOut?: () => void;
  appName?: string;
  onSellRent?: () => void;
};

export function Navbar({
  user,
  links = [],
  onSignOut,
  appName = "Zakarta",
  onSellRent,
}: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : null;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) {
        setAvatarOpen(false);
      }
    }
    if (avatarOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [avatarOpen]);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 768) setMenuOpen(false);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const AvatarIcon = ({ size = "sm" }: { size?: "sm" | "md" }) => {
    const cls = size === "md" ? "h-10 w-10 text-base" : "h-6 w-6 text-xs";
    return user?.image ? (
      <img
        src={user.image}
        alt={user.name}
        className={`${cls} rounded-full object-cover`}
      />
    ) : (
      <span
        className={`flex ${cls} items-center justify-center rounded-full bg-indigo-600 font-bold text-white`}
      >
        {initials}
      </span>
    );
  };

  return (
    <>
      {/* Spacer so page content doesn't hide under the fixed navbar */}
      <div className="h-14" />

      {/* Fixed navbar — avoids iOS Safari sticky+click bug */}
      <nav
        className="fixed top-0 left-0 right-0 z-40 h-14 w-full border-b border-gray-200 bg-white"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <div className="mx-auto flex h-full max-w-8xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <div className="flex items-center justify-start">
            <a
            href="/"
            className="shrink-0 cursor-pointer text-xl font-bold tracking-tight text-gray-900 ml-8"
          >
            {appName}
          </a>

          {/* Desktop nav links */}
          {links.length > 0 && (
            <ul className="hidden items-center gap-1 md:flex ml-16">
              {links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="cursor-pointer rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Sell/Rent CTA — always visible on desktop */}
            {onSellRent && (
              <button
                type="button"
                onClick={onSellRent}
                className="hidden cursor-pointer rounded-lg border border-emerald-700 bg-red-400 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-indigo-100 md:block"
              >
                Sell / Rent Your Property
              </button>
            )}

            {/* Desktop: user dropdown */}
            {user ? (
              <div ref={avatarRef} className="relative hidden md:block">
                <button
                  type="button"
                  onClick={() => setAvatarOpen((v) => !v)}
                  aria-expanded={avatarOpen}
                  aria-haspopup="true"
                  className="flex cursor-pointer items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
                >
                  <AvatarIcon size="sm" />
                  <span className="max-w-[120px] truncate">{user.name}</span>
                  <ChevronDown
                    className={`h-3 w-3 opacity-60 transition-transform duration-200 ${avatarOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {avatarOpen && (
                  <div className="absolute right-0 z-50 mt-2 w-52 rounded-xl border border-gray-100 bg-white py-1 shadow-lg">
                    <div className="border-b border-gray-100 px-4 py-2.5">
                      <p className="truncate text-xs font-semibold text-gray-900">{user.name}</p>
                      <p className="truncate text-xs text-gray-500">{user.email}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => { setAvatarOpen(false); onSignOut?.(); }}
                      className="flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden items-center gap-2 md:flex">
                <a
                  href="/sign-in"
                  className="cursor-pointer rounded-lg px-4 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
                >
                  Sign in
                </a>
                <a
                  href="/sign-up"
                  className="cursor-pointer rounded-lg bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
                >
                  Sign up
                </a>
              </div>
            )}

            {/* Hamburger — always visible on mobile */}
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-label="Toggle menu"
              className="cursor-pointer rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 md:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Backdrop */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 z-50 bg-black/40 md:hidden"
        />
      )}

      {/* Sidebar drawer — only in DOM when open, slides in from left */}
      {menuOpen && (
        <aside className="fixed inset-y-0 left-0 z-[60] flex w-[90%] max-w-sm flex-col bg-white shadow-2xl md:hidden">
          {/* Sidebar header */}
          <div className="flex h-14 items-center justify-between border-b border-gray-100 px-5">
            <a
              href="/"
              onClick={() => setMenuOpen(false)}
              className="cursor-pointer text-xl font-bold tracking-tight text-gray-900"
            >
              {appName}
            </a>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              className="cursor-pointer rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Sidebar body */}
          <div className="flex flex-1 flex-col overflow-y-auto px-4 py-4">
            {links.length > 0 && (
              <ul className="space-y-1">
                {links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="block cursor-pointer rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}

            {onSellRent && (
              <button
                type="button"
                onClick={() => { setMenuOpen(false); onSellRent(); }}
                className="mt-3 w-full cursor-pointer rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2.5 text-left text-sm font-medium text-indigo-700 transition-colors hover:bg-indigo-100"
              >
                Sell / Rent Your Property
              </button>
            )}
          </div>

          {/* Sidebar footer: auth */}
          <div className="border-t border-gray-100 px-4 py-4">
            {user ? (
              <div className="space-y-1">
                <div className="flex items-center gap-3 rounded-lg px-3 py-2">
                  <AvatarIcon size="md" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-gray-900">{user.name}</p>
                    <p className="truncate text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => { setMenuOpen(false); onSignOut?.(); }}
                  className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <a
                  href="/sign-in"
                  onClick={() => setMenuOpen(false)}
                  className="block cursor-pointer rounded-lg px-3 py-2 text-center text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
                >
                  Sign in
                </a>
                <a
                  href="/sign-up"
                  onClick={() => setMenuOpen(false)}
                  className="block cursor-pointer rounded-lg bg-indigo-600 px-3 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-indigo-700"
                >
                  Sign up
                </a>
              </div>
            )}
          </div>
        </aside>
      )}
    </>
  );
}
