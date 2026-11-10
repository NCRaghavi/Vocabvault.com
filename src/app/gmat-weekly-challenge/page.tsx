import type { Metadata } from "next";
import ChallengePage from "@/components/ChallengePage";
import { examById } from "@/config/site";

const exam = examById("gmat")!;

export const metadata: Metadata = {
  title: `${exam.pageTitle} | VerbalVaultPrep`,
  description: exam.pageDescription,
  alternates: { canonical: `https://verbalvaultprep.com${exam.href}` },
};

export default function GmatWeeklyChallengePage() {
  return <ChallengePage examId="gmat" />;
}
