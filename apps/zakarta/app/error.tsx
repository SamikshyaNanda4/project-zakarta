"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 sm:px-6 lg:px-8">
      <div className="text-center w-full max-w-md sm:max-w-lg">

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-destructive mb-4">
          Something went wrong
        </h1>

        <p className="text-sm sm:text-base text-muted-foreground mb-6 leading-relaxed">
          An unexpected error occurred. Please try again or return home.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">

          <button
            onClick={() => reset()}
            className="w-full sm:w-auto bg-primary text-primary-foreground px-5 py-2 rounded-lg shadow-md hover:opacity-90 transition text-sm sm:text-base"
          >
            Try Again
          </button>

          <a
            href="/"
            className="w-full sm:w-auto border border-border text-foreground px-5 py-2 rounded-lg hover:bg-muted transition text-sm sm:text-base"
          >
            Go Home
          </a>

        </div>

      </div>
    </div>
  );
}