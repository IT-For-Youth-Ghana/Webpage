import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils/cn";

type PageContainerProps = HTMLAttributes<HTMLElement> & {
  as?: "main" | "section" | "div";
};

export function PageContainer({ as: Component = "main", className, ...props }: PageContainerProps) {
  return <Component className={cn("mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", className)} {...props} />;
}
