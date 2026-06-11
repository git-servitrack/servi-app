import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";
import { ROUTES } from "@/constants/routes";

export function RecoverAccountForm() {
  return (
    <div>
      <div className="mb-8 text-center">
        <h1 className="mt-3 font-display text-4xl font-semibold text-slate-900">Recover account</h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          Password resets are handled by your workspace administrators.
        </p>
      </div>

      <Card className="border-slate-200 bg-slate-50">
        <CardContent className="p-4">
          <p className="text-sm leading-6 text-slate-700">
            Please contact your Head Technician or Admin to reset or change your password.
          </p>
        </CardContent>
      </Card>

      <Link
        href={ROUTES.signIn}
        className="mt-7 flex justify-center text-sm font-medium text-[#145d66] underline-offset-4 transition-colors hover:text-[#0e4d55] hover:underline"
      >
        Back to sign in
      </Link>
    </div>
  );
}
