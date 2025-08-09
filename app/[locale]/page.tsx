import ClientComponent from "./ClientComponent";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function Page({ params }: { params: { locale: string } }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const resolvedParams = await params;

  return <ClientComponent session={session} locale={resolvedParams.locale} />;
}
