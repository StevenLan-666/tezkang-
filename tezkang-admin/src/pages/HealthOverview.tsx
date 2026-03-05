/**
 * @description 健康数据概览 - 对比同一儿童最近3次评估的三维提升情况
 */
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface Child {
    id: string;
    full_name: string;
    age: number;
    gender: string;
}

interface AssessmentRecord {
    score: number;
    period: string;
    category: string;
}

const HealthOverview: React.FC = () => {
    const [children, setChildren] = useState<Child[]>([]);
    const [selectedChild, setSelectedChild] = useState<string>('');
    const [chartData, setChartData] = useState<{ period: string; 社交: number; 行为: number; 决策: number }[]>([]);
    const [loading, setLoading] = useState(true);
    const [healthScore, setHealthScore] = useState(0);

    // 加载所有儿童
    useEffect(() => {
        const fetch = async () => {
            const { data } = await supabase.from('children').select('id, full_name, age, gender');
            setChildren(data || []);
            if (data && data.length > 0) setSelectedChild(data[0].id);
            setLoading(false);
        };
        fetch();
    }, []);

    // 加载选中儿童的最近3次评估
    useEffect(() => {
        if (!selectedChild) return;
        const fetch = async () => {
            const [socialRes, behaviorRes, decisionRes, healthRes] = await Promise.all([
                supabase.from('assessments').select('score, period').eq('child_id', selectedChild).eq('category', 'social').order('recorded_at', { ascending: false }).limit(3),
                supabase.from('assessments').select('score, period').eq('child_id', selectedChild).eq('category', 'behavior').order('recorded_at', { ascending: false }).limit(3),
                supabase.from('assessments').select('score, period').eq('child_id', selectedChild).eq('category', 'decision').order('recorded_at', { ascending: false }).limit(3),
                supabase.from('health_scores').select('score').eq('child_id', selectedChild).order('recorded_at', { ascending: false }).limit(1),
            ]);

            setHealthScore(healthRes.data?.[0]?.score || 0);

            // 合并为图表数据：以 period 为 X 轴
            const socialData = (socialRes.data || []).reverse();
            const behaviorData = (behaviorRes.data || []).reverse();
            const decisionData = (decisionRes.data || []).reverse();

            const maxLen = Math.max(socialData.length, behaviorData.length, decisionData.length);
            const merged = [];
            for (let i = 0; i < maxLen; i++) {
                merged.push({
                    period: socialData[i]?.period || behaviorData[i]?.period || decisionData[i]?.period || `第${i + 1}次`,
                    社交: socialData[i]?.score || 0,
                    行为: behaviorData[i]?.score || 0,
                    决策: decisionData[i]?.score || 0,
                });
            }
            setChartData(merged);
        };
        fetch();
    }, [selectedChild]);

    const currentChild = children.find(c => c.id === selectedChild);

    return (
        <div className="space-y-6">
            {/* 儿童选择器 */}
            <div className="flex items-center gap-4">
                <label className="text-sm font-semibold text-slate-600">选择儿童：</label>
                <select
                    value={selectedChild}
                    onChange={e => setSelectedChild(e.target.value)}
                    className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 min-w-[200px]"
                >
                    {children.map(c => (
                        <option key={c.id} value={c.id}>{c.full_name} ({c.age}岁/{c.gender})</option>
                    ))}
                </select>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-16"><div className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin"></div></div>
            ) : (
                <>
                    {/* 儿童概览 */}
                    {currentChild && (
                        <div className="grid grid-cols-4 gap-4">
                            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                                <p className="text-xs text-slate-500 mb-1">姓名</p>
                                <p className="text-lg font-bold text-slate-800">{currentChild.full_name}</p>
                            </div>
                            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                                <p className="text-xs text-slate-500 mb-1">年龄/性别</p>
                                <p className="text-lg font-bold text-slate-800">{currentChild.age}岁 / {currentChild.gender}</p>
                            </div>
                            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                                <p className="text-xs text-slate-500 mb-1">健康指数</p>
                                <p className="text-lg font-bold text-primary-600">{healthScore || '-'}</p>
                            </div>
                            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                                <p className="text-xs text-slate-500 mb-1">评估次数</p>
                                <p className="text-lg font-bold text-slate-800">{chartData.length}</p>
                            </div>
                        </div>
                    )}

                    {/* 三维提升对比图 */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                        <h3 className="text-base font-bold text-slate-800 mb-1">最近 3 次评估三维对比</h3>
                        <p className="text-xs text-slate-400 mb-4">对比同一儿童不同时期的社交/行为/决策评分变化</p>
                        {chartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={320}>
                                <BarChart data={chartData} barGap={4}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                    <XAxis dataKey="period" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                                    <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} domain={[0, 100]} />
                                    <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
                                    <Legend iconType="circle" iconSize={8} />
                                    <Bar dataKey="社交" fill="#14B8A6" radius={[6, 6, 0, 0]} barSize={40} />
                                    <Bar dataKey="行为" fill="#3B82F6" radius={[6, 6, 0, 0]} barSize={40} />
                                    <Bar dataKey="决策" fill="#F59E0B" radius={[6, 6, 0, 0]} barSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="py-16 text-center text-sm text-slate-400">该儿童暂无评估数据</div>
                        )}
                    </div>

                    {/* 评分变化明细 */}
                    {chartData.length > 1 && (
                        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                            <h3 className="text-base font-bold text-slate-800 mb-4">评分变化趋势</h3>
                            <div className="grid grid-cols-3 gap-4">
                                {['社交', '行为', '决策'].map((dim, idx) => {
                                    const key = dim as '社交' | '行为' | '决策';
                                    const latest = chartData[chartData.length - 1][key];
                                    const prev = chartData[chartData.length - 2][key];
                                    const diff = latest - prev;
                                    const colors = [
                                        { bg: 'bg-primary-50', text: 'text-primary-700', bar: 'bg-primary-500' },
                                        { bg: 'bg-blue-50', text: 'text-blue-700', bar: 'bg-blue-500' },
                                        { bg: 'bg-amber-50', text: 'text-amber-700', bar: 'bg-amber-500' },
                                    ][idx];
                                    return (
                                        <div key={dim} className={`p-4 rounded-xl ${colors.bg}`}>
                                            <p className={`text-xs font-semibold ${colors.text} mb-2`}>{dim}能力</p>
                                            <div className="flex items-end gap-2">
                                                <span className={`text-2xl font-bold ${colors.text}`}>{latest}</span>
                                                <span className={`text-xs font-semibold mb-1 ${diff > 0 ? 'text-green-600' : diff < 0 ? 'text-red-500' : 'text-slate-400'}`}>
                                                    {diff > 0 ? `↑${diff}` : diff < 0 ? `↓${Math.abs(diff)}` : '—'}
                                                </span>
                                            </div>
                                            <div className="mt-2 h-1.5 bg-white/60 rounded-full overflow-hidden">
                                                <div className={`h-full rounded-full ${colors.bar}`} style={{ width: `${latest}%` }}></div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default HealthOverview;
