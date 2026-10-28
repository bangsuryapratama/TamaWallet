import * as React from "react";
import { InsightsView } from "./insights-view";

export const metadata = {
  title: "Financial Insights & Intelligence | TamaWallet",
  description: "Analisis pola pengeluaran, rasio tabungan, dan skor kesehatan kas.",
};

export default function InsightsPage() {
  return <InsightsView />;
}
