"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { sileo } from "sileo";

import { Input } from "@/components/ui/input";
import { ROUTES } from "@/constants/routes";
import { signInSchema, type SignInSchemaValues } from "@/features/auth/schemas/sign-in-schema";
import { useStandardFormSubmit } from "@/hooks/use-standard-form-submit";
import { authService } from "@/services";
import type { AuthSuccessResponse } from "@/services/auth/contracts";
import type { ApiErrorShape } from "@/services/http/types";

const defaultValues: SignInSchemaValues = {
  identifier: "",
  password: "",
};

export function SignInForm() {
  const router = useRouter();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignInSchemaValues>({
    resolver: zodResolver(signInSchema),
    defaultValues,
  });
  const { isSubmitting, run, clearFeedback } = useStandardFormSubmit();

  function getToastErrorMessage(errorValue: unknown) {
    if (typeof errorValue === "object" && errorValue !== null && "message" in errorValue) {
      return String(
        (errorValue as { message?: unknown }).message ?? "Please check your credentials.",
      );
    }

    return "Please check your credentials.";
  }

  async function onSubmit(values: SignInSchemaValues) {
    const result = await sileo
      .promise<AuthSuccessResponse>(
        async () => {
          const submission = await run(
            () => authService.signIn(values),
            (response) => response.message,
          );

          if (submission.error) {
            throw submission.error;
          }

          if (!submission.data) {
            throw new Error("Sign-in did not return session data.");
          }

          return submission.data;
        },
        {
          loading: {
            title: "Signing in...",
            description: "Checking your Servi workspace access.",
          },
          success: (response) => ({
            title: "Welcome to Servi",
            description: `Signed in as ${response.session.roleLabel}.`,
          }),
          error: (errorValue) => ({
            title: "Sign-in failed",
            description: getToastErrorMessage(errorValue),
          }),
        },
      )
      .catch((errorValue: ApiErrorShape) => {
        if (errorValue.fieldErrors) {
          Object.entries(errorValue.fieldErrors).forEach(([field, message]) => {
            setError(field as keyof SignInSchemaValues, {
              type: "server",
              message,
            });
          });
        }

        return null;
      });

    if (!result) {
      return;
    }

    router.replace(result.session.redirectTo);
  }

  return (
    <div>
      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-600">Email</label>
          <Input
            {...register("identifier", { onChange: clearFeedback })}
            placeholder="ops.admin@servi-web.local"
            aria-invalid={Boolean(errors.identifier)}
            className="h-12 rounded-md border-slate-200 bg-white text-slate-900 shadow-sm placeholder:text-slate-400 focus-visible:border-[#145d66] focus-visible:ring-[#145d66]/20"
          />
          {errors.identifier?.message ? (
            <p className="text-xs font-medium text-destructive">{errors.identifier.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-600">Password</label>
          <div className="relative">
            <Input
              {...register("password", { onChange: clearFeedback })}
              type={passwordVisible ? "text" : "password"}
              placeholder="Enter your password"
              aria-invalid={Boolean(errors.password)}
              className="h-12 rounded-md border-slate-200 bg-white pr-11 text-slate-900 shadow-sm placeholder:text-slate-400 focus-visible:border-[#145d66] focus-visible:ring-[#145d66]/20"
            />
            <button
              type="button"
              onClick={() => setPasswordVisible((visible) => !visible)}
              className="absolute right-3 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
              aria-label={passwordVisible ? "Hide password" : "Show password"}
            >
              {passwordVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password?.message ? (
            <p className="text-xs font-medium text-destructive">{errors.password.message}</p>
          ) : null}
        </div>

        <div className="-mt-1 flex justify-end">
          <Link
            href={ROUTES.recoverAccount}
            className="text-sm font-medium text-[#145d66] underline-offset-4 transition-colors hover:text-[#0e4d55] hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <div className="pt-1">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-md bg-[#145d66] text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#0e4d55] disabled:pointer-events-none disabled:opacity-50"
          >
            {isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </div>
      </form>
    </div>
  );
}
