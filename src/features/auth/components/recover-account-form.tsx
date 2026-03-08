"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeftRight } from "lucide-react";
import { useForm } from "react-hook-form";

import { FormFieldShell } from "@/components/forms/form-field-shell";
import { FormSubmitBar } from "@/components/forms/form-submit-bar";
import { ApiErrorAlert } from "@/components/feedback/api-error-alert";
import { MutationFeedback } from "@/components/feedback/mutation-feedback";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/constants/routes";
import { recoverAccountSchema, type RecoverAccountSchemaValues } from "@/features/auth/schemas/recover-account-schema";
import { useStandardFormSubmit } from "@/hooks/use-standard-form-submit";
import { authService } from "@/services";

const defaultValues: RecoverAccountSchemaValues = {
  email: "",
};

export function RecoverAccountForm() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RecoverAccountSchemaValues>({
    resolver: zodResolver(recoverAccountSchema),
    defaultValues,
  });
  const { isSubmitting, error, successMessage, run, clearFeedback } = useStandardFormSubmit();

  async function onSubmit(values: RecoverAccountSchemaValues) {
    const result = await run(() => authService.recoverAccount(values), (response) => response.message);

    if (result.error?.fieldErrors) {
      Object.entries(result.error.fieldErrors).forEach(([field, message]) => {
        setError(field as keyof RecoverAccountSchemaValues, {
          type: "server",
          message,
        });
      });
    }
  }

  return (
    <Card className="border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(250,247,241,0.95))] shadow-[0_28px_80px_-42px_rgba(34,47,61,0.45)]">
      <CardHeader className="space-y-4 p-7 sm:p-8">
        <div className="flex items-center gap-3 text-primary">
          <div className="grid size-11 place-items-center rounded-full bg-primary/12">
            <ArrowLeftRight className="size-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Recovery</p>
            <CardTitle className="font-display text-4xl text-slate-900">Recover account</CardTitle>
          </div>
        </div>
        <CardDescription className="text-base leading-7 text-slate-600">
          This placeholder page establishes the frontend entry point for password reset or account recovery before the backend recovery flow exists.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 p-7 pt-0 sm:p-8 sm:pt-0">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {error ? <ApiErrorAlert message={error.message} /> : null}
          {successMessage ? <MutationFeedback message={successMessage} /> : null}

          <FormFieldShell
            label="Work email"
            error={errors.email?.message}
            description="Recovery messages are simulated in this phase. Replace this with your actual email or OTP flow later."
          >
            <Input {...register("email", { onChange: clearFeedback })} placeholder="alex@servi-web.local" aria-invalid={Boolean(errors.email)} />
          </FormFieldShell>

          <FormSubmitBar
            isSubmitting={isSubmitting}
            submitLabel="Send recovery instructions"
            helpText=""
          />
        </form>

        <div className="space-y-3 border-t border-border/70 pt-4 text-sm text-slate-600">
          <Button asChild variant="ghost" className="justify-start px-0 text-primary hover:bg-transparent">
            <Link href={ROUTES.signIn}>Back to sign in</Link>
          </Button>
          <p className="text-sm leading-6 text-muted-foreground">If your access was never provisioned, request account setup from your admin.</p>
        </div>
      </CardContent>
    </Card>
  );
}
