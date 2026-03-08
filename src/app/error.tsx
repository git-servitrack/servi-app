"use client";

import { AlertTriangle } from "lucide-react";

import { ErrorState } from "@/components/feedback/error-state";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground">
        <ErrorState
          icon={AlertTriangle}
          title="Something broke in the workspace"
          description={error.message || "An unexpected error interrupted the current route."}
          actions={<Button onClick={reset}>Try again</Button>}
        />
      </body>
    </html>
  );
}
