/**
 * @description 历史记录列表页面
 * 从 Supabase history_records 表动态获取数据
 */
import { useState, useMemo } from 'react';
import { useHistoryRecords } from '../hooks/useHealthData';

interface HistoryListProps {
  onBack: () => void;
  title: string;
  onOpenDetail?: (type: 'test' | 'activity', title: string) => void;
  onOpenFeedback?: () => void;
  childId?: string | null;
}

export default function HistoryList({ onBack, title, onOpenDetail, onOpenFeedback, childId }: HistoryListProps) {
  const [activeFilter, setActiveFilter] = useState<'全部' | '测试记录' | '活动记录'>('全部');

  const categoryMap: { [key: string]: string } = {
    '社交能力': 'social',
    '行为表现': 'behavior',
    '决策方式': 'decision',
  };

  // 如果标题对应某个分类则筛选，否则获取全部
  const currentCategory = categoryMap[title] || undefined;
  const { records, loading } = useHistoryRecords(childId || null, currentCategory);

  // 根据 tab 过滤记录类型
  const filteredItems = useMemo(() => {
    if (activeFilter === '测试记录') return records.filter(r => r.record_type === 'test');
    if (activeFilter === '活动记录') return records.filter(r => r.record_type === 'activity');
    return records;
  }, [records, activeFilter]);

  const filters: ('全部' | '测试记录' | '活动记录')[] = ['全部', '测试记录', '活动记录'];

  return (
    <div className="bg-background-light dark:bg-background-dark text-text-main dark:text-slate-200 min-h-screen transition-colors duration-200 antialiased pb-10 flex flex-col">
      <div className="px-6 py-3 flex justify-between items-center text-xs font-semibold text-text-main dark:text-slate-300 opacity-90 sticky top-0 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md z-20">
        <span>16:58</span>
        <div className="flex gap-1.5 items-center">
          <span className="material-symbols-outlined text-sm">signal_cellular_alt</span>
          <span className="material-symbols-outlined text-sm">wifi</span>
          <span className="material-symbols-outlined text-sm">battery_full</span>
        </div>
      </div>

      <header className="px-6 py-4 flex items-center justify-between relative sticky top-10 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md z-10">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-surface-light dark:bg-surface-dark shadow-sm flex items-center justify-center text-text-sub dark:text-slate-400 hover:text-primary transition-colors z-10">
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </button>
        <div className="absolute left-0 right-0 text-center pointer-events-none">
          <h1 className="text-lg font-bold text-text-main dark:text-white">{title === '全部记录' ? '全部历史记录' : `${title}历史记录`}</h1>
        </div>
        <div className="w-10"></div>
      </header>

      <main className="px-6 mt-4 space-y-4 pb-24 flex-1 overflow-y-auto">
        <div className="flex gap-4 mb-2">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`text-xs font-bold pb-1 transition-colors ${activeFilter === f ? 'text-primary border-b-2 border-primary' : 'text-text-sub dark:text-slate-400'}`}
            >
              {f}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex flex-col items-center py-12 gap-3">
            <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs text-text-sub">加载中...</span>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="flex flex-col items-center py-16 gap-4">
            <span className="material-symbols-outlined text-4xl text-slate-300">history</span>
            <p className="text-sm text-text-sub dark:text-slate-400">暂无历史记录</p>
          </div>
        ) : (
          filteredItems.map((item) => (
            <div key={item.id} className="bg-surface-light dark:bg-surface-dark rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800 flex items-start space-x-4">
              <div className={`flex-shrink-0 w-12 h-12 rounded-2xl bg-${item.status_color}-50 dark:bg-${item.status_color}-900/20 flex items-center justify-center text-${item.status_color}-500 dark:text-${item.status_color}-400`}>
                <span className="material-symbols-outlined">
                  {item.record_type === 'test' ? 'assignment' : 'fitness_center'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-slate-700 dark:text-slate-200 text-sm">{item.title}</h4>
                  <span className="text-[10px] text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded-full whitespace-nowrap ml-2">{item.record_date}</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">{item.description}</p>

                <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-50 dark:border-slate-800">
                  <div className="flex gap-2">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-${item.status_color}-50 text-${item.status_color}-600 dark:bg-${item.status_color}-900/30 dark:text-${item.status_color}-400 border border-${item.status_color}-100 dark:border-${item.status_color}-900/50`}>
                      {item.status}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {item.record_type === 'test' ? '测试记录' : '活动记录'}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => onOpenDetail?.(item.record_type as 'test' | 'activity', item.title)} className="text-[10px] font-bold text-primary bg-primary/10 px-3 py-1 rounded-lg hover:bg-primary/20 transition-colors">详情</button>
                    <button onClick={onOpenFeedback} className="text-[10px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">反馈</button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  );
}
