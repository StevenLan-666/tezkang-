/**
 * @description Supabase 客户端 - 后台管理系统使用 service_role key
 * service_role key 可以绕过 RLS 策略，读取所有数据
 * 注意：此 key 仅限服务端或信任环境使用，不可暴露给终端用户
 */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// 优先使用 service_role key（绕过 RLS），否则回退到 anon key
const supabaseKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY
    || import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase 配置缺失，请检查 .env 文件');
}

export const supabase = createClient(
    supabaseUrl || '',
    supabaseKey || '',
    {
        auth: {
            // 后台管理系统不需要自动刷新 token
            autoRefreshToken: false,
            persistSession: false,
        },
    }
);
