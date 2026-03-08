import { SparePartFormView } from "@/features/spare-parts/components/spare-part-form-view";
import { emptySparePartFormValues } from "@/features/spare-parts/data/spare-parts";

export default function SparePartCreatePage() {
  return <SparePartFormView mode="create" values={emptySparePartFormValues} />;
}
