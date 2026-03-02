import React, { useState } from 'react';

interface ActivityDetailProps {
  onBack: () => void;
  onRegister: () => void;
  title?: string;
}

const ACTIVITY_DATA: Record<string, { image: string, desc: string, tags: string[] }> = {
  'ADHD儿童情绪管理夏令营': {
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAs-Z7O0AMJ7PXGl6vZu5-FQ3JNJd9HcocBNtMZNesLFyqbBV66gKk3wClj2D80s3lak4NkghL_YnzatCTslysoVkUV5FOMq0J2JgEH1DGif3vbt8wx5RfKo_VIC3GwZZttHAcZqSLvA6NXqsdii9RxYM49Pn6LS_vY8exPRsrGXMzW5LtkPxjrmW_ZI3wsgVHuUpzg8MceH_YfhLzUXSONk4ip3z7Ao0SVjBDkPc9ZXCCuTFwBw23LoCYTFMDL3acN2MXvxxhyE80O',
    desc: '专为ADHD儿童设计的情绪调节课程，通过游戏与互动帮助孩子识别和管理情绪，提升社交能力。',
    tags: ['情绪管理', '社交提升']
  },
  'ADHD 儿童感统专注力训练营': {
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBvHIqFqNvn0mAA1t9NzBOQG4bikTbxO1Zv5aOMbGfwdLtgwRr0d4Zsl1g0zucdWEHln47VYNH7HVko9erS8lvPceDhiQ72hsIxguiCZmeQDyU3dIhKhUjfNn9U5eUVsY4F9DiuARRtgnsrhhoI6rptPYQv6R2fxj7Eks2IzVoM7TyFNRIVVTT8GPo9FGrsvfSuYfMIWtmfnQxPLn2vwdQLr1Lz24kjTx126CQBYa10oDVIZwNfrs7jM_2wBZJrNvpvqoWyTIsgOm5i',
    desc: '本次活动旨在通过专业的感统训练，帮助 ADHD 儿童提升专注力和身体协调能力。我们将通过一系列有趣的游戏和互动，让孩子们在快乐中学习和成长。',
    tags: ['感统训练', '专注力']
  },
  '共情能力工作坊': {
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBWgXMCoejP-ji49PT_G4y_pHGMWgzucXvI-Dfg52VVmAGQfLoZoWgPyYzeem7tJK26t-lajTAtKWNe4MQUb2x06Hj2F9cUl6Erg-KGMtvl941P4324xD8bGo0TrJwZvRdvfh-ipNmYmI76nNKvlaCBH-3oMCryWuDSU3gTw5tbhssl6b_UsfOi1KoEbiIQKaL5OQvsaE4wj8oENafpGa_6KEerhbYY6ejkMGt5FWJAB9brFxtFbmh26BCg-gbkAO4WwyIyeFzH_sCs',
    desc: '引导孩子理解他人情绪，建立同理心，改善人际交往质量。通过角色扮演和情景模拟，让孩子学会换位思考。',
    tags: ['社交技能', '共情能力']
  },
  '注意力集中训练营': {
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBWgXMCoejP-ji49PT_G4y_pHGMWgzucXvI-Dfg52VVmAGQfLoZoWgPyYzeem7tJK26t-lajTAtKWNe4MQUb2x06Hj2F9cUl6Erg-KGMtvl941P4324xD8bGo0TrJwZvRdvfh-ipNmYmI76nNKvlaCBH-3oMCryWuDSU3gTw5tbhssl6b_UsfOi1KoEbiIQKaL5OQvsaE4wj8oENafpGa_6KEerhbYY6ejkMGt5FWJAB9brFxtFbmh26BCg-gbkAO4WwyIyeFzH_sCs',
    desc: '结合感统训练，有效提升孩子的专注时长和抗干扰能力。通过科学的视觉和听觉追踪训练，强化大脑执行功能。',
    tags: ['专注力', '抗干扰']
  },
  '专注力与冲动控制': {
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDCJhrTGsnpisibkRqqOuKw0VRd0KD2uVn6RR0_B5aVlhvR-lyWVsnTO4Uy7KblhLfvwmAwdBt20SYfb6jbsUNlLD1e52HN_26J_lJ53PlmcbeJQhaCWQyJ0aVwItN8aYIr6svWEgvruhnvlKFeXRkhodLzz4Hhjv9l7XXyduZQ4lPrM0y7maScpmOxy495VWFED0ZwQqC1BV9nQb3GASvMqMhxS3kS5oFo5MvtQLMeYmZetPAoi57cgWxI2UwdGhWSON46c6vtqoMO',
    desc: '学习在日常生活中做出更好决策的策略。通过延迟满足训练和冲动抑制练习，帮助孩子建立更好的自我控制能力。',
    tags: ['自我控制', '决策能力']
  }
};

