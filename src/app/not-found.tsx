import Link from "next/link";
import { FileQuestion, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-background">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-muted-foreground mb-4">
        <FileQuestion className="h-8 w-8" />
      </div>
      <h1 className="text-3xl font-bold tracking-tight text-foreground">404</h1>
      <h2 className="text-lg font-semibold text-foreground mt-1">
        Halaman Tidak Ditemukan
      </h2>
      <p className="text-sm text-muted-foreground max-w-sm mt-2 mb-6">
        Halaman yang Anda tuju tidak tersedia atau telah dipindahkan.
      </p>
      <Link href="/dashboard">
        <Button className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali ke Dashboard</span>
        </Button>
      </Link>
    </div>
  );
}
