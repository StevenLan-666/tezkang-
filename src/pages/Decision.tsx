import { useState, useMemo } from 'react';
import { useHistoryRecords, useAssessments } from '../hooks/useHealthData';
import RecommendedSection from '../components/RecommendedSection';

export default function Decision({ onOpenTest, onOpenDetail, onOpenService, onOpenActivity, onOpenHistory, onOpenFeedback, childId }: { onOpenTest?: () => void, onOpenDetail?: () => void, onOpenService?: (title?: string) => void, onOpenActivity?: (title?: string) => void, onOpenHistory?: () => void, onOpenFeedback?: () => void, childId?: string | null }) {
  // 从 DB 获取决策维度的所有评估数据
  const { assessments } = useAssessments(childId || null, 'decision');

  const dates = useMemo(() => {
    if (assessments.length === 0) return ['暂无数据'];
    return assessments.map(a => a.period);
  }, [assessments]);

  const [selectedDate, setSelectedDate] = useState('');
  const [showDateDropdown, setShowDateDropdown] = useState(false);

  const activeDate = selectedDate || dates[0];

  const data = useMemo(() => {
    const current = assessments.find(a => a.period === activeDate);
    if (!current) return { improvement: '-', rational: '0%', thoughtful: '0%', independent: '0%' };

    const getDetail = (name: string) => current.details.find(d => d.dimension_name === name)?.dimension_value || '0%';

    return {
      improvement: current.improvement || '-',
      rational: getDetail('理性'),
      thoughtful: getDetail('深思熟虑'),
      independent: getDetail('独立'),
    };
  }, [assessments, activeDate]);

  const { records: decisionHistory } = useHistoryRecords(childId || null, 'decision');

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
        <h1 className="text-2xl font-bold text-text-main dark:text-white tracking-tight">决策方式</h1>
        <div className="relative">
          <div
            className="flex items-center space-x-2 bg-white dark:bg-surface-dark px-4 py-2 rounded-full shadow-sm border border-slate-100 dark:border-slate-700 cursor-pointer hover:bg-slate-50 transition-colors"
            onClick={() => setShowDateDropdown(!showDateDropdown)}
          >
            <span className="material-symbols-outlined text-primary text-lg">calendar_today</span>
            <span className="font-medium text-sm text-slate-600 dark:text-slate-300">{activeDate}</span>
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
                  className={`px-4 py-2 text-sm cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${activeDate === date ? 'text-primary font-bold bg-primary/5' : 'text-slate-600 dark:text-slate-300'}`}
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
        <div className="space-y-4" onClick={onOpenDetail}>
          <div className="bg-surface-light dark:bg-surface-dark rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800 cursor-pointer hover:shadow-md transition-shadow relative">
            <div className="absolute top-2 right-2 text-primary text-[10px] font-bold bg-primary/10 px-2 py-1 rounded">可点击区域</div>
            <div className="flex justify-between text-sm font-medium mb-3 mt-2">
              <span className="text-blue-500 dark:text-blue-400">理性</span>
              <span className="text-red-400 dark:text-red-400">感性</span>
            </div>
            <div className="relative pt-1 pb-1">
              <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <div className="absolute top-1 left-0 h-2 bg-primary rounded-l-lg transition-all duration-500" style={{ width: data.rational }}></div>
                <div className="absolute top-0 w-4 h-4 bg-primary rounded-full border-2 border-white dark:border-surface-dark shadow-sm transform -translate-x-1/2 transition-all duration-500" style={{ left: data.rational }}></div>
              </div>
              <div className="absolute -top-6 transform -translate-x-1/2 bg-text-main dark:bg-white text-white dark:text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded shadow-sm transition-all duration-500" style={{ left: data.rational }}>{data.rational}</div>
            </div>
          </div>

          <div className="bg-surface-light dark:bg-surface-dark rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800 cursor-pointer hover:shadow-md transition-shadow relative">
            <div className="absolute top-2 right-2 text-primary text-[10px] font-bold bg-primary/10 px-2 py-1 rounded">可点击区域</div>
            <div className="flex justify-between text-sm font-medium mb-3 mt-2">
              <span className="text-green-500 dark:text-green-400">深思熟虑</span>
              <span className="text-orange-400 dark:text-orange-400">冲动</span>
            </div>
            <div className="relative pt-1 pb-1">
              <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <div className="absolute top-1 left-0 h-2 bg-primary rounded-l-lg transition-all duration-500" style={{ width: data.thoughtful }}></div>
                <div className="absolute top-0 w-4 h-4 bg-primary rounded-full border-2 border-white dark:border-surface-dark shadow-sm transform -translate-x-1/2 transition-all duration-500" style={{ left: data.thoughtful }}></div>
              </div>
            </div>
          </div>

          <div className="bg-surface-light dark:bg-surface-dark rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800 cursor-pointer hover:shadow-md transition-shadow relative">
            <div className="absolute top-2 right-2 text-primary text-[10px] font-bold bg-primary/10 px-2 py-1 rounded">可点击区域</div>
            <div className="flex justify-between text-sm font-medium mb-3 mt-2">
              <span className="text-purple-500 dark:text-purple-400">独立</span>
              <span className="text-primary dark:text-primary">协作</span>
            </div>
            <div className="relative pt-1 pb-1">
              <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <div className="absolute top-1 left-0 h-2 bg-primary rounded-l-lg transition-all duration-500" style={{ width: data.independent }}></div>
                <div className="absolute top-0 w-4 h-4 bg-primary rounded-full border-2 border-white dark:border-surface-dark shadow-sm transform -translate-x-1/2 transition-all duration-500" style={{ left: data.independent }}></div>
              </div>
            </div>
          </div>
        </div>

        <section className="mb-2 mt-6">
          <div className="flex justify-between items-end mb-4 px-1">
            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200">进行测试</h3>
          </div>
          <div className="flex gap-3">
            <div onClick={() => onOpenService?.('一对一心理咨询和行为干预')} className="flex-[3] bg-primary/10 dark:bg-primary/20 rounded-2xl p-4 shadow-sm border border-primary/20 flex flex-col justify-between cursor-pointer hover:bg-primary/20 transition-colors relative overflow-hidden h-32">
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
            {decisionHistory.slice(0, 2).map((item) => (
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

        <RecommendedSection category="decision" onOpenService={onOpenService} onOpenActivity={onOpenActivity} />
      </main>
    </div>
  );
}
