import type { Metadata } from "next";
import ChallengePage from "@/components/ChallengePage";
import { examById, SITE } from "@/config/site";

const exam = examById("toefl")!;

export const metadata: Metadata = {
  title: `${exam.pageTitle} | VerbalVaultPrep`,
  description: exam.pageDescription,
  alternates: { canonical: `${SITE.url}${exam.href}` },
};

export default function ToeflWeeklyChallengePage() {
  return <ChallengePage examId="toefl" />;
}
