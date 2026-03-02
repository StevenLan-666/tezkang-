import { useState } from 'react';
import { useHistoryRecords } from '../hooks/useHealthData';

export default function Social({ onOpenTest, onOpenDetail, onOpenService, onOpenActivity, onOpenHistory, onOpenFeedback, childId }: { onOpenTest?: () => void, onOpenDetail?: () => void, onOpenService?: (title?: string) => void, onOpenActivity?: (title?: string) => void, onOpenHistory?: () => void, onOpenFeedback?: () => void, childId?: string | null }) {
  const [selectedDate, setSelectedDate] = useState('2023年 10月');
  const [showDateDropdown, setShowDateDropdown] = useState(false);

  const dates = ['2023年 10月', '2023年 9月', '2023年 8月'];

  const getScoreData = () => {
    switch (selectedDate) {
      case '2023年 9月': return { score: 80, improvement: '+2%', comm: '良好', empathy: '一般', team: '较弱', control: '一般' };
      case '2023年 8月': return { score: 78, improvement: '-', comm: '一般', empathy: '较弱', team: '较弱', control: '较弱' };
      case '2023年 10月':
      default: return { score: 85, improvement: '+5%', comm: '优秀', empathy: '良好', team: '一般', control: '优秀' };
    }
  };

  const data = getScoreData();
  const { records: socialHistory } = useHistoryRecords(childId || null, 'social');

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

      <header className="px-6 py-4 flex justify-between items-center sticky top-8 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md z-10">
        <h1 className="text-2xl font-bold text-text-main dark:text-white tracking-tight">社交能力</h1>
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

      <main className="px-5 max-w-lg mx-auto space-y-6">
        <section className="mb-8 relative h-72 w-full flex items-center justify-center cursor-pointer" onClick={onOpenDetail}>
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent rounded-[2rem] -z-10"></div>
          <div className="relative w-full h-full">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
              <div className="w-36 h-36 rounded-full bg-white dark:bg-slate-700 shadow-xl shadow-slate-200/50 dark:shadow-none flex flex-col items-center justify-center border-4 border-primary/20 ring-4 ring-white/50 dark:ring-slate-800/50 animate-[float_6s_ease-in-out_infinite]">
                <span className="text-4xl font-extrabold text-primary">{data.score}</span>
                <span className="text-xs font-semibold text-text-sub dark:text-slate-400 mt-1 tracking-wide">综合评分</span>
              </div>
            </div>

            <div className="absolute top-6 left-6 animate-[float_6s_ease-in-out_2s_infinite]">
              <div className="w-24 h-24 rounded-full bg-blue-100/50 dark:bg-slate-800 flex flex-col items-center justify-center border border-blue-200/50 shadow-sm backdrop-blur-sm">
                <span className="material-symbols-outlined text-blue-400 text-2xl mb-1">chat_bubble</span>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">沟通</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{data.comm}</span>
              </div>
            </div>

            <div className="absolute top-8 right-4 animate-[float_6s_ease-in-out_infinite]">
              <div className="w-28 h-28 rounded-full bg-pink-100/50 dark:bg-slate-800 flex flex-col items-center justify-center border border-pink-200/50 shadow-sm backdrop-blur-sm">
                <span className="material-symbols-outlined text-pink-400 text-2xl mb-1">volunteer_activism</span>
                <span className="text-sm font-bold text-slate-600 dark:text-slate-300">共情能力</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{data.empathy}</span>
              </div>
            </div>

            <div className="absolute bottom-4 left-10 animate-[float_6s_ease-in-out_infinite]">
              <div className="w-20 h-20 rounded-full bg-amber-100/50 dark:bg-slate-800 flex flex-col items-center justify-center border border-amber-200/50 shadow-sm backdrop-blur-sm">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300 text-center leading-tight">团队<br />协作</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">{data.team}</span>
              </div>
            </div>

            <div className="absolute bottom-8 right-12 animate-[float_6s_ease-in-out_2s_infinite]">
              <div className="w-16 h-16 rounded-full bg-green-100/50 dark:bg-slate-800 flex flex-col items-center justify-center border border-green-200/50 shadow-sm backdrop-blur-sm">
                <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300">控制力</span>
                {data.control === '优秀' ? (
                  <span className="material-symbols-outlined text-green-500 text-base mt-0.5">check_circle</span>
                ) : (
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{data.control}</span>
                )}
              </div>
            </div>
          </div>
        </section>

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

        <section>
          <div className="flex justify-between items-end mb-4 px-1">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">历史记录</h3>
            <button onClick={onOpenHistory} className="text-xs text-primary font-medium hover:opacity-80 flex items-center">
              查看全部 <span className="material-symbols-outlined text-sm ml-0.5">chevron_right</span>
            </button>
          </div>

          <div className="space-y-4">
            {socialHistory.slice(0, 2).map((item) => (
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
        </section>

        <section className="pt-2 pb-6">
          <h3 className="text-lg font-bold mb-3 px-1 text-slate-800 dark:text-slate-200">推荐服务</h3>
          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar px-1">
            <div className="min-w-[260px] bg-surface-light dark:bg-surface-dark p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <div className="h-32 rounded-xl bg-gray-200 dark:bg-gray-700 mb-3 relative overflow-hidden group">
                <span className="absolute top-2 right-2 bg-black/30 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-lg z-10">课程</span>
                <img alt="Children playing together" className="w-full h-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDCJhrTGsnpisibkRqqOuKw0VRd0KD2uVn6RR0_B5aVlhvR-lyWVsnTO4Uy7KblhLfvwmAwdBt20SYfb6jbsUNlLD1e52HN_26J_lJ53PlmcbeJQhaCWQyJ0aVwItN8aYIr6svWEgvruhnvlKFeXRkhodLzz4Hhjv9l7XXyduZQ4lPrM0y7maScpmOxy495VWFED0ZwQqC1BV9nQb3GASvMqMhxS3kS5oFo5MvtQLMeYmZetPAoi57cgWxI2UwdGhWSON46c6vtqoMO" />
              </div>
              <h4 className="font-bold text-slate-700 dark:text-slate-200 text-sm">社交技能提升班</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4 line-clamp-2">通过互动游戏和角色扮演，提升孩子在集体环境中的沟通与协作能力。</p>
              <button onClick={() => onOpenService?.('社交技能提升班')} className="w-full py-2.5 rounded-xl border border-primary/30 text-primary text-xs font-semibold hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors">预约课程</button>
            </div>

            <div className="min-w-[260px] bg-surface-light dark:bg-surface-dark p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <div className="h-32 rounded-xl bg-gray-200 dark:bg-gray-700 mb-3 relative overflow-hidden group">
                <span className="absolute top-2 right-2 bg-black/30 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-lg z-10">活动</span>
                <img alt="Group therapy session" className="w-full h-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBWgXMCoejP-ji49PT_G4y_pHGMWgzucXvI-Dfg52VVmAGQfLoZoWgPyYzeem7tJK26t-lajTAtKWNe4MQUb2x06Hj2F9cUl6Erg-KGMtvl941P4324xD8bGo0TrJwZvRdvfh-ipNmYmI76nNKvlaCBH-3oMCryWuDSU3gTw5tbhssl6b_UsfOi1KoEbiIQKaL5OQvsaE4wj8oENafpGa_6KEerhbYY6ejkMGt5FWJAB9brFxtFbmh26BCg-gbkAO4WwyIyeFzH_sCs" />
              </div>
              <h4 className="font-bold text-slate-700 dark:text-slate-200 text-sm">共情能力工作坊</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4 line-clamp-2">引导孩子理解他人情绪，建立同理心，改善人际交往质量。</p>
              <button onClick={() => onOpenActivity?.('共情能力工作坊')} className="w-full py-2.5 rounded-xl border border-primary/30 text-primary text-xs font-semibold hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors">预约活动</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
