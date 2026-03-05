/**
 * @description 排班管理页面
 * 日历视图（全部人员排班）+ 列表视图（按人员筛选）
 */
import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabase';

interface ScheduleRecord {
    id: string;
    staff_name: string;
    schedule_date: string;
    schedule_time: string;
    child_name: string;
    item_title: string;
    status: string;
    created_at: string;
}

const STATUS_STYLE: Record<string, string> = {
    booked: 'bg-primary-100 text-primary-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-600',
};
const STATUS_TEXT: Record<string, string> = { booked: '已预约', completed: '已完成', cancelled: '已取消' };

const ScheduleList: React.FC = () => {
    const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
    const [providers, setProviders] = useState<string[]>([]);
    const [selectedProvider, setSelectedProvider] = useState('');
    const [allRecords, setAllRecords] = useState<ScheduleRecord[]>([]);
    const [filteredRecords, setFilteredRecords] = useState<ScheduleRecord[]>([]);
    const [loading, setLoading] = useState(true);

    // 日历状态
    const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
    const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth()); // 0-indexed

    // 加载所有服务人员
    useEffect(() => {
        const fetch = async () => {
            const { data } = await supabase.from('services').select('provider_name');
            if (data) {
                const unique = [...new Set(data.map((d: { provider_name: string }) => d.provider_name).filter(Boolean))];
                setProviders(unique);
                if (unique.length > 0) setSelectedProvider(unique[0]);
            }
        };
        fetch();
    }, []);

    // 加载全部排班记录（日历视图使用）
    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true);
            const { data } = await supabase
                .from('staff_schedule')
                .select('*')
                .order('schedule_date', { ascending: true });
            setAllRecords(data || []);
            setLoading(false);
        };
        fetchAll();
    }, []);

    // 按人员筛选排班（列表视图使用）
    useEffect(() => {
        if (!selectedProvider) return;
        const fetchByProvider = async () => {
            const { data } = await supabase
                .from('staff_schedule')
                .select('*')
                .eq('staff_name', selectedProvider)
                .order('schedule_date', { ascending: true });
            setFilteredRecords(data || []);
        };
        fetchByProvider();
    }, [selectedProvider]);

    // 日历工具函数
    const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
    const firstDayOfWeek = new Date(calendarYear, calendarMonth, 1).getDay(); // 0=周日
    const monthLabel = `${calendarYear}年 ${calendarMonth + 1}月`;
    const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

    // 按日期分组排班
    const recordsByDate = useMemo(() => {
        const map: Record<string, ScheduleRecord[]> = {};
        allRecords.forEach(r => {
            const dateKey = r.schedule_date;
            if (!map[dateKey]) map[dateKey] = [];
            map[dateKey].push(r);
        });
        return map;
    }, [allRecords]);

    const prevMonth = () => {
        if (calendarMonth === 0) { setCalendarYear(y => y - 1); setCalendarMonth(11); }
        else setCalendarMonth(m => m - 1);
    };
    const nextMonth = () => {
        if (calendarMonth === 11) { setCalendarYear(y => y + 1); setCalendarMonth(0); }
        else setCalendarMonth(m => m + 1);
    };

    // 生成日历格子
    const calendarCells = useMemo(() => {
        const cells: { day: number; dateStr: string; isCurrentMonth: boolean }[] = [];

        // 上月填充
        for (let i = 0; i < firstDayOfWeek; i++) {
            cells.push({ day: 0, dateStr: '', isCurrentMonth: false });
        }

        // 当月
        for (let d = 1; d <= daysInMonth; d++) {
            const mm = String(calendarMonth + 1).padStart(2, '0');
            const dd = String(d).padStart(2, '0');
            cells.push({ day: d, dateStr: `${calendarYear}-${mm}-${dd}`, isCurrentMonth: true });
        }

        return cells;
    }, [calendarYear, calendarMonth, daysInMonth, firstDayOfWeek]);

    // 给不同人员分配颜色
    const staffColors = useMemo(() => {
        const palette = [
            'bg-primary-50 border-primary-200 text-primary-700',
            'bg-purple-50 border-purple-200 text-purple-700',
            'bg-amber-50 border-amber-200 text-amber-700',
            'bg-teal-50 border-teal-200 text-teal-700',
            'bg-pink-50 border-pink-200 text-pink-700',
            'bg-cyan-50 border-cyan-200 text-cyan-700',
        ];
        const map: Record<string, string> = {};
        const uniqueStaff = [...new Set(allRecords.map(r => r.staff_name))];
        uniqueStaff.forEach((name, i) => { map[name] = palette[i % palette.length]; });
        return map;
    }, [allRecords]);

    return (
        <div className="space-y-6">
            {/* 视图切换 Tab */}
            <div className="flex items-center justify-between">
                <div className="flex bg-slate-100 rounded-xl p-1">
                    <button
                        onClick={() => setViewMode('calendar')}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${viewMode === 'calendar' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <span className="material-symbols-outlined !text-[16px]">calendar_month</span>日历视图
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${viewMode === 'list' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <span className="material-symbols-outlined !text-[16px]">list</span>列表视图
                    </button>
                </div>
                <div className="flex items-center gap-6 text-xs text-slate-500">
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-primary-100"></div>已预约</div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-green-100"></div>已完成</div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-red-100"></div>已取消</div>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-16"><div className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin"></div></div>
            ) : viewMode === 'calendar' ? (
                /* ===== 日历视图 ===== */
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    {/* 月份导航 */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                        <button onClick={prevMonth} className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-slate-100 flex items-center justify-center transition-colors">
                            <span className="material-symbols-outlined !text-[18px] text-slate-600">chevron_left</span>
                        </button>
                        <h3 className="text-sm font-bold text-slate-800">{monthLabel}</h3>
                        <button onClick={nextMonth} className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-slate-100 flex items-center justify-center transition-colors">
                            <span className="material-symbols-outlined !text-[18px] text-slate-600">chevron_right</span>
                        </button>
                    </div>

                    {/* 星期表头 */}
                    <div className="grid grid-cols-7 border-b border-slate-100">
                        {weekDays.map(d => (
                            <div key={d} className="py-2.5 text-center text-[11px] font-bold text-slate-400 uppercase">{d}</div>
                        ))}
                    </div>

                    {/* 日历格子 */}
                    <div className="grid grid-cols-7">
                        {calendarCells.map((cell, idx) => {
                            const events = cell.dateStr ? (recordsByDate[cell.dateStr] || []) : [];
                            const isToday = cell.dateStr === new Date().toISOString().slice(0, 10);
                            return (
                                <div
                                    key={idx}
                                    className={`min-h-[120px] border-b border-r border-slate-50 p-1.5 ${!cell.isCurrentMonth ? 'bg-slate-50/30' : ''} ${isToday ? 'bg-primary-50/30' : ''}`}
                                >
                                    {cell.isCurrentMonth && (
                                        <>
                                            <div className={`text-[11px] font-bold mb-1 px-1 ${isToday ? 'text-primary-600' : 'text-slate-500'}`}>
                                                {cell.day}
                                                {isToday && <span className="ml-1 text-[9px] text-primary-500">今天</span>}
                                            </div>
                                            <div className="space-y-0.5">
                                                {events.slice(0, 3).map(evt => (
                                                    <div
                                                        key={evt.id}
                                                        className={`px-1.5 py-1 rounded-md text-[10px] leading-tight border ${staffColors[evt.staff_name] || 'bg-slate-50 border-slate-200 text-slate-600'}`}
                                                    >
                                                        <div className="font-bold truncate">{evt.item_title}</div>
                                                        <div className="flex items-center justify-between mt-0.5">
                                                            <span className="opacity-70 truncate">{evt.staff_name}</span>
                                                            <span className={`shrink-0 px-1 py-px rounded text-[8px] font-bold ${STATUS_STYLE[evt.status] || 'bg-slate-100 text-slate-500'}`}>
                                                                {STATUS_TEXT[evt.status] || evt.status}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                                {events.length > 3 && (
                                                    <div className="text-[9px] text-slate-400 font-medium px-1">+{events.length - 3} 更多</div>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                /* ===== 列表视图 ===== */
                <>
                    <div className="flex items-center gap-4">
                        <label className="text-sm font-semibold text-slate-600">选择人员：</label>
                        <select value={selectedProvider} onChange={e => setSelectedProvider(e.target.value)} className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 min-w-[180px]">
                            {providers.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                        <div className="text-sm text-slate-500">共 <span className="font-bold text-slate-800">{filteredRecords.filter(r => r.status === 'booked').length}</span> 个预约</div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        {filteredRecords.length === 0 ? (
                            <div className="py-16 text-center text-sm text-slate-400">
                                <span className="material-symbols-outlined !text-[40px] text-slate-200 block mb-2">event_busy</span>
                                该人员暂无排班记录
                            </div>
                        ) : (
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-slate-50/80">
                                        <th className="text-left py-3 px-5 text-xs font-semibold text-slate-500 uppercase">日期</th>
                                        <th className="text-left py-3 px-5 text-xs font-semibold text-slate-500 uppercase">时间</th>
                                        <th className="text-left py-3 px-5 text-xs font-semibold text-slate-500 uppercase">服务项目</th>
                                        <th className="text-left py-3 px-5 text-xs font-semibold text-slate-500 uppercase">儿童</th>
                                        <th className="text-left py-3 px-5 text-xs font-semibold text-slate-500 uppercase">状态</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredRecords.map(r => (
                                        <tr key={r.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                                            <td className="py-3 px-5 text-sm font-medium text-slate-800">{r.schedule_date}</td>
                                            <td className="py-3 px-5 text-sm text-slate-600">{r.schedule_time}</td>
                                            <td className="py-3 px-5 text-sm text-slate-700">{r.item_title}</td>
                                            <td className="py-3 px-5 text-sm text-slate-600">{r.child_name}</td>
                                            <td className="py-3 px-5">
                                                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${STATUS_STYLE[r.status] || 'bg-slate-100 text-slate-600'}`}>
                                                    {STATUS_TEXT[r.status] || r.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default ScheduleList;
