/**
 * @description 活动详情页面 - 从 DB 加载活动数据
 */
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface ActivityDetailProps {
  onBack: () => void;
  onRegister: () => void;
  title?: string;
}

// 默认占位图
const DEFAULT_IMAGE = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBWgXMCoejP-ji49PT_G4y_pHGMWgzucXvI-Dfg52VVmAGQfLoZoWgPyYzeem7tJK26t-lajTAtKWNe4MQUb2x06Hj2F9cUl6Erg-KGMtvl941P4324xD8bGo0TrJwZvRdvfh-ipNmYmI76nNKvlaCBH-3oMCryWuDSU3gTw5tbhssl6b_UsfOi1KoEbiIQKaL5OQvsaE4wj8oENafpGa_6KEerhbYY6ejkMGt5FWJAB9brFxtFbmh26BCg-gbkAO4WwyIyeFzH_sCs';

export default function ActivityDetail({ onBack, onRegister, title }: ActivityDetailProps) {
  const [showToast, setShowToast] = useState(false);
  const [activity, setActivity] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const currentTitle = title || '活动详情';

  useEffect(() => {
    const fetchActivity = async () => {
      const { data } = await supabase
        .from('activities')
        .select('*')
        .eq('title', currentTitle)
        .single();
      if (data) setActivity(data);
      setLoading(false);
    };
    fetchActivity();
  }, [currentTitle]);

  const handleShare = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  // 使用 DB 数据或降级默认值
  const displayImage = activity?.image_url || DEFAULT_IMAGE;
  const description = activity?.description || '';
  const location = activity?.location || '待确认';
  const eventDate = activity?.event_date || '';
  const price = activity?.price || 0;
  const category = activity?.category || '';
  const maxParticipants = activity?.max_participants || 30;
  const currentParticipants = activity?.current_participants || 0;

  // 根据 category 生成标签
  const tags = category ? category.split(',').map((t: string) => t.trim()).filter(Boolean) : ['活动'];

  if (loading) {
    return (
      <div className="bg-background-light dark:bg-background-dark min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-background-light dark:bg-background-dark text-text-main dark:text-white antialiased selection:bg-primary/20 selection:text-primary pb-28 min-h-screen w-full flex flex-col overflow-x-hidden">
      <div className="sticky top-0 z-50 flex items-center bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md p-4 justify-between border-b border-transparent transition-all duration-300">
        <button onClick={onBack} className="flex h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-surface-dark text-text-main dark:text-white hover:bg-gray-100 dark:hover:bg-slate-800 shadow-sm transition-colors border border-slate-200 dark:border-slate-700">
          <span className="material-symbols-outlined !text-[20px]">arrow_back_ios_new</span>
        </button>
        <h2 className="text-text-main dark:text-white text-lg font-bold tracking-tight opacity-90">活动详情</h2>
        <button onClick={handleShare} className="flex h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-surface-dark text-text-main dark:text-white hover:bg-gray-100 dark:hover:bg-slate-800 shadow-sm transition-colors border border-slate-200 dark:border-slate-700">
          <span className="material-symbols-outlined text-xl">share</span>
        </button>
      </div>

      {showToast && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-[100] bg-slate-800 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg animate-bounce">
          链接已复制到剪贴板
        </div>
      )}

      <div className="px-4 pt-2 pb-6">
        <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-sm group">
          <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url("${displayImage}")` }}>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent"></div>
          <div className="absolute top-4 right-4">
            <span className="bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm bg-opacity-90 tracking-wide flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">local_fire_department</span>
              {activity?.status === 'ended' ? '已结束' : '火热报名中'}
            </span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col gap-3">
            <div className="flex gap-2">
              {tags.map((tag: string) => (
                <span key={tag} className="bg-white/20 backdrop-blur-md text-white text-[10px] px-2 py-0.5 rounded border border-white/20 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[10px]">label</span>
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="text-white text-2xl font-bold leading-tight shadow-sm tracking-tight">{currentTitle}</h1>
            <div className="flex flex-col gap-1.5 mt-1">
              {eventDate && (
                <div className="flex items-center gap-2 text-slate-100 text-sm font-medium">
                  <span className="material-symbols-outlined text-lg opacity-90">calendar_month</span>
                  <span>{eventDate}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-slate-100 text-sm font-medium">
                <span className="material-symbols-outlined text-lg opacity-90">location_on</span>
                <span>{location}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-100 text-sm font-medium">
                <span className="material-symbols-outlined text-lg opacity-90">group</span>
                <span>{currentParticipants}/{maxParticipants} 人</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-background-light dark:bg-background-dark rounded-t-3xl -mt-4 relative z-10">
        <div className="px-5 py-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1.5 h-6 bg-primary rounded-full shadow-sm"></div>
            <h2 className="text-text-main dark:text-white text-lg font-bold">关于活动</h2>
          </div>
          <div className="bg-white dark:bg-surface-dark p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
            <p className="text-text-sub dark:text-slate-400 text-[15px] font-normal leading-7 text-justify">
              {description || '暂无活动描述'}
            </p>
            <div className="grid grid-cols-2 gap-3 mt-6">
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-teal-50 dark:bg-teal-900/20 border border-teal-100 dark:border-teal-900/50">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-white dark:bg-surface-dark text-primary shadow-sm shrink-0">
                  <span className="material-symbols-outlined text-xl">psychology</span>
                </div>
                <div>
                  <h3 className="font-bold text-text-main dark:text-white text-sm">专注力提升</h3>
                  <p className="text-xs text-text-sub dark:text-slate-400 mt-0.5">科学训练方法</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-teal-50 dark:bg-teal-900/20 border border-teal-100 dark:border-teal-900/50">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-white dark:bg-surface-dark text-primary shadow-sm shrink-0">
                  <span className="material-symbols-outlined text-xl">groups</span>
                </div>
                <div>
                  <h3 className="font-bold text-text-main dark:text-white text-sm">社交互动</h3>
                  <p className="text-xs text-text-sub dark:text-slate-400 mt-0.5">小班制教学</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-5 py-2">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-1.5 h-6 bg-primary rounded-full shadow-sm"></div>
            <h2 className="text-text-main dark:text-white text-lg font-bold">活动安排</h2>
          </div>
          <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="space-y-8 relative pl-2">
              <div className="absolute left-[7px] top-3 bottom-3 w-[2px] bg-slate-100 dark:bg-slate-700"></div>

              <div className="relative flex gap-5 group">
                <div className="z-10 mt-1.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-white dark:bg-surface-dark ring-4 ring-primary/20 shadow-sm">
                  <div className="h-2 w-2 rounded-full bg-primary"></div>
                </div>
                <div className="flex flex-col gap-1 w-full">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-base font-bold text-text-main dark:text-white">签到与破冰游戏</h3>
                    <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <span className="material-symbols-outlined text-[10px]">schedule</span>
                      09:00
                    </span>
                  </div>
                  <p className="text-sm text-text-sub dark:text-slate-400 leading-relaxed">领取活动物资，认识新朋友，建立初步的信任关系。</p>
                </div>
              </div>

              <div className="relative flex gap-5 group">
                <div className="z-10 mt-1.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-white dark:bg-surface-dark ring-4 ring-slate-100 dark:ring-slate-700 shadow-sm">
                  <div className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-500"></div>
                </div>
                <div className="flex flex-col gap-1 w-full">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-base font-bold text-text-main dark:text-white opacity-90">核心训练课程</h3>
                    <span className="text-xs font-medium text-text-sub dark:text-slate-400">09:30</span>
                  </div>
                  <p className="text-sm text-text-sub dark:text-slate-400 leading-relaxed">专业训练，激发运动潜能，提升核心能力。</p>
                </div>
              </div>

              <div className="relative flex gap-5 group">
                <div className="z-10 mt-1.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-white dark:bg-surface-dark ring-4 ring-slate-100 dark:ring-slate-700 shadow-sm">
                  <div className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-500"></div>
                </div>
                <div className="flex flex-col gap-1 w-full">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-base font-bold text-text-main dark:text-white opacity-90">互动游戏挑战</h3>
                    <span className="text-xs font-medium text-text-sub dark:text-slate-400">10:45</span>
                  </div>
                  <p className="text-sm text-text-sub dark:text-slate-400 leading-relaxed">趣味互动游戏，在玩乐中提升专注时长。</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-surface-dark/90 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800 shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.05)] pb-safe flex justify-center">
        <div className="w-full max-w-md px-5 py-3 flex items-center gap-6">
          <div className="flex flex-col">
            <span className="text-[11px] text-text-sub dark:text-slate-400 font-medium tracking-wide flex items-center gap-1">
              <span className="material-symbols-outlined text-[10px]">payments</span>
              报名费用
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm font-bold text-primary">¥</span>
              <span className="text-2xl font-bold text-text-main dark:text-white tracking-tight">{price || '免费'}</span>
            </div>
          </div>
          <button onClick={onRegister} className="flex-1 h-12 bg-primary hover:bg-primary-dark text-white rounded-full font-bold text-base shadow-lg shadow-primary/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group">
            <span>立即报名</span>
            <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
}
