"use client"

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

type RecentItem = {
  id: string;
  name: string;
  area: string;
  type: "buy" | "rent";
};

const BBSR = [
  { name: "Acharya Vihar", id: "loc_bbsr_0002" },
  { name: "Patia", id: "loc_bbsr_0011" },
];

const CUTTACK = [
  { name: "Badambadi", id: "loc_ctc_0001" },
  { name: "College Square", id: "loc_ctc_0003" },
];

const PURI = [
  { name: "Sea Beach Road", id: "loc_puri_0005" },
  { name: "Grand Road", id: "loc_puri_0001" },
];

const DEFAULT_AREAS = [
  { name: "Bhubaneswar", list: BBSR },
  { name: "Cuttack", list: CUTTACK },
  { name: "Puri", list: PURI },
];

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
  const [recent, setRecent] = useState<RecentItem[]>([]);

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

  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  const toggleAccordion = (key: string) => {
    setOpenAccordion((prev) => (prev === key ? null : key));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
  if (!user) {
    setRecent([]);
    return;
  }

  try {
  const data = JSON.parse(localStorage.getItem("recent_searches") || "[]");

  if (Array.isArray(data)) {
    setRecent(data);
  } else {
    setRecent([]);
  }
} catch {
    setRecent([]);
  }
}, [user]);

const buyRecent = recent.filter((r) => r.type === "buy");
const rentRecent = recent.filter((r) => r.type === "rent");

function mergeLocalities(
  defaultAreas: { name: string; list: { name: string; id: string }[] }[],
  recentList: RecentItem[],
  type: "buy" | "rent"
) {
  if (!recentList.length) return defaultAreas;

  return defaultAreas.map((area) => {
    const matched = recentList.filter(
      (r) => r.area.toLowerCase() === area.name.toLowerCase()
    );

    if (matched.length === 0) return area;

    const updatedList = area.list.map((item) => ({ ...item }));

    matched.forEach((r, index) => {
      if (index < updatedList.length) {
        updatedList[index] = {
          name: r.name,
          id: r.id,
        };
      }
    });

    return {
      ...area,
      list: updatedList,
    };
  });
}

