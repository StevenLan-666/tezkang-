import { useState } from 'react';

interface ServicesProps {
  onOpenDetail?: (type: 'activity' | 'service', title: string) => void;
  onOpenActivityList?: () => void;
  onOpenServiceList?: () => void;
  onOpenFeedback?: () => void;
  registeredActivities?: string[];
  registeredServices?: string[];
  initialTab?: 'public' | 'personal';
}

export default function Services({ onOpenDetail, onOpenActivityList, onOpenServiceList, onOpenFeedback, registeredActivities = [], registeredServices = [], initialTab = 'public' }: ServicesProps) {
  const [activeTab, setActiveTab] = useState<'public' | 'personal'>(initialTab);

  // 使用活动/服务标题匹配报名状态
  const isActivity1Registered = registeredActivities.includes('ADHD儿童情绪管理夏令营') || registeredActivities.includes('ADHD 儿童感统专注力训练营');
  const isService1Registered = registeredServices.includes('一对一心理咨询与行为干预');

  return (
    <div className="flex-1 overflow-y-auto pb-24 bg-background-light dark:bg-background-dark">
      <div className="h-12 w-full fixed top-0 z-40 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md max-w-md"></div>

      <div className="relative pt-14 px-5">
        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-text-main dark:text-white tracking-tight">服务预约</h1>
            <p className="text-xs text-text-sub dark:text-slate-400 mt-0.5">探索适合孩子的成长活动</p>
          </div>
          <div className="flex gap-3">
            <button className="w-10 h-10 rounded-full bg-white dark:bg-surface-dark shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <span className="material-symbols-outlined text-text-main dark:text-white text-[20px]">search</span>
            </button>
            <button className="w-10 h-10 rounded-full bg-white dark:bg-surface-dark shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors relative">
              <span className="material-symbols-outlined text-text-main dark:text-white text-[20px]">notifications</span>
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-400 rounded-full border border-white dark:border-surface-dark"></span>
            </button>
          </div>
        </header>

        <div className="bg-slate-200/60 dark:bg-slate-800/60 p-1.5 rounded-2xl flex mb-6 backdrop-blur-sm">
          <button
            onClick={() => setActiveTab('public')}
            className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-sm transition-all duration-200 ${activeTab === 'public' ? 'bg-white dark:bg-surface-dark shadow-sm text-primary' : 'text-text-sub dark:text-slate-400 hover:text-text-main dark:hover:text-white'}`}
          >
            公共活动
          </button>
          <button
            onClick={() => setActiveTab('personal')}
            className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-sm transition-all duration-200 ${activeTab === 'personal' ? 'bg-white dark:bg-surface-dark shadow-sm text-primary' : 'text-text-sub dark:text-slate-400 hover:text-text-main dark:hover:text-white'}`}
          >
            个人服务
          </button>
        </div>

        {activeTab === 'public' ? (
          <>
            <div className="flex justify-between items-end mb-4">
              <h2 className="text-lg font-bold text-text-main dark:text-white tracking-tight">热门活动</h2>
              <button onClick={onOpenActivityList} className="text-xs text-primary font-semibold flex items-center hover:opacity-80 transition-opacity">
                查看全部 <span className="material-symbols-outlined text-sm ml-0.5">chevron_right</span>
              </button>
            </div>

            <div className="bg-surface-light dark:bg-surface-dark rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden mb-4 group cursor-pointer transform hover:scale-[1.01] transition-all duration-300">
              <div className="h-44 w-full bg-slate-200 dark:bg-slate-700 relative">
                <img alt="Children playing outdoors" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAs-Z7O0AMJ7PXGl6vZu5-FQ3JNJd9HcocBNtMZNesLFyqbBV66gKk3wClj2D80s3lak4NkghL_YnzatCTslysoVkUV5FOMq0J2JgEH1DGif3vbt8wx5RfKo_VIC3GwZZttHAcZqSLvA6NXqsdii9RxYM49Pn6LS_vY8exPRsrGXMzW5LtkPxjrmW_ZI3wsgVHuUpzg8MceH_YfhLzUXSONk4ip3z7Ao0SVjBDkPc9ZXCCuTFwBw23LoCYTFMDL3acN2MXvxxhyE80O" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className={`absolute top-4 left-4 ${isActivity1Registered ? 'bg-blue-500/90' : 'bg-emerald-500/90'} text-white text-[10px] font-bold px-2.5 py-1 rounded-lg backdrop-blur-md shadow-sm`}>
                  {isActivity1Registered ? '已报名' : '正在报名'}
                </div>
                <div className="absolute bottom-4 right-4 bg-black/40 text-white text-[10px] px-2.5 py-1 rounded-lg backdrop-blur-md flex items-center gap-1.5 border border-white/10">
                  <span className="material-symbols-outlined text-[12px]">group</span> {isActivity1Registered ? '25/30' : '24/30'}
                </div>
              </div>
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-base font-bold text-text-main dark:text-white leading-snug">ADHD儿童情绪管理夏令营</h3>
                </div>
                <p className="text-xs text-text-sub dark:text-slate-400 mb-4 line-clamp-2 leading-relaxed">
                  专为ADHD儿童设计的情绪调节课程，通过游戏与互动帮助孩子识别和管理情绪，提升社交能力。
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-slate-50 dark:border-slate-800">
                  <div className="flex items-center gap-2 text-xs text-text-sub dark:text-slate-400 font-medium">
                    <span className="material-symbols-outlined text-[18px] text-primary">calendar_today</span>
                    <span>10月15日 09:00</span>
                  </div>
                  {isActivity1Registered ? (
                    <button className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-semibold px-5 py-2.5 rounded-xl transition-colors cursor-default">
                      等待开始
                    </button>
                  ) : (
                    <button onClick={() => onOpenDetail?.('activity', 'ADHD 儿童感统专注力训练营')} className="bg-primary hover:bg-primary-dark text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-primary/20 transition-colors">
                      立即报名
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-surface-light dark:bg-surface-dark rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden mb-8 group cursor-pointer transform hover:scale-[1.01] transition-all duration-300">
              <div className="h-44 w-full bg-slate-200 dark:bg-slate-700 relative">
                <img alt="Children playing outdoors" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBvHIqFqNvn0mAA1t9NzBOQG4bikTbxO1Zv5aOMbGfwdLtgwRr0d4Zsl1g0zucdWEHln47VYNH7HVko9erS8lvPceDhiQ72hsIxguiCZmeQDyU3dIhKhUjfNn9U5eUVsY4F9DiuARRtgnsrhhoI6rptPYQv6R2fxj7Eks2IzVoM7TyFNRIVVTT8GPo9FGrsvfSuYfMIWtmfnQxPLn2vwdQLr1Lz24kjTx126CQBYa10oDVIZwNfrs7jM_2wBZJrNvpvqoWyTIsgOm5i" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute top-4 left-4 bg-blue-500/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg backdrop-blur-md shadow-sm">
                  已报名
                </div>
                <div className="absolute bottom-4 right-4 bg-black/40 text-white text-[10px] px-2.5 py-1 rounded-lg backdrop-blur-md flex items-center gap-1.5 border border-white/10">
                  <span className="material-symbols-outlined text-[12px]">group</span> 30/30
                </div>
              </div>
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-base font-bold text-text-main dark:text-white leading-snug">ADHD 儿童感统专注力训练营</h3>
                </div>
                <p className="text-xs text-text-sub dark:text-slate-400 mb-4 line-clamp-2 leading-relaxed">
                  本次活动旨在通过专业的感统训练，帮助 ADHD 儿童提升专注力和身体协调能力。
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-slate-50 dark:border-slate-800">
                  <div className="flex items-center gap-2 text-xs text-text-sub dark:text-slate-400 font-medium">
                    <span className="material-symbols-outlined text-[18px] text-primary">calendar_today</span>
                    <span>11月15日 09:00</span>
                  </div>
                  <button className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-semibold px-5 py-2.5 rounded-xl transition-colors cursor-default">
                    等待开始
                  </button>
                </div>
              </div>
            </div>

            <h2 className="text-lg font-bold text-text-main dark:text-white mb-4 tracking-tight">更多推荐</h2>

            <div className="bg-surface-light dark:bg-surface-dark rounded-2xl p-3 shadow-sm border border-slate-100 dark:border-slate-800 flex gap-4 mb-4 items-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <div className="w-24 h-24 flex-shrink-0 rounded-xl bg-slate-200 dark:bg-slate-700 overflow-hidden relative shadow-inner">
                <img alt="Art therapy session" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB8JDnRUxZcdhSs2RIUoMphmWjHjIxdMKPS9R8r7aeLMsRK7p4N6ODEMGqPLPVg7Awersvv9eyxcgiv5gdGx7rzbqGDazr45UYdY4oc5icDKkuf_sCs05R2QEBymXWYRBSlcIgi1NTEXliWxc-NzBQROcQeG8g_n0cHwB2WxrEPbWog9Iikniu1v8Ok9FZjUBe4GDxGT2m1zB9Jp1n7EjCefzgJ72AL3KnLaf_PI-m0yLSEm_vXkHXExaebKnPzuBHTK0MZ3IMM9U7q" />
              </div>
              <div className="flex-1 min-w-0 py-1">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-sm font-bold text-text-main dark:text-white truncate pr-2">专注力绘画工作坊</h3>
                  <span className="text-[10px] px-2 py-0.5 bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 rounded-md font-bold whitespace-nowrap">未参与</span>
                </div>
                <div className="flex items-center gap-1 mb-3">
                  <span className="material-symbols-outlined text-[14px] text-slate-400">location_on</span>
                  <span className="text-xs text-text-sub dark:text-slate-400 truncate">市少年宫 C区 201室</span>
                </div>
                <div className="flex justify-between items-end">
                  <div className="text-xs text-text-sub dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 px-2 py-1 rounded-md">
                    名额: <span className="text-text-main dark:text-white font-bold ml-1">15</span>
                  </div>
                  <button className="text-primary text-xs font-bold bg-primary/10 hover:bg-primary/20 dark:bg-primary/20 dark:hover:bg-primary/30 px-3 py-1.5 rounded-lg transition-colors">
                    详情
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-surface-light dark:bg-surface-dark rounded-2xl p-3 shadow-sm border border-slate-100 dark:border-slate-800 flex gap-4 mb-4 items-center opacity-75 hover:opacity-100 transition-opacity">
              <div className="w-24 h-24 flex-shrink-0 rounded-xl bg-slate-200 dark:bg-slate-700 overflow-hidden relative grayscale">
                <img alt="Physical exercise group" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAHM3FLoPnHGZFEJfG-kUDaWhxrJ_-mB12PAlVLG24yWaYzQwleryGteRZSUtaEYbcn7ruLA6_x7Ty5nPcYskQvF4cTmhfGzWhaOEzpn54S_nyfmf-LlGe90y2xIi025KELJ046vj5OCgnNB1NODq7JAp90ihPi3t5Vqsi_21II7SpdGuk-uGSaO8WbZzJFxiKbHA_FRz1dvosd9-oDGI8fPUKxRUsUwjsVnMdcFjbhm5tRYaIz_1kAfn_Nu20smrnuw_5hE86cUFQt" />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center backdrop-blur-[1px]">
                  <span className="text-white text-xs font-bold border border-white/40 px-2 py-1 rounded">已结束</span>
                </div>
              </div>
              <div className="flex-1 min-w-0 py-1">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-sm font-bold text-text-main dark:text-white truncate pr-2">感统训练公开课</h3>
                  <span className="text-[10px] px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-md font-bold whitespace-nowrap">已结束</span>
                </div>
                <div className="flex items-center gap-1 mb-3">
                  <span className="material-symbols-outlined text-[14px] text-slate-400">location_on</span>
                  <span className="text-xs text-text-sub dark:text-slate-400 truncate">康复中心 3楼大厅</span>
                </div>
                <div className="flex justify-between items-end">
                  <div className="text-xs text-text-sub dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 px-2 py-1 rounded-md">
                    名额: <span className="text-text-main dark:text-white font-bold ml-1">50</span>
                  </div>
                  <div className="flex gap-2">
                    <button className="text-slate-400 dark:text-slate-500 text-xs font-semibold px-3 py-1.5 cursor-default">
                      回顾
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); onOpenFeedback?.(); }} className="bg-primary/10 hover:bg-primary/20 text-primary text-xs font-semibold px-4 py-1.5 rounded-lg transition-colors flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">rate_review</span>
                      反馈
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-between items-end mb-4">
              <h2 className="text-lg font-bold text-text-main dark:text-white tracking-tight">推荐服务</h2>
              <button onClick={onOpenServiceList} className="text-xs text-primary font-semibold flex items-center hover:opacity-80 transition-opacity">
                查看全部 <span className="material-symbols-outlined text-sm ml-0.5">chevron_right</span>
              </button>
            </div>

            <div className="bg-surface-light dark:bg-surface-dark rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden mb-8 group cursor-pointer transform hover:scale-[1.01] transition-all duration-300">
              <div className="h-44 w-full bg-slate-200 dark:bg-slate-700 relative">
                <img alt="Therapist with child" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBWgXMCoejP-ji49PT_G4y_pHGMWgzucXvI-Dfg52VVmAGQfLoZoWgPyYzeem7tJK26t-lajTAtKWNe4MQUb2x06Hj2F9cUl6Erg-KGMtvl941P4324xD8bGo0TrJwZvRdvfh-ipNmYmI76nNKvlaCBH-3oMCryWuDSU3gTw5tbhssl6b_UsfOi1KoEbiIQKaL5OQvsaE4wj8oENafpGa_6KEerhbYY6ejkMGt5FWJAB9brFxtFbmh26BCg-gbkAO4WwyIyeFzH_sCs" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className={`absolute top-4 left-4 ${isService1Registered ? 'bg-blue-500/90' : 'bg-blue-500/90'} text-white text-[10px] font-bold px-2.5 py-1 rounded-lg backdrop-blur-md shadow-sm`}>
                  {isService1Registered ? '待服务' : '可预约'}
                </div>
                <div className="absolute bottom-4 right-4 bg-black/40 text-white text-[10px] px-2.5 py-1 rounded-lg backdrop-blur-md flex items-center gap-1.5 border border-white/10">
                  <span className="material-symbols-outlined text-[12px]">star</span> 4.9
                </div>
              </div>
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-base font-bold text-text-main dark:text-white leading-snug">一对一心理咨询与行为干预</h3>
                </div>
                <p className="text-xs text-text-sub dark:text-slate-400 mb-4 line-clamp-2 leading-relaxed">
                  由资深儿童心理专家提供个性化的评估与干预方案，帮助孩子改善注意力、控制冲动，并提升社交技能。
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-slate-50 dark:border-slate-800">
                  <div className="flex items-center gap-2 text-xs text-text-sub dark:text-slate-400 font-medium">
                    <span className="material-symbols-outlined text-[18px] text-primary">person</span>
                    <span>李医生 (主任医师)</span>
                  </div>
                  {isService1Registered ? (
                    <button className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-semibold px-5 py-2.5 rounded-xl transition-colors cursor-default">
                      等待服务
                    </button>
                  ) : (
                    <button onClick={() => onOpenDetail?.('service', '一对一心理咨询与行为干预')} className="bg-primary hover:bg-primary-dark text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-primary/20 transition-colors">
                      立即预约
                    </button>
                  )}
                </div>
              </div>
            </div>

            <h2 className="text-lg font-bold text-text-main dark:text-white mb-4 tracking-tight">更多服务</h2>

            <div className="bg-surface-light dark:bg-surface-dark rounded-2xl p-3 shadow-sm border border-slate-100 dark:border-slate-800 flex gap-4 mb-4 items-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <div className="w-24 h-24 flex-shrink-0 rounded-xl bg-slate-200 dark:bg-slate-700 overflow-hidden relative shadow-inner">
                <img alt="Family counseling" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDCJhrTGsnpisibkRqqOuKw0VRd0KD2uVn6RR0_B5aVlhvR-lyWVsnTO4Uy7KblhLfvwmAwdBt20SYfb6jbsUNlLD1e52HN_26J_lJ53PlmcbeJQhaCWQyJ0aVwItN8aYIr6svWEgvruhnvlKFeXRkhodLzz4Hhjv9l7XXyduZQ4lPrM0y7maScpmOxy495VWFED0ZwQqC1BV9nQb3GASvMqMhxS3kS5oFo5MvtQLMeYmZetPAoi57cgWxI2UwdGhWSON46c6vtqoMO" />
              </div>
              <div className="flex-1 min-w-0 py-1">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-sm font-bold text-text-main dark:text-white truncate pr-2">家庭教育指导</h3>
                  <span className="text-[10px] px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-md font-bold whitespace-nowrap">线上</span>
                </div>
                <div className="flex items-center gap-1 mb-3">
                  <span className="material-symbols-outlined text-[14px] text-slate-400">schedule</span>
                  <span className="text-xs text-text-sub dark:text-slate-400 truncate">45分钟/次</span>
                </div>
                <div className="flex justify-between items-end">
                  <div className="text-xs text-text-sub dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 px-2 py-1 rounded-md">
                    评价: <span className="text-text-main dark:text-white font-bold ml-1">4.8</span>
                  </div>
                  <button onClick={() => onOpenDetail?.('service', '家庭教育指导')} className="text-primary text-xs font-bold bg-primary/10 hover:bg-primary/20 dark:bg-primary/20 dark:hover:bg-primary/30 px-3 py-1.5 rounded-lg transition-colors">
                    详情
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-surface-light dark:bg-surface-dark rounded-2xl p-3 shadow-sm border border-slate-100 dark:border-slate-800 flex gap-4 mb-4 items-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <div className="w-24 h-24 flex-shrink-0 rounded-xl bg-slate-200 dark:bg-slate-700 overflow-hidden relative shadow-inner">
                <img alt="Cognitive training" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAs-Z7O0AMJ7PXGl6vZu5-FQ3JNJd9HcocBNtMZNesLFyqbBV66gKk3wClj2D80s3lak4NkghL_YnzatCTslysoVkUV5FOMq0J2JgEH1DGif3vbt8wx5RfKo_VIC3GwZZttHAcZqSLvA6NXqsdii9RxYM49Pn6LS_vY8exPRsrGXMzW5LtkPxjrmW_ZI3wsgVHuUpzg8MceH_YfhLzUXSONk4ip3z7Ao0SVjBDkPc9ZXCCuTFwBw23LoCYTFMDL3acN2MXvxxhyE80O" />
              </div>
              <div className="flex-1 min-w-0 py-1">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-sm font-bold text-text-main dark:text-white truncate pr-2">认知功能训练</h3>
                  <span className="text-[10px] px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-md font-bold whitespace-nowrap">线下</span>
                </div>
                <div className="flex items-center gap-1 mb-3">
                  <span className="material-symbols-outlined text-[14px] text-slate-400">schedule</span>
                  <span className="text-xs text-text-sub dark:text-slate-400 truncate">60分钟/次</span>
                </div>
                <div className="flex justify-between items-end">
                  <div className="text-xs text-text-sub dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 px-2 py-1 rounded-md">
                    评价: <span className="text-text-main dark:text-white font-bold ml-1">4.7</span>
                  </div>
                  <button onClick={() => onOpenDetail?.('activity', '认知功能训练')} className="text-primary text-xs font-bold bg-primary/10 hover:bg-primary/20 dark:bg-primary/20 dark:hover:bg-primary/30 px-3 py-1.5 rounded-lg transition-colors">
                    详情
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
