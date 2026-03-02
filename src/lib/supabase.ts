/**
 * @description Supabase 客户端初始化
 * 从 Vite 环境变量读取配置
 * 在环境变量缺失时导出 configured = false，供 hooks 判断
 */
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

/** Supabase 是否已正确配置 */
export const isSupabaseConfigured = !!(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://your-project.supabase.co' &&
  supabaseAnonKey !== 'your-anon-key'
);

if (!isSupabaseConfigured) {
  console.warn(
    '[Supabase] 环境变量未配置或为默认值，应用将以离线模式运行。请在 .env 中设置 VITE_SUPABASE_URL 和 VITE_SUPABASE_ANON_KEY'
  );
}

export const supabase = createClient<Database>(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);
