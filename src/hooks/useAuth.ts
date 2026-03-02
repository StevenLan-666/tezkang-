/**
 * @description 认证 Hook
 * 账号(邮箱) + 密码 登录/注册
 * 未注册账户输入时自动注册（auto-confirm 需在 Supabase Dashboard 关闭邮箱确认）
 * 找回密码通过邮箱
 */
import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

interface AuthState {
    user: User | null;
    session: Session | null;
    loading: boolean;
}

export const useAuth = () => {
    const [authState, setAuthState] = useState<AuthState>({
        user: null,
        session: null,
        loading: isSupabaseConfigured,
    });

    useEffect(() => {
        if (!isSupabaseConfigured) return;

        const timeout = setTimeout(() => {
            setAuthState(prev => {
                if (prev.loading) {
                    console.warn('[Auth] 认证检查超时，降级为未登录状态');
                    return { user: null, session: null, loading: false };
                }
                return prev;
            });
        }, 5000);

        supabase.auth.getSession()
            .then(({ data: { session } }) => {
                clearTimeout(timeout);
                setAuthState({
                    user: session?.user ?? null,
                    session,
                    loading: false,
                });
            })
            .catch((err) => {
                clearTimeout(timeout);
                console.warn('[Auth] 获取会话失败:', err);
                setAuthState({ user: null, session: null, loading: false });
            });

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setAuthState({
                    user: session?.user ?? null,
                    session,
                    loading: false,
                });
            }
        );

        return () => {
            clearTimeout(timeout);
            subscription.unsubscribe();
        };
    }, []);

    /**
     * 使用邮箱 + 密码登录
     * 如果账户不存在，自动注册
     * @param account - 邮箱地址（测试阶段可用任意格式如 test@test.com）
     * @param password - 密码（至少6位）
     */
    const signIn = useCallback(async (account: string, password: string) => {
        if (!isSupabaseConfigured) throw new Error('Supabase 未配置，请检查 .env 文件');

        const email = account.includes('@') ? account : `${account}@tezkang.local`;

        // 先尝试登录
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            const msg = error.message || '';

            // 账号不存在 → 自动注册
            if (msg.includes('Invalid login credentials') || msg.includes('invalid_credentials')) {
                const signUpResult = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        // 设置不需要邮箱确认（需要在 Supabase Dashboard 同时关闭邮箱确认）
                        data: { auto_registered: true },
                    },
                });

                if (signUpResult.error) {
                    throw new Error(`自动注册失败: ${signUpResult.error.message}`);
                }

                // 检查是否需要邮箱确认
                if (signUpResult.data.user && !signUpResult.data.session) {
                    // 注册成功但没有 session，说明需要邮箱确认
                    // 尝试直接用密码登录一次（如果 Supabase 设置了 auto-confirm）
                    const retryLogin = await supabase.auth.signInWithPassword({ email, password });
                    if (retryLogin.error) {
                        throw new Error('注册成功！请在 Supabase Dashboard → Authentication → Email 中关闭 "Confirm email" 选项，以便测试阶段无需邮箱验证即可登录。');
                    }
                    return retryLogin.data;
                }

                return signUpResult.data;
            }

            // 邮箱未确认
            if (msg.includes('Email not confirmed') || msg.includes('email_not_confirmed')) {
                throw new Error('该账号需要邮箱验证才能登录。请在 Supabase Dashboard → Authentication → Email 中关闭 "Confirm email" 选项。');
            }

            throw error;
        }

        return data;
    }, []);

    /**
     * 使用邮箱 + 密码注册
     * @param account - 邮箱地址
     * @param password - 密码
     */
    const signUp = useCallback(async (account: string, password: string) => {
        if (!isSupabaseConfigured) throw new Error('Supabase 未配置，请检查 .env 文件');

        const email = account.includes('@') ? account : `${account}@tezkang.local`;

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });
        if (error) throw error;

        // 如果返回了 session，直接登录成功
        if (data.session) return data;

        // 没有 session 说明需要邮箱确认，尝试直接登录
        const retryLogin = await supabase.auth.signInWithPassword({ email, password });
        if (retryLogin.error) {
            throw new Error('注册成功，但需要关闭邮箱确认才能直接登录。请在 Supabase Dashboard → Authentication → Email 中关闭 "Confirm email"。');
        }
        return retryLogin.data;
    }, []);

    /**
     * 通过邮箱找回密码
     * @param email - 绑定的邮箱地址
     */
    const resetPassword = useCallback(async (email: string) => {
        if (!isSupabaseConfigured) throw new Error('Supabase 未配置，请检查 .env 文件');

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}`,
        });
        if (error) throw error;
    }, []);

    /**
     * 登出
     */
    const signOut = useCallback(async () => {
        if (!isSupabaseConfigured) return;
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    }, []);

    return {
        user: authState.user,
        session: authState.session,
        loading: authState.loading,
        isAuthenticated: !!authState.session,
        signIn,
        signUp,
        resetPassword,
        signOut,
    };
};
