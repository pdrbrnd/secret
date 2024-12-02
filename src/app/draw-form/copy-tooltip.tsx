import { Tooltip } from "@/components/tooltip";
import { useEffect, useState } from "react";

export const CopyTooltip = ({ children }: { children: React.ReactNode }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (copied) {
      timeout = setTimeout(() => {
        setCopied(false);
      }, 2000);
    }

    return () => clearTimeout(timeout);
  }, [copied]);

  return (
    <Tooltip
      delayIn={0}
      content={copied ? "Copied!" : "Copy"}
      onOpenChange={(open) => {
        if (!open) setCopied(false);
      }}
    >
      {children}
    </Tooltip>
  );
};
