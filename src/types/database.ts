/**
 * Skema Database TamaWallet sesuai PRD Bagian 8.
 * Tipe data TypeScript ini merepresentasikan entitas basis data Supabase PostgreSQL.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type WalletType =
  | "bank"
  | "ewallet"
  | "cash"
  | "savings"
  | "mutual_fund"
  | "stock"
  | "crypto"
  | "other";

export type TransactionType = "income" | "expense" | "transfer";

export type VerificationStatus = "verified" | "unverified" | "disputed";

export type GoalStatus = "in_progress" | "achieved" | "archived";

export interface Profile {
  id: string;
  display_name: string | null;
  preferred_currency: string;
  timezone: string;
  created_at: string;
  updated_at: string;
}

export interface Wallet {
  id: string;
  user_id: string;
  name: string;
  type: WalletType;
  currency: string;
  opening_balance: number;
  archived_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  type: TransactionType;
  amount: number;
  transaction_date: string;
  category_id: string | null;
  wallet_id: string;
  transfer_group_id: string | null;
  description: string | null;
  source: string;
  verification_status: VerificationStatus;
  created_at: string;
  updated_at: string;
  archived_at: string | null;
}

export interface Category {
  id: string;
  user_id: string | null; // null jika kategori default sistem
  name: string;
  type: "income" | "expense";
  parent_id: string | null;
  created_at: string;
}

export interface TransactionEvidence {
  id: string;
  user_id: string;
  transaction_id: string;
  storage_path: string;
  file_type: string;
  created_at: string;
}

export interface BalanceSnapshot {
  id: string;
  user_id: string;
  wallet_id: string;
  actual_balance: number;
  recorded_at: string;
  source: string;
  notes: string | null;
}

export interface Goal {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  target_amount: number;
  deadline: string | null;
  priority: number;
  status: GoalStatus;
  created_at: string;
  updated_at: string;
}

export interface GoalAllocation {
  id: string;
  user_id: string;
  goal_id: string;
  wallet_id: string;
  amount: number;
  allocation_date: string;
  type: "allocate" | "deallocate";
  notes: string | null;
}

export interface FinancialPreference {
  id: string;
  user_id: string;
  preference_key: string;
  preference_value: Json;
  updated_at: string;
}

export interface AuditLog {
  id: string;
  user_id: string;
  entity_type: string;
  entity_id: string;
  action: "create" | "update" | "archive" | "reconcile";
  before_data: Json | null;
  after_data: Json | null;
  created_at: string;
}
