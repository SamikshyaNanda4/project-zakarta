"use client";

import { useState } from "react";
import { Menu, X, User, LogOut, ChevronDown } from "lucide-react";

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
};

export function Navbar({
  user,
  links = [],
  onSignOut,
  appName = "Zakarta",
}: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : null;

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <a href="/" className="text-xl font-bold tracking-tight text-gray-900">
          {appName}
        </a>

        {/* Desktop nav links */}
        <ul className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Right side: auth controls */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="relative hidden md:block">
              <button
                onClick={() => setAvatarOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              >
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name}
                    className="h-6 w-6 rounded-full object-cover"
                  />
                ) : (
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                    {initials}
                  </span>
                )}
                <span className="max-w-[120px] truncate">{user.name}</span>
                <ChevronDown className="h-3 w-3 opacity-60" />
              </button>

              {avatarOpen && (
                <>
                  {/* Click-away overlay */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setAvatarOpen(false)}
                  />
                  <div className="absolute right-0 z-50 mt-2 w-52 rounded-xl border border-gray-100 bg-white py-1 shadow-lg">
                    <div className="border-b border-gray-100 px-4 py-2.5">
                      <p className="truncate text-xs font-semibold text-gray-900">
                        {user.name}
                      </p>
                      <p className="truncate text-xs text-gray-500">
                        {user.email}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setAvatarOpen(false);
                        onSignOut?.();
                      }}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <a
                href="/sign-in"
                className="rounded-lg px-4 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Sign in
              </a>
              <a
                href="/sign-up"
                className="rounded-lg bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
              >
                Sign up
              </a>
            </div>
          )}

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 transition-colors md:hidden"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="border-t border-gray-100 bg-white px-4 pb-4 pt-2 md:hidden">
          <ul className="space-y-1">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-3 border-t border-gray-100 pt-3">
            {user ? (
              <div>
                <div className="mb-2 flex items-center gap-3 px-3">
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">
                      {initials}
                    </span>
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-gray-900">
                      {user.name}
                    </p>
                    <p className="truncate text-xs text-gray-500">
                      {user.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onSignOut?.();
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
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
                  className="block rounded-lg px-3 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Sign in
                </a>
                <a
                  href="/sign-up"
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-lg bg-indigo-600 px-3 py-2 text-center text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
                >
                  Sign up
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
