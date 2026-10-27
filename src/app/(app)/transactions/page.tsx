import { ArrowLeftRight, Plus, Download, Upload } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function TransactionsPage() {
  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      <PageHeader
        title="Transaksi"
        description="Riwayat pemasukan, pengeluaran konsumsi, transfer antarrekening, serta bukti transaksi."
        badge={
          <Badge variant="outline" className="text-xs">
            Modul 2 & 3 Target
          </Badge>
        }
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled className="gap-1.5">
              <Upload className="h-3.5 w-3.5" />
              <span>Impor CSV</span>
            </Button>
            <Button variant="outline" size="sm" disabled className="gap-1.5">
              <Download className="h-3.5 w-3.5" />
              <span>Ekspor</span>
            </Button>
            <Button size="sm" disabled className="gap-1.5">
              <Plus className="h-3.5 w-3.5" />
              <span>Catat Transaksi</span>
            </Button>
          </div>
        }
      />

      <EmptyState
        icon={<ArrowLeftRight className="h-6 w-6" />}
        title="Belum Ada Transaksi Tercatat"
        description="Pencatatan transaksi manual, parsing bahasa alami AI, impor CSV, dan bukti mutasi akan aktif pada Modul 2 & 3."
        action={
          <p className="text-xs text-muted-foreground font-mono">
            Status: Menunggu Modul 1 (Auth & Database)
          </p>
        }
      />
    </div>
  );
}
