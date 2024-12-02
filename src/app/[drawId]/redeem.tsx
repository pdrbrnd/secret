"use client";

import { useActionState } from "react";
import { Button } from "@/components/button";
import {
  Dialog,
  DialogActions,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/dialog";
import { cn } from "@/lib/utils";
import { redeemName } from "./actions";

export const Redeem = ({
  name,
  id,
  isRedeemed,
}: {
  name: string;
  id: string;
  isRedeemed: boolean;
}) => {
  const [{ error }, action, isPending] = useActionState(redeemName, {});

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          disabled={isRedeemed}
          size="lg"
          className={cn("justify-start", isRedeemed && "line-through")}
        >
          {name}
        </Button>
      </DialogTrigger>
      <DialogContent className="w-96">
        <DialogTitle>Tens a certeza, {name}?</DialogTitle>
        <DialogDescription>
          Estás prestes a revelar quem te saiu.
          {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        </DialogDescription>
        <DialogActions>
          <form action={action} inert={isPending}>
            <input type="hidden" readOnly name="id" value={id} />
            <Button type="submit" isLoading={isPending}>
              Confirmar
            </Button>
            <DialogClose asChild>
              <Button variant="secondary">Cancelar</Button>
            </DialogClose>
          </form>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};
