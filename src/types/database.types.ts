/**
 * @description Supabase 数据库类型定义
 * 对应 supabase-schema.sql 中的表结构
 */

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string;
                    full_name: string;
                    phone: string;
                    avatar_url: string;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id: string;
                    full_name?: string;
                    phone?: string;
                    avatar_url?: string;
                };
                Update: {
                    full_name?: string;
                    phone?: string;
                    avatar_url?: string;
                    updated_at?: string;
                };
            };
            children: {
                Row: {
                    id: string;
                    profile_id: string;
                    full_name: string;
                    age: number;
                    gender: string;
                    avatar_url: string;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    profile_id: string;
                    full_name: string;
                    age?: number;
                    gender?: string;
                    avatar_url?: string;
                };
                Update: {
                    full_name?: string;
                    age?: number;
                    gender?: string;
                    avatar_url?: string;
                    updated_at?: string;
                };
            };
            physical_data: {
                Row: {
                    id: string;
                    child_id: string;
                    weight: number;
                    height: number;
                    bmi: number | null;
                    recorded_at: string;
                };
                Insert: {
                    id?: string;
                    child_id: string;
                    weight: number;
                    height: number;
                    bmi?: number | null;
                };
                Update: {
                    weight?: number;
                    height?: number;
                    bmi?: number | null;
                };
            };
            health_scores: {
                Row: {
                    id: string;
                    child_id: string;
                    score: number;
                    improvement: string;
                    grade: string;
                    heart_rate: number;
                    activity_minutes: number;
                    recorded_at: string;
                };
                Insert: {
                    id?: string;
                    child_id: string;
                    score: number;
                    improvement?: string;
                    grade?: string;
                    heart_rate?: number;
                    activity_minutes?: number;
                };
                Update: {
                    score?: number;
                    improvement?: string;
                    grade?: string;
                    heart_rate?: number;
                    activity_minutes?: number;
                };
            };
            assessments: {
                Row: {
                    id: string;
                    child_id: string;
                    category: string;
                    score: number;
                    improvement: string;
                    period: string;
                    recorded_at: string;
                };
                Insert: {
                    id?: string;
                    child_id: string;
                    category: string;
                    score: number;
                    improvement?: string;
                    period: string;
                };
                Update: {
                    score?: number;
                    improvement?: string;
                };
            };
            assessment_details: {
                Row: {
                    id: string;
                    assessment_id: string;
                    dimension_name: string;
                    dimension_value: string;
                    sort_order: number;
                };
                Insert: {
                    id?: string;
                    assessment_id: string;
                    dimension_name: string;
                    dimension_value: string;
                    sort_order?: number;
                };
                Update: {
                    dimension_value?: string;
                    sort_order?: number;
                };
            };
            activities: {
                Row: {
                    id: string;
                    title: string;
                    description: string;
                    image_url: string;
                    location: string;
                    event_date: string;
                    max_participants: number;
                    current_participants: number;
                    price: number;
                    status: string;
                    category: string;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    title: string;
                    description?: string;
                    image_url?: string;
                    location?: string;
                    event_date?: string;
                    max_participants?: number;
                    current_participants?: number;
                    price?: number;
                    status?: string;
                    category?: string;
                };
                Update: {
                    title?: string;
                    description?: string;
                    status?: string;
                    current_participants?: number;
                };
            };
            services: {
                Row: {
                    id: string;
                    title: string;
                    description: string;
                    image_url: string;
                    provider_name: string;
                    provider_title: string;
                    duration: string;
                    rating: number;
                    mode: string;
                    price: number;
                    status: string;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    title: string;
                    description?: string;
                    image_url?: string;
                    provider_name?: string;
                    provider_title?: string;
                    duration?: string;
                    rating?: number;
                    mode?: string;
                    price?: number;
                    status?: string;
                };
                Update: {
                    title?: string;
                    description?: string;
                    status?: string;
                    rating?: number;
                };
            };
            registrations: {
                Row: {
                    id: string;
                    profile_id: string;
                    child_id: string;
                    item_type: string;
                    item_id: string;
                    item_title: string;
                    child_name: string;
                    child_age: number;
                    child_gender: string;
                    health_notes: string;
                    selected_date: string;
                    selected_time: string;
                    parent_name: string;
                    parent_phone: string;
                    status: string;
                    completed_at: string | null;
                    satisfaction_score: number;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    profile_id: string;
                    child_id: string;
                    item_type: string;
                    item_id?: string;
                    item_title: string;
                    child_name?: string;
                    child_age?: number;
                    child_gender?: string;
                    health_notes?: string;
                    selected_date?: string;
                    selected_time?: string;
                    parent_name?: string;
                    parent_phone?: string;
                    status?: string;
                    completed_at?: string;
                    satisfaction_score?: number;
                };
                Update: {
                    status?: string;
                };
            };
            appointments: {
                Row: {
                    id: string;
                    profile_id: string;
                    title: string;
                    appointment_date: string;
                    appointment_time: string;
                    item_type: string;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    profile_id: string;
                    title: string;
                    appointment_date: string;
                    appointment_time: string;
                    item_type: string;
                };
                Update: {
                    title?: string;
                    appointment_date?: string;
                    appointment_time?: string;
                };
            };
            feedback: {
                Row: {
                    id: string;
                    profile_id: string;
                    activity_id: string | null;
                    registration_id: string | null;
                    activity_title: string;
                    feedback_type: string;
                    description: string;
                    allow_contact: boolean;
                    status: string;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    profile_id: string;
                    activity_id?: string;
                    registration_id?: string;
                    activity_title?: string;
                    feedback_type: string;
                    description: string;
                    allow_contact?: boolean;
                    status?: string;
                };
                Update: {
                    status?: string;
                    activity_title?: string;
                };
            };
            history_records: {
                Row: {
                    id: string;
                    child_id: string;
                    title: string;
                    record_type: string;
                    record_date: string;
                    description: string;
                    status: string;
                    status_color: string;
                    category: string;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    child_id: string;
                    title: string;
                    record_type: string;
                    record_date: string;
                    description?: string;
                    status?: string;
                    status_color?: string;
                    category: string;
                };
                Update: {
                    description?: string;
                    status?: string;
                    status_color?: string;
                };
            };
            activity_reports: {
                Row: {
                    id: string;
                    activity_id: string;
                    actual_participants: number;
                    avg_duration_minutes: number;
                    completion_rate: number;
                    satisfaction_score: number;
                    social_before: number;
                    social_after: number;
                    behavior_before: number;
                    behavior_after: number;
                    decision_before: number;
                    decision_after: number;
                    focus_before: number;
                    focus_after: number;
                    summary: string;
                    highlights: string;
                    recommendations: string;
                    report_date: string;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    activity_id: string;
                    actual_participants: number;
                    avg_duration_minutes?: number;
                    completion_rate?: number;
                    satisfaction_score?: number;
                    social_before?: number;
                    social_after?: number;
                    behavior_before?: number;
                    behavior_after?: number;
                    decision_before?: number;
                    decision_after?: number;
                    focus_before?: number;
                    focus_after?: number;
                    summary?: string;
                    highlights?: string;
                    recommendations?: string;
                };
                Update: {
                    actual_participants?: number;
                    avg_duration_minutes?: number;
                    completion_rate?: number;
                    satisfaction_score?: number;
                    summary?: string;
                    highlights?: string;
                    recommendations?: string;
                };
            };
            activity_report_details: {
                Row: {
                    id: string;
                    report_id: string;
                    child_id: string;
                    registration_id: string | null;
                    actual_duration_minutes: number;
                    completed: boolean;
                    social_improvement: number;
                    behavior_improvement: number;
                    decision_improvement: number;
                    focus_improvement: number;
                    teacher_comment: string;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    report_id: string;
                    child_id: string;
                    registration_id?: string;
                    actual_duration_minutes?: number;
                    completed?: boolean;
                    social_improvement?: number;
                    behavior_improvement?: number;
                    decision_improvement?: number;
                    focus_improvement?: number;
                    teacher_comment?: string;
                };
                Update: {
                    actual_duration_minutes?: number;
                    completed?: boolean;
                    social_improvement?: number;
                    behavior_improvement?: number;
                    decision_improvement?: number;
                    focus_improvement?: number;
                    teacher_comment?: string;
                };
            };
        };
    };
}
