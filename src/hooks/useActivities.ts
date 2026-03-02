/**
 * @description 活动/服务 Hook
 * 获取活动和服务列表，管理报名、预约
 */
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/database.types';

type Activity = Database['public']['Tables']['activities']['Row'];
type Service = Database['public']['Tables']['services']['Row'];
type Registration = Database['public']['Tables']['registrations']['Row'];
type Appointment = Database['public']['Tables']['appointments']['Row'];

/**
 * 获取活动列表
 */
export const useActivities = () => {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchActivities = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const { data, error: err } = await supabase
                .from('activities')
                .select('*')
                .order('event_date', { ascending: false });

            if (err) throw err;
            setActivities(data || []);
        } catch (err) {
            const message = err instanceof Error ? err.message : '获取活动列表失败';
            setError(message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchActivities();
    }, [fetchActivities]);

    return { activities, loading, error, refetch: fetchActivities };
};

/**
 * 获取服务列表
 */
export const useServices = () => {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchServices = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const { data, error: err } = await supabase
                .from('services')
                .select('*')
                .order('created_at', { ascending: false });

            if (err) throw err;
            setServices(data || []);
        } catch (err) {
            const message = err instanceof Error ? err.message : '获取服务列表失败';
            setError(message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchServices();
    }, [fetchServices]);

    return { services, loading, error, refetch: fetchServices };
};

/**
 * 获取用户已报名的记录
 */
export const useRegistrations = () => {
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchRegistrations = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                setLoading(false);
                return;
            }

            const { data, error: err } = await supabase
                .from('registrations')
                .select('*')
                .eq('profile_id', user.id)
                .order('created_at', { ascending: false });

            if (err) throw err;
            setRegistrations(data || []);
        } catch (err) {
            const message = err instanceof Error ? err.message : '获取报名记录失败';
            setError(message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRegistrations();
    }, [fetchRegistrations]);

    /**
     * 提交报名
     */
    const submitRegistration = useCallback(async (
        registration: Database['public']['Tables']['registrations']['Insert']
    ) => {
        const { error } = await supabase.from('registrations').insert(registration);
        if (error) throw error;
        await fetchRegistrations();
    }, [fetchRegistrations]);

    /**
     * 检查是否已报名某项目
     */
    const isRegistered = useCallback((itemTitle: string) => {
        return registrations.some(r => r.item_title === itemTitle);
    }, [registrations]);

    return {
        registrations,
        loading,
        error,
        submitRegistration,
        isRegistered,
        refetch: fetchRegistrations,
    };
};

/**
 * 获取用户预约信息
 */
export const useAppointments = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [nextAppointment, setNextAppointment] = useState<Appointment | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchAppointments = useCallback(async () => {
        try {
            setLoading(true);

            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                setLoading(false);
                return;
            }

            const { data, error } = await supabase
                .from('appointments')
                .select('*')
                .eq('profile_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;

            setAppointments(data || []);
            setNextAppointment(data?.[0] || null);
        } catch {
            // 静默处理
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAppointments();
    }, [fetchAppointments]);

    /**
     * 创建新预约
     */
    const createAppointment = useCallback(async (
        appointment: Database['public']['Tables']['appointments']['Insert']
    ) => {
        const { error } = await supabase.from('appointments').insert(appointment);
        if (error) throw error;
        await fetchAppointments();
    }, [fetchAppointments]);

    return {
        appointments,
        nextAppointment,
        loading,
        createAppointment,
        refetch: fetchAppointments,
    };
};

/**
 * 提交反馈 Hook
 */
export const useFeedback = () => {
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const submitFeedback = useCallback(async (data: {
        feedbackType: string;
        description: string;
        allowContact: boolean;
    }) => {
        try {
            setSubmitting(true);
            setError(null);

            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('未登录');

            const { error: err } = await supabase.from('feedback').insert({
                profile_id: user.id,
                feedback_type: data.feedbackType,
                description: data.description,
                allow_contact: data.allowContact,
            });

            if (err) throw err;
        } catch (err) {
            const message = err instanceof Error ? err.message : '提交反馈失败';
            setError(message);
            throw err;
        } finally {
            setSubmitting(false);
        }
    }, []);

    return { submitFeedback, submitting, error };
};
