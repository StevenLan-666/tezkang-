export default function BottomNav({ currentTab, setCurrentTab }: { currentTab: string, setCurrentTab: (tab: string) => void }) {
  return (
    <nav className="fixed bottom-0 w-full max-w-md bg-surface-light dark:bg-surface-dark border-t border-slate-200 dark:border-slate-800 pb-safe z-50">
      <div className="flex justify-between items-center h-16 px-4">
        <button onClick={() => setCurrentTab('dashboard')} className={`flex flex-col items-center justify-center w-12 h-full transition-colors ${currentTab === 'dashboard' ? 'text-primary' : 'text-slate-400 hover:text-primary'}`}>
          <span className={`material-symbols-outlined text-[24px] ${currentTab === 'dashboard' ? 'fill-1' : ''}`}>person</span>
          <span className="text-[10px] font-medium mt-1">个人综合</span>
        </button>
        <button onClick={() => setCurrentTab('social')} className={`flex flex-col items-center justify-center w-12 h-full transition-colors ${currentTab === 'social' ? 'text-primary' : 'text-slate-400 hover:text-primary'}`}>
          <span className={`material-symbols-outlined text-[24px] ${currentTab === 'social' ? 'fill-1' : ''}`}>group</span>
          <span className="text-[10px] font-medium mt-1">社交能力</span>
        </button>
        <div className="relative -top-6 flex flex-col items-center">
          <button onClick={() => setCurrentTab('services')} className="w-14 h-14 rounded-full bg-primary text-white shadow-lg shadow-primary/30 flex items-center justify-center transform transition-transform active:scale-95 border-4 border-background-light dark:border-background-dark">
            <span className="material-symbols-outlined text-3xl">add</span>
          </button>
          <span className={`absolute -bottom-5 text-[10px] font-medium whitespace-nowrap ${currentTab === 'services' ? 'text-primary' : 'text-slate-400'}`}>预约服务</span>
        </div>
        <button onClick={() => setCurrentTab('behavior')} className={`flex flex-col items-center justify-center w-12 h-full transition-colors ${currentTab === 'behavior' ? 'text-primary' : 'text-slate-400 hover:text-primary'}`}>
          <span className={`material-symbols-outlined text-[24px] ${currentTab === 'behavior' ? 'fill-1' : ''}`}>bar_chart</span>
          <span className="text-[10px] font-medium mt-1">行为表现</span>
        </button>
        <button onClick={() => setCurrentTab('decision')} className={`flex flex-col items-center justify-center w-12 h-full transition-colors ${currentTab === 'decision' ? 'text-primary' : 'text-slate-400 hover:text-primary'}`}>
          <span className={`material-symbols-outlined text-[24px] ${currentTab === 'decision' ? 'fill-1' : ''}`}>route</span>
          <span className="text-[10px] font-medium mt-1">决策方式</span>
        </button>
      </div>
    </nav>
  );
}
