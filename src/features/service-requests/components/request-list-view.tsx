import Link from "next/link";

import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { ModuleStatGrid } from "@/components/shared/module-stat-grid";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

      <ModuleStatGrid
        items={[
          { label: "Open requests", value: serviceRequestRecords.filter((request) => request.status !== "Resolved" && request.status !== "Closed").length.toString(), hint: "Active issues still in queue" },
          { label: "Critical priority", value: serviceRequestRecords.filter((request) => request.priority === "Critical").length.toString(), hint: "Immediate attention required" },
          { label: "Scheduled today", value: serviceRequestRecords.filter((request) => request.status === "Scheduled").length.toString(), hint: "Ready for technician action" },
        ]}
      />

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
