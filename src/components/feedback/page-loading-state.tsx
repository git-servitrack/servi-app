import { LoadingSkeleton } from "@/components/feedback/loading-skeleton";
import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { SectionWrapper } from "@/components/shared/section-wrapper";

interface PageLoadingStateProps {
  eyebrow: string;
  title: string;
  description: string;
}

export function PageLoadingState({ eyebrow, title, description }: PageLoadingStateProps) {
  return (
    <PageContainer>
      <PageHeader eyebrow={eyebrow} title={title} description={description} />
      <SectionWrapper title="Loading content" description="Preparing the next workspace view.">
        <LoadingSkeleton cardCount={3} rowCount={5} />
      </SectionWrapper>
    </PageContainer>
  );
}
