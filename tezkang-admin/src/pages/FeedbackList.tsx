/**
 * @description 反馈管理页面 - 含处理备注
 */
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Modal from '../components/ui/Modal';

interface FeedbackRow {
    id: string;
    feedback_type: string;
    description: string;
    activity_title: string;
    status: string;
    allow_contact: boolean;
    created_at: string;
}

const FeedbackList: React.FC = () => {
    const [feedbackList, setFeedbackList] = useState<FeedbackRow[]>([]);
    const [loading, setLoading] = useState(true);
    // 处理备注弹窗
    const [noteOpen, setNoteOpen] = useState(false);
    const [noteTarget, setNoteTarget] = useState<string | null>(null);
    const [noteText, setNoteText] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetch = async () => {
            const { data } = await supabase.from('feedback').select('*').order('created_at', { ascending: false });
            setFeedbackList(data || []);
            setLoading(false);
        };
        fetch();
    }, []);

    const openProcessNote = (id: string) => {
        setNoteTarget(id);
        setNoteText('');
        setNoteOpen(true);
    };

    const submitProcess = async () => {
        if (!noteTarget) return;
        setSaving(true);
        // 更新状态为 processing，并将备注追加到 description（简化方案）
        const fb = feedbackList.find(f => f.id === noteTarget);
        const updatedDesc = fb ? `${fb.description}\n\n---\n📋 处理备注（${new Date().toLocaleDateString('zh-CN')}）：${noteText}` : '';
        await supabase.from('feedback').update({ status: 'processing', description: updatedDesc }).eq('id', noteTarget);
        setFeedbackList(prev => prev.map(f => f.id === noteTarget ? { ...f, status: 'processing', description: updatedDesc } : f));
        setSaving(false);
        setNoteOpen(false);
    };

    const markResolved = async (id: string) => {
        await supabase.from('feedback').update({ status: 'resolved' }).eq('id', id);
        setFeedbackList(prev => prev.map(f => f.id === id ? { ...f, status: 'resolved' } : f));
    };

    const statusStyle: Record<string, string> = { pending: 'bg-amber-100 text-amber-700', processing: 'bg-blue-100 text-blue-700', resolved: 'bg-green-100 text-green-700' };
    const statusText: Record<string, string> = { pending: '待处理', processing: '处理中', resolved: '已解决' };

    return (
        <div className="space-y-6">
            <div className="text-sm text-slate-500">共 <span className="font-bold text-slate-800">{feedbackList.length}</span> 条反馈</div>

            {loading ? (
                <div className="flex items-center justify-center py-16"><div className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin"></div></div>
            ) : (
                <div className="space-y-4">
                    {feedbackList.map(fb => (
                        <div key={fb.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${statusStyle[fb.status] || 'bg-slate-100 text-slate-600'}`}>{statusText[fb.status] || fb.status}</span>
                                    <span className="text-xs text-slate-400 bg-slate-50 px-2 py-0.5 rounded">{fb.feedback_type}</span>
                                    {fb.activity_title && <span className="text-xs text-slate-400">• {fb.activity_title}</span>}
                                </div>
                                <span className="text-[10px] text-slate-400">{new Date(fb.created_at).toLocaleDateString('zh-CN')}</span>
                            </div>
                            <div className="text-sm text-slate-700 leading-relaxed mb-4 whitespace-pre-line">{fb.description}</div>
                            <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                                <div className="text-xs text-slate-400">{fb.allow_contact ? '✅ 允许联系' : '⛔ 匿名反馈'}</div>
                                <div className="flex gap-2">
                                    {fb.status === 'pending' && (
                                        <button onClick={() => openProcessNote(fb.id)} className="px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100">开始处理</button>
                                    )}
                                    {fb.status === 'processing' && (
                                        <button onClick={() => markResolved(fb.id)} className="px-3 py-1.5 text-xs font-semibold text-green-600 bg-green-50 rounded-lg hover:bg-green-100">标记解决</button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                    {feedbackList.length === 0 && <div className="py-16 text-center text-sm text-slate-400">暂无反馈</div>}
                </div>
            )}

            {/* 处理备注弹窗 */}
            <Modal open={noteOpen} onClose={() => setNoteOpen(false)} title="填写处理情况">
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">处理说明 *</label>
                        <textarea value={noteText} onChange={e => setNoteText(e.target.value)} rows={4} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 resize-none" placeholder="请描述处理方案和进展..." />
                    </div>
                    <div className="flex justify-end gap-3">
                        <button onClick={() => setNoteOpen(false)} className="px-5 py-2.5 text-sm font-semibold text-slate-500 bg-slate-100 rounded-xl hover:bg-slate-200">取消</button>
                        <button onClick={submitProcess} disabled={saving || !noteText.trim()} className="px-6 py-2.5 text-sm font-semibold text-white bg-blue-500 rounded-xl hover:bg-blue-600 shadow-lg shadow-blue-500/20 disabled:opacity-50">{saving ? '提交中...' : '提交并开始处理'}</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default FeedbackList;
