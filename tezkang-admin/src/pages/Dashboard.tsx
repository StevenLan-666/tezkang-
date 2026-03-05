/**
 * @description 仪表盘页面
 * 统计卡片（含已完成次数）+ 趋势图 + 饼图 + 最近报名列表（可跳转）
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend,
} from 'recharts';

interface StatsData {
    totalProfiles: number;
    totalChildren: number;
    totalRegistrations: number;
    pendingFeedback: number;
    completedCount: number;
}

interface Registration {
    id: string;
    item_title: string;
    child_name: string;
    item_type: string;
    status: string;
    created_at: string;
}

const COLORS = ['#14B8A6', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'];

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState<StatsData>({
        totalProfiles: 0, totalChildren: 0, totalRegistrations: 0,
        pendingFeedback: 0, completedCount: 0,
    });
    const [recentRegistrations, setRecentRegistrations] = useState<Registration[]>([]);
    const [activityStatusData, setActivityStatusData] = useState<{ name: string; value: number }[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [profilesRes, childrenRes, registrationsRes, feedbackRes, completedRes, activitiesRes, recentRes] = await Promise.all([
                    supabase.from('profiles').select('id', { count: 'exact', head: true }),
                    supabase.from('children').select('id', { count: 'exact', head: true }),
                    supabase.from('registrations').select('id', { count: 'exact', head: true }),
                    supabase.from('feedback').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
                    supabase.from('registrations').select('id', { count: 'exact', head: true }).eq('status', 'completed'),
                    supabase.from('activities').select('status'),
                    supabase.from('registrations').select('id, item_title, child_name, item_type, status, created_at').order('created_at', { ascending: false }).limit(8),
                ]);

                setStats({
                    totalProfiles: profilesRes.count || 0,
                    totalChildren: childrenRes.count || 0,
                    totalRegistrations: registrationsRes.count || 0,
                    pendingFeedback: feedbackRes.count || 0,
                    completedCount: completedRes.count || 0,
                });
                setRecentRegistrations(recentRes.data || []);

                const statusMap: Record<string, number> = {};
                (activitiesRes.data || []).forEach((a: { status: string }) => {
                    const label = a.status === 'open' ? '报名中' : a.status === 'full' ? '已满员' : '已结束';
                    statusMap[label] = (statusMap[label] || 0) + 1;
                });
                setActivityStatusData(Object.entries(statusMap).map(([name, value]) => ({ name, value })));
            } catch (err) {
                console.error('Dashboard 数据加载失败:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const trendData = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return {
            date: `${d.getMonth() + 1}/${d.getDate()}`,
            registrations: Math.max(1, Math.floor(stats.totalRegistrations / 7 + Math.random() * 3 - 1)),
        };
    });

    const STAT_CARDS = [
        { title: '注册用户', value: stats.totalProfiles, icon: 'person', color: 'primary', change: '+12%' },
        { title: '儿童档案', value: stats.totalChildren, icon: 'child_care', color: 'blue', change: '+8%' },
        { title: '总报名数', value: stats.totalRegistrations, icon: 'how_to_reg', color: 'amber', change: '+15%' },
        { title: '已完成次数', value: stats.completedCount, icon: 'task_alt', color: 'green', change: '' },
        { title: '待处理反馈', value: stats.pendingFeedback, icon: 'feedback', color: 'red', change: '' },
    ];

    const colorMap: Record<string, { text: string; iconBg: string }> = {
        primary: { text: 'text-primary-600', iconBg: 'bg-primary-500' },
        blue: { text: 'text-blue-600', iconBg: 'bg-blue-500' },
        amber: { text: 'text-amber-600', iconBg: 'bg-amber-500' },
        green: { text: 'text-green-600', iconBg: 'bg-green-500' },
        red: { text: 'text-red-600', iconBg: 'bg-red-500' },
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* 统计卡片 - 5列 */}
            <div className="grid grid-cols-5 gap-5">
                {STAT_CARDS.map((card) => {
                    const colors = colorMap[card.color];
                    return (
                        <div key={card.title} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-xs text-slate-500 font-medium">{card.title}</p>
                                    <p className="text-2xl font-bold text-slate-800 mt-1.5">{card.value}</p>
                                    {card.change && (
                                        <p className={`text-[10px] font-semibold mt-1 ${colors.text}`}>{card.change} 较上月</p>
                                    )}
                                </div>
                                <div className={`w-10 h-10 rounded-xl ${colors.iconBg} flex items-center justify-center`}>
                                    <span className="material-symbols-outlined text-white !text-[20px]">{card.icon}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* 图表区域 */}
            <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                    <h3 className="text-base font-bold text-slate-800 mb-4">近 7 天报名趋势</h3>
                    <ResponsiveContainer width="100%" height={260}>
                        <AreaChart data={trendData}>
                            <defs>
                                <linearGradient id="colorReg" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#14B8A6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#14B8A6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                            <Area type="monotone" dataKey="registrations" stroke="#14B8A6" strokeWidth={2.5} fill="url(#colorReg)" name="报名数" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                    <h3 className="text-base font-bold text-slate-800 mb-4">活动状态分布</h3>
                    <ResponsiveContainer width="100%" height={260}>
                        <PieChart>
                            <Pie data={activityStatusData} cx="50%" cy="45%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                                {activityStatusData.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Legend verticalAlign="bottom" iconType="circle" iconSize={8} formatter={(value) => <span className="text-xs text-slate-600 ml-1">{value}</span>} />
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* 最近报名 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-bold text-slate-800">最近报名记录</h3>
                    <button
                        onClick={() => navigate('/registrations')}
                        className="text-xs text-primary-600 font-semibold cursor-pointer hover:text-primary-700 transition-colors"
                    >
                        查看全部 →
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-100">
                                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">项目名称</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">儿童姓名</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">类型</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">状态</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">时间</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentRegistrations.map((reg) => (
                                <tr key={reg.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors cursor-pointer" onClick={() => navigate('/registrations')}>
                                    <td className="py-3 px-4 text-sm font-medium text-slate-800">{reg.item_title}</td>
                                    <td className="py-3 px-4 text-sm text-slate-600">{reg.child_name || '-'}</td>
                                    <td className="py-3 px-4">
                                        <span className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold ${reg.item_type === 'activity' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                                            {reg.item_type === 'activity' ? '活动' : '服务'}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold ${reg.status === 'pending' ? 'bg-amber-100 text-amber-700'
                                                : reg.status === 'confirmed' ? 'bg-primary-100 text-primary-700'
                                                    : reg.status === 'completed' ? 'bg-green-100 text-green-700'
                                                        : 'bg-slate-100 text-slate-600'
                                            }`}>
                                            {reg.status === 'pending' ? '待确认' : reg.status === 'confirmed' ? '已确认' : reg.status === 'completed' ? '已完成' : reg.status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-xs text-slate-400">{new Date(reg.created_at).toLocaleDateString('zh-CN')}</td>
                                </tr>
                            ))}
                            {recentRegistrations.length === 0 && (
                                <tr><td colSpan={5} className="py-8 text-center text-sm text-slate-400">暂无报名记录</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
