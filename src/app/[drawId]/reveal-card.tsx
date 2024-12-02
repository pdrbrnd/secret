"use client";

import { Button } from "@/components/button";
import { Tooltip } from "@/components/tooltip";
import { Eye, EyeClosed } from "@phosphor-icons/react";
import { useState } from "react";

export const RevealCard = ({ name }: { name: string }) => {
  const [reveal, setReveal] = useState(false);

  return (
    <div className="flex items-center gap-2 justify-between shadow-md border border-border rounded-2xl p-2">
      <div className="p-2 leading-none text-xl">
        {reveal ? (
          <span>{name}</span>
        ) : (
          <span className="flex gap-1.5">
            {new Array(8).fill("·").map((_, i) => (
              <span
                key={i}
                className="w-1.5 h-1.5 bg-foreground rounded-full"
              />
            ))}
          </span>
        )}
      </div>

      <Tooltip content={reveal ? "Hide match" : "View match"}>
        <Button variant="secondary" square onClick={() => setReveal(!reveal)}>
          {reveal ? <EyeClosed weight="bold" /> : <Eye weight="bold" />}
        </Button>
      </Tooltip>
    </div>
  );
};
