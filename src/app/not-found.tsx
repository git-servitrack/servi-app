import Link from "next/link";
import { Compass } from "lucide-react";

import { ErrorState } from "@/components/feedback/error-state";
import { ROUTES } from "@/constants/routes";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <ErrorState
      icon={Compass}
      title="Page not found"
      description="The route does not exist yet or has not been implemented in the current phase."
      actions={
        <Button asChild>
          <Link href={ROUTES.dashboard}>Return to dashboard</Link>
        </Button>
      }
    />
  );
}
