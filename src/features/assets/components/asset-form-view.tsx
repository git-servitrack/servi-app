import Link from "next/link";

import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ROUTES } from "@/constants/routes";
import { AssetForm } from "@/features/assets/components/asset-form";
import type { AssetFormValues } from "@/features/assets/types/assets";

interface AssetFormViewProps {
  mode: "create" | "edit";
  values: AssetFormValues;
  assetId?: string;
}

export function AssetFormView({ mode, values, assetId }: AssetFormViewProps) {
  const isEdit = mode === "edit";

  return (
    <PageContainer>
      <PageHeader
        eyebrow={isEdit ? "Edit Asset" : "Create Asset"}
        title={isEdit ? "Update asset record" : "Create new asset"}
        description={
          isEdit
            ? "Use the shared asset form to adjust ownership, service cadence, and asset metadata."
            : "Prepare a clean asset record structure ready for validation rules and API submission later."
        }
        actions={
          <>
            <Badge variant="outline">{isEdit ? "Edit flow" : "Create flow"}</Badge>
            <Button asChild variant="outline">
              <Link href={ROUTES.assets}>Back to assets</Link>
            </Button>
          </>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <SectionWrapper title="Asset form" description="Form layout is shared between create and edit routes to prevent duplicated module logic.">
          <AssetForm
            title={isEdit ? "Edit asset details" : "New asset details"}
            description="Form field strategy mirrors the expected shape of future service contracts."
            submitLabel={isEdit ? "Save changes" : "Create asset"}
            values={values}
            assetId={assetId}
          />
        </SectionWrapper>

        <SectionWrapper title="Form guidance" description="Keep field ownership consistent so create and edit flows can share the same contract.">
          <Card>
            <CardHeader>
              <CardDescription>Recommended integration approach</CardDescription>
              <CardTitle>Future API notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">
              <p>Map this form directly to a typed asset DTO and add validation with `react-hook-form` and `zod` in Phase 11.</p>
              <p>Use the same schema for create and edit, with route-level default values supplied from the asset detail fetch.</p>
              <p>Keep file uploads, linked documents, and maintenance history as adjacent flows rather than expanding this base form too early.</p>
            </CardContent>
          </Card>
        </SectionWrapper>
      </div>
    </PageContainer>
  );
}
