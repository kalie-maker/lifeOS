import { notFound } from "next/navigation";
import { SpaceDetailScreen } from "@/components/spaces/SpaceDetailScreen";
import { SPACES, spaceBySlug } from "@/lib/spaces";

export function generateStaticParams() {
  return SPACES.map((s) => ({ slug: s.slug }));
}

export const dynamicParams = false;

export default async function SpacePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const space = spaceBySlug(slug);
  if (!space) notFound();
  return <SpaceDetailScreen space={space} />;
}
