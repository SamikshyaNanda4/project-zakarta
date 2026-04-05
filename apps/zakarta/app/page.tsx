import { Button } from "@repo/ui/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-24">
      <h1 className="text-4xl font-bold">Zakarta</h1>
      <p className="text-muted-foreground">Welcome to the Zakarta frontend</p>
      <Button>Get Started</Button>
    </main>
  );
}
