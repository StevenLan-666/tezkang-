/**
 * @description 用户详情页面 - 展示监护人信息、关联儿童、报名历史和健康数据
 */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface UserProfile {
    id: string;
    full_name: string;
    phone: string;
    created_at: string;
}

interface Child {
    id: string;
    full_name: string;
    age: number;
    gender: string;
}

interface Registration {
    id: string;
    item_title: string;
    item_type: string;
    status: string;
    created_at: string;
}

const UserDetail: React.FC = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [children, setChildren] = useState<Child[]>([]);
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId) return;
        const fetch = async () => {
            const [profileRes, childrenRes, regRes] = await Promise.all([
                supabase.from('profiles').select('*').eq('id', userId).single(),
                supabase.from('children').select('*').eq('profile_id', userId),
                supabase.from('registrations').select('id, item_title, item_type, status, created_at').eq('profile_id', userId).order('created_at', { ascending: false }),
            ]);
            setProfile(profileRes.data);
            setChildren(childrenRes.data || []);
            setRegistrations(regRes.data || []);
            setLoading(false);
        };
        fetch();
    }, [userId]);

    if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin"></div></div>;
    if (!profile) return <div className="text-center py-16 text-sm text-slate-400">用户不存在</div>;

    const statusText: Record<string, string> = { pending: '待确认', confirmed: '已确认', completed: '已完成', cancelled: '已取消' };
    const statusStyle: Record<string, string> = { pending: 'bg-amber-100 text-amber-700', confirmed: 'bg-primary-100 text-primary-700', completed: 'bg-green-100 text-green-700', cancelled: 'bg-red-100 text-red-600' };

    return (
        <div className="space-y-6">
            {/* 返回 */}
            <button onClick={() => navigate('/users')} className="flex items-center gap-1 text-sm text-slate-500 hover:text-primary-600 transition-colors">
                <span className="material-symbols-outlined !text-[18px]">arrow_back</span>返回用户列表
            </button>

            {/* 基本信息 */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-2xl bg-primary-100 flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary-600 !text-[32px]">person</span>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">{profile.full_name || '未设置'}</h2>
                        <p className="text-sm text-slate-500 mt-1">手机：{profile.phone || '-'}</p>
                        <p className="text-xs text-slate-400 mt-0.5">注册时间：{new Date(profile.created_at).toLocaleDateString('zh-CN')}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
                {/* 儿童档案 */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <h3 className="text-base font-bold text-slate-800 mb-4">儿童档案</h3>
                    {children.length === 0 ? (
                        <p className="text-sm text-slate-400">暂无儿童档案</p>
                    ) : (
                        <div className="space-y-3">
                            {children.map(c => (
                                <div key={c.id} className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl">
                                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-blue-600 !text-[20px]">child_care</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-800">{c.full_name}</p>
                                        <p className="text-xs text-slate-400">{c.age}岁 · {c.gender}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* 报名历史 */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <h3 className="text-base font-bold text-slate-800 mb-4">报名历史 ({registrations.length})</h3>
                    {registrations.length === 0 ? (
                        <p className="text-sm text-slate-400">暂无报名记录</p>
                    ) : (
                        <div className="space-y-2 max-h-80 overflow-y-auto">
                            {registrations.map(r => (
                                <div key={r.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                                    <div>
                                        <p className="text-sm font-medium text-slate-700">{r.item_title}</p>
                                        <p className="text-xs text-slate-400">{new Date(r.created_at).toLocaleDateString('zh-CN')}</p>
                                    </div>
                                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${statusStyle[r.status] || 'bg-slate-100 text-slate-600'}`}>
                                        {statusText[r.status] || r.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserDetail;
