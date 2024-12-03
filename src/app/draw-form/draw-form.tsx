"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Button } from "@/components/button";
import { Input, InputGroup, InputSuffix } from "@/components/input";
import { Copy, Link, Trash } from "@phosphor-icons/react";
import { Tooltip } from "@/components/tooltip";

import { Header } from "../header";

import { createDraw } from "./actions";
import { flushSync } from "react-dom";

export const DrawForm = () => {
  const [state, action, isPending] = useActionState(createDraw, {
    participants: [""],
  });

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [participants, setParticipants] = useState<string[]>(
    state.participants
  );

  // allow pasting a list of names to add multiple participants at once
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (participants.length === 1) {
        const pasted = e.clipboardData?.getData("text");

        if (!pasted) return;

        const names = pasted
          .split(/[\n,]/)
          .map((n) => n.trim())
          .filter((n) => n !== "");

        if (names.length > 0) {
          e.preventDefault();
          setParticipants(names);
        }
      }
    };

    window.addEventListener("paste", handlePaste);

    return () => {
      window.removeEventListener("paste", handlePaste);
    };
  }, [participants]);

  const handleAddLine = () => {
    flushSync(() => {
      setParticipants([...participants, ""]);
    });

    inputRefs.current[participants.length]?.focus();
  };

  const handleRemoveLine = (index: number) => {
    if (participants.length === 1) return;

    setParticipants((prev) => prev.filter((_, i) => i !== index));
  };

  if (state.drawId) {
    return (
      <>
        <Header
          title="Sorteio criado!"
          description="Envia este link a todos os participantes:"
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
        </div>
      </>
    );
  }

  return (
    <>
      <Header
        title="Sortear nomes"
        description={[
          "Introduz os nomes dos participantes para fazer pares aleatórios.",
          "Vais receber um link para enviar a todos os participantes.",
        ]}
      />
      <form action={action} inert={isPending}>
        <div className="shadow-md border border-border rounded-2xl p-2 flex flex-col gap-2 mt-8">
          {participants.map((participant, index) => (
            <InputGroup key={index} className="group">
              <Input
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                name="participant"
                value={participant}
                onChange={(e) => {
                  setParticipants((prev) =>
                    prev.map((n, i) => (i === index ? e.target.value : n))
                  );
                }}
                placeholder="Escreve o nome"
                required
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    // don't submit and add a new line instead
                    e.preventDefault();
                    handleAddLine();
                  }

                  if (e.key === "Backspace" && participant === "") {
                    e.preventDefault();
                    flushSync(() => {
                      handleRemoveLine(index);
                    });
                    // focus the previous input
                    inputRefs.current[index - 1]?.focus();
                  }
                }}
                data-1p-ignore
                data-bwignore
                data-form-type="other"
                data-lpignore="true"
              />
              {participants.length > 1 && (
                <InputSuffix
                  interactive
                  role="button"
                  tabIndex={0}
                  className="group-hover:opacity-100 opacity-0 transition-opacity delay-0 group-hover:delay-100 group-focus-within:opacity-100 outline-none focus-visible:ring-4 ring-foreground/10 rounded-sm cursor-pointer"
                  onClick={() => handleRemoveLine(index)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleRemoveLine(index);
                    }
                  }}
                >
                  <Trash weight="bold" className="text-red-500" />
                </InputSuffix>
              )}
            </InputGroup>
          ))}

          <Button variant="secondary" onClick={handleAddLine}>
            Adicionar participante
          </Button>
        </div>

        <div className="mt-8">
          {state.error && <p className="text-red-500 mb-4">{state.error}</p>}

          <Button type="submit" isLoading={isPending} className="w-full">
            <Link weight="bold" />
            <span>Obter link</span>
          </Button>
        </div>

        <p className="text-foreground mt-2 text-sm">
          Também podes colar uma lista de nomes para adicionar vários de uma
          vez.
        </p>
      </form>
    </>
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
      content={copied ? "Copiado!" : "Copiar"}
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
        <span className="sr-only">Copiar link</span>
      </Button>
    </Tooltip>
  );
};
