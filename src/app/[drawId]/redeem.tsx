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
import { db, drawNames } from "@db";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const Redeem = ({
  name,
  id,
  isRedeemed,
}: {
  name: string;
  id: string;
  isRedeemed: boolean;
}) => {
  const handleRedeem = async () => {
    "use server";

    const [row] = await db
      .update(drawNames)
      .set({
        is_redeemed: true,
      })
      .where(eq(drawNames.id, id))
      .returning();

    const cookieStore = await cookies();
    cookieStore.set(row.drawId, id);

    redirect(`/${row.drawId}`);
  };

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
        <DialogTitle>Are you sure, {name}?</DialogTitle>
        <DialogDescription>
          You are about to reveal your secret match.
        </DialogDescription>
        <DialogActions>
          <Button onClick={handleRedeem}>Confirm</Button>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};
