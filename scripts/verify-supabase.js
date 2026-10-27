// Skrip Verifikasi Database Supabase TamaWallet
// Jalankan dengan: node scripts/verify-supabase.js

const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

const envPath = path.resolve(__dirname, "../.env.local");
if (!fs.existsSync(envPath)) {
  console.error("❌ File .env.local tidak ditemukan.");
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, "utf8");
const env = {};
envContent.split("\n").forEach((line) => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    let value = match[2] || "";
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    env[match[1]] = value;
  }
});

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key =
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY || env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!url || !key) {
  console.error("❌ Variabel Supabase URL atau Kunci belum lengkap di .env.local");
  process.exit(1);
}

const supabase = createClient(url, key);

async function verify() {
  console.log("🔍 Memeriksa koneksi ke Supabase:", url);

  // 1. Verifikasi Auth
  const { data: authData, error: authError } = await supabase.auth.getSession();
  if (authError) {
    console.error("❌ Gagal menghubungi Supabase Auth:", authError.message);
  } else {
    console.log("✅ Supabase Auth: Aktif & Terhubung.");
  }

  // 2. Verifikasi Tabel Categories
  const { data: catData, error: catError } = await supabase
    .from("categories")
    .select("name, type")
    .limit(5);

  if (catError) {
    if (catError.code === "PGRST205") {
      console.log(
        "⏳ Tabel database belum dibuat. Silakan salin & jalankan 'supabase/migrations/20261027_001_initial_schema.sql' di Supabase SQL Editor."
      );
    } else {
      console.log("⚠️ Respons tabel categories:", catError.message);
    }
  } else {
    console.log(
      `✅ Tabel 'categories' ditemukan! Berisi ${catData.length} sampel kategori bawaan.`
    );
  }
}

verify();
