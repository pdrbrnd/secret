"use server";

import { db, drawNames, draws } from "@db";

export type FormState = {
  participants: string[];
  error?: string;
  drawId?: string;
};

// fisher-yates shuffle
function shuffle<T>(array: T[]): T[] {
  const arr = [...array];

  for (let i = arr.length - 1; i > 0; i--) {
    const index = Math.floor(Math.random() * (i + 1));
    const temp = arr[i];
    arr[i] = arr[index];
    arr[index] = temp;
  }

  return arr;
}

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

      const shuffledParticipants = shuffle(participants);
      // shifts index by 1 to match each participant with the next
      const matches = shuffledParticipants.map(
        (_, index) =>
          shuffledParticipants[(index + 1) % shuffledParticipants.length]
      );

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
