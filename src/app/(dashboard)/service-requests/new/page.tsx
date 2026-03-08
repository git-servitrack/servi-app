import { emptyServiceRequestFormValues } from "@/features/service-requests/data/service-requests";
import { RequestFormView } from "@/features/service-requests/components/request-form-view";

export default function ServiceRequestCreatePage() {
  return <RequestFormView mode="create" values={emptyServiceRequestFormValues} />;
}
