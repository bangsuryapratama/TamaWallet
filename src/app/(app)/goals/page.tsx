import { Target, Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function GoalsPage() {
  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      <PageHeader
        title="Goals Finansial"
        description="Tetapkan target keuangan, pantau progres alokasi, dan simulasikan kebutuhan kontribusi rutin."
        badge={
          <Badge variant="outline" className="text-xs">
            Modul 4 Target
          </Badge>
        }
        actions={
          <Button disabled className="gap-2">
            <Plus className="h-4 w-4" />
            <span>Buat Goal Baru</span>
          </Button>
        }
      />

      <EmptyState
        icon={<Target className="h-6 w-6" />}
        title="Belum Ada Target Finansial"
        description="Fitur pembuatan goal, penetapan tenggat, dan alokasi dana independen tanpa menduplikasi aset akan aktif pada Modul 4."
        action={
          <p className="text-xs text-muted-foreground font-mono">
            Status: Menunggu Modul 1 (Auth & Database)
          </p>
        }
      />
    </div>
  );
}
