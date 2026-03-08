import { PageLoadingState } from "@/components/feedback/page-loading-state";

export default function Loading() {
  return (
    <PageLoadingState
        eyebrow="System"
        title="Loading workspace"
        description="Preparing the foundation shell and shared UI patterns."
      />
  );
}