// AFTER function
const FINAL_BUY = mergeLocalities(DEFAULT_AREAS, buyRecent, "buy");
const FINAL_RENT = mergeLocalities(DEFAULT_AREAS, rentRecent, "rent");



    
  return (
    <>
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
            onMouseDown={resetDropdown}
            className="shrink-0 cursor-pointer text-xl font-bold tracking-tight text-gray-900 ml-8"
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
                <button
                  onClick={() => setPropOpen((prev) => !prev)}
                  onFocus={() => setPropOpen(true)}
                  onBlur={() => {
                    setTimeout(() => setPropOpen(false), 150);
                  }}
                  aria-haspopup="menu"
                  aria-label="Properties menu"
                  aria-expanded={propOpen}
                  className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                >
                  Properties
                </button>

                {propOpen && (
                  <div className="absolute left-0 top-full mt-2 w-[600px] rounded-xl border border-gray-200 bg-white py-4 shadow-lg z-50">
                    <div className="px-4">

                      {/* BUY */}
                      <p className="text-sm font-semibold text-gray-800 mb-3">
                        Buy Properties
                      </p>

                      <div className="grid grid-cols-3 gap-6">
                        {FINAL_BUY.map((city) => (
                          <div key={city.name}>
                            <p className="text-xs font-medium text-gray-500 mb-2">
                              {city.name}
                            </p>
                            {city.list.map((loc: any) => (
                              <a
                                key={`buy-${loc.id}`}
                                href={`/properties?listingType=sell&area=${city.name}&localityIds=${loc.id}`}
                                onClick={resetDropdown}
                                className="block text-sm text-gray-600 hover:text-gray-900 py-1"
                              >
                                {loc.name}
                              </a>
                            ))}
                          </div>
                        ))}
                      </div>

                      <hr className="my-4 border-gray-200" />

                      {/* RENT */}
                      <p className="text-sm font-semibold text-gray-800 mb-3">
                        Rent Properties
                      </p>

                      <div className="grid grid-cols-3 gap-6">
                        {FINAL_RENT.map((city) => (
                          <div key={city.name}>
                            <p className="text-xs font-medium text-gray-500 mb-2">
                              {city.name}
                            </p>
                            {city.list.map((loc: any) => (
                              <a
                                key={`rent-${loc.id}`}
                                href={`/properties?listingType=rent&area=${city.name}&localityIds=${loc.id}`}
                                onClick={resetDropdown}
                                className="block text-sm text-gray-600 hover:text-gray-900 py-1"
                              >
                                {loc.name}
                              </a>
                            ))}
                          </div>
                        ))}
                      </div>

                    </div>
                  </div>
                )}
              </li>

              {/* About */}
             <li
                className="relative"
              >
                <a
                  href="/about"
                  className="rounded-lg px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100"
                >
                  About
                </a>
              </li>

              {/* Contact */}
              <li
                className="relative"
              >
                <a
                  href="/contact"
                  className="rounded-lg px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100"
                >
                  Contact
                </a>
              </li>
        </ul> 
       </div>        
          {/* RIGHT */}
          <div className="flex items-center gap-2">
            {/* Sell/Rent CTA — always visible on desktop */}
            {onSellRent && (
              <button
                type="button"
                onClick={onSellRent}
                className="hidden cursor-pointer rounded-sm border border-white bg-emerald-400 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-emerald-600 md:block"
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
                  className="cursor-pointer rounded-sm px-2 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:underline"
                >
                  Login
                </a>
                <a
                  href="/sign-up"
                  className="cursor-pointer rounded-sm bg-gray-100 px-2 py-1.5 text-sm font-medium text-emerald-950 transition-colors hover:bg-emerald-200 hover:underline"
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

      {/* MOBILE */}
{/* Backdrop */}
{menuOpen && (
  <div
    onClick={() => setMenuOpen(false)}
    className="fixed inset-0 z-50 bg-black/40 md:hidden"
  />
)}

{/* Sidebar drawer */}
{menuOpen && (
  <aside className="fixed inset-y-0 left-0 z-[60] flex w-[90%] max-w-sm flex-col bg-white shadow-2xl md:hidden">

    {/* HEADER */}
    <div className="flex h-14 items-center justify-between border-b border-gray-100 px-5">
      <a
        href="/"
        onClick={() => setMenuOpen(false)}
        className="cursor-pointer text-xl font-bold tracking-tight text-gray-900"
      >
        {appName}
      </a>
      <button onClick={() => setMenuOpen(false)}>
        <X className="h-5 w-5" />
      </button>
    </div>

    {/* BODY */}
    <div className="flex flex-1 flex-col overflow-y-auto px-4 py-4">

      {/* BUY ACCORDION */}
      <div className="mb-4">
        <button
          onClick={() => toggleAccordion("buy")}
          className="w-full flex justify-between text-sm font-medium text-gray-700"
        >
          Buy Properties
          <ChevronDown className={`${openAccordion === "buy" ? "rotate-180" : ""}`} />
        </button>

        {openAccordion === "buy" && (
          <div className="mt-2 space-y-2">
            {FINAL_BUY.map((city) => (
              <div key={city.name}>
                <p className="text-xs text-gray-500 mt-2">{city.name}</p>
                {city.list.map((loc: any) => (
                  <a
                    key={loc.id}
                    href={`/properties?listingType=sell&area=${city.name}&localityIds=${loc.id}`}
                    onClick={() => setMenuOpen(false)}
                    className="block py-2 text-sm border-b"
                  >
                    {loc.name}
                  </a>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RENT ACCORDION */}
      <div className="mb-4">
        <button
          onClick={() => toggleAccordion("rent")}
          className="w-full flex justify-between text-sm font-medium text-gray-700"
        >
          Rent Properties
          <ChevronDown className={`${openAccordion === "rent" ? "rotate-180" : ""}`} />
        </button>

        {openAccordion === "rent" && (
          <div className="mt-2 space-y-2">
            {FINAL_RENT.map((city) => (
              <div key={city.name}>
                <p className="text-xs text-gray-500 mt-2">{city.name}</p>
                {city.list.map((loc: any) => (
                  <a
                    key={loc.id}
                    href={`/properties?listingType=rent&area=${city.name}&localityIds=${loc.id}`}
                    onClick={() => setMenuOpen(false)}
                    className="block py-2 text-sm border-b"
                  >
                    {loc.name}
                  </a>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* LINKS */}
      <div className="pt-3 border-t space-y-2">
        <a href="/about" className="block text-sm text-gray-700">About</a>
        <a href="/contact" className="block text-sm text-gray-700">Contact</a>
      </div>

      {/* CTA */}
      {onSellRent && (
        <button
          onClick={() => { setMenuOpen(false); onSellRent(); }}
          className="mt-4 w-full cursor-pointer rounded-sm border border-white bg-emerald-400 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-emerald-600"
        >
          Sell / Rent Your Property
        </button>
      )}
    </div>

    {/* FOOTER (UNCHANGED ORIGINAL) */}
    <div className="border-t border-gray-100 px-4 py-4">
      {user ? (
        <div className="space-y-1">
          <div className="flex items-center gap-3 px-3 py-2">
            <AvatarIcon size="md" />
            <div>
              <p className="text-sm font-semibold">{user.name}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
          </div>
          <button
            onClick={() => { setMenuOpen(false); onSignOut?.(); }}
            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <a href="/sign-in" className="block text-center py-2 text-sm hover:bg-gray-100 rounded">
            Sign in
          </a>
          <a href="/sign-up" className="block text-center py-2 text-sm bg-emerald-600 text-white rounded">
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