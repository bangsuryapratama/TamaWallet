-- TamaWallet Demo Seed Data (Terpisah dari alur produksi)
-- Sesuai PRD Bagian 11 Modul 1: "Seed data demonstrasi yang terpisah dari data pengguna"
-- File ini HANYA dijalankan untuk demonstrasi pengujian lokal/staging jika diinginkan.

-- CATATAN: Ganti '00000000-0000-0000-0000-000000000001' dengan UUID akun demo yang valid jika ingin mengaktifkan data ini.
DO $$
DECLARE
  demo_user_id UUID := '00000000-0000-0000-0000-000000000001'::uuid;
  wallet_bca UUID;
  wallet_cash UUID;
  cat_gaji UUID;
  cat_makan UUID;
BEGIN
  -- Hanya jalankan jika user demo ada
  IF EXISTS (SELECT 1 FROM auth.users WHERE id = demo_user_id) THEN
    -- Seed Wallets
    INSERT INTO public.wallets (id, user_id, name, type, currency, opening_balance)
    VALUES 
      (uuid_generate_v4(), demo_user_id, 'BCA Utama', 'bank', 'IDR', 5000000),
      (uuid_generate_v4(), demo_user_id, 'Dompet Tunai', 'cash', 'IDR', 350000)
    RETURNING id INTO wallet_bca;

    -- Seed Goals
    INSERT INTO public.goals (user_id, name, description, target_amount, deadline, priority, status)
    VALUES
      (demo_user_id, 'Dana Darurat 3 Bulan', 'Simpanan cadangan likuid', 15000000, CURRENT_DATE + INTERVAL '180 days', 1, 'in_progress');
  END IF;
END $$;
