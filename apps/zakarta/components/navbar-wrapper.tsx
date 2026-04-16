"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@repo/ui/components/navbar";
import { authClient } from "@/lib/auth-client";
import { AuthModal } from "@/components/auth-modal";

const NAV_LINKS = [
  { href: "/", label: "Properties" },
];

// const SELL_RENT_PATH = "/properties/new";
const SELL_RENT_PATH = "/CreatePropertyForm";

export function NavbarWrapper() {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const [authModalOpen, setAuthModalOpen] = useState(false);

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

  function handleSellRent() {
    if (session?.user) {
      router.push(SELL_RENT_PATH);
    } else {
      setAuthModalOpen(true);
    }
  }

  function handleAuthSuccess() {
    setAuthModalOpen(false);
    router.push(SELL_RENT_PATH);
    router.refresh();
  }

  return (
    <>
      <Navbar
        user={user}
        links={NAV_LINKS}
        onSignOut={handleSignOut}
        onSellRent={handleSellRent}
        appName="Zakarta"
      />
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
        defaultTab="sign-in"
      />
    </>
  );
}
