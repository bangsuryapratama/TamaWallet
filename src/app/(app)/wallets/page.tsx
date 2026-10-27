import { WalletCards, Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function WalletsPage() {
  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      <PageHeader
        title="Wallet & Akun"
        description="Kelola seluruh rekening bank, dompet digital, kas tunai, dan portofolio investasi."
        badge={
          <Badge variant="outline" className="text-xs">
            Modul 2 Target
          </Badge>
        }
        actions={
          <Button disabled className="gap-2">
            <Plus className="h-4 w-4" />
            <span>Tambah Wallet</span>
          </Button>
        }
      />

      <EmptyState
        icon={<WalletCards className="h-6 w-6" />}
        title="Belum Ada Wallet Terdaftar"
        description="Fitur pengelolaan multi-wallet, penambahan saldo awal, dan pencatatan transfer akan aktif pada Modul 2 (Wallet & Ledger) setelah autentikasi dan database siap."
        action={
          <p className="text-xs text-muted-foreground font-mono">
            Status: Menunggu Modul 1 (Auth & Database)
          </p>
        }
      />
    </div>
  );
}
