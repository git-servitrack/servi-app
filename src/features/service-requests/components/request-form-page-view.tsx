"use client";

import { LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { ApiErrorAlert } from "@/components/feedback/api-error-alert";
import { ROUTES } from "@/constants/routes";
import { RequestFormView } from "@/features/service-requests/components/request-form-view";
import { emptyServiceRequestFormValues } from "@/features/service-requests/data/service-requests";
import { mapServiceRequestToFormValues } from "@/features/service-requests/lib/service-requests";
import type {
  ServiceRequestFormValues,
  ServiceRequestAssetOption,
  ServiceRequestRequesterOption,
} from "@/features/service-requests/types/service-requests";
import { serviceRequestsService } from "@/services";
import type { ApiErrorShape } from "@/services/http/types";

interface RequestFormPageViewProps {
  mode: "create" | "edit";
  requestId?: string;
}

function buildEmptyRequestValues(
  assets: ServiceRequestAssetOption[],
  requesters: ServiceRequestRequesterOption[],
): ServiceRequestFormValues {
  const firstAsset = assets[0];

  return {
    ...emptyServiceRequestFormValues,
    requester: requesters[0]?.id ?? "",
    asset: firstAsset?.id ?? "",
    site: firstAsset?.site ?? emptyServiceRequestFormValues.site,
  };
}

export function RequestFormPageView({ mode, requestId }: RequestFormPageViewProps) {
  const [values, setValues] = useState<ServiceRequestFormValues | null>(null);
  const [assets, setAssets] = useState<ServiceRequestAssetOption[]>([]);
  const [requesters, setRequesters] = useState<ServiceRequestRequesterOption[]>([]);
  const [error, setError] = useState<ApiErrorShape | null>(null);

  useEffect(() => {
    let active = true;

    async function loadFormData() {
      const optionsResult = await serviceRequestsService.formOptions();

      if (!active) return;

      if (optionsResult.error) {
        setError(optionsResult.error);
        setValues(null);
        setAssets([]);
        setRequesters([]);
        return;
      }

      setAssets(optionsResult.data.assets);
      setRequesters(optionsResult.data.requesters);

      if (mode === "create") {
        setError(null);
        setValues(buildEmptyRequestValues(optionsResult.data.assets, optionsResult.data.requesters));
        return;
      }

      if (!requestId) {
        setError({
          code: "NOT_FOUND",
          message: "Service request could not be found.",
          status: 404,
        });
        setValues(null);
        return;
      }

      const requestResult = await serviceRequestsService.getById(requestId);

      if (!active) return;

      if (requestResult.error) {
        setError(requestResult.error);
        setValues(null);
        return;
      }

      setError(null);
      setValues(mapServiceRequestToFormValues(requestResult.data));
    }

    void loadFormData();

    return () => {
      active = false;
    };
  }, [mode, requestId]);

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <ApiErrorAlert message={error.message} />
        <Link
          href={ROUTES.serviceRequests}
          className="mt-5 inline-flex text-sm font-medium text-[#145d66] hover:text-[#0e4d55]"
        >
          Back to requests
        </Link>
      </div>
    );
  }

  if (!values) {
    return (
      <div className="flex min-h-screen items-center justify-center gap-2 text-sm text-slate-500 dark:text-stone-400">
        <LoaderCircle className="h-4 w-4 animate-spin" />
        Loading request form...
      </div>
    );
  }

  return (
    <RequestFormView
      mode={mode}
      values={values}
      requestId={requestId}
      assets={assets}
      requesters={requesters}
    />
  );
}
