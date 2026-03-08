import { ClipboardClock, Layers3, Wrench } from "lucide-react";

import { LoadingSkeleton } from "@/components/feedback/loading-skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { AppMetric } from "@/types/common";

const foundationMetrics: AppMetric[] = [
  {
    label: "Shared foundations",
    value: "12",
    hint: "Layouts, helpers, route constants, and reusable feedback patterns are in place.",
  },
  {
    label: "Configured primitives",
    value: "7",
    hint: "Button, input, card, badge, dialog, table, and sheet follow shadcn-style patterns.",
  },
  {
    label: "Next target",
    value: "Phase 2",
    hint: "Navigation polish, active states, and app-shell UX improvements are ready to build on this base.",
  },
];

const upcomingModules = [
  ["Assets", "Listing, details, and forms", "Phase 4"],
  ["Service Requests", "Request lifecycle and remarks", "Phase 5"],
  ["Maintenance", "Workflow, assignment, and completion", "Phase 6"],
  ["Technicians", "Profiles and workload summaries", "Phase 7"],
];

export function DashboardFoundationView() {
  return (
    <PageContainer>
      <PageHeader
        eyebrow="SERVI-WEB"
        title="Operations workspace foundation"
        description="Phase 1 establishes the shell, reusable primitives, and consistent feedback patterns that later modules will inherit."
        actions={<Badge variant="accent">Frontend foundation ready</Badge>}
      />

      <SectionWrapper
        title="Foundation coverage"
        description="These cards summarize what the current phase now provides for future modules."
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {foundationMetrics.map((metric) => (
            <Card key={metric.label}>
              <CardHeader>
                <CardDescription>{metric.label}</CardDescription>
                <CardTitle className="text-4xl">{metric.value}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-6 text-muted-foreground">{metric.hint}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </SectionWrapper>

      <SectionWrapper
        title="Module rollout preview"
        description="The route map is already defined so future phases can stay consistent with the shell."
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Module</TableHead>
              <TableHead>Scope</TableHead>
              <TableHead className="text-right">Target phase</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {upcomingModules.map(([module, scope, phase]) => (
              <TableRow key={module}>
                <TableCell className="font-semibold text-foreground">{module}</TableCell>
                <TableCell className="text-muted-foreground">{scope}</TableCell>
                <TableCell className="text-right">
                  <Badge variant="outline" className="ml-auto w-fit">
                    {phase}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SectionWrapper>

      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <SectionWrapper title="Base loading pattern" description="Shared skeleton treatment for dashboards, tables, and route transitions.">
          <LoadingSkeleton cardCount={2} rowCount={3} />
        </SectionWrapper>

        <SectionWrapper title="Base empty state" description="Reusable message block for lists and dashboards that have no data yet.">
          <EmptyState
            icon={ClipboardClock}
            title="No operational records yet"
            description="Use this pattern for empty dashboard widgets, filtered tables, or modules that are waiting on API integration."
          />
        </SectionWrapper>
      </div>

      <SectionWrapper title="Shell principles" description="These reminders keep the later module work aligned with the orchestration layer.">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              icon: Layers3,
              title: "Keep pages thin",
              body: "Route files should compose sections instead of owning feature logic and duplicated markup.",
            },
            {
              icon: Wrench,
              title: "Centralize patterns",
              body: "Shared shells, feedback states, and route constants reduce drift as the app grows.",
            },
            {
              icon: ClipboardClock,
              title: "Design for extension",
              body: "Each module should be able to drop into the shell without rewriting layout rules or base components.",
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <Card key={item.title} className="bg-card/85">
                <CardHeader>
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </div>
                  <CardTitle>{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-6 text-muted-foreground">{item.body}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </SectionWrapper>
    </PageContainer>
  );
}
