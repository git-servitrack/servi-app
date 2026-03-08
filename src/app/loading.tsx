import { LoadingSkeleton } from "@/components/feedback/loading-skeleton";
import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { SectionWrapper } from "@/components/shared/section-wrapper";

export default function Loading() {
  return (
    <PageContainer>
      <PageHeader
        eyebrow="System"
        title="Loading workspace"
        description="Preparing the foundation shell and shared UI patterns."
      />

      <SectionWrapper title="Dashboard preview" description="Base loading treatment for route transitions.">
        <LoadingSkeleton cardCount={3} rowCount={5} />
      </SectionWrapper>
    </PageContainer>
  );
}
