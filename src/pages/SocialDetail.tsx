export default function SocialDetail({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden antialiased pb-10 bg-gray-50">
      <header className="flex items-center justify-between px-4 py-3 sticky top-0 z-50 bg-background-light/95 backdrop-blur-md border-b border-slate-100">
        <button onClick={onBack} className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-100 active:bg-slate-200 transition-colors text-text-main">
          <span className="material-symbols-outlined font-light">arrow_back_ios_new</span>
        </button>
        <h1 className="text-lg font-bold text-text-main absolute left-1/2 -translate-x-1/2">社交能力深度分析</h1>
        <div className="w-10"></div> 
      </header>
      <main className="flex-1 flex flex-col gap-6 px-5 pt-6">
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-text-main tracking-tight">社交多维度评估</h2>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-slate-200 hover:bg-primary-light transition-colors text-slate-400">
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>info</span>
            </button>
          </div>
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <div className="flex justify-between items-start mb-8">
              <div>
                <p className="text-text-sub text-sm font-medium mb-1">社交技能综合评分</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-primary">85</span>
                  <span className="text-sm text-slate-400 font-medium">/ 100</span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-1 bg-green-50 px-2.5 py-1 rounded-full border border-green-100">
                  <span className="material-symbols-outlined text-green-500" style={{ fontSize: '18px', fontVariationSettings: "'FILL' 1" }}>trending_up</span>
                  <span className="text-green-500 text-sm font-bold">+5%</span>
                </div>
                <span className="text-xs text-slate-400 mt-1.5">较上月提升</span>
              </div>
            </div>
            <div className="relative w-full aspect-square max-w-[280px] mx-auto mb-6">
              <svg className="w-full h-full text-slate-100" viewBox="0 0 200 200">
                <circle cx="100" cy="100" fill="none" r="20" stroke="currentColor" strokeWidth="1.5"></circle>
                <circle cx="100" cy="100" fill="none" r="40" stroke="currentColor" strokeWidth="1.5"></circle>
                <circle cx="100" cy="100" fill="none" r="60" stroke="currentColor" strokeWidth="1.5"></circle>
                <circle cx="100" cy="100" fill="none" r="80" stroke="currentColor" strokeWidth="1.5"></circle>
                <line stroke="currentColor" strokeWidth="1.5" x1="100" x2="100" y1="20" y2="180"></line>
                <line stroke="currentColor" strokeWidth="1.5" x1="24" x2="176" y1="65" y2="135"></line>
                <line stroke="currentColor" strokeWidth="1.5" x1="176" x2="24" y1="65" y2="135"></line>
                <polygon fill="rgba(80, 155, 176, 0.15)" points="100,30 165,75 150,140 50,140 35,75" stroke="#509BB0" strokeLinejoin="round" strokeWidth="2.5"></polygon>
                <circle cx="100" cy="30" fill="#fff" r="4" stroke="#509BB0" strokeWidth="2"></circle>
                <circle cx="165" cy="75" fill="#fff" r="4" stroke="#509BB0" strokeWidth="2"></circle>
                <circle cx="150" cy="140" fill="#fff" r="4" stroke="#509BB0" strokeWidth="2"></circle>
                <circle cx="50" cy="140" fill="#fff" r="4" stroke="#509BB0" strokeWidth="2"></circle>
                <circle cx="35" cy="75" fill="#fff" r="4" stroke="#509BB0" strokeWidth="2"></circle>
              </svg>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 bg-white/90 backdrop-blur px-2 py-0.5 rounded-md shadow-sm text-xs font-bold text-text-sub border border-slate-100 flex items-center gap-1">
                <span className="material-symbols-outlined text-[10px] text-primary">record_voice_over</span>
                <span>主动性</span>
              </div>
              <div className="absolute top-[30%] right-0 translate-x-3 bg-white/90 backdrop-blur px-2 py-0.5 rounded-md shadow-sm text-xs font-bold text-text-sub border border-slate-100 flex items-center gap-1">
                <span className="material-symbols-outlined text-[10px] text-primary">forum</span>
                <span>回应</span>
              </div>
              <div className="absolute bottom-[25%] right-0 translate-x-3 bg-white/90 backdrop-blur px-2 py-0.5 rounded-md shadow-sm text-xs font-bold text-text-sub border border-slate-100 flex items-center gap-1">
                <span className="material-symbols-outlined text-[10px] text-primary">favorite</span>
                <span>共情</span>
              </div>
              <div className="absolute bottom-[25%] left-0 -translate-x-3 bg-white/90 backdrop-blur px-2 py-0.5 rounded-md shadow-sm text-xs font-bold text-text-sub border border-slate-100 flex items-center gap-1">
                <span className="material-symbols-outlined text-[10px] text-primary">mood</span>
                <span>情绪控制</span>
              </div>
              <div className="absolute top-[30%] left-0 -translate-x-3 bg-white/90 backdrop-blur px-2 py-0.5 rounded-md shadow-sm text-xs font-bold text-text-sub border border-slate-100 flex items-center gap-1">
                <span className="material-symbols-outlined text-[10px] text-primary">gesture</span>
                <span>非语言</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-primary/5 p-4 rounded-2xl flex items-center gap-3 border border-slate-100">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-primary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                </div>
                <div>
                  <p className="text-xs text-text-sub mb-0.5">显著优势</p>
                  <p className="text-sm font-bold text-text-main">主动性沟通</p>
                </div>
              </div>
              <div className="bg-orange-50/50 p-4 rounded-2xl flex items-center gap-3 border border-orange-100/50">
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-orange-400 text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>
                </div>
                <div>
                  <p className="text-xs text-text-sub mb-0.5">建议关注</p>
                  <p className="text-sm font-bold text-text-main">情绪控制</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section>
          <h2 className="text-xl font-bold text-text-main tracking-tight mb-4">对话节奏分析</h2>
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 overflow-hidden">
            <div className="flex justify-between items-center mb-8">
              <p className="text-text-sub text-sm font-medium">交互延迟与频率</p>
              <div className="flex gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>face</span>
                  <span className="text-text-sub">孩子</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-slate-400 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>group</span>
                  <span className="text-text-sub">同伴</span>
                </div>
              </div>
            </div>
            <div className="relative h-40 w-full mb-2">
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none z-0">
                <div className="border-b border-dashed border-slate-100 w-full h-0"></div>
                <div className="border-b border-dashed border-slate-100 w-full h-0"></div>
                <div className="border-b border-dashed border-slate-100 w-full h-0"></div>
                <div className="border-b border-dashed border-slate-100 w-full h-0"></div>
              </div>
              <svg className="absolute inset-0 w-full h-full z-10" preserveAspectRatio="none" viewBox="0 0 300 100">
                <defs>
                  <linearGradient id="gradientPrimary" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#509BB0" stopOpacity="0.2"></stop>
                    <stop offset="100%" stopColor="#509BB0" stopOpacity="0"></stop>
                  </linearGradient>
                </defs>
                <path d="M0,70 Q30,40 60,65 T120,50 T180,75 T240,40 T300,60 V100 H0 Z" fill="url(#gradientPrimary)"></path>
                <path d="M0,70 Q30,40 60,65 T120,50 T180,75 T240,40 T300,60" fill="none" stroke="#509BB0" strokeLinecap="round" strokeWidth="2.5"></path>
                <path d="M0,60 Q40,80 80,55 T160,70 T240,55 T300,75" fill="none" stroke="#94a3b8" strokeDasharray="4,4" strokeLinecap="round" strokeWidth="2"></path>
              </svg>
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 font-medium px-1">
              <span>10:00</span>
              <span>10:05</span>
              <span>10:10</span>
              <span>10:15</span>
              <span>10:20</span>
            </div>
            <div className="mt-6 pt-5 border-t border-slate-100">
              <div className="text-sm text-text-main leading-relaxed flex items-start gap-2">
                <span className="material-symbols-outlined text-primary mt-0.5 shrink-0" style={{ fontSize: '18px' }}>analytics</span>
                <p>
                  <span className="font-bold text-primary mr-1">分析结论:</span> 对话节奏整体平稳。在 10:12 左右出现短暂延迟，可能是孩子在处理复杂情感信息。建议继续加强<span className="font-medium text-text-main border-b-2 border-primary/20">“等待轮流”</span>的练习。
                </p>
              </div>
            </div>
          </div>
        </section>
        <section>
          <h2 className="text-xl font-bold text-text-main tracking-tight mb-4">详细指标</h2>
          <div className="flex flex-col gap-3">
            <div className="bg-white p-5 rounded-2xl flex items-center justify-between shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>record_voice_over</span>
                </div>
                <div>
                  <p className="text-text-main font-bold text-base">平均回应时间</p>
                  <p className="text-slate-400 text-xs mt-0.5">标准范围: 1.5s - 3.0s</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-text-main font-bold text-lg">2.1s</p>
                <div className="flex items-center justify-end gap-1 mt-1">
                  <span className="material-symbols-outlined text-green-500 text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-50 text-green-600 font-medium border border-green-100">正常</span>
                </div>
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl flex items-center justify-between shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>visibility</span>
                </div>
                <div>
                  <p className="text-text-main font-bold text-base">眼神接触频率</p>
                  <p className="text-slate-400 text-xs mt-0.5">每分钟次数</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-text-main font-bold text-lg">3.5次</p>
                <div className="flex items-center justify-end gap-1 mt-1">
                  <span className="material-symbols-outlined text-orange-400 text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-50 text-orange-500 font-medium border border-orange-100">略低</span>
                </div>
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl flex items-center justify-between shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-500 group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>sentiment_satisfied</span>
                </div>
                <div>
                  <p className="text-text-main font-bold text-base">积极情绪表达</p>
                  <p className="text-slate-400 text-xs mt-0.5">对话占比</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-text-main font-bold text-lg">42%</p>
                <div className="flex items-center justify-end gap-1 mt-1">
                  <span className="material-symbols-outlined text-green-500 text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-50 text-green-600 font-medium border border-green-100">优秀</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
