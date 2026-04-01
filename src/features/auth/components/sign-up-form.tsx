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
import { signUpSchema, type SignUpSchemaValues } from "@/features/auth/schemas/sign-up-schema";
import { useStandardFormSubmit } from "@/hooks/use-standard-form-submit";
import { authService } from "@/services";

const defaultValues: SignUpSchemaValues = {
  fullName: "",
  email: "",
  password: "",
};

export function SignUpForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignUpSchemaValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues,
  });
  const { isSubmitting, error, successMessage, run, clearFeedback } = useStandardFormSubmit();

  async function onSubmit(values: SignUpSchemaValues) {
    const result = await run(
      () =>
        authService.signIn({
          identifier: values.email,
          password: values.password,
        }),
      (response) => response.message,
    );

    if (result.error?.fieldErrors) {
      Object.entries(result.error.fieldErrors).forEach(([field, message]) => {
        const mapped = field === "identifier" ? "email" : field;
        setError(mapped as keyof SignUpSchemaValues, {
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
        Create account
      </p>
      <h2 className="mt-3 font-display text-2xl font-bold leading-tight text-slate-900 sm:text-3xl">
        Set up your operations workspace.
      </h2>
      <p className="mt-2 text-sm leading-6 text-slate-500">
        Create your account and get access to service requests, maintenance tracking, and
        operational reporting.
      </p>

      <form className="mt-7 space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {error ? <ApiErrorAlert message={error.message} /> : null}
        {successMessage ? <MutationFeedback message={successMessage} /> : null}

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">Full name</label>
          <Input
            {...register("fullName", { onChange: clearFeedback })}
            placeholder="Alex Montemayor"
            autoComplete="name"
            aria-invalid={Boolean(errors.fullName)}
            className="h-11 rounded-xl border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus-visible:border-[#145d66] focus-visible:ring-[#145d66]/20"
          />
          {errors.fullName?.message ? (
            <p className="text-xs font-medium text-destructive">{errors.fullName.message}</p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">Work email</label>
          <Input
            {...register("email", { onChange: clearFeedback })}
            type="email"
            placeholder="you@servi-web.local"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            className="h-11 rounded-xl border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus-visible:border-[#145d66] focus-visible:ring-[#145d66]/20"
          />
          {errors.email?.message ? (
            <p className="text-xs font-medium text-destructive">{errors.email.message}</p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">Password</label>
          <Input
            {...register("password", { onChange: clearFeedback })}
            type="password"
            placeholder="Create a password"
            autoComplete="new-password"
            aria-invalid={Boolean(errors.password)}
            className="h-11 rounded-xl border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus-visible:border-[#145d66] focus-visible:ring-[#145d66]/20"
          />
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
            {isSubmitting ? "Creating workspace..." : "Create workspace"}
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
        href={ROUTES.signIn}
        className="flex h-11 w-full items-center justify-center rounded-full border border-slate-200 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
      >
        Sign in
      </Link>

      <p className="mt-5 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link
          href={ROUTES.signIn}
          className="font-semibold text-[#145d66] transition-colors hover:text-[#0e4d55]"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
