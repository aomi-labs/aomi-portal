import type { Metadata } from "next";
import { StatementView } from "@/features/chat/components/statement-view";

export const metadata: Metadata = {
  title: "Usage statement — Aomi",
};

export default function StatementPage() {
  return <StatementView />;
}
