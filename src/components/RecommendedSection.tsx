/**
 * @description 推荐服务/活动卡片组件
 * 从数据库加载推荐内容，替代硬编码
 */
import React from 'react';
import { useRecommendations } from '../hooks/useRecommendations';

interface RecommendedSectionProps {
    category: 'social' | 'behavior' | 'decision';
    onOpenService?: (title?: string) => void;
    onOpenActivity?: (title?: string) => void;
}

const RecommendedSection: React.FC<RecommendedSectionProps> = ({ category, onOpenService, onOpenActivity }) => {
    const { items, loading } = useRecommendations(category);

    if (loading) {
        return (
            <section className="pt-2 pb-6">
                <h3 className="text-lg font-bold mb-3 px-1 text-slate-800 dark:text-slate-200">推荐服务</h3>
                <div className="flex gap-4 px-1">
                    {[1, 2].map(i => (
                        <div key={i} className="min-w-[260px] bg-surface-light dark:bg-surface-dark p-4 rounded-2xl border border-slate-100 dark:border-slate-800 animate-pulse">
                            <div className="h-32 rounded-xl bg-slate-200 dark:bg-slate-700 mb-3"></div>
                            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-full mb-4"></div>
                            <div className="h-10 bg-slate-100 dark:bg-slate-800 rounded-xl"></div>
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    if (items.length === 0) return null;

    return (
        <section className="pt-2 pb-6">
            <h3 className="text-lg font-bold mb-3 px-1 text-slate-800 dark:text-slate-200">推荐服务</h3>
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar px-1">
                {items.map(item => (
                    <div key={item.id} className="min-w-[260px] bg-surface-light dark:bg-surface-dark p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                        <div className="h-32 rounded-xl bg-gray-200 dark:bg-gray-700 mb-3 relative overflow-hidden group">
                            <span className="absolute top-2 right-2 bg-black/30 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-lg z-10">
                                {item.type === 'activity' ? '活动' : '课程'}
                            </span>
                            {item.image_url && (
                                <img
                                    alt={item.title}
                                    className="w-full h-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
                                    src={item.image_url}
                                />
                            )}
                        </div>
                        <h4 className="font-bold text-slate-700 dark:text-slate-200 text-sm">{item.title}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4 line-clamp-2">{item.description}</p>
                        <button
                            onClick={() => item.type === 'activity' ? onOpenActivity?.(item.title) : onOpenService?.(item.title)}
                            className="w-full py-2.5 rounded-xl border border-primary/30 text-primary text-xs font-semibold hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors"
                        >
                            {item.type === 'activity' ? '预约活动' : '预约课程'}
                        </button>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default RecommendedSection;
