import React, { useState } from 'react';

interface ServiceDetailProps {
  onBack: () => void;
  onRegister: () => void;
  title?: string;
}

const SERVICE_DATA: Record<string, { image: string, desc: string, tags: string[], expert: string, expertTitle: string }> = {
  '一对一心理咨询与行为干预': {
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBWgXMCoejP-ji49PT_G4y_pHGMWgzucXvI-Dfg52VVmAGQfLoZoWgPyYzeem7tJK26t-lajTAtKWNe4MQUb2x06Hj2F9cUl6Erg-KGMtvl941P4324xD8bGo0TrJwZvRdvfh-ipNmYmI76nNKvlaCBH-3oMCryWuDSU3gTw5tbhssl6b_UsfOi1KoEbiIQKaL5OQvsaE4wj8oENafpGa_6KEerhbYY6ejkMGt5FWJAB9brFxtFbmh26BCg-gbkAO4WwyIyeFzH_sCs',
    desc: '由资深儿童心理专家提供个性化的评估与干预方案，帮助孩子改善注意力、控制冲动，并提升社交技能。我们将结合认知行为疗法（CBT）和家庭系统疗法。',
    tags: ['心理咨询', '一对一'],
    expert: '李医生',
    expertTitle: '主任医师 / 儿童心理学博士'
  },
  '社交技能提升班': {
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDCJhrTGsnpisibkRqqOuKw0VRd0KD2uVn6RR0_B5aVlhvR-lyWVsnTO4Uy7KblhLfvwmAwdBt20SYfb6jbsUNlLD1e52HN_26J_lJ53PlmcbeJQhaCWQyJ0aVwItN8aYIr6svWEgvruhnvlKFeXRkhodLzz4Hhjv9l7XXyduZQ4lPrM0y7maScpmOxy495VWFED0ZwQqC1BV9nQb3GASvMqMhxS3kS5oFo5MvtQLMeYmZetPAoi57cgWxI2UwdGhWSON46c6vtqoMO',
    desc: '通过互动游戏和角色扮演，提升孩子在集体环境中的沟通与协作能力。重点培养孩子的轮流意识、分享习惯和冲突解决能力。',
    tags: ['社交技能', '小组互动'],
    expert: '王老师',
    expertTitle: '高级家庭教育指导师'
  },
  '行为规范引导课': {
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDCJhrTGsnpisibkRqqOuKw0VRd0KD2uVn6RR0_B5aVlhvR-lyWVsnTO4Uy7KblhLfvwmAwdBt20SYfb6jbsUNlLD1e52HN_26J_lJ53PlmcbeJQhaCWQyJ0aVwItN8aYIr6svWEgvruhnvlKFeXRkhodLzz4Hhjv9l7XXyduZQ4lPrM0y7maScpmOxy495VWFED0ZwQqC1BV9nQb3GASvMqMhxS3kS5oFo5MvtQLMeYmZetPAoi57cgWxI2UwdGhWSON46c6vtqoMO',
    desc: '通过专业引导，帮助孩子建立良好的日常行为规范和自律习惯。针对ADHD儿童的特点，设计可视化的行为契约和奖励机制。',
    tags: ['行为规范', '自律养成'],
    expert: '张医生',
    expertTitle: '康复治疗师'
  },
  '情绪调节': {
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBWgXMCoejP-ji49PT_G4y_pHGMWgzucXvI-Dfg52VVmAGQfLoZoWgPyYzeem7tJK26t-lajTAtKWNe4MQUb2x06Hj2F9cUl6Erg-KGMtvl941P4324xD8bGo0TrJwZvRdvfh-ipNmYmI76nNKvlaCBH-3oMCryWuDSU3gTw5tbhssl6b_UsfOi1KoEbiIQKaL5OQvsaE4wj8oENafpGa_6KEerhbYY6ejkMGt5FWJAB9brFxtFbmh26BCg-gbkAO4WwyIyeFzH_sCs',
    desc: '一对一咨询，促进情感成长和稳定。帮助孩子识别情绪诱因，学习有效的情绪调节技巧，减少情绪爆发。',
    tags: ['情绪调节', '心理健康'],
    expert: '刘老师',
    expertTitle: '资深评估师'
  },
  '日常测试和干预': {
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBWgXMCoejP-ji49PT_G4y_pHGMWgzucXvI-Dfg52VVmAGQfLoZoWgPyYzeem7tJK26t-lajTAtKWNe4MQUb2x06Hj2F9cUl6Erg-KGMtvl941P4324xD8bGo0TrJwZvRdvfh-ipNmYmI76nNKvlaCBH-3oMCryWuDSU3gTw5tbhssl6b_UsfOi1KoEbiIQKaL5OQvsaE4wj8oENafpGa_6KEerhbYY6ejkMGt5FWJAB9brFxtFbmh26BCg-gbkAO4WwyIyeFzH_sCs',
    desc: '由专业老师进行全面评估，提供日常行为和社交能力的测试与干预指导。定期追踪孩子的进步情况，动态调整干预计划。',
    tags: ['全面评估', '定期追踪'],
    expert: '刘老师',
    expertTitle: '资深评估师'
  }
};

