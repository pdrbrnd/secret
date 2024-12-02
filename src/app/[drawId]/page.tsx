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
  params: Promise<{ drawId: string }>;
}) {
  const { drawId } = await params;
  const draw = await db.query.draws.findFirst({
    where: eq(draws.id, drawId),
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
          title={`${participant.name}, vê o teu par!`}
          description={[
            "Clica abaixo para revelar.",
            "Podes voltar a esta página a qualquer momento para relembrar.",
          ]}
        />
        <div className="mt-8">
          <RevealCard name={participant.match} />
        </div>
      </>
    );
  }

  const sortedParticipants = shuffle(draw.drawNames).sort((a, b) => {
    return Number(a.isRedeemed) - Number(b.isRedeemed);
  });

  return (
    <div>
      <Header
        title="Quem és tu?"
        description="Clica no teu nome para ver quem é o teu par."
      />
      <p className="text-red-500 p-2 bg-red-500/10 rounded-lg mt-4">
        Escolhe com cuidado. Cada participante só pode escolher uma vez.
      </p>

      <div className="mt-8 flex flex-col gap-2">
        {sortedParticipants.map((name) => (
          <Redeem
            key={name.id}
            name={name.name}
            id={name.id}
            isRedeemed={name.isRedeemed}
          />
        ))}
      </div>
    </div>
  );
}
