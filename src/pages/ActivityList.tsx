import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useHistoryRecords } from '../hooks/useHealthData';
import { supabase } from '../lib/supabase';

interface ActivityListProps {
  onBack: () => void;
  onOpenDetail: (title: string) => void;
  onOpenDetailReport?: (title: string) => void;
  onOpenFeedback?: () => void;
  registrations?: any[];
  initialFilter?: string;
  childId?: string | null;
  profileId?: string | null;
  refetchRegistrations?: (reg: any) => Promise<void>;
}

export default function ActivityList({ onBack, onOpenDetail, onOpenDetailReport, onOpenFeedback, registrations = [], initialFilter, childId, profileId, refetchRegistrations }: ActivityListProps) {
  const [activeFilter, setActiveFilter] = useState(initialFilter || '全部');
  const [loadingComplete, setLoadingComplete] = useState<string | null>(null);

  useEffect(() => {
    setActiveFilter(initialFilter || '全部');
  }, [initialFilter]);

  const filters = ['全部', '已报名', '已完成', '已结束'];

  // 从数据库加载活动
  const [dbActivities, setDbActivities] = useState<any[]>([]);
  const [dbLoading, setDbLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      const { data, error } = await supabase.from('activities').select('*').order('created_at', { ascending: false });
      if (error) console.error('加载活动失败:', error);
      if (data) setDbActivities(data);
      setDbLoading(false);
    };
    fetchActivities();
  }, []);

  const handleCompleteActivity = async (item: any) => {
    try {
      setLoadingComplete(item.id);

      // @ts-ignore
      const { error: updateErr } = await supabase
        .from('registrations')
        .update({ status: 'completed', completed_at: new Date().toISOString() })
        .eq('id', item.registrationId);

      if (updateErr) throw updateErr;

      // 因为数据库的 Trigger `on_registration_completed` 已经接管了写入 history_records 和 assessments 操作
      // 这里只需要更新状态即可，无需重复写入

      await refetchRegistrations?.(null);
      alert('已模拟签到完成该活动，各项记录已生成！');
    } catch (e) {
      console.error(e);
      alert('模拟完成失败');
    } finally {
      setLoadingComplete(null);
    }
  };

  // 将 DB 数据映射为列表卡片格式
  const baseActivities = dbActivities.map(a => {
    let displayStatus = '正在报名';
    let registrationId = null;

    const reg = registrations.find(r => r.item_title === a.title);
    if (reg) {
      registrationId = reg.id;
      displayStatus = reg.status === 'completed' ? '已完成' : '已报名';
    }

    // 如果没完成且活动已经截止，则标记为“已结束”（表示不能再报名或参与了）
    if (displayStatus !== '已完成' && (a.status === 'closed' || a.status === 'ended')) {
      displayStatus = '已结束';
    }

    return {
      id: a.id,
      title: a.title,
      desc: a.description || '',
      date: a.event_date || a.start_date || '',
      registrationId,
      status: displayStatus,
      image: a.image_url || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBWgXMCoejP-ji49PT_G4y_pHGMWgzucXvI-Dfg52VVmAGQfLoZoWgPyYzeem7tJK26t-lajTAtKWNe4MQUb2x06Hj2F9cUl6Erg-KGMtvl941P4324xD8bGo0TrJwZvRdvfh-ipNmYmI76nNKvlaCBH-3oMCryWuDSU3gTw5tbhssl6b_UsfOi1KoEbiIQKaL5OQvsaE4wj8oENafpGa_6KEerhbYY6ejkMGt5FWJAB9brFxtFbmh26BCg-gbkAO4WwyIyeFzH_sCs',
      participants: `${a.current_participants || 0}/${a.max_participants || 30}`,
    };
  });

  const activities = baseActivities;

  const filteredActivities = activeFilter === '全部'
    ? activities
    : activities.filter(a => {
      if (activeFilter === '已报名') return a.status === '已报名';
      if (activeFilter === '已完成') return a.status === '已完成';
      if (activeFilter === '已结束') return a.status === '已结束';
      return true;
    });

  return (
    <div className="bg-background-light dark:bg-background-dark text-text-main dark:text-white min-h-screen flex flex-col antialiased">
      <div className="px-6 py-3 flex justify-between items-center text-xs font-semibold text-text-main dark:text-slate-300 opacity-90">
        <span>10:24</span>
        <div className="flex gap-1.5 items-center">
          <span className="material-symbols-outlined text-sm">signal_cellular_alt</span>
          <span className="material-symbols-outlined text-sm">wifi</span>
          <span className="material-symbols-outlined text-sm">battery_full</span>
        </div>
      </div>

      <header className="px-6 py-4 flex items-center relative justify-center bg-background-light dark:bg-background-dark sticky top-0 z-30">
        <button onClick={onBack} className="absolute left-6 w-10 h-10 rounded-full bg-white dark:bg-surface-dark shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-center text-text-main dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors z-10">
          <span className="material-symbols-outlined !text-[20px]">arrow_back_ios_new</span>
        </button>
        <h1 className="text-lg font-bold text-text-main dark:text-white">活动列表</h1>
      </header>

      <div className="px-5 py-2">
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {filters.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${activeFilter === filter
                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                : 'bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 text-text-sub dark:text-slate-400 hover:border-primary hover:text-primary'
                }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <main className="flex-1 overflow-y-auto px-5 pt-4 pb-24 space-y-6">
        {filteredActivities.map((activity) => (
          <div
            key={activity.id}
            className={`bg-surface-light dark:bg-surface-dark rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden group cursor-pointer transform hover:scale-[1.01] transition-all duration-300 ${activity.status === '已结束' ? 'opacity-75 hover:opacity-100' : ''}`}
          >
            <div className={`h-44 w-full bg-slate-200 dark:bg-slate-700 relative ${activity.status === '已结束' ? 'grayscale' : ''}`}>
              <img alt={activity.title} className="w-full h-full object-cover" src={activity.image} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

              {activity.status === '正在报名' && (
                <div className="absolute top-4 left-4 bg-emerald-500/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg backdrop-blur-md shadow-sm">
                  正在报名
                </div>
              )}
              {activity.status === '已报名' && (
                <div className="absolute top-4 left-4 bg-blue-500/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg backdrop-blur-md shadow-sm">
                  已报名
                </div>
              )}
              {activity.status === '已参与' && (
                <div className="absolute top-4 left-4 bg-sky-500/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg backdrop-blur-md shadow-sm">
                  已参与
                </div>
              )}
              {activity.status === '已结束' && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center backdrop-blur-[1px]">
                  <span className="text-white text-xs font-bold border border-white/40 px-2 py-1 rounded">已结束</span>
                </div>
              )}

              <div className="absolute bottom-4 right-4 bg-black/40 text-white text-[10px] px-2.5 py-1 rounded-lg backdrop-blur-md flex items-center gap-1.5 border border-white/10">
                <span className="material-symbols-outlined text-[12px]">group</span> {activity.participants}
              </div>
            </div>
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-base font-bold text-text-main dark:text-white leading-snug">{activity.title}</h3>
              </div>
              <p className="text-xs text-text-sub dark:text-slate-400 mb-4 line-clamp-2 leading-relaxed">
                {activity.desc}
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-slate-50 dark:border-slate-800">
                <div className="flex items-center gap-2 text-xs text-text-sub dark:text-slate-400 font-medium">
                  <span className="material-symbols-outlined text-[18px] text-primary">calendar_today</span>
                  <span>{activity.date}</span>
                </div>

                {activity.status === '正在报名' && (
                  <button onClick={() => onOpenDetail(activity.title)} className="bg-primary hover:bg-primary-dark text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-primary/20 transition-colors">
                    立即报名
                  </button>
                )}
                {activity.status === '已报名' && (
                  <div className="flex gap-2">
                    {loadingComplete === activity.id ? (
                      <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mt-1"></div>
                    ) : (
                      <button onClick={(e) => { e.stopPropagation(); handleCompleteActivity(activity); }} className="text-[11px] font-bold text-white bg-primary-500 hover:bg-primary-600 px-3 py-1.5 rounded-lg active:scale-95 transition-all">
                        模拟签到
                      </button>
                    )}
                    <button className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-semibold px-5 py-2.5 rounded-xl transition-colors cursor-default">
                      等待开始
                    </button>
                  </div>
                )}
                {activity.status === '已完成' && (
                  <div className="flex gap-2">
                    <button onClick={(e) => { e.stopPropagation(); onOpenDetailReport?.(activity.title); }} className="text-[11px] font-bold text-primary dark:text-primary-400 bg-primary/10 dark:bg-primary/20 px-3 py-1.5 rounded-lg active:scale-95 transition-all">
                      查看详情
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); onOpenFeedback?.(); }} className="bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold px-4 py-1.5 rounded-lg transition-colors flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">rate_review</span>
                      反馈
                    </button>
                  </div>
                )}
                {activity.status === '已结束' && (
                  <div className="flex gap-2">
                    <button className="text-slate-400 dark:text-slate-500 text-xs font-semibold px-3 py-1.5 cursor-default">
                      回顾
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); onOpenFeedback?.(); }} className="bg-primary/10 hover:bg-primary/20 text-primary text-xs font-semibold px-4 py-1.5 rounded-lg transition-colors flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">rate_review</span>
                      反馈
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