export default function ServiceDetail({ onBack, onRegister, title }: ServiceDetailProps) {
  const [showToast, setShowToast] = useState(false);
  const currentTitle = title || '一对一心理咨询与行为干预';
  const data = SERVICE_DATA[currentTitle] || SERVICE_DATA['一对一心理咨询与行为干预'];

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
          <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url("${data.image}")` }}>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent"></div>
          <div className="absolute top-4 right-4">
            <span className="bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm bg-opacity-90 tracking-wide flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">event_available</span>
              可预约
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
                <span className="material-symbols-outlined text-lg opacity-90">schedule</span>
                <span>每次 50 分钟</span>
              </div>
              <div className="flex items-center gap-2 text-slate-100 text-sm font-medium">
                <span className="material-symbols-outlined text-lg opacity-90">location_on</span>
                <span>线上视频 / 线下诊室</span>
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
              {data.desc}
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
              <div className="h-16 w-16 rounded-full bg-cover bg-center shrink-0 border border-slate-100 dark:border-slate-700 shadow-sm" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA16_gsHcqJO_dzQ5waxfyB6uPxdIL-OX6AzvDoQsi3RYk4EXyxyz49lYT4-0mvXO0rWtS8YJol5uwaBFtwQdDX3OSghntkXpfUXi1Q0pANgHKLUH6dnmaV5h0cc3GfjVKft0u8gODp_31NswP1Em7ShlcRyoz1cYz__SdAOHkSZs1iVfjbqdHIxejtxAhoTBtw3oxyXYVtPQsywdu5F8lu2lKrOKjN3jiKf8bSgwxJ77DqFM6HxGFjdI6irmzxUblasQECzq7-BVel")' }}></div>
              <div>
                <h3 className="font-bold text-text-main dark:text-white text-lg flex items-center gap-1">
                  {data.expert}
                  <span className="material-symbols-outlined fill-1 text-blue-500 text-sm" style={{ fontSize: '18px' }}>verified</span>
                </h3>
                <p className="text-sm text-text-sub dark:text-slate-400 mt-0.5">{data.expertTitle}</p>
                <div className="flex items-center gap-1 mt-2">
                  <span className="material-symbols-outlined text-yellow-400 text-sm">star</span>
                  <span className="text-sm font-bold text-text-main dark:text-white">4.9</span>
                  <span className="text-xs text-text-sub dark:text-slate-400 ml-1">(128条评价)</span>
                </div>
              </div>
            </div>
            <p className="text-sm text-text-sub dark:text-slate-400 leading-relaxed">
              从事儿童心理卫生工作15年，擅长儿童及青少年多动症（ADHD）、抽动症、孤独症谱系障碍的诊断与综合干预。曾赴海外进修儿童认知行为治疗。
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
              <span className="text-2xl font-bold text-text-main dark:text-white tracking-tight">600</span>
              <span className="text-xs text-slate-400">/次</span>
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
