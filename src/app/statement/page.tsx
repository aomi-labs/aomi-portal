import type { Metadata } from "next";
import { StatementView } from "@/features/chat/components/statement-view";

export const metadata: Metadata = {
  title: "Usage statement · Aomi Portal",
};

export default function StatementPage() {
  return <StatementView />;
}
