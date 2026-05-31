import { authRoles } from "@/features/auth/data/auth-roles";
import type { AuthSessionPreview, UserRoleId } from "@/features/auth/types/auth";

export type ApiUserRole =
  | "warehouse_staff"
  | "admin"
  | "technician"
  | "head_technician"
  | "project_site_staff"
  | "management";

export interface ApiAuthUser {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string;
  avatar: string | null;
  role: ApiUserRole;
}

export interface AuthTokenPair {
  accessToken: string;
  refreshToken?: string;
}

export interface CurrentSession {
  user: ApiAuthUser;
  session: AuthSessionPreview;
}

const ACCESS_TOKEN_KEY = "servi.accessToken";
const REFRESH_TOKEN_KEY = "servi.refreshToken";

export const frontendToApiRoleMap = {
  "warehouse-staff": "warehouse_staff",
  "admin-operator": "admin",
  technician: "technician",
  "head-technician": "head_technician",
  "project-site": "project_site_staff",
  management: "management",
} satisfies Record<UserRoleId, ApiUserRole>;

export const apiToFrontendRoleMap = {
  warehouse_staff: "warehouse-staff",
  admin: "admin-operator",
  technician: "technician",
  head_technician: "head-technician",
  project_site_staff: "project-site",
  management: "management",
} satisfies Record<ApiUserRole, UserRoleId>;

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function storeAuthTokens(tokens: AuthTokenPair) {
  if (!canUseStorage()) return;

  window.localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);

  if (tokens.refreshToken) {
    window.localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
  }
}

export function getAccessToken() {
  if (!canUseStorage()) return null;

  return window.localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken() {
  if (!canUseStorage()) return null;

  return window.localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function clearAuthTokens() {
  if (!canUseStorage()) return;

  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function mapApiRoleToFrontendRole(role: ApiUserRole): UserRoleId {
  return apiToFrontendRoleMap[role];
}

export function mapFrontendRoleToApiRole(role: UserRoleId): ApiUserRole {
  return frontendToApiRoleMap[role];
}

export function isFrontendRoleAllowed(role: UserRoleId, allowedRoles: UserRoleId[]) {
  return allowedRoles.includes(role);
}

export function isApiRoleAllowed(role: ApiUserRole, allowedRoles: ApiUserRole[]) {
  return allowedRoles.includes(role);
}

export function mapApiUserToSession(user: ApiAuthUser): AuthSessionPreview {
  const roleId = mapApiRoleToFrontendRole(user.role);
  const roleDefinition = authRoles.find((role) => role.id === roleId);

  return {
    fullName: [user.firstName, user.lastName].filter(Boolean).join(" ") || user.username,
    roleId,
    roleLabel: roleDefinition?.label ?? roleId,
    redirectTo: roleDefinition?.defaultRoute ?? "/dashboard",
  };
}

export function buildCurrentSession(user: ApiAuthUser): CurrentSession {
  return {
    user,
    session: mapApiUserToSession(user),
  };
}
