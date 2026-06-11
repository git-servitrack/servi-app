"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";

import { ApiErrorAlert } from "@/components/feedback/api-error-alert";
import { MutationFeedback } from "@/components/feedback/mutation-feedback";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/constants/routes";
import {
  recoverAccountSchema,
  type RecoverAccountSchemaValues,
} from "@/features/auth/schemas/recover-account-schema";
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
    const result = await run(
      () => authService.recoverAccount(values),
      (response) => response.message,
    );

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
    <div>
      <div className="mb-8 text-center">
        <h1 className="mt-3 font-display text-4xl font-semibold text-slate-900">Recover account</h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          Enter your work email to see the correct password reset instruction.
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        {error ? <ApiErrorAlert message={error.message} /> : null}
        {successMessage ? <MutationFeedback message={successMessage} /> : null}

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-600">Email</label>
          <Input
            {...register("email", { onChange: clearFeedback })}
            placeholder="alex@servi-web.local"
            aria-invalid={Boolean(errors.email)}
            className="h-12 rounded-md border-slate-200 bg-white text-slate-900 shadow-sm placeholder:text-slate-400 focus-visible:border-[#145d66] focus-visible:ring-[#145d66]/20"
          />
          {errors.email?.message ? (
            <p className="text-xs font-medium text-destructive">{errors.email.message}</p>
          ) : null}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-md bg-[#145d66] text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#0e4d55] disabled:pointer-events-none disabled:opacity-50"
        >
          {isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
          {isSubmitting ? "Checking..." : "Show reset instruction"}
        </button>
      </form>

      <Link
        href={ROUTES.signIn}
        className="mt-7 flex justify-center text-sm font-medium text-[#145d66] underline-offset-4 transition-colors hover:text-[#0e4d55] hover:underline"
      >
        Back to sign in
      </Link>
    </div>
  );
}
