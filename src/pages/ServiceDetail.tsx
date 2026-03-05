/**
 * @description 服务详情页面 - 从 DB 加载服务数据（含服务人员信息）
 */
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface ServiceDetailProps {
  onBack: () => void;
  onRegister: () => void;
  title?: string;
}

// 默认占位图
const DEFAULT_IMAGE = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBWgXMCoejP-ji49PT_G4y_pHGMWgzucXvI-Dfg52VVmAGQfLoZoWgPyYzeem7tJK26t-lajTAtKWNe4MQUb2x06Hj2F9cUl6Erg-KGMtvl941P4324xD8bGo0TrJwZvRdvfh-ipNmYmI76nNKvlaCBH-3oMCryWuDSU3gTw5tbhssl6b_UsfOi1KoEbiIQKaL5OQvsaE4wj8oENafpGa_6KEerhbYY6ejkMGt5FWJAB9brFxtFbmh26BCg-gbkAO4WwyIyeFzH_sCs';

interface ServiceData {
  title: string;
  description: string;
  image_url: string;
  provider_name: string;
  provider_title: string;
  duration: string;
  mode: string;
  price: number;
  rating: number;
  staff_id: string | null;
}

interface StaffInfo {
  full_name: string;
  title: string;
  bio: string;
  years_of_experience: number;
  specialty: string[];
}

export default function ServiceDetail({ onBack, onRegister, title }: ServiceDetailProps) {
  const [showToast, setShowToast] = useState(false);
  const [service, setService] = useState<ServiceData | null>(null);
  const [staffInfo, setStaffInfo] = useState<StaffInfo | null>(null);
  const [loading, setLoading] = useState(true);

  const currentTitle = title || '服务详情';

  useEffect(() => {
    const fetchService = async () => {
      // 通过 title 查找服务
      const { data } = await supabase
        .from('services')
        .select('*')
        .eq('title', currentTitle)
        .single();

      if (data) {
        setService(data);
        // 如果有关联 staff_id，获取人员详情
        if (data.staff_id) {
          const { data: staff } = await supabase
            .from('staff')
            .select('full_name, title, bio, years_of_experience, specialty')
            .eq('id', data.staff_id)
            .single();
          if (staff) setStaffInfo(staff);
        }
      }
      setLoading(false);
    };
    fetchService();
  }, [currentTitle]);

  const handleShare = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  // 获取展示用数据（优先用 DB，降级用默认值）
  const displayImage = service?.image_url || DEFAULT_IMAGE;
  const expertName = staffInfo?.full_name || service?.provider_name || '专家';
  const expertTitle = staffInfo?.title || service?.provider_title || '';
  const expertBio = staffInfo?.bio || `从事相关领域工作${staffInfo?.years_of_experience || 0}年，为儿童提供专业的${currentTitle}服务。`;
  const description = service?.description || '';
  const price = service?.price || 0;
  const rating = service?.rating || 4.5;

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
        <h2 className="text-text-main dark:text-white text-lg font-bold tracking-tight opacity-90">服务详情</h2>
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
            <span className="bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm bg-opacity-90 tracking-wide flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">event_available</span>
              可预约
            </span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col gap-3">
            <h1 className="text-white text-2xl font-bold leading-tight shadow-sm tracking-tight">{currentTitle}</h1>
            <div className="flex flex-col gap-1.5 mt-1">
              <div className="flex items-center gap-2 text-slate-100 text-sm font-medium">
                <span className="material-symbols-outlined text-lg opacity-90">schedule</span>
                <span>{service?.duration || '每次 50 分钟'}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-100 text-sm font-medium">
                <span className="material-symbols-outlined text-lg opacity-90">location_on</span>
                <span>{service?.mode === 'online' ? '线上视频' : '线上视频 / 线下诊室'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-background-light dark:bg-background-dark rounded-t-3xl -mt-4 relative z-10">
        <div className="px-5 py-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1.5 h-6 bg-primary rounded-full shadow-sm"></div>
            <h2 className="text-text-main dark:text-white text-lg font-bold">服务介绍</h2>
          </div>
          <div className="bg-white dark:bg-surface-dark p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
            <p className="text-text-sub dark:text-slate-400 text-[15px] font-normal leading-7 text-justify">
              {description || '暂无服务描述'}
            </p>
            <div className="grid grid-cols-2 gap-3 mt-6">
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/50">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-white dark:bg-surface-dark text-blue-500 shadow-sm shrink-0">
                  <span className="material-symbols-outlined text-xl">assignment</span>
                </div>
                <div>
                  <h3 className="font-bold text-text-main dark:text-white text-sm">专业评估</h3>
                  <p className="text-xs text-text-sub dark:text-slate-400 mt-0.5">量表与访谈</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/50">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-white dark:bg-surface-dark text-blue-500 shadow-sm shrink-0">
                  <span className="material-symbols-outlined text-xl">trending_up</span>
                </div>
                <div>
                  <h3 className="font-bold text-text-main dark:text-white text-sm">行为改善</h3>
                  <p className="text-xs text-text-sub dark:text-slate-400 mt-0.5">定制化方案</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-5 py-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 bg-primary rounded-full shadow-sm"></div>
              <h2 className="text-text-main dark:text-white text-lg font-bold">专家介绍</h2>
            </div>
          </div>

          <div className="bg-white dark:bg-surface-dark p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="flex items-start gap-4 mb-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-slate-100 dark:border-slate-700 shadow-sm">
                <span className="material-symbols-outlined text-primary text-3xl">person</span>
              </div>
              <div>
                <h3 className="font-bold text-text-main dark:text-white text-lg flex items-center gap-1">
                  {expertName}
                  <span className="material-symbols-outlined fill-1 text-blue-500 text-sm" style={{ fontSize: '18px' }}>verified</span>
                </h3>
                <p className="text-sm text-text-sub dark:text-slate-400 mt-0.5">{expertTitle}</p>
                <div className="flex items-center gap-1 mt-2">
                  <span className="material-symbols-outlined text-yellow-400 text-sm">star</span>
                  <span className="text-sm font-bold text-text-main dark:text-white">{rating}</span>
                  {staffInfo?.specialty && staffInfo.specialty.length > 0 && (
                    <div className="flex gap-1 ml-2">
                      {staffInfo.specialty.slice(0, 2).map((s, i) => (
                        <span key={i} className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded">{s}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <p className="text-sm text-text-sub dark:text-slate-400 leading-relaxed">
              {expertBio}
            </p>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-surface-dark/90 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800 shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.05)] pb-safe flex justify-center">
        <div className="w-full max-w-md px-5 py-3 flex items-center gap-6">
          <div className="flex flex-col">
            <span className="text-[11px] text-text-sub dark:text-slate-400 font-medium tracking-wide flex items-center gap-1">
              <span className="material-symbols-outlined text-[10px]">payments</span>
              单次咨询
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm font-bold text-primary">¥</span>
              <span className="text-2xl font-bold text-text-main dark:text-white tracking-tight">{price || '面议'}</span>
              {price > 0 && <span className="text-xs text-slate-400">/次</span>}
            </div>
          </div>
          <button onClick={onRegister} className="flex-1 h-12 bg-primary hover:bg-primary-dark text-white rounded-full font-bold text-base shadow-lg shadow-primary/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group">
            <span>立即预约</span>
            <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
}
