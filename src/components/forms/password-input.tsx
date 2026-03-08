"use client";

import { Eye, EyeOff } from "lucide-react";
import { forwardRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type PasswordInputProps = Omit<React.ComponentProps<typeof Input>, "type">;

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(function PasswordInput(
  { className, ...props },
  ref,
) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative">
      <Input
        {...props}
        ref={ref}
        type={isVisible ? "text" : "password"}
        className={["pr-12", className].filter(Boolean).join(" ")}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => setIsVisible((current) => !current)}
        className="absolute right-1 top-1/2 size-9 -translate-y-1/2 text-muted-foreground hover:bg-transparent hover:text-foreground"
        aria-label={isVisible ? "Hide password" : "Show password"}
      >
        {isVisible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </Button>
    </div>
  );
});
