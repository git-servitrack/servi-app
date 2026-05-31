import { AuthShell } from "@/features/auth/components/auth-shell";
import { AuthRouteGuard } from "@/features/auth/components/auth-route-guard";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthRouteGuard>
      <AuthShell>{children}</AuthShell>
    </AuthRouteGuard>
  );
}
