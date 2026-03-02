import React from 'react';

interface ReservationSuccessProps {
  onViewAppointments: () => void;
  onBackHome: () => void;
  title?: string;
}

export default function ReservationSuccess({ onViewAppointments, onBackHome, title }: ReservationSuccessProps) {
  return (
    <div className="bg-background-light dark:bg-background-dark text-text-main dark:text-white min-h-screen flex flex-col justify-between antialiased">
      <div className="px-6 py-3 flex justify-between items-center text-xs font-semibold text-text-main dark:text-slate-300 opacity-90 z-20">
        <span>10:24</span>
        <div className="flex gap-1.5 items-center">
          <span className="material-symbols-outlined text-sm">signal_cellular_alt</span>
          <span className="material-symbols-outlined text-sm">wifi</span>
          <span className="material-symbols-outlined text-sm">battery_full</span>
        </div>
      </div>

      <main className="flex-1 flex flex-col items-center justify-center px-8 relative pb-24">
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none"></div>
        <div className="absolute top-10 right-[-2rem] w-48 h-48 bg-secondary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 left-[-2rem] w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>

        <div className="relative mb-8 animate-[scaleIn_0.5s_ease-out_forwards]">
          <div className="w-32 h-32 rounded-full bg-green-500/20 flex items-center justify-center animate-pulse">
            <div className="w-24 h-24 rounded-full bg-green-500 flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.4)]">
              <span className="material-symbols-outlined text-white text-6xl" style={{ fontVariationSettings: "'wght' 700" }}>check</span>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-4 h-4 bg-secondary rounded-full opacity-60"></div>
          <div className="absolute bottom-2 left-2 w-3 h-3 bg-warning rounded-full opacity-60"></div>
          <div className="absolute top-1/2 -left-6 w-2 h-2 bg-primary rounded-full opacity-60"></div>
        </div>

        <div className="text-center mb-10 animate-[fadeUp_0.6s_ease-out_0.2s_forwards]">
          <h1 className="text-3xl font-extrabold text-text-main dark:text-white mb-2 tracking-tight">预约成功</h1>
          <p className="text-text-sub dark:text-slate-400">您的预约已成功安排</p>
        </div>

        <div className="w-full bg-surface-light dark:bg-surface-dark rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 animate-[fadeUp_0.6s_ease-out_0.4s_forwards] relative overflow-hidden">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-1.5 bg-primary/30 rounded-b-xl"></div>
          <div className="flex flex-col gap-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-primary text-3xl">psychology</span>
              </div>
              <div>
                <h2 className="text-lg font-bold text-text-main dark:text-white leading-tight mb-1">{title || '感觉统合训练'}</h2>
                <span className="text-sm text-text-sub dark:text-slate-400">莎拉·威尔逊 医生</span>
              </div>
            </div>

            <div className="border-t border-dashed border-slate-200 dark:border-slate-700 w-full"></div>

            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <span className="material-symbols-outlined text-sm">calendar_month</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-text-sub dark:text-slate-400">日期 & 时间</span>
                  <span className="font-bold text-text-main dark:text-white text-sm">10月16日 周三 • 下午 14:00</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-500 dark:text-orange-400">
                  <span className="material-symbols-outlined text-sm">location_on</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-text-sub dark:text-slate-400">地点</span>
                  <span className="font-bold text-text-main dark:text-white text-sm">儿童健康中心, 302室</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button className="mt-6 flex items-center gap-2 text-primary font-bold text-sm animate-[fadeUp_0.6s_ease-out_0.4s_forwards] hover:opacity-80 transition-opacity">
          <span className="material-symbols-outlined text-lg">event_available</span>
          添加到日历
        </button>
      </main>

      <footer className="px-6 pb-8 pt-4 w-full bg-background-light dark:bg-background-dark z-10 pb-safe">
        <div className="flex flex-col gap-3">
          <button onClick={onViewAppointments} className="w-full py-4 bg-primary hover:bg-primary-dark text-white rounded-2xl font-bold text-lg shadow-lg shadow-primary/20 transition-colors flex items-center justify-center gap-2">
            查看我的预约
          </button>
          <button onClick={onBackHome} className="w-full py-4 bg-transparent border border-slate-200 dark:border-slate-700 text-text-sub dark:text-slate-400 hover:text-text-main dark:hover:text-white hover:border-slate-400 rounded-2xl font-bold text-lg transition-colors">
            返回首页
          </button>
        </div>
        <div className="w-1/3 h-1 bg-slate-300 dark:bg-slate-600 rounded-full mx-auto mt-6"></div>
      </footer>
    </div>
  );
}
