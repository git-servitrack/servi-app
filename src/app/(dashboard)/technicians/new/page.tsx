import { TechnicianFormView } from "@/features/technicians/components/technician-form-view";
import { emptyTechnicianFormValues } from "@/features/technicians/data/technicians";

export default function TechnicianCreatePage() {
  return <TechnicianFormView mode="create" values={emptyTechnicianFormValues} />;
}
