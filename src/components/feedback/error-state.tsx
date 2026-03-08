import type { LucideIcon } from "lucide-react";
import { AlertTriangle } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ErrorStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actions?: React.ReactNode;
}

export function ErrorState({ icon: Icon = AlertTriangle, title, description, actions }: ErrorStateProps) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6">
      <Card className="w-full max-w-xl">
        <CardHeader className="gap-4">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
            <Icon className="size-6" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-3xl">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </CardHeader>
        {actions ? <CardContent>{actions}</CardContent> : null}
      </Card>
    </div>
  );
}
