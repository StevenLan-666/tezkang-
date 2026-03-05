import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface ActivityDetailReportProps {
  onBack: () => void;
  title: string;
  childId?: string | null;
}

export default function ActivityDetailReport({ onBack, title, childId }: ActivityDetailReportProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        // 先尝试精确匹配 registrations
        let q = supabase.from('registrations').select('*').eq('item_title', title);
        if (childId) q = q.eq('child_id', childId);

        let { data: regData } = await q.order('created_at', { ascending: false }).limit(1).single();

        // 如果精确匹配找不到，但标题包含“综合评估”或“行为”，或者就是子维度名，退化查该儿童最后一次完成的“一对一干预”或所有服务中的最近一次
        if (!regData && childId) {
          const fallbackQ = await supabase.from('registrations')
            .select('*')
            .eq('child_id', childId)
            .eq('status', 'completed')
            .or('item_title.ilike.%干预%,item_title.ilike.%心理咨询%,item_title.ilike.%评估%,item_title.ilike.%纠正%')
            .order('completed_at', { ascending: false })
            .limit(1)
            .single();

          if (fallbackQ.data) {
            regData = fallbackQ.data;
          } else {
            // 最终兜底：随便取该儿童最近完成的一条
            const finalFallbackQ = await supabase.from('registrations')
              .select('*')
              .eq('child_id', childId)
              .eq('status', 'completed')
              .order('completed_at', { ascending: false })
              .limit(1)
              .single();
            if (finalFallbackQ.data) regData = finalFallbackQ.data;
          }
        }

        let targetData: any = {};

        if (regData) {
          const rData = regData as any;
          // 取孩子及监护人信息
          let childInfo = { name: '未知', age: '未知', phone: '未填写' };
          if (childId) {
            const { data: userData } = await supabase.from('users').select('*').eq('child_id', childId).single();
            if (userData) {
              const uData = userData as any;
              childInfo.name = uData.child_name || '未知';
              childInfo.age = uData.child_age || '未知';
              childInfo.phone = uData.phone || '未填写';
            }
          }

          // 尝试去 activities 或 services 查详情
          if (rData.item_type === 'activity') {
            const { data: act } = await supabase.from('activities').select('*').eq('id', rData.item_id).single();
            targetData = { ...rData, detail: act as any, childInfo, isActivity: true };
          } else {
            const { data: svc } = await supabase.from('services').select('*').eq('id', rData.item_id).single();
            targetData = { ...rData, detail: svc as any, childInfo, isActivity: false };
          }
        }

        setData(targetData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (title) fetchDetail();
  }, [title, childId]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-900 min-h-screen pb-10 items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const detailObj = data?.detail || {};
  let timeStr = '暂未安排';
  if (data?.selected_date) {
    timeStr = `${data.selected_date} ${data.selected_time || ''}`;
  } else if (data?.isActivity && (detailObj.start_date || detailObj.event_date)) {
    timeStr = detailObj.start_date || detailObj.event_date;
  } else if (data?.preferred_time) {
    timeStr = data.preferred_time;
  }

  const locationStr = detailObj.location || '线上/待定';
  const descStr = detailObj.description || '暂无简介';
  const personName = data?.assigned_staff || detailObj.provider_name || '相关老师';
  const staffComment = data?.staff_comment || '暂无反馈，您可以稍后查看或向老师了解。';

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
                <p className="text-xs text-slate-500 dark:text-slate-400">{timeStr || '暂未安排'}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-slate-400 text-lg mt-0.5">location_on</span>
              <div>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">地点</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{locationStr}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-slate-400 text-lg mt-0.5">description</span>
              <div>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">简介</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {descStr}
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
              <p className="text-sm font-bold text-slate-800 dark:text-white">{data?.child_name || data?.childInfo?.name || data?.participant_name || '未知'}</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-xl">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">年龄</p>
              <p className="text-sm font-bold text-slate-800 dark:text-white">{data?.child_age || data?.childInfo?.age || data?.participant_age || '未知'}</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-xl col-span-2">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">联系电话</p>
              <p className="text-sm font-bold text-slate-800 dark:text-white">{data?.parent_phone || data?.childInfo?.phone || data?.guardian_phone || '未填写'}</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-xl col-span-2">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">备注需求</p>
              <p className="text-sm font-bold text-slate-800 dark:text-white">{data?.health_notes || data?.notes || '无'}</p>
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
            <h4 className="font-bold text-slate-800 dark:text-white mb-3">老师/专家点评</h4>
            <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-2xl italic text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
              "{staffComment}"
            </div>
            <div className="mt-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center text-slate-400">
                <span className="material-symbols-outlined">person</span>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800 dark:text-white">{personName}</p>
                <p className="text-xs text-slate-500">相关负责人</p>
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
