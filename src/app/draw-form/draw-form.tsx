"use client";

import { useActionState, useEffect, useState } from "react";
import { createDraw } from "./actions";
import { Button } from "@/components/button";
import { Input, InputAddon, InputGroup } from "@/components/input";
import { Copy, Trash } from "@phosphor-icons/react";
import { Tooltip } from "@/components/tooltip";

export const DrawForm = () => {
  const [state, action, isPending] = useActionState(createDraw, {
    participants: new Array(3).fill(""),
  });
  const [participants, setParticipants] = useState<string[]>(
    state.participants
  );

  if (state.drawId) {
    return (
      <>
        <Header
          title="Draw created!"
          description="Send this link to all participants:"
        />
        <div className="mt-4">
          <div className="shadow-md border border-emerald-500/20 bg-emerald-500/10 rounded-2xl p-2 gap-2 text-emerald-500 flex items-center justify-between">
            <input
              readOnly
              className="w-full outline-none"
              value={`${window.location.origin}/${state.drawId}`}
            />
            <CopyButton id={state.drawId} />
          </div>
          <p className="text-foreground/44 mt-2 text-sm">
            Each participant will be able to see their match only once.
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header
        title="Secret name matcher"
        description="Enter the names of participants to randomly assign matches. You will get a magic link to share with participants."
      />
      <form action={action} inert={isPending}>
        <div className="shadow-md border border-border rounded-2xl p-2 flex flex-col gap-2 mt-8">
          {participants.map((participant, index) => (
            <InputGroup key={index} className="group">
              <Input
                type="text"
                name="participant"
                value={participant}
                onChange={(e) => {
                  setParticipants((prev) =>
                    prev.map((n, i) => (i === index ? e.target.value : n))
                  );
                }}
                placeholder="Enter name"
                required
              />
              {participants.length > 3 && (
                <InputAddon
                  interactive
                  role="button"
                  tabIndex={0}
                  className="group-hover:opacity-100 opacity-0 transition-opacity delay-0 group-hover:delay-100 group-focus-within:opacity-100 outline-none focus-visible:ring-4 ring-foreground/10 rounded-sm ring-offset-2 cursor-pointer"
                  onClick={() =>
                    setParticipants((prev) =>
                      prev.filter((_, i) => i !== index)
                    )
                  }
                >
                  <Trash weight="bold" className="text-red-500" />
                </InputAddon>
              )}
            </InputGroup>
          ))}

          <Button
            variant="secondary"
            onClick={() => setParticipants([...participants, ""])}
          >
            Add participant
          </Button>
        </div>

        {state.error && <p className="text-red-500">{state.error}</p>}

        <Button type="submit" isLoading={isPending} className="w-full mt-10">
          Get magic link
        </Button>
      </form>
    </>
  );
};

const Header = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <div>
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="text-foreground/44 mt-1">{description}</p>
    </div>
  );
};

const CopyButton = ({ id }: { id: string }) => {
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
      persistOnClick
      delayIn={0}
      content={copied ? "Copied!" : "Copy"}
      onOpenChange={(open) => {
        if (!open) setCopied(false);
      }}
    >
      <Button
        className="border-emerald-500/30 ring-emerald-500/10"
        variant="secondary"
        size="sm"
        square
        onClick={() => {
          setCopied(true);
          navigator.clipboard.writeText(`${window.location.origin}/${id}`);
        }}
      >
        <Copy weight="bold" />
        <span className="sr-only">Copy link</span>
      </Button>
    </Tooltip>
  );
};
