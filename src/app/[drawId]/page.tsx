import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { db, draws } from "@db";

import { shuffle } from "@/lib/utils/array";

import { Header } from "../header";
import { RevealCard } from "./reveal-card";
import { Redeem } from "./redeem";

export default async function DrawPage({
  params,
}: {
  params: { drawId: string };
}) {
  const draw = await db.query.draws.findFirst({
    where: eq(draws.id, params.drawId),
    with: {
      drawNames: true,
    },
  });

  if (!draw) notFound();

  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(draw.id)?.value;
  const participant = draw.drawNames.find((name) => name.id === cookieValue);

  if (participant) {
    return (
      <>
        <Header
          title={`${participant.name}, your match is here!`}
          description={[
            "Click below to reveal.",
            "You can come back anytime to see your match again",
          ]}
        />
        <div className="mt-8">
          <RevealCard name={participant.match} />
        </div>
      </>
    );
  }

  const sortedParticipants = shuffle(draw.drawNames).sort((a, b) => {
    return Number(a.is_redeemed) - Number(b.is_redeemed);
  });

  return (
    <div>
      <Header
        title="Who are you?"
        description="Click your name to see your secret match."
      />
      <p className="text-red-500 p-2 bg-red-500/10 rounded-lg mt-4">
        Choose carefully. Each participant can only redeem their match once.
      </p>

      <div className="mt-8 flex flex-col gap-2">
        {sortedParticipants.map((name) => (
          <Redeem
            key={name.id}
            name={name.name}
            id={name.id}
            isRedeemed={name.is_redeemed}
          />
        ))}
      </div>
    </div>
  );
}
