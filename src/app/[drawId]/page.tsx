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
  });

  if (!draw) notFound();

  return <div>{params.drawId}</div>;
}
