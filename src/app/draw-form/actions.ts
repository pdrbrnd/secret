"use server";

import { shuffle } from "@/lib/utils/array";
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
  const participants = shuffle(data.getAll("participant").filter(isString));

  if (participants.length < 3) {
    return {
      participants,
      error: "You need to provide at least 3 participants",
    };
  }

  // check for duplicates
  const uniqueParticipants = new Set(participants);
  if (uniqueParticipants.size !== participants.length) {
    return {
      participants,
      error: "You have duplicate participants, make sure each name is unique.",
    };
  }

  try {
    const id = await db.transaction(async (tx) => {
      const [draw] = await tx.insert(draws).values({}).returning();

      // shifts index by 1 to match each participant with the next
      const matches = participants.map((_, index) => {
        return participants[(index + 1) % participants.length];
      });

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
