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
      error: "Tens que introduzir pelo menos 3 participantes.",
    };
  }

  // check for duplicates
  const uniqueParticipants = new Set(participants);
  if (uniqueParticipants.size !== participants.length) {
    return {
      participants,
      error: "Tens nomes duplicados, certifica-te de que cada nome é único.",
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
      error: "Falha ao criar o sorteio. Por favor, tenta novamente.",
    };
  }
}
