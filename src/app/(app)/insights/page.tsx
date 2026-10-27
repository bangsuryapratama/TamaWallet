import { TrendingUp, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";

export default function InsightsPage() {
  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      <PageHeader
        title="Insight Finansial"
        description="Analisis pola pengeluaran, tren bulanan, rasio tabungan, dan evaluasi berbasis data aktual."
        badge={
          <Badge variant="outline" className="text-xs">
            Modul 5 Target
          </Badge>
        }
      />

      <EmptyState
        icon={<TrendingUp className="h-6 w-6" />}
        title="Insight Belum Tersedia"
        description="Sesuai prinsip PRD, insight finansial hanya dihitung secara deterministik dari riwayat transaksi aktual dan pembanding yang valid. Modul 5 akan memproses laporan setelah data transaksi tersedia."
        action={
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span>Tanpa halusinasi AI atau angka estimasi palsu</span>
          </div>
        }
      />
    </div>
  );
}
