import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useHistoryRecords } from '../hooks/useHealthData';

interface ServiceListProps {
  onBack: () => void;
  onOpenDetail: (title: string) => void;
  onOpenDetailReport?: (title: string) => void;
  onOpenFeedback?: () => void;
  registeredServices?: string[];
  initialFilter?: string;
  highlightTitle?: string;
  onHighlightConsumed?: () => void;
  childId?: string | null;
}

export default function ServiceList({ onBack, onOpenDetail, onOpenDetailReport, onOpenFeedback, registeredServices = [], initialFilter, highlightTitle, onHighlightConsumed, childId }: ServiceListProps) {
  const [activeFilter, setActiveFilter] = useState(initialFilter || '全部');
  const itemRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    if (highlightTitle && itemRefs.current[highlightTitle]) {
      itemRefs.current[highlightTitle]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      onHighlightConsumed?.();
    }
  }, [highlightTitle, activeFilter]);

  const filters = ['全部', '待服务', '已完成', '已取消'];

  const baseServices = [
    {
      id: 1,
      title: '一对一心理咨询与行为干预',
      desc: '由资深儿童心理专家提供个性化的评估与干预方案，帮助孩子改善注意力、控制冲动，并提升社交技能。',
      expert: '李医生 (主任医师)',
      status: registeredServices.includes('一对一心理咨询与行为干预') ? '待服务' : '可预约',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBWgXMCoejP-ji49PT_G4y_pHGMWgzucXvI-Dfg52VVmAGQfLoZoWgPyYzeem7tJK26t-lajTAtKWNe4MQUb2x06Hj2F9cUl6Erg-KGMtvl941P4324xD8bGo0TrJwZvRdvfh-ipNmYmI76nNKvlaCBH-3oMCryWuDSU3gTw5tbhssl6b_UsfOi1KoEbiIQKaL5OQvsaE4wj8oENafpGa_6KEerhbYY6ejkMGt5FWJAB9brFxtFbmh26BCg-gbkAO4WwyIyeFzH_sCs',
      rating: '4.9'
    },
    {
      id: 2,
      title: '家庭教育指导',
      desc: '为家长提供专业的教育建议，帮助家长更好地理解和引导孩子的成长。',
      expert: '王老师 (高级家庭教育指导师)',
      status: registeredServices.includes('家庭教育指导') ? '待服务' : '可预约',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDCJhrTGsnpisibkRqqOuKw0VRd0KD2uVn6RR0_B5aVlhvR-lyWVsnTO4Uy7KblhLfvwmAwdBt20SYfb6jbsUNlLD1e52HN_26J_lJ53PlmcbeJQhaCWQyJ0aVwItN8aYIr6svWEgvruhnvlKFeXRkhodLzz4Hhjv9l7XXyduZQ4lPrM0y7maScpmOxy495VWFED0ZwQqC1BV9nQb3GASvMqMhxS3kS5oFo5MvtQLMeYmZetPAoi57cgWxI2UwdGhWSON46c6vtqoMO',
      rating: '4.8'
    },
    {
      id: 3,
      title: '认知功能训练',
      desc: '通过科学的训练方法，提升孩子的认知能力、记忆力和注意力。',
      expert: '张医生 (康复治疗师)',
      status: registeredServices.includes('认知功能训练') ? '待服务' : '可预约',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAs-Z7O0AMJ7PXGl6vZu5-FQ3JNJd9HcocBNtMZNesLFyqbBV66gKk3wClj2D80s3lak4NkghL_YnzatCTslysoVkUV5FOMq0J2JgEH1DGif3vbt8wx5RfKo_VIC3GwZZttHAcZqSLvA6NXqsdii9RxYM49Pn6LS_vY8exPRsrGXMzW5LtkPxjrmW_ZI3wsgVHuUpzg8MceH_YfhLzUXSONk4ip3z7Ao0SVjBDkPc9ZXCCuTFwBw23LoCYTFMDL3acN2MXvxxhyE80O',
      rating: '4.7'
    },
    {
      id: 6,
      title: '社交技能提升班',
      desc: '通过互动游戏和角色扮演，提升孩子在集体环境中的沟通与协作能力。',
      expert: '王老师 (高级家庭教育指导师)',
      status: registeredServices.includes('社交技能提升班') ? '待服务' : '可预约',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDCJhrTGsnpisibkRqqOuKw0VRd0KD2uVn6RR0_B5aVlhvR-lyWVsnTO4Uy7KblhLfvwmAwdBt20SYfb6jbsUNlLD1e52HN_26J_lJ53PlmcbeJQhaCWQyJ0aVwItN8aYIr6svWEgvruhnvlKFeXRkhodLzz4Hhjv9l7XXyduZQ4lPrM0y7maScpmOxy495VWFED0ZwQqC1BV9nQb3GASvMqMhxS3kS5oFo5MvtQLMeYmZetPAoi57cgWxI2UwdGhWSON46c6vtqoMO',
      rating: '4.8'
    },
    {
      id: 7,
      title: '行为规范引导课',
      desc: '通过专业引导，帮助孩子建立良好的日常行为规范和自律习惯。',
      expert: '张医生 (康复治疗师)',
      status: registeredServices.includes('行为规范引导课') ? '待服务' : '可预约',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDCJhrTGsnpisibkRqqOuKw0VRd0KD2uVn6RR0_B5aVlhvR-lyWVsnTO4Uy7KblhLfvwmAwdBt20SYfb6jbsUNlLD1e52HN_26J_lJ53PlmcbeJQhaCWQyJ0aVwItN8aYIr6svWEgvruhnvlKFeXRkhodLzz4Hhjv9l7XXyduZQ4lPrM0y7maScpmOxy495VWFED0ZwQqC1BV9nQb3GASvMqMhxS3kS5oFo5MvtQLMeYmZetPAoi57cgWxI2UwdGhWSON46c6vtqoMO',
      rating: '4.7'
    },
    {
      id: 9,
      title: '情绪调节',
      desc: '一对一咨询，促进情感成长和稳定。',
      expert: '刘老师 (资深评估师)',
      status: registeredServices.includes('情绪调节') ? '待服务' : '可预约',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBWgXMCoejP-ji49PT_G4y_pHGMWgzucXvI-Dfg52VVmAGQfLoZoWgPyYzeem7tJK26t-lajTAtKWNe4MQUb2x06Hj2F9cUl6Erg-KGMtvl941P4324xD8bGo0TrJwZvRdvfh-ipNmYmI76nNKvlaCBH-3oMCryWuDSU3gTw5tbhssl6b_UsfOi1KoEbiIQKaL5OQvsaE4wj8oENafpGa_6KEerhbYY6ejkMGt5FWJAB9brFxtFbmh26BCg-gbkAO4WwyIyeFzH_sCs',
      rating: '4.9'
    },
    {
      id: 5,
      title: '日常测试和干预',
      desc: '由专业老师进行全面评估，提供日常行为和社交能力的测试与干预指导。',
      expert: '刘老师 (资深评估师)',
      status: registeredServices.includes('日常测试和干预') ? '待服务' : '可预约',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBWgXMCoejP-ji49PT_G4y_pHGMWgzucXvI-Dfg52VVmAGQfLoZoWgPyYzeem7tJK26t-lajTAtKWNe4MQUb2x06Hj2F9cUl6Erg-KGMtvl941P4324xD8bGo0TrJwZvRdvfh-ipNmYmI76nNKvlaCBH-3oMCryWuDSU3gTw5tbhssl6b_UsfOi1KoEbiIQKaL5OQvsaE4wj8oENafpGa_6KEerhbYY6ejkMGt5FWJAB9brFxtFbmh26BCg-gbkAO4WwyIyeFzH_sCs',
      rating: '4.9'
    }
  ];

  // 一次"日常测试和干预"服务 → 同时产生 social/behavior/decision 三条 test 记录
  // 按 record_date 分组，每个日期对应一次服务
  const { records: testRecords } = useHistoryRecords(childId || null);
  const historyServices = useMemo(() => {
    const testOnly = testRecords.filter(item => item.record_type === 'test');
    const grouped: Record<string, typeof testOnly> = {};
    testOnly.forEach(item => {
      const date = item.record_date || 'unknown';
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(item);
    });
    return Object.entries(grouped).map(([date, items]) => {
      const categories = items.map(i => i.title).join('、');
      const statusSummary = items.map(i => `${i.title}: ${i.status}`).join('；');
      return {
        id: `svc-${date}`,
        title: '日常测试和干预',
        desc: `${date} 完成评估（${categories}）。${statusSummary}`,
        expert: '刘老师 (资深评估师)',
        status: '已完成',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBWgXMCoejP-ji49PT_G4y_pHGMWgzucXvI-Dfg52VVmAGQfLoZoWgPyYzeem7tJK26t-lajTAtKWNe4MQUb2x06Hj2F9cUl6Erg-KGMtvl941P4324xD8bGo0TrJwZvRdvfh-ipNmYmI76nNKvlaCBH-3oMCryWuDSU3gTw5tbhssl6b_UsfOi1KoEbiIQKaL5OQvsaE4wj8oENafpGa_6KEerhbYY6ejkMGt5FWJAB9brFxtFbmh26BCg-gbkAO4WwyIyeFzH_sCs',
        rating: '5.0'
      };
    });
  }, [testRecords]);

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
            ref={el => itemRefs.current[service.title] = el}
            className={`bg-surface-light dark:bg-surface-dark rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden group cursor-pointer transform hover:scale-[1.01] transition-all duration-300 ${service.status === '已取消' ? 'opacity-75 hover:opacity-100' : ''} ${highlightTitle === service.title ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-background-dark' : ''}`}
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
                  <button className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-semibold px-5 py-2.5 rounded-xl transition-colors cursor-default">
                    等待服务
                  </button>
                )}
                {service.status === '已完成' && (
                  <div className="flex gap-2">
                    <button onClick={() => onOpenDetailReport?.(service.title)} className="bg-primary/10 hover:bg-primary/20 text-primary text-xs font-semibold px-4 py-1.5 rounded-lg transition-colors">
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
