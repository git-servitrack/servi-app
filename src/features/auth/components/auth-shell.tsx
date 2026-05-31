import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import loginImage from "@/assets/login-img.png";
import logoImage from "@/assets/logo-black.png";

interface AuthShellProps {
  children: ReactNode;
}

export function AuthShell({ children }: AuthShellProps) {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 lg:grid lg:grid-cols-2">
      <section className="hidden min-h-screen flex-col items-center justify-center bg-[#e7f7ee] px-10 py-12 lg:flex">
        <div className="w-full max-w-[430px] text-center">
          <div className="relative mx-auto aspect-square w-full max-w-[340px]">
            <Image
              src={loginImage}
              alt="Servi operations illustration"
              fill
              priority
              sizes="340px"
              className="object-contain"
            />
          </div>

          <p className="mt-8 font-sans text-3xl font-bold text-slate-900">Servi Operations Hub</p>
          <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-slate-600">
            Keep maintenance requests, assets, technicians, and reporting in one focused workspace.
          </p>
        </div>
      </section>

      <section className="flex min-h-screen flex-col items-center justify-center bg-[#f8fafc] px-5 py-10 sm:px-8 lg:px-10">
        <div className="w-full max-w-[360px]">
          <Link href="/" className="mb-12 flex items-center justify-center">
            <Image
              src={logoImage}
              alt="Servi logo"
              width={220}
              height={65}
              priority
              className="h-auto w-[190px] object-contain sm:w-[220px]"
            />
          </Link>

          {children}
        </div>
      </section>
    </main>
  );
}
