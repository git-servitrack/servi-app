"use client";

import { useEffect, useState } from "react";
import { LogIn, ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ROUTES } from "@/constants/routes";
import { clearAuthTokens, SESSION_EXPIRED_EVENT } from "@/services/auth/session";

export function SessionExpiredDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function handleSessionExpired() {
      clearAuthTokens();
      setOpen(true);
    }

    window.addEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired);

    return () => {
      window.removeEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired);
    };
  }, []);

  function handleSignInAgain() {
    setOpen(false);
    router.replace(ROUTES.signIn);
  }

  return (
    <Dialog open={open} onOpenChange={() => undefined}>
      <DialogContent showCloseButton={false} className="max-w-md">
        <DialogHeader className="items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#145d66]/10 text-[#145d66] dark:bg-[#86d0d8]/10 dark:text-[#86d0d8]">
            <ShieldAlert className="h-7 w-7" />
          </div>
          <DialogTitle className="font-display text-3xl text-slate-950 dark:text-stone-100">
            Session expired
          </DialogTitle>
          <DialogDescription className="max-w-sm text-slate-500 dark:text-stone-400">
            Your login token has expired. Please sign in again so Servi can refresh your secure workspace access.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-center">
          <button
            type="button"
            onClick={handleSignInAgain}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#145d66] px-6 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#0e4d55] sm:w-auto"
          >
            <LogIn className="h-4 w-4" />
            Sign in again
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
