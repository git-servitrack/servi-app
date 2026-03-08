import Link from "next/link";

import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ROUTES } from "@/constants/routes";
import { defaultRequestFilters, requestFilterOptions, serviceRequestRecords } from "@/features/service-requests/data/service-requests";
import { RequestFilters } from "@/features/service-requests/components/request-filters";
import { RequestTable } from "@/features/service-requests/components/request-table";
import { filterServiceRequests } from "@/features/service-requests/lib/service-requests";

const filteredRequests = filterServiceRequests(serviceRequestRecords, defaultRequestFilters);

export function RequestListView() {
  return (
    <PageContainer>
      <PageHeader
        eyebrow="Service Requests"
        title="Request queue"
        description="Manage intake, triage, scheduling, and follow-up across operational sites with request data shaped for later backend wiring."
        actions={
          <>
            <Badge variant="accent">{serviceRequestRecords.length} active records</Badge>
            <Button asChild>
              <Link href={`${ROUTES.serviceRequests}/new`}>Create request</Link>
            </Button>
          </>
        }
      />

      <section className="grid gap-4 md:grid-cols-3">
        {[
          { label: "Open requests", value: serviceRequestRecords.filter((request) => request.status !== "Resolved" && request.status !== "Closed").length.toString(), hint: "Active issues still in queue" },
          { label: "Critical priority", value: serviceRequestRecords.filter((request) => request.priority === "Critical").length.toString(), hint: "Immediate attention required" },
          { label: "Scheduled today", value: serviceRequestRecords.filter((request) => request.status === "Scheduled").length.toString(), hint: "Ready for technician action" },
        ].map((item) => (
          <Card key={item.label}>
            <CardHeader>
              <CardDescription>{item.label}</CardDescription>
              <CardTitle className="text-4xl">{item.value}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-6 text-muted-foreground">{item.hint}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <SectionWrapper title="Filters" description="Filter controls are in place now and can later map to URL state or backend query params.">
        <RequestFilters
          filters={defaultRequestFilters}
          statuses={requestFilterOptions.statuses}
          priorities={requestFilterOptions.priorities}
          sites={requestFilterOptions.sites}
        />
      </SectionWrapper>

      <SectionWrapper title="Request listing" description="The request table is structured for future pagination, sorting, and mutation feedback.">
        <RequestTable requests={filteredRequests} />
      </SectionWrapper>
    </PageContainer>
  );
}
