/**
 * @description 健康数据 Hook
 * 获取健康指数、体格数据、评估分数等
 */
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/database.types';

type PhysicalData = Database['public']['Tables']['physical_data']['Row'];
type HealthScore = Database['public']['Tables']['health_scores']['Row'];
type Assessment = Database['public']['Tables']['assessments']['Row'];
type AssessmentDetail = Database['public']['Tables']['assessment_details']['Row'];
type HistoryRecord = Database['public']['Tables']['history_records']['Row'];

interface HealthDataState {
    physicalData: PhysicalData | null;
    healthScore: HealthScore | null;
    loading: boolean;
    error: string | null;
}

/**
 * 获取指定儿童的最新体格数据和健康指数
 * @param childId - 儿童 ID
 */
export const useHealthData = (childId: string | null) => {
    const [state, setState] = useState<HealthDataState>({
        physicalData: null,
        healthScore: null,
        loading: true,
        error: null,
    });

    const fetchData = useCallback(async () => {
        if (!childId) {
            setState(prev => ({ ...prev, loading: false }));
            return;
        }

        try {
            setState(prev => ({ ...prev, loading: true, error: null }));

            // 获取最新体格数据
            const { data: physical, error: physErr } = await supabase
                .from('physical_data')
                .select('*')
                .eq('child_id', childId)
                .order('recorded_at', { ascending: false })
                .limit(1)
                .single();

            // 获取最新健康指数
            const { data: health, error: healthErr } = await supabase
                .from('health_scores')
                .select('*')
                .eq('child_id', childId)
                .order('recorded_at', { ascending: false })
                .limit(1)
                .single();

            setState({
                physicalData: physErr?.code === 'PGRST116' ? null : physical,
                healthScore: healthErr?.code === 'PGRST116' ? null : health,
                loading: false,
                error: null,
            });
        } catch (err) {
            const message = err instanceof Error ? err.message : '获取健康数据失败';
            setState(prev => ({ ...prev, loading: false, error: message }));
        }
    }, [childId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    /**
     * 更新体格数据
     */
    const updatePhysicalData = useCallback(async (
        data: { weight: number; height: number }
    ) => {
        if (!childId) throw new Error('未选择儿童');

        const bmi = parseFloat((data.weight / ((data.height / 100) ** 2)).toFixed(1));

        const { error } = await supabase.from('physical_data').insert({
            child_id: childId,
            weight: data.weight,
            height: data.height,
            bmi,
        });

        if (error) throw error;
        await fetchData();
    }, [childId, fetchData]);

    return { ...state, updatePhysicalData, refetch: fetchData };
};

/**
 * 获取指定维度的评估数据
 * @param childId - 儿童 ID
 * @param category - 评估维度 ('social' | 'behavior' | 'decision')
 */
export const useAssessments = (childId: string | null, category: string) => {
    const [assessments, setAssessments] = useState<(Assessment & { details: AssessmentDetail[] })[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAssessments = useCallback(async () => {
        if (!childId) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const { data, error: err } = await supabase
                .from('assessments')
                .select('*, assessment_details(*)')
                .eq('child_id', childId)
                .eq('category', category)
                .order('recorded_at', { ascending: false });

            if (err) throw err;

            // Supabase 返回 assessment_details 作为嵌套字段
            const mapped = (data || []).map((item: Record<string, unknown>) => ({
                ...(item as Assessment),
                details: ((item as Record<string, unknown>).assessment_details || []) as AssessmentDetail[],
            }));

            setAssessments(mapped);
            setLoading(false);
        } catch (err) {
            const message = err instanceof Error ? err.message : '获取评估数据失败';
            setError(message);
            setLoading(false);
        }
    }, [childId, category]);

    useEffect(() => {
        fetchAssessments();
    }, [fetchAssessments]);

    return { assessments, loading, error, refetch: fetchAssessments };
};

/**
 * 获取历史记录
 * @param childId - 儿童 ID
 * @param category - 可选，过滤分类
 */
export const useHistoryRecords = (childId: string | null, category?: string) => {
    const [records, setRecords] = useState<HistoryRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchRecords = useCallback(async () => {
        if (!childId) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            let query = supabase
                .from('history_records')
                .select('*')
                .eq('child_id', childId)
                .order('created_at', { ascending: false });

            if (category) {
                query = query.eq('category', category);
            }

            const { data, error: err } = await query;
            if (err) throw err;

            setRecords(data || []);
            setLoading(false);
        } catch (err) {
            const message = err instanceof Error ? err.message : '获取历史记录失败';
            setError(message);
            setLoading(false);
        }
    }, [childId, category]);

    useEffect(() => {
        fetchRecords();
    }, [fetchRecords]);

    return { records, loading, error, refetch: fetchRecords };
};
