/**
 * @description 用户/儿童档案 Hook
 * 获取当前用户的监护人信息和儿童信息
 */
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];
type Child = Database['public']['Tables']['children']['Row'];

interface ProfileState {
    profile: Profile | null;
    children: Child[];
    /** 默认选中的第一个孩子 */
    activeChild: Child | null;
    loading: boolean;
    error: string | null;
}

export const useProfile = () => {
    const [state, setState] = useState<ProfileState>({
        profile: null,
        children: [],
        activeChild: null,
        loading: true,
        error: null,
    });

    const fetchProfile = useCallback(async () => {
        try {
            setState(prev => ({ ...prev, loading: true, error: null }));

            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                setState(prev => ({ ...prev, loading: false }));
                return;
            }

            // 获取用户档案
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (profileError && profileError.code !== 'PGRST116') {
                throw profileError;
            }

            // 获取儿童信息
            const { data: children, error: childrenError } = await supabase
                .from('children')
                .select('*')
                .eq('profile_id', user.id)
                .order('created_at', { ascending: true });

            if (childrenError) throw childrenError;

            setState({
                profile: profile || null,
                children: children || [],
                activeChild: children?.[0] || null,
                loading: false,
                error: null,
            });
        } catch (err) {
            const message = err instanceof Error ? err.message : '获取档案失败';
            setState(prev => ({ ...prev, loading: false, error: message }));
        }
    }, []);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    /**
     * 更新监护人信息
     */
    const updateProfile = useCallback(async (updates: Database['public']['Tables']['profiles']['Update']) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('未登录');

        const { error } = await supabase
            .from('profiles')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('id', user.id);

        if (error) throw error;
        await fetchProfile();
    }, [fetchProfile]);

    /**
     * 添加儿童
     */
    const addChild = useCallback(async (child: Database['public']['Tables']['children']['Insert']) => {
        const { error } = await supabase.from('children').insert(child);
        if (error) throw error;
        await fetchProfile();
    }, [fetchProfile]);

    return {
        ...state,
        updateProfile,
        addChild,
        refetch: fetchProfile,
    };
};
