import Link from "next/link";

import { ModuleStatGrid } from "@/components/shared/module-stat-grid";
import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { authRoles } from "@/features/auth/data/auth-roles";
import { userRecords } from "@/features/user-management/data/user-management";
import { UserTable } from "@/features/user-management/components/user-table";

export function UserManagementListView() {
  return (
    <PageContainer>
      <PageHeader
        eyebrow="Admin Access"
        title="User management"
        description="Provision workspace accounts, assign operational roles, and keep access changes centralized under admin control."
        actions={
          <>
            <Badge variant="accent">Admin only</Badge>
            <Button asChild>
              <Link href={`${ROUTES.userManagement}/new`}>Create user</Link>
            </Button>
          </>
        }
      />

      <ModuleStatGrid
        items={[
          { label: "Active", value: userRecords.filter((user) => user.status === "Active").length.toString(), hint: "Accounts currently able to access the workspace" },
          { label: "Pending", value: userRecords.filter((user) => user.status === "Pending Activation").length.toString(), hint: "Invitations awaiting first-time access" },
          { label: "Roles", value: authRoles.length.toString(), hint: "Provisionable operational roles currently defined" },
        ]}
      />

      <SectionWrapper title="Provisioning policy" description="Public sign-up is intentionally removed. Only Admin / System Operator accounts should provision users.">
        <div className="rounded-[1.4rem] border border-dashed border-border bg-card/70 p-5 text-sm leading-6 text-muted-foreground">
          <p>Use this module to create accounts, assign the correct role, and manage activation state. Later backend enforcement should restrict this module to admin-authorized sessions only.</p>
        </div>
      </SectionWrapper>

      <SectionWrapper title="Workspace users" description="Shared listing structure for later API-backed user search, filtering, and audit metadata.">
        <UserTable users={userRecords} />
      </SectionWrapper>
    </PageContainer>
  );
}
