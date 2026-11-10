import type { Metadata } from "next";
import ChallengePage from "@/components/ChallengePage";
import { examById, SITE } from "@/config/site";

const exam = examById("sat")!;

export const metadata: Metadata = {
  title: `${exam.pageTitle} | VerbalVaultPrep`,
  description: exam.pageDescription,
  alternates: { canonical: `${SITE.url}${exam.href}` },
};

export default function SatWeeklyChallengePage() {
  return <ChallengePage examId="sat" />;
}
