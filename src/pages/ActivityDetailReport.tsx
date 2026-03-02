import React from 'react';

interface ActivityDetailReportProps {
  onBack: () => void;
  title: string;
}

export default function ActivityDetailReport({ onBack, title }: ActivityDetailReportProps) {
  return (
    <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-900 min-h-screen pb-10">
      <header className="px-6 py-4 bg-white dark:bg-slate-800 shadow-sm sticky top-0 z-20 flex items-center justify-between">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-lg font-bold text-slate-800 dark:text-white">详情报告</h1>
        <div className="w-10"></div>
      </header>

      <main className="px-6 py-6 space-y-6">
        {/* Activity/Service Info Section */}
        <section className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-3xl">event_note</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white leading-tight">{title}</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">项目详情</p>
            </div>
          </div>
          <div className="space-y-3 mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-slate-400 text-lg mt-0.5">schedule</span>
              <div>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">时间</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">2023年10月24日 14:00 - 16:00</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-slate-400 text-lg mt-0.5">location_on</span>
              <div>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">地点</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">儿童发展中心 302 教室</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-slate-400 text-lg mt-0.5">description</span>
              <div>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">简介</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  本次活动旨在通过专业的感统训练和互动游戏，帮助孩子提升专注力、情绪调节能力以及社交技巧。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Registration Info Section */}
        <section className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span>
            报名信息
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-xl">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">参与儿童</p>
              <p className="text-sm font-bold text-slate-800 dark:text-white">俊豪</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-xl">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">年龄</p>
              <p className="text-sm font-bold text-slate-800 dark:text-white">8岁</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-xl col-span-2">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">联系电话</p>
              <p className="text-sm font-bold text-slate-800 dark:text-white">138 **** 8888</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-xl col-span-2">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">备注需求</p>
              <p className="text-sm font-bold text-slate-800 dark:text-white">希望重点关注孩子在集体活动中的情绪变化。</p>
            </div>
          </div>
        </section>

        {/* History/Performance Report Section */}
        <section className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <span className="w-1.5 h-6 bg-primary rounded-full"></span>
              表现报告
            </h3>
            <span className="bg-green-100 text-green-600 text-xs font-bold px-3 py-1 rounded-full">已生成</span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-2xl text-center">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">综合评分</p>
              <p className="text-3xl font-black text-primary">A+</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-2xl text-center">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">参与时长</p>
              <p className="text-3xl font-black text-slate-800 dark:text-white">45<span className="text-sm font-normal ml-1">min</span></p>
            </div>
          </div>

          <div className="space-y-6">
            {[
              { label: '专注力', value: 85, color: 'bg-blue-500' },
              { label: '社交互动', value: 92, color: 'bg-emerald-500' },
              { label: '情绪稳定性', value: 78, color: 'bg-orange-500' },
              { label: '指令执行', value: 88, color: 'bg-purple-500' },
            ].map((item) => (
              <div key={item.label} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-bold text-slate-700 dark:text-slate-300">{item.label}</span>
                  <span className="font-black text-slate-900 dark:text-white">{item.value}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-700 h-3 rounded-full overflow-hidden">
                  <div 
                    className={`${item.color} h-full rounded-full transition-all duration-1000`} 
                    style={{ width: `${item.value}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700">
            <h4 className="font-bold text-slate-800 dark:text-white mb-3">专家点评</h4>
            <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-2xl italic text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
              "孩子在本次活动中表现出了极高的参与热情，特别是在小组协作环节，能够主动承担责任并协助同伴。专注力较以往有明显提升，建议继续保持目前的训练节奏。"
            </div>
            <div className="mt-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
                <img src="https://picsum.photos/seed/expert/100/100" alt="expert" referrerPolicy="no-referrer" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800 dark:text-white">李医生</p>
                <p className="text-xs text-slate-500">资深儿童心理专家</p>
              </div>
            </div>
          </div>
        </section>

        <button 
          onClick={onBack}
          className="w-full py-4 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 active:scale-[0.98] transition-all"
        >
          返回列表
        </button>
      </main>
    </div>
  );
}
