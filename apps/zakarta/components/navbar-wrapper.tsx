"use client";

import { useRouter } from "next/navigation";
import { Navbar } from "@repo/ui/components/navbar";
import { authClient } from "@/lib/auth-client";

const NAV_LINKS = [
  { href: "/", label: "Properties" },
];

export function NavbarWrapper() {
  const { data: session } = authClient.useSession();
  const router = useRouter();

  const user = session?.user
    ? {
        name: session.user.name,
        email: session.user.email,
        image: session.user.image ?? null,
      }
    : null;

  async function handleSignOut() {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <Navbar
      user={user}
      links={NAV_LINKS}
      onSignOut={handleSignOut}
      appName="Zakarta"
    />
  );
}
