export default function Profile({ onLogout, onBack, profileName, profilePhone, childName }: { onLogout: () => void, onBack: () => void, profileName?: string, profilePhone?: string, childName?: string }) {
  return (
    <div className="flex-1 overflow-y-auto pb-24 bg-background-light dark:bg-background-dark">
      <div className="px-5 pt-3 pb-2 flex justify-between items-center bg-background-light dark:bg-background-dark z-20 sticky top-0">
        <div className="text-sm font-semibold tracking-wide text-text-main dark:text-slate-300">16:58</div>
        <div className="flex items-center space-x-1.5 text-text-main dark:text-slate-300">
          <span className="material-symbols-outlined text-[18px]">signal_cellular_alt</span>
          <span className="material-symbols-outlined text-[18px]">bluetooth</span>
          <span className="material-symbols-outlined text-[18px]">volume_off</span>
          <span className="material-symbols-outlined text-[18px] rotate-90">battery_full</span>
        </div>
      </div>

      <div className="flex items-center justify-between px-4 py-3 bg-background-light dark:bg-background-dark sticky top-8 z-10">
        <button onClick={onBack} className="p-1 -ml-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
          <span className="material-symbols-outlined text-2xl text-text-main dark:text-white">arrow_back</span>
        </button>
        <h1 className="text-lg font-bold text-text-main dark:text-white absolute left-1/2 transform -translate-x-1/2">选项</h1>
        <div className="w-8"></div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-8">
        <div className="mt-4 bg-surface-light dark:bg-surface-dark">
          <button className="w-full flex items-center justify-between px-4 py-4 active:bg-gray-100 dark:active:bg-gray-800 transition-colors border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <span className="text-[17px] text-text-main dark:text-white">监护人信息</span>
              <div className="flex items-center gap-2 text-text-sub dark:text-slate-400 text-[15px]">
                <span>{profileName || '未设置'}</span>
                <span>{profilePhone || '未设置'}</span>
              </div>
            </div>
            <span className="material-symbols-outlined text-text-sub dark:text-slate-400 text-xl">chevron_right</span>
          </button>

          <button className="w-full flex items-center justify-between px-4 py-4 active:bg-gray-100 dark:active:bg-gray-800 transition-colors">
            <div className="flex items-center gap-3">
              <span className="text-[17px] text-text-main dark:text-white">受监护人信息</span>
              <span className="text-text-sub dark:text-slate-400 text-[15px]">{childName || '未设置'}</span>
            </div>
            <span className="material-symbols-outlined text-text-sub dark:text-slate-400 text-xl">chevron_right</span>
          </button>
        </div>

        <div className="mt-8 bg-surface-light dark:bg-surface-dark">
          <button className="w-full flex items-center justify-between px-4 py-4 active:bg-gray-100 dark:active:bg-gray-800 transition-colors border-b border-slate-200 dark:border-slate-700">
            <span className="text-[17px] text-text-main dark:text-white">账号安全</span>
            <span className="material-symbols-outlined text-text-sub dark:text-slate-400 text-xl">chevron_right</span>
          </button>
        </div>

        <div className="mt-8 bg-surface-light dark:bg-surface-dark">
          <button className="w-full flex items-center justify-between px-4 py-4 active:bg-gray-100 dark:active:bg-gray-800 transition-colors border-b border-slate-200 dark:border-slate-700">
            <span className="text-[17px] text-text-main dark:text-white">设置</span>
            <span className="material-symbols-outlined text-text-sub dark:text-slate-400 text-xl">chevron_right</span>
          </button>
          <button className="w-full flex items-center justify-between px-4 py-4 active:bg-gray-100 dark:active:bg-gray-800 transition-colors border-b border-slate-200 dark:border-slate-700">
            <span className="text-[17px] text-text-main dark:text-white">用户协议</span>
            <span className="material-symbols-outlined text-text-sub dark:text-slate-400 text-xl">chevron_right</span>
          </button>
          <button className="w-full flex items-center justify-between px-4 py-4 active:bg-gray-100 dark:active:bg-gray-800 transition-colors border-b border-slate-200 dark:border-slate-700">
            <span className="text-[17px] text-text-main dark:text-white">隐私协议</span>
            <span className="material-symbols-outlined text-text-sub dark:text-slate-400 text-xl">chevron_right</span>
          </button>
          <button className="w-full flex items-center justify-between px-4 py-4 active:bg-gray-100 dark:active:bg-gray-800 transition-colors border-b border-slate-200 dark:border-slate-700">
            <span className="text-[17px] text-text-main dark:text-white">检查更新</span>
            <span className="material-symbols-outlined text-text-sub dark:text-slate-400 text-xl">chevron_right</span>
          </button>
          <button className="w-full flex items-center justify-between px-4 py-4 active:bg-gray-100 dark:active:bg-gray-800 transition-colors border-b border-slate-200 dark:border-slate-700">
            <span className="text-[17px] text-text-main dark:text-white">通知管理</span>
            <span className="material-symbols-outlined text-text-sub dark:text-slate-400 text-xl">chevron_right</span>
          </button>
          <button className="w-full flex items-center justify-between px-4 py-4 active:bg-gray-100 dark:active:bg-gray-800 transition-colors">
            <span className="text-[17px] text-text-main dark:text-white">版本更新</span>
            <span className="material-symbols-outlined text-text-sub dark:text-slate-400 text-xl">chevron_right</span>
          </button>
        </div>

        <div className="mt-8 bg-surface-light dark:bg-surface-dark mb-10">
          <button onClick={onLogout} className="w-full flex items-center justify-start px-4 py-4 active:bg-gray-100 dark:active:bg-gray-800 transition-colors">
            <span className="text-[17px] text-red-500 dark:text-red-400">退出账号</span>
          </button>
        </div>
      </div>
    </div>
  );
}
