/**
 * @description 推荐服务/活动 Hook
 * 根据维度分类（social/behavior/decision）从数据库加载推荐内容
 */
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

interface RecommendItem {
    id: string;
    title: string;
    description: string;
    image_url: string;
    type: 'activity' | 'service';
}

/**
 * 获取指定分类的推荐活动和服务
 * @param category - 'social' | 'behavior' | 'decision'
 */
export const useRecommendations = (category: string) => {
    const [items, setItems] = useState<RecommendItem[]>([]);
    const [loading, setLoading] = useState(true);

    const fetch = useCallback(async () => {
        try {
            setLoading(true);
            const results: RecommendItem[] = [];

            // 获取匹配分类的活动（优先使用 category_tags，如果为空则按 category 字段模糊匹配）
            const { data: activities } = await supabase
                .from('activities')
                .select('id, title, description, image_url, category_tags, category, status')
                .eq('status', 'open')
                .limit(3);

            (activities || []).forEach((a: any) => {
                const tags: string[] = a.category_tags || [];
                const cat = (a.category || '').toLowerCase();
                // 如果 category_tags 包含目标分类，或者 category 字段包含相关关键词
                const matched = tags.includes(category);
                const keywordMatch = (
                    (category === 'social' && (cat.includes('社交') || cat.includes('情绪'))) ||
                    (category === 'behavior' && (cat.includes('专注') || cat.includes('感统') || cat.includes('行为'))) ||
                    (category === 'decision' && (cat.includes('决策') || cat.includes('冲动')))
                );
                if (matched || keywordMatch) {
                    results.push({
                        id: a.id,
                        title: a.title,
                        description: a.description || '',
                        image_url: a.image_url || '',
                        type: 'activity',
                    });
                }
            });

            // 获取匹配分类的服务
            const { data: services } = await supabase
                .from('services')
                .select('id, title, description, image_url, category_tags, status')
                .eq('status', 'available')
                .limit(3);

            (services || []).forEach((s: any) => {
                const tags: string[] = s.category_tags || [];
                if (tags.includes(category)) {
                    results.push({
                        id: s.id,
                        title: s.title,
                        description: s.description || '',
                        image_url: s.image_url || '',
                        type: 'service',
                    });
                }
            });

            // 如果没有匹配到任何结果，返回所有可用项目的前2个
            if (results.length === 0) {
                (activities || []).slice(0, 1).forEach((a: any) => {
                    results.push({ id: a.id, title: a.title, description: a.description || '', image_url: a.image_url || '', type: 'activity' });
                });
                (services || []).slice(0, 1).forEach((s: any) => {
                    results.push({ id: s.id, title: s.title, description: s.description || '', image_url: s.image_url || '', type: 'service' });
                });
            }

            setItems(results.slice(0, 4));
        } catch (err) {
            console.error('获取推荐失败:', err);
        } finally {
            setLoading(false);
        }
    }, [category]);

    useEffect(() => { fetch(); }, [fetch]);

    return { items, loading, refetch: fetch };
};
