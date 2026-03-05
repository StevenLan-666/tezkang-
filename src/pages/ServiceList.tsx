import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useHistoryRecords } from '../hooks/useHealthData';
import { supabase } from '../lib/supabase';

interface ServiceListProps {
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

export default function ServiceList({ onBack, onOpenDetail, onOpenDetailReport, onOpenFeedback, registrations = [], initialFilter, childId, profileId, refetchRegistrations }: ServiceListProps) {
  const [activeFilter, setActiveFilter] = useState(initialFilter || '全部');
  const [loadingComplete, setLoadingComplete] = useState<string | null>(null);

  useEffect(() => {
    setActiveFilter(initialFilter || '全部');
  }, [initialFilter]);

  const filters = ['全部', '可预约', '待服务', '已完成', '已取消'];

  // 从数据库加载服务
  const [dbServices, setDbServices] = useState<any[]>([]);
  const [dbLoading, setDbLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      const { data, error } = await supabase.from('services').select('*').order('created_at', { ascending: false });
      if (error) console.error('加载服务失败:', error);
      if (data) setDbServices(data);
      setDbLoading(false);
    };
    fetchServices();
  }, []);

  const handleCompleteService = async (item: any) => {
    try {
      setLoadingComplete(item.id);

      // @ts-ignore
      const { error: updateErr } = await supabase
        .from('registrations')
        .update({ status: 'completed', completed_at: new Date().toISOString() })
        .eq('id', item.registrationId);

      if (updateErr) throw updateErr;

      // 由后端的 Supabase Trigger 'sync_completed_to_history' 接管历史记录与测试评估数据的插入
      // 因此不需要前端在此重复执行 insert 动作

      await refetchRegistrations?.(null);
      alert('已模拟完成该服务');
    } catch (e) {
      console.error(e);
      alert('模拟完成失败');
    } finally {
      setLoadingComplete(null);
    }
  };

  // 将 DB 数据映射为列表卡片格式，合并报名状态
  const baseServices = dbServices
    .filter(s => s.status === 'available')
    .map(s => {
      // 在 registrations 找这门课
      const reg = registrations.find(r => r.item_title === s.title);
      let status = '可预约';
      if (reg) {
        status = reg.status === 'completed' ? '已完成' : '待服务';
      }

      return {
        id: s.id,
        title: s.title,
        desc: s.description || '',
        expert: reg?.assigned_staff ? reg.assigned_staff : `${s.provider_name} (${s.provider_title})`,
        status,
        registrationId: reg?.id || null, // 用于点击完成
        image: s.image_url || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBWgXMCoejP-ji49PT_G4y_pHGMWgzucXvI-Dfg52VVmAGQfLoZoWgPyYzeem7tJK26t-lajTAtKWNe4MQUb2x06Hj2F9cUl6Erg-KGMtvl941P4324xD8bGo0TrJwZvRdvfh-ipNmYmI76nNKvlaCBH-3oMCryWuDSU3gTw5tbhssl6b_UsfOi1KoEbiIQKaL5OQvsaE4wj8oENafpGa_6KEerhbYY6ejkMGt5FWJAB9brFxtFbmh26BCg-gbkAO4WwyIyeFzH_sCs',
        rating: s.rating?.toString() || '4.5',
      };
    });

  // 从 DB 中查找评估干预类服务（用于历史记录展示聚合）
  const assessmentService = dbServices.find(s => s.title?.includes('干预') || s.title?.includes('心理咨询'));
  const assessmentServiceTitle = assessmentService?.title || '一对一心理咨询和行为干预';
  const assessmentServiceExpert = assessmentService
    ? `${assessmentService.provider_name} (${assessmentService.provider_title})`
    : '刘老师 (资深评估师)';
  const assessmentServiceImage = assessmentService?.image_url || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBWgXMCoejP-ji49PT_G4y_pHGMWgzucXvI-Dfg52VVmAGQfLoZoWgPyYzeem7tJK26t-lajTAtKWNe4MQUb2x06Hj2F9cUl6Erg-KGMtvl941P4324xD8bGo0TrJwZvRdvfh-ipNmYmI76nNKvlaCBH-3oMCryWuDSU3gTw5tbhssl6b_UsfOi1KoEbiIQKaL5OQvsaE4wj8oENafpGa_6KEerhbYY6ejkMGt5FWJAB9brFxtFbmh26BCg-gbkAO4WwyIyeFzH_sCs';

  // 将社交/行为/决策的 test 记录，按日期分组模拟为当次服务发生
  const { records: testRecords } = useHistoryRecords(childId || null);
  const historyServices = useMemo(() => {
    // 只取 social, behavior, decision 类型的 test
    const testOnly = testRecords.filter(item => item.record_type === 'test' && ['social', 'behavior', 'decision'].includes(item.category as string));
    const grouped: Record<string, typeof testOnly> = {};
    testOnly.forEach(item => {
      const date = item.record_date || 'unknown';
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(item);
    });
    return Object.entries(grouped).map(([date, items]) => {
      // 从标题里抽出前面几个字，如“社交能力”、“行为表现”
      const categories = items.map(i => i.title.replace('综合评估', '').replace(/（.*）/, '')).join('、');
      return {
        id: `svc-hist-${date}`,
        title: assessmentServiceTitle,
        desc: `${date} 完成评估（${categories}）。`,
        expert: assessmentServiceExpert,
        status: '已完成',
        image: assessmentServiceImage,
        rating: '5.0'
      };
    });
  }, [testRecords, assessmentServiceTitle, assessmentServiceExpert, assessmentServiceImage]);

  // 合并当前的预约服务状态与由测试报告推断出来的已完成历史服务
  const services = [...baseServices, ...historyServices];

  const filteredServices = activeFilter === '全部'
    ? services
    : services.filter(s => {
      if (activeFilter === '待服务') return s.status === '待服务';
      if (activeFilter === '已完成') return s.status === '已完成';
      if (activeFilter === '已取消') return s.status === '已取消';
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
        <h1 className="text-lg font-bold text-text-main dark:text-white">服务列表</h1>
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
        {filteredServices.map((service) => (
          <div
            key={service.id}
            className={`bg-surface-light dark:bg-surface-dark rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden group cursor-pointer transform hover:scale-[1.01] transition-all duration-300 ${service.status === '已取消' ? 'opacity-75 hover:opacity-100' : ''}`}
          >
            <div className={`h-44 w-full bg-slate-200 dark:bg-slate-700 relative ${service.status === '已取消' ? 'grayscale' : ''}`}>
              <img alt={service.title} className="w-full h-full object-cover" src={service.image} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

              {service.status === '可预约' && (
                <div className="absolute top-4 left-4 bg-blue-500/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg backdrop-blur-md shadow-sm">
                  可预约
                </div>
              )}
              {service.status === '待服务' && (
                <div className="absolute top-4 left-4 bg-blue-500/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg backdrop-blur-md shadow-sm">
                  待服务
                </div>
              )}
              {service.status === '已完成' && (
                <div className="absolute top-4 left-4 bg-emerald-500/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg backdrop-blur-md shadow-sm">
                  已完成
                </div>
              )}
              {service.status === '已取消' && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center backdrop-blur-[1px]">
                  <span className="text-white text-xs font-bold border border-white/40 px-2 py-1 rounded">已取消</span>
                </div>
              )}

              <div className="absolute bottom-4 right-4 bg-black/40 text-white text-[10px] px-2.5 py-1 rounded-lg backdrop-blur-md flex items-center gap-1.5 border border-white/10">
                <span className="material-symbols-outlined text-[12px]">star</span> {service.rating}
              </div>
            </div>

            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-base font-bold text-text-main dark:text-white leading-snug">{service.title}</h3>
              </div>
              <p className="text-xs text-text-sub dark:text-slate-400 mb-4 line-clamp-2 leading-relaxed">
                {service.desc}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-slate-50 dark:border-slate-800">
                <div className="flex items-center gap-2 text-xs text-text-sub dark:text-slate-400 font-medium">
                  <span className="material-symbols-outlined text-[18px] text-primary">person</span>
                  <span>{service.expert}</span>
                </div>

                {service.status === '可预约' && (
                  <button onClick={() => onOpenDetail(service.title)} className="bg-primary hover:bg-primary-dark text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-primary/20 transition-colors">
                    立即预约
                  </button>
                )}

                {service.status === '待服务' && (
                  <div className="flex gap-2">
                    {loadingComplete === service.id ? (
                      <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mt-1"></div>
                    ) : (
                      <button onClick={(e) => { e.stopPropagation(); handleCompleteService(service); }} className="text-[11px] font-bold text-white bg-primary-500 hover:bg-primary-600 px-3 py-1.5 rounded-lg active:scale-95 transition-all">
                        模拟完成
                      </button>
                    )}
                    <button className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-semibold px-5 py-2.5 rounded-xl transition-colors cursor-default">
                      等待服务
                    </button>
                  </div>
                )}

                {service.status === '已完成' && (
                  <div className="flex gap-2">
                    <button onClick={(e) => { e.stopPropagation(); onOpenDetailReport?.(service.title); }} className="text-[11px] font-bold text-primary dark:text-primary-400 bg-primary/10 dark:bg-primary/20 px-3 py-1.5 rounded-lg active:scale-95 transition-all">
                      查看详情
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); onOpenFeedback?.(); }} className="bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold px-4 py-1.5 rounded-lg transition-colors flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">rate_review</span>
                      反馈
                    </button>
                  </div>
                )}

                {service.status === '已取消' && (
                  <button className="text-slate-400 dark:text-slate-500 text-xs font-semibold px-3 py-1.5 cursor-default">
                    重新预约
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
