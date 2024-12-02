"use server";

import { db, drawNames } from "@db";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type FormState = {
  error?: string;
};

export async function redeemName(
  previousData: FormState,
  data: FormData
): Promise<FormState> {
  const id = data.get("id");

  if (!id || typeof id !== "string") {
    return { error: "No name selected" };
  }

  try {
    const [row] = await db
      .update(drawNames)
      .set({
        is_redeemed: true,
      })
      .where(eq(drawNames.id, id))
      .returning();

    if (!row) {
      throw new Error("Failed to redeem name");
    }

    const cookieStore = await cookies();
    cookieStore.set(row.drawId, id);

    redirect(`/${row.drawId}`);
  } catch (error) {
    return { error: "Failed to redeem name. Please try again later." };
  }
}
