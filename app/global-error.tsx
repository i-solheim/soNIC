"use client";

import { useEffect } from "react";
import { AlertCircle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] dark:bg-[#060910] p-4">
          <div className="max-w-md w-full bg-white dark:bg-[#0f172a] rounded-3xl p-8 shadow-xl border border-slate-200 dark:border-slate-800 text-center">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Critical Error</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8">
              A critical error occurred while loading the application.
            </p>
            <button
              onClick={() => reset()}
              className="bg-[var(--color-primary)] hover:brightness-110 text-white font-bold py-3 px-8 rounded-xl transition-all"
            >
              Reload application
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
