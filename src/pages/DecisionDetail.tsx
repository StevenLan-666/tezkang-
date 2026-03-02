export default function DecisionDetail({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden antialiased pb-10 bg-gray-50">
      <header className="flex items-center justify-between px-4 py-3 sticky top-0 z-50 bg-background-light/95 backdrop-blur-md border-b border-slate-100">
        <button onClick={onBack} className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-100 active:bg-slate-200 transition-colors text-text-main">
          <span className="material-symbols-outlined font-light">arrow_back_ios_new</span>
        </button>
        <h1 className="text-lg font-bold text-text-main absolute left-1/2 -translate-x-1/2">决策方式深度分析</h1>
        <div className="w-10"></div> 
      </header>

      <div className="flex-1 flex flex-col gap-6 p-5 pb-8">
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-text-main tracking-tight text-lg font-bold leading-tight flex items-center gap-2">
              认知灵活性
            </h3>
            <button className="text-primary text-sm font-medium hover:text-primary-dark transition-colors">查看详情</button>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
            <div className="flex items-center gap-6 justify-center py-4">
              <div className="relative w-36 h-36 rounded-full flex items-center justify-center shadow-inner" style={{ background: 'conic-gradient(from 0deg, #509BB0 0% 45%, #81B29A 45% 75%, #F4A261 75% 100%)' }}>
                <div className="absolute inset-3 bg-white rounded-full flex flex-col items-center justify-center shadow-sm">
                  <span className="text-xs text-slate-500 mb-1">综合评分</span>
                  <span className="text-3xl font-bold text-text-main tracking-tighter">82</span>
                </div>
              </div>
              <div className="flex flex-col gap-3 flex-1 pl-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary shadow-sm"></div>
                  <span className="text-sm text-slate-500 flex-1">灵活应对</span>
                  <span className="text-sm font-bold text-text-main">45%</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#81B29A] shadow-sm"></div>
                  <span className="text-sm text-slate-500 flex-1">固执坚持</span>
                  <span className="text-sm font-bold text-text-main">30%</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#F4A261] shadow-sm"></div>
                  <span className="text-sm text-slate-500 flex-1">随机尝试</span>
                  <span className="text-sm font-bold text-text-main">25%</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-100">
              <div className="flex flex-col items-center justify-center gap-1 rounded-lg p-3 bg-primary/10">
                <span className="text-slate-500 text-xs">反应速度</span>
                <p className="text-text-main text-lg font-bold">1.2<span className="text-xs font-normal ml-0.5 text-slate-500">s</span></p>
              </div>
              <div className="flex flex-col items-center justify-center gap-1 rounded-lg p-3 bg-primary/10">
                <span className="text-slate-500 text-xs">正确率</span>
                <p className="text-text-main text-lg font-bold">92<span className="text-xs font-normal ml-0.5 text-slate-500">%</span></p>
              </div>
              <div className="flex flex-col items-center justify-center gap-1 rounded-lg p-3 bg-green-50">
                <span className="text-slate-500 text-xs">进步幅度</span>
                <p className="text-green-500 text-lg font-bold">+5<span className="text-xs font-normal ml-0.5 text-green-500/80">%</span></p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-text-main tracking-tight text-lg font-bold leading-tight flex items-center gap-2">
              独立完成阶梯图
            </h3>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 overflow-hidden relative">
            <div className="absolute inset-0 top-6 left-12 right-6 bottom-10 flex flex-col justify-between pointer-events-none opacity-20">
              <div className="w-full h-px bg-slate-200 border-t border-dashed border-slate-400"></div>
              <div className="w-full h-px bg-slate-200 border-t border-dashed border-slate-400"></div>
              <div className="w-full h-px bg-slate-200 border-t border-dashed border-slate-400"></div>
              <div className="w-full h-px bg-slate-200 border-t border-dashed border-slate-400"></div>
            </div>
            <div className="flex items-end justify-between h-48 gap-3 pl-8 pt-4 pb-2 relative">
              <div className="absolute left-0 top-4 bottom-2 flex flex-col justify-between text-xs text-slate-500 font-medium h-full pr-2">
                <span>完全</span>
                <span>部分</span>
                <span>提示</span>
                <span>依赖</span>
              </div>
              <div className="flex flex-col items-center gap-2 flex-1 group">
                <div className="w-full bg-gray-100 rounded-t-lg relative h-full flex items-end overflow-hidden">
                  <div className="w-full bg-primary/40 h-[30%] rounded-t-lg transition-all duration-500 group-hover:bg-primary/60"></div>
                </div>
                <span className="text-xs text-slate-500">周一</span>
              </div>
              <div className="flex flex-col items-center gap-2 flex-1 group">
                <div className="w-full bg-gray-100 rounded-t-lg relative h-full flex items-end overflow-hidden">
                  <div className="w-full bg-primary/50 h-[45%] rounded-t-lg transition-all duration-500 group-hover:bg-primary/70"></div>
                </div>
                <span className="text-xs text-slate-500">周二</span>
              </div>
              <div className="flex flex-col items-center gap-2 flex-1 group">
                <div className="w-full bg-gray-100 rounded-t-lg relative h-full flex items-end overflow-hidden">
                  <div className="w-full bg-primary/60 h-[60%] rounded-t-lg transition-all duration-500 group-hover:bg-primary/80"></div>
                </div>
                <span className="text-xs text-slate-500">周三</span>
              </div>
              <div className="flex flex-col items-center gap-2 flex-1 group">
                <div className="w-full bg-gray-100 rounded-t-lg relative h-full flex items-end overflow-hidden">
                  <div className="w-full bg-primary/80 h-[50%] rounded-t-lg transition-all duration-500 group-hover:bg-primary"></div>
                </div>
                <span className="text-xs text-slate-500">周四</span>
              </div>
              <div className="flex flex-col items-center gap-2 flex-1 group">
                <div className="w-full bg-primary/20 rounded-t-lg relative h-full flex items-end overflow-visible">
                  <div className="w-full bg-primary h-[85%] relative rounded-t-lg shadow-lg shadow-primary/20">
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-text-main text-white text-[10px] px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md">
                      85%
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-text-main"></div>
                    </div>
                  </div>
                </div>
                <span className="text-xs font-bold text-primary">今天</span>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-text-main tracking-tight text-lg font-bold leading-tight flex items-center gap-2">
              思考时钟
            </h3>
            <div className="flex gap-3">
              <span className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium"><span className="block w-2 h-2 rounded-full bg-primary shadow-sm"></span>本次</span>
              <span className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium"><span className="block w-2 h-2 rounded-full bg-gray-300"></span>历史</span>
            </div>
          </div>
          <div className="bg-white rounded-xl p-1 shadow-sm border border-slate-100 relative overflow-hidden">
            <div className="aspect-square relative m-3">
              <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 rounded-lg overflow-hidden">
                <div className="bg-red-50/60 border-r border-b border-dashed border-gray-200 flex p-3">
                  <span className="text-xs font-semibold text-red-400">冲动区</span>
                </div>
                <div className="bg-emerald-50/60 border-b border-dashed border-gray-200 flex justify-end p-3">
                  <span className="text-xs font-semibold text-emerald-500">平衡区</span>
                </div>
                <div className="bg-amber-50/60 border-r border-dashed border-gray-200 flex items-end p-3">
                  <span className="text-xs font-semibold text-amber-500">懊悔区</span>
                </div>
                <div className="bg-gray-50/60 flex justify-end items-end p-3">
                  <span className="text-xs font-semibold text-gray-400">犹豫区</span>
                </div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-full h-px bg-gray-300"></div>
                <div className="h-full w-px bg-gray-300 absolute"></div>
              </div>
              <div className="absolute inset-0">
                <div className="absolute top-[20%] left-[30%] w-2.5 h-2.5 rounded-full bg-gray-300 opacity-60"></div>
                <div className="absolute top-[60%] left-[20%] w-2.5 h-2.5 rounded-full bg-gray-300 opacity-60"></div>
                <div className="absolute top-[70%] left-[75%] w-2.5 h-2.5 rounded-full bg-gray-300 opacity-60"></div>
                <div className="absolute top-[40%] left-[60%] w-3 h-3 rounded-full bg-gray-300 opacity-80"></div>
                <div className="absolute top-[35%] right-[35%] w-4 h-4 rounded-full bg-primary shadow-[0_0_0_4px_rgba(80,155,176,0.15)] border-2 border-white z-10 animate-pulse"></div>
                <div className="absolute top-[35%] right-[35%] -translate-y-9 text-[10px] font-bold text-primary bg-white px-2 py-1 rounded shadow-md border border-primary/10 whitespace-nowrap">最新</div>
              </div>
            </div>
            <div className="px-4 pb-4 pt-1">
              <div className="flex items-start gap-2 text-sm text-slate-500 bg-gray-50 p-3 rounded-lg border border-slate-100">
                <span className="material-symbols-outlined text-primary text-lg mt-0.5">info</span>
                <p className="leading-relaxed text-xs">
                  思考时钟展示了决策速度与准确性的关系。本次测试处于<span className="text-emerald-600 font-bold">平衡区</span>，表现优异，建议继续保持当前的节奏。
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
