export default function BehaviorDetail({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden antialiased pb-10 bg-gray-50">
      <header className="flex items-center justify-between px-4 py-3 sticky top-0 z-50 bg-background-light/95 backdrop-blur-md border-b border-slate-100">
        <button onClick={onBack} className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-100 active:bg-slate-200 transition-colors text-text-main">
          <span className="material-symbols-outlined font-light">arrow_back_ios_new</span>
        </button>
        <h1 className="text-lg font-bold text-text-main absolute left-1/2 -translate-x-1/2">行为模式深度分析</h1>
        <div className="flex size-10 items-center justify-end cursor-pointer hover:bg-slate-100 rounded-full transition-colors justify-center">
          <span className="material-symbols-outlined text-text-main text-2xl">ios_share</span>
        </div>
      </header>

      <div className="flex-1 flex flex-col gap-6 p-4 pb-8">
        <div className="flex items-center justify-between bg-white rounded-xl p-3 px-5 shadow-sm border border-slate-100">
          <span className="text-sm text-slate-500 font-medium">统计周期</span>
          <div className="flex items-center gap-2 text-primary font-bold text-sm cursor-pointer hover:opacity-80 transition-opacity bg-primary/10 px-3 py-1.5 rounded-lg">
            <span>过去 30 天</span>
            <span className="material-symbols-outlined text-sm">expand_more</span>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1 px-1">
            <h2 className="text-text-main tracking-tight text-lg font-bold leading-tight">诱因-行为因果流动图</h2>
            <p className="text-slate-500 text-sm font-normal leading-relaxed">分析高频诱因及其引发的具体行为关联。</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex justify-between items-start mb-8 border-b border-slate-100 pb-4">
              <div className="flex flex-col">
                <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">总记录行为</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-text-main text-3xl font-bold">124</p>
                  <span className="text-sm text-slate-500 font-normal">次</span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-1 text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                  <span className="material-symbols-outlined text-sm">trending_up</span>
                  <span className="text-xs font-bold">+5%</span>
                </div>
                <p className="text-slate-400 text-[10px] mt-1.5">环比上月</p>
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-[auto_1fr] gap-4 items-center group">
                <div className="text-right w-20">
                  <p className="text-text-main text-sm font-bold">作业压力</p>
                  <p className="text-slate-400 text-xs">42次 (34%)</p>
                </div>
                <div className="relative h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="absolute top-0 left-0 h-full bg-primary rounded-full transition-all duration-500 ease-out group-hover:bg-primary-dark" style={{ width: '75%' }}></div>
                </div>
              </div>
              <div className="grid grid-cols-[auto_1fr] gap-4 items-center group">
                <div className="text-right w-20">
                  <p className="text-text-main text-sm font-bold">睡眠不足</p>
                  <p className="text-slate-400 text-xs">28次 (22%)</p>
                </div>
                <div className="relative h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="absolute top-0 left-0 h-full bg-purple-400 rounded-full transition-all duration-500 ease-out group-hover:opacity-80" style={{ width: '50%' }}></div>
                </div>
              </div>
              <div className="grid grid-cols-[auto_1fr] gap-4 items-center group">
                <div className="text-right w-20">
                  <p className="text-text-main text-sm font-bold">屏幕限制</p>
                  <p className="text-slate-400 text-xs">21次 (17%)</p>
                </div>
                <div className="relative h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="absolute top-0 left-0 h-full bg-blue-400 rounded-full transition-all duration-500 ease-out group-hover:opacity-80" style={{ width: '38%' }}></div>
                </div>
              </div>
              <div className="grid grid-cols-[auto_1fr] gap-4 items-center group">
                <div className="text-right w-20">
                  <p className="text-text-main text-sm font-bold">社交挫折</p>
                  <p className="text-slate-400 text-xs">15次 (12%)</p>
                </div>
                <div className="relative h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="absolute top-0 left-0 h-full bg-orange-400 rounded-full transition-all duration-500 ease-out group-hover:opacity-80" style={{ width: '25%' }}></div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 flex gap-4 items-start shadow-sm">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0 border border-primary/20 shadow-sm">
              <span className="material-symbols-outlined text-primary text-lg">lightbulb</span>
            </div>
            <div>
              <h4 className="text-primary font-bold text-sm mb-1.5">关键发现</h4>
              <p className="text-slate-500 text-xs leading-relaxed text-justify">
                当<span className="font-bold text-primary">“作业压力”</span>与<span className="font-bold text-purple-500">“睡眠不足”</span>同时出现时，爆发持续时间平均延长 15 分钟。建议优先调整晚间作息。
              </p>
            </div>
          </div>
        </div>

        <div className="h-px w-full bg-slate-200 my-2"></div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1 px-1">
            <div className="flex justify-between items-center">
              <h2 className="text-text-main tracking-tight text-lg font-bold leading-tight">情绪火山爆发图</h2>
              <span className="material-symbols-outlined text-slate-400 text-xl cursor-pointer hover:text-primary transition-colors">info</span>
            </div>
            <p className="text-slate-500 text-sm font-normal leading-relaxed">记录情绪爆发的强度与持续时长分布。</p>
          </div>
          <div className="bg-white rounded-2xl p-6 pb-2 shadow-sm border border-slate-100 relative overflow-hidden min-h-[320px]">
            <div className="absolute inset-0 p-6 pt-12 pb-10 grid grid-rows-4 grid-cols-1 gap-0 pointer-events-none opacity-40">
              <div className="border-b border-dashed border-slate-300 w-full h-full"></div>
              <div className="border-b border-dashed border-slate-300 w-full h-full"></div>
              <div className="border-b border-dashed border-slate-300 w-full h-full"></div>
              <div className="border-b border-transparent w-full h-full"></div>
            </div>
            <div className="absolute left-3 top-6 text-[10px] text-slate-400 font-medium bg-white px-1 z-10">强度</div>
            <div className="relative h-[240px] w-full mt-6">
              <div className="absolute bottom-[70%] left-[20%] w-20 h-20 rounded-full bg-red-500/10 border border-red-500 flex items-center justify-center backdrop-blur-sm z-10 shadow-[0_0_20px_rgba(239,68,68,0.2)] animate-pulse">
                <div className="text-center">
                  <span className="block text-[10px] font-bold text-red-500">Lv.5</span>
                  <span className="block text-[8px] text-red-500/80">35min</span>
                </div>
              </div>
              <div className="absolute bottom-[40%] left-[50%] w-12 h-12 rounded-full bg-orange-500/15 border border-orange-500 flex items-center justify-center backdrop-blur-sm z-10 hover:scale-110 transition-transform cursor-pointer">
                <span className="text-[9px] font-bold text-orange-500">Lv.3</span>
              </div>
              <div className="absolute bottom-[20%] left-[70%] w-14 h-14 rounded-full bg-yellow-500/15 border border-yellow-500 flex items-center justify-center backdrop-blur-sm z-10 hover:scale-110 transition-transform cursor-pointer">
                <span className="text-[9px] font-bold text-yellow-600">Lv.2</span>
              </div>
              <div className="absolute bottom-[55%] left-[38%] w-10 h-10 rounded-full bg-orange-500/15 border border-orange-500 flex items-center justify-center backdrop-blur-sm z-0 opacity-70 hover:opacity-100 transition-opacity">
              </div>
              <div className="absolute bottom-[25%] left-[10%] w-8 h-8 rounded-full bg-yellow-500/15 border border-yellow-500 flex items-center justify-center backdrop-blur-sm z-0 opacity-50">
              </div>
              <div className="absolute -bottom-2 w-full flex justify-between text-[10px] text-slate-400 pt-2 px-2">
                <span>0min</span>
                <span>15min</span>
                <span>30min</span>
                <span>45min+</span>
              </div>
            </div>
            <div className="absolute right-3 bottom-3 text-[10px] text-slate-400 font-medium bg-white px-1">持续时长</div>
          </div>
          <div className="flex gap-6 justify-center mt-1">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
              <span className="text-xs text-slate-500">高强度</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-orange-500"></div>
              <span className="text-xs text-slate-500">中强度</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
              <span className="text-xs text-slate-500">低强度</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
