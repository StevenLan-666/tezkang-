import React from 'react';

interface AssessmentSubPageProps {
  onBack: () => void;
}

export default function AssessmentSubPage({ onBack }: AssessmentSubPageProps) {
  return (
    <div className="flex-1 flex flex-col bg-background-light dark:bg-background-dark min-h-screen transition-colors duration-200 antialiased pb-24">
      <div className="px-6 py-3 flex justify-between items-center text-xs font-semibold text-text-light dark:text-text-dark opacity-90">
        <span>16:58</span>
        <div className="flex gap-1.5 items-center">
          <span className="material-symbols-outlined text-sm font-bold">signal_cellular_alt</span>
          <span className="material-symbols-outlined text-sm font-bold">wifi</span>
          <span className="material-symbols-outlined text-sm font-bold">battery_full</span>
        </div>
      </div>
      
      <header className="px-6 py-4">
        <div className="flex items-center justify-between mb-6 relative">
          <button 
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-surface-light dark:bg-surface-dark shadow-md flex items-center justify-center text-text-light dark:text-text-dark hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors z-10"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="text-lg font-bold text-text-light dark:text-white absolute left-1/2 transform -translate-x-1/2 w-full text-center">评测</h1>
          <div className="w-10"></div> 
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full mb-2 overflow-hidden">
          <div className="bg-[#509BB0] h-2 rounded-full w-2/3 transition-all duration-500 ease-out shadow-[0_0_15px_rgba(80,155,176,0.3)]"></div>
        </div>
        <div className="flex justify-between text-xs text-subtext-light dark:text-subtext-dark font-medium">
          <span>问题 14/20</span>
          <span>70%</span>
        </div>
      </header>

      <main className="px-6 space-y-8">
        <section>
          <div className="bg-surface-light dark:bg-surface-dark p-1.5 rounded-xl shadow-md flex">
            <button className="flex-1 py-2 text-sm font-bold rounded-lg bg-[#509BB0] text-white shadow-sm transition-all">
              孩子
            </button>
            <button className="flex-1 py-2 text-sm font-semibold text-subtext-light dark:text-subtext-dark hover:text-[#509BB0] transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/30 rounded-lg">
              家长
            </button>
            <button className="flex-1 py-2 text-sm font-semibold text-subtext-light dark:text-subtext-dark hover:text-[#509BB0] transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/30 rounded-lg">
              老师
            </button>
          </div>
          <p className="text-xs text-center mt-3 text-subtext-light dark:text-subtext-dark">请选择当前正在观察行为的对象。</p>
        </section>

        <section className="space-y-6">
          <div className="bg-surface-light dark:bg-surface-dark p-5 rounded-2xl shadow-md">
            <h3 className="font-bold text-text-light dark:text-white mb-2 text-lg">专注力</h3>
            <p className="text-sm text-subtext-light dark:text-subtext-dark mb-6 leading-relaxed">
              孩子在任务或游戏中是否经常难以保持注意力？
            </p>
            <div className="flex justify-between gap-2">
              {[1, 2, 3, 4, 5].map((num) => (
                <div key={num} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                  <input className="peer sr-only" id={`q1-${num}`} name="q1" type="radio" defaultChecked={num === 1} />
                  <label 
                    className="w-10 h-10 rounded-full border-2 border-gray-200 dark:border-gray-600 flex items-center justify-center font-bold text-subtext-light dark:text-subtext-dark transition-all peer-checked:bg-[#509BB0] peer-checked:text-white peer-checked:border-[#509BB0] cursor-pointer hover:border-[#509BB0]/50" 
                    htmlFor={`q1-${num}`}
                  >
                    {num}
                  </label>
                  {num === 1 && <span className="text-[10px] text-center text-subtext-light font-medium group-hover:text-[#509BB0] transition-colors">从不</span>}
                  {num === 3 && <span className="text-[10px] text-center text-subtext-light font-medium group-hover:text-[#509BB0] transition-colors">经常</span>}
                  {num === 5 && <span className="text-[10px] text-center text-subtext-light font-medium group-hover:text-[#509BB0] transition-colors">总是</span>}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface-light dark:bg-surface-dark p-5 rounded-2xl shadow-md">
            <h3 className="font-bold text-text-light dark:text-white mb-2 text-lg">多动性</h3>
            <p className="text-sm text-subtext-light dark:text-subtext-dark mb-6 leading-relaxed">
              孩子在需要保持坐姿的场合是否经常离座？
            </p>
            <div className="space-y-3">
              {['完全没有', '有一点', '相当多', '非常多'].map((option, idx) => (
                <label key={option} className={`flex items-center p-3 border-2 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all group ${idx === 2 ? 'border-[#509BB0] bg-[#509BB0]/5' : 'border-transparent'}`}>
                  <input 
                    className="form-radio text-[#509BB0] w-5 h-5 border-gray-300 focus:ring-[#509BB0] mr-3 transition-transform group-active:scale-95" 
                    name="q2" 
                    type="radio" 
                    defaultChecked={idx === 2}
                  />
                  <span className="text-sm font-medium text-text-light dark:text-text-dark">{option}</span>
                </label>
              ))}
            </div>
          </div>
        </section>

        <div className="fixed bottom-0 left-0 w-full bg-surface-light dark:bg-surface-dark border-t border-gray-100 dark:border-gray-800 p-6 z-50 flex items-center justify-between gap-4 shadow-[0_-4px_20px_-2px_rgba(0,0,0,0.05)] max-w-md mx-auto left-1/2 -translate-x-1/2">
          <button onClick={onBack} className="px-6 py-3.5 rounded-xl border-2 border-[#509BB0] text-[#509BB0] font-bold text-sm w-1/3 hover:bg-[#509BB0]/5 active:scale-95 transition-all">
            上一题
          </button>
          <button className="px-6 py-3.5 rounded-xl bg-[#509BB0] text-white font-bold text-sm flex-1 shadow-lg shadow-[#509BB0]/30 hover:bg-[#3E7B8C] active:scale-95 transition-all flex items-center justify-center gap-2">
            下一题
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>
      </main>
      <div className="fixed bottom-1 left-1/2 transform -translate-x-1/2 w-1/3 h-1 bg-gray-300 dark:bg-gray-600 rounded-full z-[60]"></div>
    </div>
  );
}
