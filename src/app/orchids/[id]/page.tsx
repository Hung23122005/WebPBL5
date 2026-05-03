import OrchidDetailClient from "@/components/orchid/OrchidDetailClient";

export default async function OrchidDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <OrchidDetailClient id={id} />;
}
