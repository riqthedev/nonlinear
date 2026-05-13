import { AppShell } from "@/components/AppShell";
import { DemoBanner } from "@/components/DemoBanner";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppShell>
      <DemoBanner />
      {children}
    </AppShell>
  );
}
