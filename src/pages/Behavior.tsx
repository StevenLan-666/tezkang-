import { useState } from 'react';
import { useHistoryRecords } from '../hooks/useHealthData';

export default function Behavior({ onOpenTest, onOpenDetail, onOpenService, onOpenActivity, onOpenHistory, onOpenFeedback, childId }: { onOpenTest?: () => void, onOpenDetail?: () => void, onOpenService?: (title?: string) => void, onOpenActivity?: (title?: string) => void, onOpenHistory?: () => void, onOpenFeedback?: () => void, childId?: string | null }) {
  const [selectedDate, setSelectedDate] = useState('2023年 10月');
  const [showDateDropdown, setShowDateDropdown] = useState(false);

  const dates = ['2023年 10月', '2023年 9月', '2023年 8月'];

  const getScoreData = () => {
    switch (selectedDate) {
      case '2023年 9月': return { score: 75, improvement: '+3%', selfDiscipline: '80%', focus: '70%', defiance: '18%', aggression: '6%' };
      case '2023年 8月': return { score: 72, improvement: '-', selfDiscipline: '75%', focus: '68%', defiance: '20%', aggression: '8%' };
      case '2023年 10月':
      default: return { score: 78, improvement: '+4%', selfDiscipline: '85%', focus: '72%', defiance: '15%', aggression: '5%' };
    }
  };

  const data = getScoreData();
  const { records: behaviorHistory } = useHistoryRecords(childId || null, 'behavior');

  return (
    <div className="flex-1 overflow-y-auto pb-24 bg-background-light dark:bg-background-dark">
      <div className="px-6 py-3 flex justify-between items-center text-xs font-semibold text-text-main dark:text-slate-300 opacity-70 sticky top-0 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md z-20">
        <span>16:58</span>
        <div className="flex gap-1.5 items-center">
          <span className="material-symbols-outlined text-sm !text-[18px]">signal_cellular_alt</span>
          <span className="material-symbols-outlined text-sm !text-[18px]">wifi</span>
          <span className="material-symbols-outlined text-sm !text-[18px]">battery_full</span>
        </div>
      </div>

      <header className="px-6 py-4 flex justify-between items-center sticky top-8 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md z-30">
        <h1 className="text-2xl font-bold text-text-main dark:text-white tracking-tight">行为表现</h1>
        <div className="relative">
          <div
            className="flex items-center space-x-2 bg-white dark:bg-surface-dark px-4 py-2 rounded-full shadow-sm border border-slate-100 dark:border-slate-700 cursor-pointer hover:bg-slate-50 transition-colors"
            onClick={() => setShowDateDropdown(!showDateDropdown)}
          >
            <span className="material-symbols-outlined text-primary text-lg">calendar_today</span>
            <span className="font-medium text-sm text-slate-600 dark:text-slate-300">{selectedDate}</span>
            {data.improvement !== '-' && (
              <span className="text-xs font-bold text-green-500 ml-1">{data.improvement}</span>
            )}
            <span className="material-symbols-outlined text-slate-400 text-sm">expand_more</span>
          </div>
          {showDateDropdown && (
            <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-surface-dark rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 overflow-hidden z-50">
              {dates.map(date => (
                <div
                  key={date}
                  className={`px-4 py-2 text-sm cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${selectedDate === date ? 'text-primary font-bold bg-primary/5' : 'text-slate-600 dark:text-slate-300'}`}
                  onClick={() => {
                    setSelectedDate(date);
                    setShowDateDropdown(false);
                  }}
                >
                  {date}
                </div>
              ))}
            </div>
          )}
        </div>
      </header>

      <main className="px-5 space-y-6">
        <div className="bg-surface-light dark:bg-surface-dark rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 relative overflow-hidden cursor-pointer" onClick={onOpenDetail}>
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>

          <div className="flex justify-between items-center mb-6 relative z-10">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">综合行为分析</h2>
            <button className="text-xs bg-primary text-white px-4 py-1.5 rounded-full hover:bg-primary-dark transition-colors shadow-sm font-medium">查看报告</button>
          </div>

          <div className="flex flex-col items-center justify-center relative z-10">
            <div className="relative w-48 h-48 mb-8 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90 absolute inset-0">
                <circle className="text-gray-100 dark:text-gray-800" cx="96" cy="96" fill="transparent" r="80" stroke="currentColor" strokeWidth="16"></circle>
                <circle className="text-green-400" cx="96" cy="96" fill="transparent" r="80" stroke="currentColor" strokeDasharray="502" strokeDashoffset="100" strokeLinecap="round" strokeWidth="16"></circle>
                <circle className="text-blue-400" cx="96" cy="96" fill="transparent" r="80" stroke="currentColor" strokeDasharray="502" strokeDashoffset="300" strokeLinecap="round" strokeWidth="16" style={{ transform: 'rotate(90deg)', transformOrigin: 'center' }}></circle>
                <circle className="text-yellow-400" cx="96" cy="96" fill="transparent" r="80" stroke="currentColor" strokeDasharray="502" strokeDashoffset="400" strokeLinecap="round" strokeWidth="16" style={{ transform: 'rotate(180deg)', transformOrigin: 'center' }}></circle>
                <circle className="text-red-400" cx="96" cy="96" fill="transparent" r="80" stroke="currentColor" strokeDasharray="502" strokeDashoffset="450" strokeLinecap="round" strokeWidth="16" style={{ transform: 'rotate(270deg)', transformOrigin: 'center' }}></circle>
              </svg>
              <div className="bg-white dark:bg-surface-dark rounded-full w-32 h-32 flex flex-col items-center justify-center shadow-sm z-10">
                <span className="text-4xl font-bold text-slate-800 dark:text-white tracking-tight">{data.score}</span>
                <span className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-1">综合评分</span>
              </div>
            </div>
            <div className="text-primary text-sm font-bold mb-4">可点击区域</div>

            <div className="grid grid-cols-2 gap-3 w-full">
              <div className="flex items-center space-x-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50">
                <div className="w-1.5 h-8 rounded-full bg-green-400"></div>
                <div className="flex-1">
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wide font-semibold mb-0.5">自律性</p>
                  <div className="flex items-baseline justify-between w-full">
                    <span className="text-base font-bold text-slate-700 dark:text-slate-200">{data.selfDiscipline}</span>
                    <span className="text-[10px] text-green-500 flex items-center bg-green-50 dark:bg-green-900/20 px-1.5 py-0.5 rounded-md">
                      <span className="material-symbols-outlined text-[10px] mr-0.5">arrow_upward</span> 5%
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50">
                <div className="w-1.5 h-8 rounded-full bg-blue-400"></div>
                <div className="flex-1">
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wide font-semibold mb-0.5">注意力</p>
                  <div className="flex items-baseline justify-between w-full">
                    <span className="text-base font-bold text-slate-700 dark:text-slate-200">{data.focus}</span>
                    <span className="text-[10px] text-slate-400 flex items-center bg-slate-100 dark:bg-slate-700/50 px-1.5 py-0.5 rounded-md">-</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50">
                <div className="w-1.5 h-8 rounded-full bg-yellow-400"></div>
                <div className="flex-1">
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wide font-semibold mb-0.5">对立违抗</p>
                  <div className="flex items-baseline justify-between w-full">
                    <span className="text-base font-bold text-slate-700 dark:text-slate-200">{data.defiance}</span>
                    <span className="text-[10px] text-green-500 flex items-center bg-green-50 dark:bg-green-900/20 px-1.5 py-0.5 rounded-md">
                      <span className="material-symbols-outlined text-[10px] mr-0.5">arrow_downward</span> 2%
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50">
                <div className="w-1.5 h-8 rounded-full bg-red-400"></div>
                <div className="flex-1">
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wide font-semibold mb-0.5">攻击性</p>
                  <div className="flex items-baseline justify-between w-full">
                    <span className="text-base font-bold text-slate-700 dark:text-slate-200">{data.aggression}</span>
                    <span className="text-[10px] text-green-500 flex items-center bg-green-50 dark:bg-green-900/20 px-1.5 py-0.5 rounded-md">
                      <span className="material-symbols-outlined text-[10px] mr-0.5">arrow_downward</span> 1%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="mb-8">
          <div className="flex justify-between items-end mb-4 px-1">
            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200">进行测试</h3>
          </div>
          <div className="flex gap-3">
            <div onClick={() => onOpenService?.('日常测试和干预')} className="flex-[3] bg-primary/10 dark:bg-primary/20 rounded-2xl p-4 shadow-sm border border-primary/20 flex flex-col justify-between cursor-pointer hover:bg-primary/20 transition-colors relative overflow-hidden h-32">
              <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-primary/20 rounded-full blur-xl"></div>
              <div className="relative z-10">
                <h4 className="font-bold text-primary dark:text-primary-light text-lg mb-0.5">预约测试</h4>
                <p className="text-[10px] text-primary/80 dark:text-primary-light/80 font-medium leading-tight">由专业老师进行全面评估</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shadow-md relative z-10 self-end">
                <span className="material-symbols-outlined text-lg">event_available</span>
              </div>
            </div>

            <div onClick={onOpenTest} className="flex-[2] bg-surface-light dark:bg-surface-dark rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col justify-between cursor-pointer hover:shadow-md transition-all h-32">
              <div>
                <h4 className="font-bold text-slate-700 dark:text-slate-200 text-lg mb-0.5">自主测试</h4>
                <p className="text-[10px] text-text-sub dark:text-slate-400 leading-tight">随时随地进行快速自测</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center self-end">
                <span className="material-symbols-outlined text-lg">edit_note</span>
              </div>
            </div>
          </div>
        </section>

        <div>
          <div className="flex justify-between items-end mb-4 px-2">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">历史记录</h3>
            <button onClick={onOpenHistory} className="text-xs text-primary font-medium hover:opacity-80 flex items-center">
              查看全部 <span className="material-symbols-outlined text-sm ml-0.5">chevron_right</span>
            </button>
          </div>

          <div className="space-y-4">
            {behaviorHistory.slice(0, 2).map((item) => (
              <div key={item.id} className="bg-surface-light dark:bg-surface-dark rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800 flex items-start space-x-4">
                <div className={`flex-shrink-0 w-12 h-12 rounded-2xl bg-${item.status_color}-50 dark:bg-${item.status_color}-900/20 flex items-center justify-center text-${item.status_color}-500 dark:text-${item.status_color}-400`}>
                  <span className="material-symbols-outlined">
                    {item.record_type === 'test' ? 'assignment' : 'fitness_center'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold text-slate-700 dark:text-slate-200 text-sm">{item.title}</h4>
                    <span className="text-[10px] text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded-full">{item.record_date}</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">{item.description}</p>
                  <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-50 dark:border-slate-800">
                    <div className="flex gap-2">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-${item.status_color}-50 text-${item.status_color}-600 dark:bg-${item.status_color}-900/30 dark:text-${item.status_color}-400 border border-${item.status_color}-100 dark:border-${item.status_color}-900/50`}>
                        {item.status}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={onOpenHistory} className="text-[10px] font-bold text-primary bg-primary/10 px-3 py-1 rounded-lg hover:bg-primary/20 transition-colors">详情</button>
                      <button onClick={() => onOpenFeedback?.()} className="text-[10px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">反馈</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <section className="pt-2 pb-6">
          <h3 className="text-lg font-bold mb-3 px-2 text-slate-800 dark:text-slate-200">推荐服务</h3>
          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar px-2">
            <div className="min-w-[260px] bg-surface-light dark:bg-surface-dark p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <div className="h-32 rounded-xl bg-gray-200 dark:bg-gray-700 mb-3 relative overflow-hidden group">
                <span className="absolute top-2 right-2 bg-black/30 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-lg z-10">课程</span>
                <img alt="Children playing together" className="w-full h-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDCJhrTGsnpisibkRqqOuKw0VRd0KD2uVn6RR0_B5aVlhvR-lyWVsnTO4Uy7KblhLfvwmAwdBt20SYfb6jbsUNlLD1e52HN_26J_lJ53PlmcbeJQhaCWQyJ0aVwItN8aYIr6svWEgvruhnvlKFeXRkhodLzz4Hhjv9l7XXyduZQ4lPrM0y7maScpmOxy495VWFED0ZwQqC1BV9nQb3GASvMqMhxS3kS5oFo5MvtQLMeYmZetPAoi57cgWxI2UwdGhWSON46c6vtqoMO" />
              </div>
              <h4 className="font-bold text-slate-700 dark:text-slate-200 text-sm">行为规范引导课</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4 line-clamp-2">通过专业引导，帮助孩子建立良好的日常行为规范和自律习惯。</p>
              <button onClick={() => onOpenService?.('行为规范引导课')} className="w-full py-2.5 rounded-xl border border-primary/30 text-primary text-xs font-semibold hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors">预约课程</button>
            </div>

            <div className="min-w-[260px] bg-surface-light dark:bg-surface-dark p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <div className="h-32 rounded-xl bg-gray-200 dark:bg-gray-700 mb-3 relative overflow-hidden group">
                <span className="absolute top-2 right-2 bg-black/30 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-lg z-10">活动</span>
                <img alt="Group therapy session" className="w-full h-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBWgXMCoejP-ji49PT_G4y_pHGMWgzucXvI-Dfg52VVmAGQfLoZoWgPyYzeem7tJK26t-lajTAtKWNe4MQUb2x06Hj2F9cUl6Erg-KGMtvl941P4324xD8bGo0TrJwZvRdvfh-ipNmYmI76nNKvlaCBH-3oMCryWuDSU3gTw5tbhssl6b_UsfOi1KoEbiIQKaL5OQvsaE4wj8oENafpGa_6KEerhbYY6ejkMGt5FWJAB9brFxtFbmh26BCg-gbkAO4WwyIyeFzH_sCs" />
              </div>
              <h4 className="font-bold text-slate-700 dark:text-slate-200 text-sm">注意力集中训练营</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4 line-clamp-2">结合感统训练，有效提升孩子的专注时长 and 抗干扰能力。</p>
              <button onClick={() => onOpenActivity?.('注意力集中训练营')} className="w-full py-2.5 rounded-xl border border-primary/30 text-primary text-xs font-semibold hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors">预约活动</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
