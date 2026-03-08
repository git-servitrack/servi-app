import { Flag, Layers3 } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ModulePlaceholderPageProps {
  eyebrow: string;
  title: string;
  description: string;
  phase: string;
}

export function ModulePlaceholderPage({
  eyebrow,
  title,
  description,
  phase,
}: ModulePlaceholderPageProps) {
  return (
    <PageContainer>
      <PageHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
        actions={<Badge variant="outline">{phase}</Badge>}
      />

      <SectionWrapper
        title="Route placeholder"
        description="This page exists so the app shell, navigation, active states, and breadcrumbs can be exercised before the feature module is implemented."
      >
        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <Card>
            <CardHeader>
              <CardDescription>Current role in the roadmap</CardDescription>
              <CardTitle>Shell-first delivery</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-6 text-muted-foreground">
              <p>
                The route is now mounted inside the shared dashboard shell, which means later module work can focus on feature content instead of rebuilding layout and navigation.
              </p>
              <div className="flex items-center gap-2 rounded-2xl border border-border/80 bg-muted/35 px-4 py-3 text-foreground">
                <Layers3 className="size-4 text-primary" />
                Page spacing, header, breadcrumbs, and navigation are inherited automatically.
              </div>
            </CardContent>
          </Card>

          <EmptyState
            icon={Flag}
            title="Module content starts in a later phase"
            description={`This route is intentionally limited to shell validation and navigation flow until ${phase} begins.`}
          />
        </div>
      </SectionWrapper>
    </PageContainer>
  );
}
