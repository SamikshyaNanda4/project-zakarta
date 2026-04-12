"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 sm:px-6 lg:px-8">
      <div className="text-center w-full max-w-md sm:max-w-lg">

        <h1 className="text-6xl sm:text-7xl lg:text-8xl font-extrabold text-primary mb-4">
          404
        </h1>

        <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-foreground mb-2">
          Page Not Found
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground mb-6 leading-relaxed">
          The page you're looking for doesn’t exist or may have been moved.
        </p>

        <Link href="/">
          <button className="w-full sm:w-auto bg-primary text-primary-foreground px-6 py-3 rounded-lg shadow-md hover:opacity-90 transition text-sm sm:text-base">
            Go Back Home
          </button>
        </Link>

      </div>
    </div>
  );
}