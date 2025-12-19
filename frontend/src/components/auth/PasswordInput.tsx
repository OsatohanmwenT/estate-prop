"use client";

import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Input } from "../ui/input";
import {
  ControllerFieldState,
  ControllerRenderProps,
  Path,
} from "react-hook-form";

interface PasswordInputProps {
  field: ControllerRenderProps<any, Path<any>>;
  fieldState: ControllerFieldState;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function PasswordInput({
  field,
  fieldState,
}: PasswordInputProps) {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

  return (
    <div className="*:not-first:mt-2">
      <div className="relative">
        <Input
          {...field}
          className="h-auto rounded-sm py-2.5 pe-9"
          placeholder="Password"
          id="auth-form-password"
          aria-invalid={fieldState.invalid}
          autoComplete="off"
          type={isVisible ? "text" : "password"}
        />
        <button
          className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          type="button"
          onClick={toggleVisibility}
          aria-label={isVisible ? "Hide password" : "Show password"}
          aria-pressed={isVisible}
          aria-controls="password"
        >
          {isVisible ? (
            <EyeOffIcon size={16} aria-hidden="true" />
          ) : (
            <EyeIcon size={16} aria-hidden="true" />
          )}
        </button>
      </div>
    </div>
  );
}
