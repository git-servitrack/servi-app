"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { FormFieldShell } from "@/components/forms/form-field-shell";
import { PasswordInput } from "@/components/forms/password-input";
import { FormSubmitBar } from "@/components/forms/form-submit-bar";
import { ApiErrorAlert } from "@/components/feedback/api-error-alert";
import { MutationFeedback } from "@/components/feedback/mutation-feedback";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Card className="border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(250,247,241,0.95))] shadow-[0_28px_80px_-42px_rgba(34,47,61,0.45)]">
      <CardHeader className="space-y-4 p-7 sm:p-8">
        <div className="flex items-center gap-3 text-primary">
          <div className="grid size-11 place-items-center rounded-full bg-primary/12">
            <KeyRound className="size-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
              Authentication
            </p>
            <CardTitle className="font-display text-4xl text-slate-900">Sign in</CardTitle>
          </div>
        </div>
        <CardDescription className="text-base leading-7 text-slate-600">
          Enter your workspace credentials. Role-aware routing stays mock-based for now and is ready
          to connect to a real session API later.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 p-7 pt-0 sm:p-8 sm:pt-0">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {error ? <ApiErrorAlert message={error.message} /> : null}
          {successMessage ? <MutationFeedback message={successMessage} /> : null}

          <FormFieldShell label="Email or username" error={errors.identifier?.message}>
            <Input
              {...register("identifier", { onChange: clearFeedback })}
              placeholder="ops.admin@servi-web.local"
              aria-invalid={Boolean(errors.identifier)}
            />
          </FormFieldShell>

          <FormFieldShell
            label="Password"
            error={errors.password?.message}
            description="Use any valid mock credential for now. Identifiers containing 'tech' or 'manage' demonstrate role-based redirects."
          >
            <PasswordInput
              {...register("password", { onChange: clearFeedback })}
              placeholder="Enter your password"
              aria-invalid={Boolean(errors.password)}
            />
          </FormFieldShell>

          <FormSubmitBar
            isSubmitting={isSubmitting}
            submitLabel="Sign in"
            helpText=""
          />
        </form>

        <div className="space-y-3 border-t border-border/70 pt-4 text-sm text-slate-600">
          <Button
            asChild
            variant="ghost"
            className="justify-start px-0 text-primary hover:bg-transparent"
          >
            <Link href={ROUTES.recoverAccount}>Forgot password or lost access?</Link>
          </Button>
          <p className="text-sm leading-6 text-muted-foreground">
            Need an account? Contact your Admin / System Operator for provisioning.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