export default function ActivityDetail({ onBack, onRegister, title }: ActivityDetailProps) {
  const [showToast, setShowToast] = useState(false);
  const currentTitle = title || 'ADHD 儿童感统专注力训练营';
  const data = ACTIVITY_DATA[currentTitle] || ACTIVITY_DATA['ADHD 儿童感统专注力训练营'];

  const handleShare = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

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
          <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url("${data.image}")` }}>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent"></div>
          <div className="absolute top-4 right-4">
            <span className="bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm bg-opacity-90 tracking-wide flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">local_fire_department</span>
              火热报名中
            </span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col gap-3">
            <div className="flex gap-2">
              {data.tags.map(tag => (
                <span key={tag} className="bg-white/20 backdrop-blur-md text-white text-[10px] px-2 py-0.5 rounded border border-white/20 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[10px]">label</span>
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="text-white text-2xl font-bold leading-tight shadow-sm tracking-tight">{currentTitle}</h1>
            <div className="flex flex-col gap-1.5 mt-1">
              <div className="flex items-center gap-2 text-slate-100 text-sm font-medium">
                <span className="material-symbols-outlined text-lg opacity-90">calendar_month</span>
                <span>2023年11月15日 - 11月17日</span>
              </div>
              <div className="flex items-center gap-2 text-slate-100 text-sm font-medium">
                <span className="material-symbols-outlined text-lg opacity-90">location_on</span>
                <span>上海市浦东新区儿童发展中心</span>
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
              {data.desc}
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
                  <p className="text-sm text-text-sub dark:text-slate-400 leading-relaxed flex items-start gap-1">
                    <span className="material-symbols-outlined text-sm mt-0.5 opacity-70">info</span>
                    <span>领取活动物资，认识新朋友，建立初步的信任关系。</span>
                  </p>
                </div>
              </div>
              
              <div className="relative flex gap-5 group">
                <div className="z-10 mt-1.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-white dark:bg-surface-dark ring-4 ring-slate-100 dark:ring-slate-700 shadow-sm">
                  <div className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-500"></div>
                </div>
                <div className="flex flex-col gap-1 w-full">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-base font-bold text-text-main dark:text-white opacity-90">感统训练基础课</h3>
                    <span className="text-xs font-medium text-text-sub dark:text-slate-400 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[10px]">schedule</span>
                      09:30
                    </span>
                  </div>
                  <p className="text-sm text-text-sub dark:text-slate-400 leading-relaxed flex items-start gap-1">
                    <span className="material-symbols-outlined text-sm mt-0.5 opacity-70">fitness_center</span>
                    <span>平衡与协调能力的初步训练，激发运动潜能。</span>
                  </p>
                </div>
              </div>
              
              <div className="relative flex gap-5 group">
                <div className="z-10 mt-1.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-white dark:bg-surface-dark ring-4 ring-slate-100 dark:ring-slate-700 shadow-sm">
                  <div className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-500"></div>
                </div>
                <div className="flex flex-col gap-1 w-full">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-base font-bold text-text-main dark:text-white opacity-90">茶歇休息</h3>
                    <span className="text-xs font-medium text-text-sub dark:text-slate-400 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[10px]">schedule</span>
                      10:30
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="relative flex gap-5 group">
                <div className="z-10 mt-1.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-white dark:bg-surface-dark ring-4 ring-slate-100 dark:ring-slate-700 shadow-sm">
                  <div className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-500"></div>
                </div>
                <div className="flex flex-col gap-1 w-full">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-base font-bold text-text-main dark:text-white opacity-90">专注力游戏挑战</h3>
                    <span className="text-xs font-medium text-text-sub dark:text-slate-400 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[10px]">schedule</span>
                      10:45
                    </span>
                  </div>
                  <p className="text-sm text-text-sub dark:text-slate-400 leading-relaxed flex items-start gap-1">
                    <span className="material-symbols-outlined text-sm mt-0.5 opacity-70">sports_esports</span>
                    <span>趣味互动游戏，在玩乐中提升专注时长。</span>
                  </p>
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
            <button className="text-primary text-sm font-semibold flex items-center gap-0.5 hover:text-primary-dark transition-colors">
              查看全部 
              <span className="material-symbols-outlined text-lg align-middle">chevron_right</span>
            </button>
          </div>
          
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 snap-x">
            <div className="snap-start shrink-0 w-72 p-4 rounded-2xl bg-white dark:bg-surface-dark shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-cover bg-center shrink-0 border border-slate-100 dark:border-slate-700 shadow-sm" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA16_gsHcqJO_dzQ5waxfyB6uPxdIL-OX6AzvDoQsi3RYk4EXyxyz49lYT4-0mvXO0rWtS8YJol5uwaBFtwQdDX3OSghntkXpfUXi1Q0pANgHKLUH6dnmaV5h0cc3GfjVKft0u8gODp_31NswP1Em7ShlcRyoz1cYz__SdAOHkSZs1iVfjbqdHIxejtxAhoTBtw3oxyXYVtPQsywdu5F8lu2lKrOKjN3jiKf8bSgwxJ77DqFM6HxGFjdI6irmzxUblasQECzq7-BVel")' }}></div>
              <div>
                <h3 className="font-bold text-text-main dark:text-white text-base flex items-center gap-1">
                  李医生
                  <span className="material-symbols-outlined fill-1 text-blue-500 text-sm" style={{ fontSize: '16px' }}>verified</span>
                </h3>
                <p className="text-xs text-primary bg-primary/5 inline-block px-2 py-0.5 rounded-md font-medium mt-1 border border-primary/10">儿童心理学博士</p>
                <p className="text-xs text-text-sub dark:text-slate-400 mt-1.5 line-clamp-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[10px]">school</span>
                  10年专注ADHD临床研究
                </p>
              </div>
            </div>
            
            <div className="snap-start shrink-0 w-72 p-4 rounded-2xl bg-white dark:bg-surface-dark shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-cover bg-center shrink-0 border border-slate-100 dark:border-slate-700 shadow-sm" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAnCJB3-w668eHKBxQH1EjmPvonLMOHwU7LTUI4m_2WhRBLnQWv_xLxHlFDH--YsVqWWxjQPHqZDyT5c2KpIFj0XQTWAFLrhU2S7jqN-FA9ZwtiJT1jgpXhZCK-NlFRdcMnk18v1LCgJjSjnq41qs8z2LaSdBXAIAP7FBej870YXV4XXw2fC0Fa61ebkQvPsQyHe_V0_3IvwoXDlKwYWUTIkPt0l-dg4Mw_ApFpwb4V7c9FIgKfUjFOFClhJdcF7n3n9VcY_5tTSQpm")' }}></div>
              <div>
                <h3 className="font-bold text-text-main dark:text-white text-base flex items-center gap-1">
                  张治疗师
                  <span className="material-symbols-outlined fill-1 text-blue-500 text-sm" style={{ fontSize: '16px' }}>verified</span>
                </h3>
                <p className="text-xs text-primary bg-primary/5 inline-block px-2 py-0.5 rounded-md font-medium mt-1 border border-primary/10">高级感统训练师</p>
                <p className="text-xs text-text-sub dark:text-slate-400 mt-1.5 line-clamp-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[10px]">toys</span>
                  擅长游戏化干预治疗
                </p>
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
              <span className="text-2xl font-bold text-text-main dark:text-white tracking-tight">299</span>
              <span className="text-xs text-slate-400 line-through decoration-slate-300 dark:decoration-slate-600">¥599</span>
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
