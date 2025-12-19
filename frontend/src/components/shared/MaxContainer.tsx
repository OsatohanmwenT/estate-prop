import React from "react";
import { cn } from "~/lib/utils";

const MaxContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        `px-4 py-4 min-h-screen bg-white sm:py-6 sm:px-7 w-full`,
        className
      )}
    >
      {children}
    </div>
  );
};

export default MaxContainer;
