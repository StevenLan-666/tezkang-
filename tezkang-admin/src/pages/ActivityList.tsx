/**
 * @description 活动管理页面 - 含新增/编辑表单 + 结束活动二次确认
 */
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import ImageUpload from '../components/ui/ImageUpload';

interface Activity {
    id: string;
    title: string;
    description: string;
    location: string;
    event_date: string;
    max_participants: number;
    current_participants: number;
    price: number;
    status: string;
    category: string;
    image_url: string;
}

const EMPTY_FORM = { title: '', description: '', location: '', event_date: '', max_participants: 30, price: 0, category: '', image_url: '' };

const STATUS_MAP: Record<string, { label: string; className: string }> = {
    open: { label: '报名中', className: 'bg-green-100 text-green-700' },
    full: { label: '已满员', className: 'bg-amber-100 text-amber-700' },
    ended: { label: '已结束', className: 'bg-slate-100 text-slate-600' },
};

const ActivityList: React.FC = () => {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [formOpen, setFormOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [saving, setSaving] = useState(false);
    // 二次确认
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmTarget, setConfirmTarget] = useState<string | null>(null);

    const fetchActivities = async () => {
        const { data } = await supabase.from('activities').select('*').order('created_at', { ascending: false });
        setActivities(data || []);
        setLoading(false);
    };

    useEffect(() => { fetchActivities(); }, []);

    const filtered = filter === 'all' ? activities : activities.filter(a => a.status === filter);

    const openCreate = () => { setForm(EMPTY_FORM); setEditingId(null); setFormOpen(true); };

    const openEdit = (a: Activity) => {
        setForm({
            title: a.title, description: a.description, location: a.location,
            event_date: a.event_date ? a.event_date.slice(0, 16) : '',
            max_participants: a.max_participants, price: a.price,
            category: a.category, image_url: a.image_url,
        });
        setEditingId(a.id);
        setFormOpen(true);
    };

    const handleSave = async () => {
        setSaving(true);
        const payload = {
            title: form.title, description: form.description, location: form.location,
            event_date: form.event_date || null, max_participants: form.max_participants,
            price: form.price, category: form.category, image_url: form.image_url,
            status: 'open',
        };
        if (editingId) {
            await supabase.from('activities').update(payload).eq('id', editingId);
        } else {
            await supabase.from('activities').insert(payload);
        }
        setSaving(false);
        setFormOpen(false);
        fetchActivities();
    };

    const requestEnd = (id: string) => { setConfirmTarget(id); setConfirmOpen(true); };

    const confirmEnd = async () => {
        if (!confirmTarget) return;
        await supabase.from('activities').update({ status: 'ended' }).eq('id', confirmTarget);
        setActivities(prev => prev.map(a => a.id === confirmTarget ? { ...a, status: 'ended' } : a));
        setConfirmOpen(false);
        setConfirmTarget(null);
    };

    const updateField = (key: string, value: string | number) => setForm(prev => ({ ...prev, [key]: value }));

    return (
        <div className="space-y-6">
            {/* 工具栏 */}
            <div className="flex items-center justify-between">
                <div className="flex gap-2">
                    {[{ v: 'all', l: '全部' }, { v: 'open', l: '报名中' }, { v: 'full', l: '已满员' }, { v: 'ended', l: '已结束' }].map(f => (
                        <button key={f.v} onClick={() => setFilter(f.v)} className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${filter === f.v ? 'bg-primary-500 text-white shadow-md shadow-primary-500/20' : 'bg-white border border-slate-200 text-slate-500 hover:border-primary-400'}`}>{f.l}</button>
                    ))}
                </div>
                <button onClick={openCreate} className="flex items-center gap-2 px-5 py-2.5 bg-primary-500 text-white rounded-xl text-sm font-semibold hover:bg-primary-600 shadow-lg shadow-primary-500/20 transition-all">
                    <span className="material-symbols-outlined !text-[18px]">add</span>新增活动
                </button>
            </div>

            {/* 卡片 */}
            {loading ? (
                <div className="flex items-center justify-center py-16"><div className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin"></div></div>
            ) : (
                <div className="grid grid-cols-3 gap-6">
                    {filtered.map((a) => {
                        const si = STATUS_MAP[a.status] || STATUS_MAP.ended;
                        const fill = a.max_participants > 0 ? Math.round((a.current_participants / a.max_participants) * 100) : 0;
                        return (
                            <div key={a.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                                <div className="p-5 flex-1 flex flex-col">
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className="text-sm font-bold text-slate-800 leading-snug flex-1 mr-2 line-clamp-1">{a.title}</h3>
                                        <span className={`shrink-0 px-2 py-0.5 rounded-md text-[10px] font-bold ${si.className}`}>{si.label}</span>
                                    </div>
                                    <p className="text-xs text-slate-500 line-clamp-2 mb-3 flex-1">{a.description}</p>
                                    <div className="space-y-1.5 mb-3">
                                        <div className="flex items-center gap-2 text-xs text-slate-500"><span className="material-symbols-outlined !text-[14px] text-slate-400">location_on</span>{a.location || '未设置'}</div>
                                        <div className="flex items-center gap-2 text-xs text-slate-500"><span className="material-symbols-outlined !text-[14px] text-slate-400">event</span>{a.event_date ? new Date(a.event_date).toLocaleDateString('zh-CN') : '未设置'}</div>
                                        <div className="flex items-center gap-2 text-xs text-slate-500"><span className="material-symbols-outlined !text-[14px] text-slate-400">sell</span>¥{a.price}</div>
                                    </div>
                                    <div className="mb-3">
                                        <div className="flex items-center justify-between text-xs mb-1"><span className="text-slate-500">报名进度</span><span className="font-semibold text-slate-700">{a.current_participants}/{a.max_participants}</span></div>
                                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-primary-500 rounded-full transition-all" style={{ width: `${fill}%` }}></div></div>
                                    </div>
                                </div>
                                <div className="flex border-t border-slate-50">
                                    <button onClick={() => openEdit(a)} className="flex-1 py-2.5 text-xs font-semibold text-primary-600 hover:bg-primary-50 transition-colors">编辑</button>
                                    {a.status === 'open' && (
                                        <button onClick={() => requestEnd(a.id)} className="flex-1 py-2.5 text-xs font-semibold text-slate-500 hover:bg-slate-50 transition-colors border-l border-slate-50">结束报名</button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                    {filtered.length === 0 && <div className="col-span-3 py-16 text-center text-sm text-slate-400">暂无活动数据</div>}
                </div>
            )}

            {/* 新增/编辑表单 */}
            <Modal open={formOpen} onClose={() => setFormOpen(false)} title={editingId ? '编辑活动' : '新增活动'} width="max-w-xl">
                <div className="space-y-4">
                    <div><label className="block text-xs font-semibold text-slate-600 mb-1">活动名称 *</label><input value={form.title} onChange={e => updateField('title', e.target.value)} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400" placeholder="输入活动名称" /></div>
                    <div><label className="block text-xs font-semibold text-slate-600 mb-1">活动描述</label><textarea value={form.description} onChange={e => updateField('description', e.target.value)} rows={3} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 resize-none" placeholder="输入活动描述" /></div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-xs font-semibold text-slate-600 mb-1">活动地点</label><input value={form.location} onChange={e => updateField('location', e.target.value)} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400" placeholder="地点" /></div>
                        <div><label className="block text-xs font-semibold text-slate-600 mb-1">活动分类</label><input value={form.category} onChange={e => updateField('category', e.target.value)} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400" placeholder="如：情绪管理、专注力" /></div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div><label className="block text-xs font-semibold text-slate-600 mb-1">活动时间</label><input type="datetime-local" value={form.event_date} onChange={e => updateField('event_date', e.target.value)} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400" /></div>
                        <div><label className="block text-xs font-semibold text-slate-600 mb-1">最大人数</label><input type="number" value={form.max_participants} onChange={e => updateField('max_participants', parseInt(e.target.value) || 0)} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400" /></div>
                        <div><label className="block text-xs font-semibold text-slate-600 mb-1">价格（元）</label><input type="number" value={form.price} onChange={e => updateField('price', parseFloat(e.target.value) || 0)} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400" /></div>
                    </div>
                    <ImageUpload value={form.image_url} onChange={url => updateField('image_url', url)} label="活动封面图" />
                    <div className="flex justify-end gap-3 pt-2">
                        <button onClick={() => setFormOpen(false)} className="px-5 py-2.5 text-sm font-semibold text-slate-500 bg-slate-100 rounded-xl hover:bg-slate-200">取消</button>
                        <button onClick={handleSave} disabled={saving || !form.title} className="px-6 py-2.5 text-sm font-semibold text-white bg-primary-500 rounded-xl hover:bg-primary-600 shadow-lg shadow-primary-500/20 disabled:opacity-50">{saving ? '保存中...' : '保存'}</button>
                    </div>
                </div>
            </Modal>

            {/* 结束活动确认 */}
            <ConfirmDialog open={confirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={confirmEnd} title="确认结束活动" message="结束后将无法再接受新的报名，确定要结束此活动吗？" confirmText="结束活动" />
        </div>
    );
};

export default ActivityList;
