import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  async function handleSignOut() {
    "use server";
    await auth.api.signOut({
      headers: await headers()
    });
    redirect("/login");
  }

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      Home
      <div className="text-center">
        {session ? (
          <>
            <p>Welcome, {session.user?.name || session.user?.email}!</p>
            <form action={handleSignOut}>
              <Button type="submit">Sign Out</Button>
            </form>
          </>
        ) : (
          <Button asChild>
            <Link href="/login">Sign In</Link>
          </Button>
        )}
      </div>
    </div>
  );
}
