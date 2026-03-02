export default function Dashboard({ onOpenProfile, onOpenPhysicalDataUpdate, onOpenNextAppointment, nextAppointment, onOpenHistory, childName, profileName }: { onOpenProfile?: () => void, onOpenPhysicalDataUpdate?: () => void, onOpenNextAppointment?: (type: 'activity' | 'service') => void, nextAppointment?: { title: string, date: string, time: string, type: 'activity' | 'service' }, onOpenHistory?: (category: string) => void, childName?: string, profileName?: string }) {
  return (
    <div className="flex-1 overflow-y-auto pb-24">
      <div className="px-6 py-3 flex justify-between items-center text-xs font-semibold text-text-main dark:text-slate-300 opacity-70 sticky top-0 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md z-10">
        <span>16:58</span>
        <div className="flex gap-1.5 items-center">
          <span className="material-symbols-outlined text-sm !text-[18px]">signal_cellular_alt</span>
          <span className="material-symbols-outlined text-sm !text-[18px]">wifi</span>
          <span className="material-symbols-outlined text-sm !text-[18px]">battery_full</span>
        </div>
      </div>

      <header className="px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-text-main dark:text-white tracking-tight">你好, {childName || '小朋友'} 👋</h1>
          <p className="text-sm text-text-sub dark:text-slate-400 mt-0.5 font-medium">每日健康概览</p>
        </div>
        <button onClick={onOpenProfile} className="w-12 h-12 rounded-full bg-surface-light dark:bg-surface-dark shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-center relative group active:scale-95 transition-all">
          <span className="material-symbols-outlined text-text-sub group-hover:text-primary transition-colors">person</span>
        </button>
      </header>

      <main className="px-6 space-y-8">
        <section className="flex flex-col items-center justify-center py-2">
          <div className="relative w-64 h-64 flex items-center justify-center">
            <div className="absolute w-full h-full rounded-full border border-primary/10 dark:border-primary/20 animate-[pulse_3s_ease-in-out_infinite]"></div>
            <div className="absolute w-52 h-52 rounded-full border border-primary/10 dark:border-primary/20"></div>
            <svg className="w-60 h-60 transform -rotate-90">
              <circle className="text-gray-100 dark:text-gray-800" cx="120" cy="120" fill="transparent" r="96" stroke="currentColor" strokeLinecap="round" strokeWidth="12"></circle>
              <circle className="text-primary shadow-sm transition-all duration-1000 ease-in-out" cx="120" cy="120" fill="transparent" r="96" stroke="currentColor" strokeDasharray="603" strokeDashoffset="120" strokeLinecap="round" strokeWidth="12"></circle>
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-text-sub dark:text-slate-400 text-xs font-bold tracking-widest uppercase mb-1">健康指数</span>
              <span className="text-6xl font-black text-primary tracking-tighter">85</span>
              <div className="flex items-center gap-1 mt-2 bg-success/10 px-3 py-1 rounded-full">
                <span className="material-symbols-outlined text-sm text-success">trending_up</span>
                <span className="text-success text-xs font-bold">+2.4%</span>
              </div>
              <span className="text-primary/60 font-bold mt-2 text-sm uppercase tracking-widest">优 +</span>
            </div>
          </div>
        </section>

        <section>
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-lg font-bold text-text-main dark:text-white">体格数据</h2>
            <button onClick={onOpenPhysicalDataUpdate} className="text-primary text-sm font-bold flex items-center bg-primary/10 px-3 py-1.5 rounded-lg hover:bg-primary/20 transition-colors">
              更新 <span className="material-symbols-outlined text-sm ml-1">edit</span>
            </button>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-surface-light dark:bg-surface-dark p-4 rounded-2xl shadow-sm flex flex-col items-center justify-center text-center border border-gray-100 dark:border-gray-800">
              <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-2">
                <span className="material-symbols-outlined text-primary text-[20px]">monitor_weight</span>
              </div>
              <span className="text-xs text-text-sub dark:text-slate-400 font-semibold">体重</span>
              <div className="mt-1">
                <span className="text-lg font-bold text-text-main dark:text-white">32.5</span>
                <span className="text-[10px] text-text-sub dark:text-slate-400 font-bold uppercase ml-0.5">kg</span>
              </div>
            </div>

            <div className="bg-surface-light dark:bg-surface-dark p-4 rounded-2xl shadow-sm flex flex-col items-center justify-center text-center border border-gray-100 dark:border-gray-800">
              <div className="w-10 h-10 rounded-full bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center mb-2">
                <span className="material-symbols-outlined text-secondary text-[20px]">height</span>
              </div>
              <span className="text-xs text-text-sub dark:text-slate-400 font-semibold">身高</span>
              <div className="mt-1">
                <span className="text-lg font-bold text-text-main dark:text-white">138</span>
                <span className="text-[10px] text-text-sub dark:text-slate-400 font-bold uppercase ml-0.5">cm</span>
              </div>
            </div>

            <div className="bg-surface-light dark:bg-surface-dark p-4 rounded-2xl shadow-sm flex flex-col items-center justify-center text-center border border-gray-100 dark:border-gray-800 relative overflow-hidden group">
              <div className="absolute inset-0 bg-success/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center mb-2">
                <span className="material-symbols-outlined text-success text-[20px]">calculate</span>
              </div>
              <span className="text-xs text-text-sub dark:text-slate-400 font-semibold">BMI</span>
              <div className="mt-1">
                <span className="text-lg font-bold text-success">17.1</span>
              </div>
              <span className="text-[10px] text-success font-bold mt-1 bg-success/15 px-2 py-0.5 rounded-md">正常</span>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-surface-light dark:bg-surface-dark p-5 rounded-3xl shadow-sm flex flex-col justify-between h-40 relative overflow-hidden group border border-gray-100 dark:border-gray-800">
            <svg className="absolute bottom-0 left-0 w-full h-16 opacity-10 text-danger" preserveAspectRatio="none" viewBox="0 0 100 25">
              <path d="M0 25 L0 10 Q15 25 30 10 T60 10 T90 20 L100 25 Z" fill="currentColor"></path>
            </svg>
            <div className="flex justify-between items-start z-10">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-danger/10 rounded-xl">
                  <span className="material-symbols-outlined text-danger text-[20px]">favorite</span>
                </div>
                <span className="font-bold text-text-main dark:text-white text-sm">心率</span>
              </div>
              <span className="text-[10px] font-bold text-text-sub dark:text-slate-400 bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-lg">平均</span>
            </div>
            <div className="flex items-end gap-2 z-10">
              <span className="text-4xl font-extrabold text-text-main dark:text-white">98</span>
              <span className="text-sm font-semibold text-text-sub dark:text-slate-400 mb-1.5">bpm</span>
            </div>
            <div className="flex items-end gap-1 h-8 mt-1 opacity-80">
              <div className="w-1.5 bg-danger/20 h-3 rounded-full"></div>
              <div className="w-1.5 bg-danger/40 h-5 rounded-full"></div>
              <div className="w-1.5 bg-danger/60 h-4 rounded-full"></div>
              <div className="w-1.5 bg-danger h-7 rounded-full"></div>
              <div className="w-1.5 bg-danger/80 h-6 rounded-full"></div>
              <div className="w-1.5 bg-danger/50 h-5 rounded-full"></div>
              <div className="w-1.5 bg-danger/30 h-8 rounded-full"></div>
            </div>
          </div>

          <div className="bg-primary dark:bg-primary-dark p-5 rounded-3xl shadow-lg shadow-primary/20 flex flex-col justify-between h-40 relative overflow-hidden text-white">
            <div className="absolute -right-4 -bottom-4 opacity-10 rotate-12">
              <span className="material-symbols-outlined text-[100px] text-white">directions_run</span>
            </div>
            <div className="flex justify-between items-start z-10">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                  <span className="material-symbols-outlined text-white text-[20px]">directions_run</span>
                </div>
                <span className="font-bold text-white text-sm">活动量</span>
              </div>
            </div>
            <div className="z-10 mt-2">
              <div className="flex items-end gap-2">
                <span className="text-4xl font-extrabold text-white">45</span>
                <span className="text-sm font-medium text-white/90 mb-1.5">分钟</span>
              </div>
              <div className="flex items-center justify-between text-[10px] text-white/80 mt-2 mb-1">
                <span>进度</span>
                <span>75%</span>
              </div>
              <div className="w-full bg-black/10 h-2 rounded-full backdrop-blur-sm">
                <div className="bg-white h-2 rounded-full w-3/4 shadow-sm"></div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text-main dark:text-white mb-4">下次预约</h2>
          <div onClick={() => onOpenNextAppointment?.(nextAppointment?.type || 'service')} className="bg-surface-light dark:bg-surface-dark p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center justify-between group cursor-pointer hover:border-primary/30 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-900/20 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">calendar_month</span>
              </div>
              <div>
                <h3 className="font-bold text-text-main dark:text-white text-sm">{nextAppointment?.title || '感觉统合训练'}</h3>
                <div className="flex items-center gap-2 mt-1.5 text-text-sub dark:text-slate-400">
                  <span className="text-xs font-medium bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">{nextAppointment?.date || '10月16日'}</span>
                  <span className="text-xs font-medium">{nextAppointment?.time || '14:00'}</span>
                </div>
              </div>
            </div>
            <button className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-800 group-hover:bg-primary/10 group-hover:text-primary transition-all flex items-center justify-center text-text-sub">
              <span className="material-symbols-outlined text-sm">arrow_forward_ios</span>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
