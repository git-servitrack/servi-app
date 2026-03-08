import { userRecords } from "@/features/user-management/data/user-management";

export function getUserRecord(userId: string) {
  return userRecords.find((user) => user.id === userId) ?? null;
}
