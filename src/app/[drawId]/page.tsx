import { db, draws } from "@db";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

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

  return (
    <div>
      <h1>Draw</h1>
      <pre>{JSON.stringify(draw, null, 2)}</pre>
    </div>
  );
}
