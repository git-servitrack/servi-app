"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { ApiErrorAlert } from "@/components/feedback/api-error-alert";
import { MutationFeedback } from "@/components/feedback/mutation-feedback";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/constants/routes";
import { signInSchema, type SignInSchemaValues } from "@/features/auth/schemas/sign-in-schema";
import { useStandardFormSubmit } from "@/hooks/use-standard-form-submit";
import { authService } from "@/services";

const defaultValues: SignInSchemaValues = {
  identifier: "",
  password: "",
};

export function SignInForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignInSchemaValues>({
    resolver: zodResolver(signInSchema),
    defaultValues,
  });
  const { isSubmitting, error, successMessage, run, clearFeedback } = useStandardFormSubmit();

  async function onSubmit(values: SignInSchemaValues) {
    const result = await run(
      () => authService.signIn(values),
      (response) => response.message,
    );

    if (result.error?.fieldErrors) {
      Object.entries(result.error.fieldErrors).forEach(([field, message]) => {
        setError(field as keyof SignInSchemaValues, {
          type: "server",
          message,
        });
      });

      return;
    }

    if (result.data) {
      router.push(result.data.session.redirectTo);
    }
  }

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#145d66]">
        Sign in
      </p>
      <h2 className="mt-3 font-display text-2xl font-bold leading-tight text-slate-900 sm:text-3xl">
        Return to your operations console.
      </h2>
      <p className="mt-2 text-sm leading-6 text-slate-500">
        Enter your workspace credentials. Role-aware routing stays mock-based for now and is ready
        to connect to a real session API later.
      </p>

      <form className="mt-7 space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {error ? <ApiErrorAlert message={error.message} /> : null}
        {successMessage ? <MutationFeedback message={successMessage} /> : null}

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">Email or username</label>
          <Input
            {...register("identifier", { onChange: clearFeedback })}
            placeholder="ops.admin@servi-web.local"
            aria-invalid={Boolean(errors.identifier)}
            className="h-11 rounded-xl border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus-visible:border-[#145d66] focus-visible:ring-[#145d66]/20"
          />
          {errors.identifier?.message ? (
            <p className="text-xs font-medium text-destructive">{errors.identifier.message}</p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">Password</label>
          <Input
            {...register("password", { onChange: clearFeedback })}
            type="password"
            placeholder="Enter your password"
            aria-invalid={Boolean(errors.password)}
            className="h-11 rounded-xl border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus-visible:border-[#145d66] focus-visible:ring-[#145d66]/20"
          />
          <p className="text-xs leading-5 text-slate-400">
            Identifiers containing &apos;tech&apos; or &apos;manage&apos; demonstrate role-based redirects.
          </p>
          {errors.password?.message ? (
            <p className="text-xs font-medium text-destructive">{errors.password.message}</p>
          ) : null}
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#145d66] text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#0e4d55] disabled:pointer-events-none disabled:opacity-50"
          >
            {isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
            {isSubmitting ? "Signing in..." : "Enter dashboard"}
            {!isSubmitting ? <ArrowRight className="h-4 w-4" /> : null}
          </button>
        </div>
      </form>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-100" />
        <span className="text-xs text-slate-400">or</span>
        <div className="h-px flex-1 bg-slate-100" />
      </div>

      <Link
        href={ROUTES.recoverAccount}
        className="flex h-11 w-full items-center justify-center rounded-full border border-slate-200 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
      >
        Recover access
      </Link>

      <p className="mt-5 text-center text-sm text-slate-500">
        Need a workspace?{" "}
        <Link
          href={ROUTES.signUp}
          className="font-semibold text-[#145d66] transition-colors hover:text-[#0e4d55]"
        >
          Create account
        </Link>
      </p>
    </div>
  );
}
