import { PageLoadingState } from "@/components/feedback/page-loading-state";

export default function DashboardLoading() {
  return (
    <PageLoadingState
      eyebrow="Dashboard Workspace"
      title="Loading workspace"
      description="Fetching the next module view, cards, and operational tables."
    />
  );
}
