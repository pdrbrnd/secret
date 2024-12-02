"use server";

import { db, drawNames, draws } from "@db";

export type FormState = {
  participants: string[];
  error?: string;
  drawId?: string;
};

const isString = (value: unknown): value is string => {
  return typeof value === "string" && value.trim() !== "";
};

export async function createDraw(
  previousState: FormState,
  data: FormData
): Promise<FormState> {
  const participants = data.getAll("participant").filter(isString);

  if (participants.length < 3) {
    return {
      participants,
      error: "You need to provide at least 3 participants",
    };
  }

  try {
    const id = await db.transaction(async (tx) => {
      const [draw] = await tx.insert(draws).values({}).returning();

      // Create shuffled pairs for secret santa
      const shuffledparticipants = [...participants].sort(
        () => Math.random() - 0.5
      );
      const matches = [
        ...shuffledparticipants.slice(1),
        shuffledparticipants[0],
      ];

      await tx.insert(drawNames).values(
        participants.map((name, index) => ({
          drawId: draw.id,
          name: name,
          match: matches[index],
        }))
      );

      return draw.id;
    });

    return {
      participants,
      drawId: id,
    };
  } catch (error) {
    console.error("Failed to create draw:", error);
    return {
      participants,
      error: "Failed to create the draw. Please try again.",
    };
  }
}
