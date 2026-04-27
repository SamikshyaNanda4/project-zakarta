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
  pathname?: string;
};

export function Navbar({
  user,
  links = [],
  onSignOut,
  appName = "Zakarta",
  onSellRent,
  pathname,
}: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [propOpen, setPropOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
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

  // Avatar click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) {
        setAvatarOpen(false);
      }
    }
    if (avatarOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [avatarOpen]);

  // Lock scroll
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Close menu on resize
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 768) setMenuOpen(false);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Hover logic
  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setPropOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setPropOpen(false);
    }, 200);
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Reset on route change
  useEffect(() => {
    setPropOpen(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, [pathname]);

  const resetDropdown = () => {
    setPropOpen(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

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
      <div className="h-14" />

      <nav className="fixed top-0 left-0 right-0 z-40 h-14 w-full border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-full max-w-8xl items-center justify-between px-4 sm:px-6 lg:px-8">

          {/* LEFT */}
          <div className="flex items-center">
            <a
              href="/"
              onMouseDown={resetDropdown}
              className="text-xl font-bold text-gray-900 ml-8"
            >
              {appName}
            </a>

            <ul className="hidden md:flex items-center gap-1 ml-16">

              {/* Properties */}
              <li
                className="relative"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <button className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900">
                  Properties
                </button>

                {propOpen && (
                  <div className="absolute left-0 top-full mt-2 w-56 rounded-xl border bg-white py-2 shadow-lg z-50">
                    
                    <div className="absolute top-[-8px] left-0 w-full h-2" />

                    <a
                      href="/properties?listingType=sell"
                      onClick={() => {
                        resetDropdown();
                      }}
                      className="block px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      Buy Property
                    </a>

                    <a
                      href="/properties?listingType=rent"
                      onClick={() => {
                        resetDropdown();
                      }}
                      className="block px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      Rent Property
                    </a>

                    <a
                      href="/properties/new"
                      onClick={() => {
                        resetDropdown();
                      }}
                      className="block px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      Sell Property
                    </a>
                  </div>
                )}
              </li>

              {/* About */}
              <li className="relative group">
                <button className="rounded-lg px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100">
                  About
                </button>
                <div className="absolute hidden group-hover:block top-full mt-2 w-48 bg-white shadow p-3 rounded">
                  <p className="text-sm text-gray-600">
                    Zakarta helps you find and list properties easily.
                  </p>
                </div>
              </li>

              {/* Contact */}
              <li className="relative group">
                <button className="rounded-lg px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100">
                  Contact
                </button>
                <div className="absolute hidden group-hover:block top-full mt-2 w-48 bg-white shadow p-3 rounded">
                  <p className="text-sm text-gray-600">
                    support@zakarta.com
                  </p>
                </div>
              </li>

            </ul>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-2">

            {onSellRent && (
              <button
                onClick={onSellRent}
                className="hidden md:block bg-emerald-400 px-4 py-1.5 text-sm text-white rounded hover:bg-emerald-600"
              >
                Sell / Rent Your Property
              </button>
            )}

            {user ? (
              <div ref={avatarRef} className="relative hidden md:block">
                <button
                  onClick={() => setAvatarOpen((v) => !v)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full border hover:bg-gray-100"
                >
                  <AvatarIcon />
                  <ChevronDown className="h-3 w-3" />
                </button>

                {avatarOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow rounded">
                    <button
                      onClick={onSignOut}
                      className="w-full px-3 py-2 text-red-600"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex gap-2">
                <a href="/sign-in">Login</a>
                <a href="/sign-up">Sign up</a>
              </div>
            )}

            <button onClick={() => setMenuOpen(true)} className="md:hidden">
              <Menu />
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE */}
      {menuOpen && (
        <div className="fixed inset-0 bg-white p-6 z-50">
          <button onClick={() => setMenuOpen(false)}>
            <X />
          </button>

          <div className="flex flex-col gap-4 mt-6">
            <a href="/properties?listingType=sell">Buy</a>
            <a href="/properties?listingType=rent">Rent</a>
            <a href="/properties/new">Sell</a>
            <hr />
            <a href="/about">About</a>
            <a href="/contact">Contact</a>
          </div>
        </div>
      )}
    </>
  );
}