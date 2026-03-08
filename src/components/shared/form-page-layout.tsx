import Link from "next/link";
import type { ReactNode } from "react";

import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface FormPageLayoutProps {
  eyebrow: string;
  title: string;
  description: string;
  flowLabel: string;
  backHref: string;
  backLabel: string;
  formTitle: string;
  formDescription: string;
  formContent: ReactNode;
  guidanceTitle: string;
  guidanceDescription: string;
  guidanceEyebrow: string;
  guidanceCardTitle: string;
  guidanceContent: ReactNode;
}

export function FormPageLayout({
  eyebrow,
  title,
  description,
  flowLabel,
  backHref,
  backLabel,
  formTitle,
  formDescription,
  formContent,
  guidanceTitle,
  guidanceDescription,
  guidanceEyebrow,
  guidanceCardTitle,
  guidanceContent,
}: FormPageLayoutProps) {
  return (
    <PageContainer>
      <PageHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
        actions={
          <>
            <Badge variant="outline">{flowLabel}</Badge>
            <Button asChild variant="outline">
              <Link href={backHref}>{backLabel}</Link>
            </Button>
          </>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <SectionWrapper title={formTitle} description={formDescription}>
          {formContent}
        </SectionWrapper>

        <SectionWrapper title={guidanceTitle} description={guidanceDescription}>
          <Card>
            <CardHeader>
              <CardDescription>{guidanceEyebrow}</CardDescription>
              <CardTitle>{guidanceCardTitle}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">{guidanceContent}</CardContent>
          </Card>
        </SectionWrapper>
      </div>
    </PageContainer>
  );
}
