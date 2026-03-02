import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useHistoryRecords } from '../hooks/useHealthData';

interface ActivityListProps {
  onBack: () => void;
  onOpenDetail: (title: string) => void;
  onOpenDetailReport?: (title: string) => void;
  onOpenFeedback?: () => void;
  registeredActivities?: string[];
  initialFilter?: string;
  highlightTitle?: string;
  onHighlightConsumed?: () => void;
  childId?: string | null;
}

export default function ActivityList({ onBack, onOpenDetail, onOpenDetailReport, onOpenFeedback, registeredActivities = [], initialFilter, highlightTitle, onHighlightConsumed, childId }: ActivityListProps) {
  const [activeFilter, setActiveFilter] = useState(initialFilter || '全部');
  const itemRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    if (highlightTitle && itemRefs.current[highlightTitle]) {
      itemRefs.current[highlightTitle]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      onHighlightConsumed?.();
    }
  }, [highlightTitle, activeFilter]);

  const isActivity1Registered = registeredActivities.includes('ADHD儿童情绪管理夏令营');
  const isActivity2Registered = registeredActivities.includes('ADHD 儿童感统专注力训练营');
  const isActivity3Registered = registeredActivities.includes('共情能力工作坊');
  const isActivity4Registered = registeredActivities.includes('注意力集中训练营');

  const filters = ['全部', '已报名', '已参与', '已结束'];

  const baseActivities = [
    {
      id: 1,
      title: 'ADHD儿童情绪管理夏令营',
      desc: '专为ADHD儿童设计的情绪调节课程，通过游戏与互动帮助孩子识别和管理情绪，提升社交能力。',
      date: '10月15日 09:00',
      status: isActivity1Registered ? '已报名' : '正在报名',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAs-Z7O0AMJ7PXGl6vZu5-FQ3JNJd9HcocBNtMZNesLFyqbBV66gKk3wClj2D80s3lak4NkghL_YnzatCTslysoVkUV5FOMq0J2JgEH1DGif3vbt8wx5RfKo_VIC3GwZZttHAcZqSLvA6NXqsdii9RxYM49Pn6LS_vY8exPRsrGXMzW5LtkPxjrmW_ZI3wsgVHuUpzg8MceH_YfhLzUXSONk4ip3z7Ao0SVjBDkPc9ZXCCuTFwBw23LoCYTFMDL3acN2MXvxxhyE80O',
      participants: isActivity1Registered ? '25/30' : '24/30'
    },
    {
      id: 2,
      title: 'ADHD 儿童感统专注力训练营',
      desc: '本次活动旨在通过专业的感统训练，帮助 ADHD 儿童提升专注力和身体协调能力。',
      date: '11月15日 09:00',
      status: isActivity2Registered ? '已报名' : '正在报名',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBvHIqFqNvn0mAA1t9NzBOQG4bikTbxO1Zv5aOMbGfwdLtgwRr0d4Zsl1g0zucdWEHln47VYNH7HVko9erS8lvPceDhiQ72hsIxguiCZmeQDyU3dIhKhUjfNn9U5eUVsY4F9DiuARRtgnsrhhoI6rptPYQv6R2fxj7Eks2IzVoM7TyFNRIVVTT8GPo9FGrsvfSuYfMIWtmfnQxPLn2vwdQLr1Lz24kjTx126CQBYa10oDVIZwNfrs7jM_2wBZJrNvpvqoWyTIsgOm5i',
      participants: isActivity2Registered ? '30/30' : '29/30'
    },
    {
      id: 5,
      title: '共情能力工作坊',
      desc: '引导孩子理解他人情绪，建立同理心，改善人际交往质量。',
      date: '11月20日 14:00',
      status: isActivity3Registered ? '已报名' : '正在报名',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBWgXMCoejP-ji49PT_G4y_pHGMWgzucXvI-Dfg52VVmAGQfLoZoWgPyYzeem7tJK26t-lajTAtKWNe4MQUb2x06Hj2F9cUl6Erg-KGMtvl941P4324xD8bGo0TrJwZvRdvfh-ipNmYmI76nNKvlaCBH-3oMCryWuDSU3gTw5tbhssl6b_UsfOi1KoEbiIQKaL5OQvsaE4wj8oENafpGa_6KEerhbYY6ejkMGt5FWJAB9brFxtFbmh26BCg-gbkAO4WwyIyeFzH_sCs',
      participants: isActivity3Registered ? '16/20' : '15/20'
    },
    {
      id: 6,
      title: '注意力集中训练营',
      desc: '结合感统训练，有效提升孩子的专注时长和抗干扰能力。',
      date: '11月25日 10:00',
      status: isActivity4Registered ? '已报名' : '正在报名',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBWgXMCoejP-ji49PT_G4y_pHGMWgzucXvI-Dfg52VVmAGQfLoZoWgPyYzeem7tJK26t-lajTAtKWNe4MQUb2x06Hj2F9cUl6Erg-KGMtvl941P4324xD8bGo0TrJwZvRdvfh-ipNmYmI76nNKvlaCBH-3oMCryWuDSU3gTw5tbhssl6b_UsfOi1KoEbiIQKaL5OQvsaE4wj8oENafpGa_6KEerhbYY6ejkMGt5FWJAB9brFxtFbmh26BCg-gbkAO4WwyIyeFzH_sCs',
      participants: isActivity4Registered ? '21/25' : '20/25'
    },
    {
      id: 3,
      title: '专注力绘画工作坊',
      desc: '通过绘画艺术疗法，引导孩子集中注意力，表达内心情感。',
      date: '10月20日 14:00',
      status: '已参与',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB8JDnRUxZcdhSs2RIUoMphmWjHjIxdMKPS9R8r7aeLMsRK7p4N6ODEMGqPLPVg7Awersvv9eyxcgiv5gdGx7rzbqGDazr45UYdY4oc5icDKkuf_sCs05R2QEBymXWYRBSlcIgi1NTEXliWxc-NzBQROcQeG8g_n0cHwB2WxrEPbWog9Iikniu1v8Ok9FZjUBe4GDxGT2m1zB9Jp1n7EjCefzgJ72AL3KnLaf_PI-m0yLSEm_vXkHXExaebKnPzuBHTK0MZ3IMM9U7q',
      participants: '15/20'
    },
    {
      id: 4,
      title: '感统训练公开课',
      desc: '免费公开课，体验基础感统训练项目，了解孩子感统发展状况。',
      date: '09月10日 10:00',
      status: '已结束',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAHM3FLoPnHGZFEJfG-kUDaWhxrJ_-mB12PAlVLG24yWaYzQwleryGteRZSUtaEYbcn7ruLA6_x7Ty5nPcYskQvF4cTmhfGzWhaOEzpn54S_nyfmf-LlGe90y2xIi025KELJ046vj5OCgnNB1NODq7JAp90ihPi3t5Vqsi_21II7SpdGuk-uGSaO8WbZzJFxiKbHA_FRz1dvosd9-oDGI8fPUKxRUsUwjsVnMdcFjbhm5tRYaIz_1kAfn_Nu20smrnuw_5hE86cUFQt',
      participants: '50/50'
    }
  ];

  // 从数据库获取 activity 类型的历史记录，作为已参与活动
  const { records: activityRecords } = useHistoryRecords(childId || null);
  const historyActivities = useMemo(() =>
    activityRecords
      .filter(item => item.record_type === 'activity')
      .map(item => ({
        id: item.id + '-act',
        title: item.title,
        desc: item.description,
        date: item.record_date,
        status: '已参与',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB8JDnRUxZcdhSs2RIUoMphmWjHjIxdMKPS9R8r7aeLMsRK7p4N6ODEMGqPLPVg7Awersvv9eyxcgiv5gdGx7rzbqGDazr45UYdY4oc5icDKkuf_sCs05R2QEBymXWYRBSlcIgi1NTEXliWxc-NzBQROcQeG8g_n0cHwB2WxrEPbWog9Iikniu1v8Ok9FZjUBe4GDxGT2m1zB9Jp1n7EjCefzgJ72AL3KnLaf_PI-m0yLSEm_vXkHXExaebKnPzuBHTK0MZ3IMM9U7q',
        participants: '20/20'
      })),
    [activityRecords]
  );

  const activities = [...baseActivities, ...historyActivities];

  const filteredActivities = activeFilter === '全部'
    ? activities
    : activities.filter(a => {
      if (activeFilter === '已报名') return a.status === '已报名';
      if (activeFilter === '已参与') return a.status === '已参与';
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
            ref={el => itemRefs.current[activity.title] = el}
            className={`bg-surface-light dark:bg-surface-dark rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden group cursor-pointer transform hover:scale-[1.01] transition-all duration-300 ${activity.status === '已结束' ? 'opacity-75 hover:opacity-100' : ''} ${highlightTitle === activity.title ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-background-dark' : ''}`}
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
                  <button className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-semibold px-5 py-2.5 rounded-xl transition-colors cursor-default">
                    等待开始
                  </button>
                )}
                {activity.status === '已参与' && (
                  <div className="flex gap-2">
                    <button onClick={() => onOpenDetailReport?.(activity.title)} className="bg-primary/10 hover:bg-primary/20 text-primary text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors">
                      查看详情
                    </button>
                    <button onClick={() => onOpenFeedback?.()} className="bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors">
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
