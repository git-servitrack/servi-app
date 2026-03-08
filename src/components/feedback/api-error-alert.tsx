import { AlertTriangle } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

export function ApiErrorAlert({ message }: { message: string }) {
  return (
    <Card className="border-destructive/30 bg-destructive/5" role="alert" aria-live="assertive">
      <CardContent className="flex items-start gap-3 p-4">
        <AlertTriangle className="mt-0.5 size-4 text-destructive" />
        <p className="text-sm leading-6 text-destructive">{message}</p>
      </CardContent>
    </Card>
  );
}
