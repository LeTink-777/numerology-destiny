import type { Metadata } from "next";
import ResultView from "@/components/ResultView";

export const metadata: Metadata = {
  title: "Ваш нумерологический портрет",
  robots: { index: false, follow: false },
};

export default function ResultPage() {
  return <ResultView />;
}
