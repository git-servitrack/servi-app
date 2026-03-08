import { CheckCircle2 } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

export function MutationFeedback({ message }: { message: string }) {
  return (
    <Card className="border-emerald-200 bg-emerald-50" role="status" aria-live="polite">
      <CardContent className="flex items-start gap-3 p-4">
        <CheckCircle2 className="mt-0.5 size-4 text-emerald-700" />
        <p className="text-sm leading-6 text-emerald-800">{message}</p>
      </CardContent>
    </Card>
  );
}
