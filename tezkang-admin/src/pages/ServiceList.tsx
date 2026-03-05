/**
 * @description 服务管理页面 - 新增/编辑时使用人员选择器
 * 服务人员从 staff 表选择，非手动填写
 */
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Modal from '../components/ui/Modal';
import ImageUpload from '../components/ui/ImageUpload';

interface Service {
    id: string;
    title: string;
    description: string;
    provider_name: string;
    provider_title: string;
    staff_id: string | null;
    duration: string;
    rating: number;
    mode: string;
    price: number;
    status: string;
    image_url: string;
}

interface StaffOption {
    id: string;
    full_name: string;
    title: string;
}

interface BookingRecord {
    id: string;
    child_name: string;
    parent_name: string;
    selected_date: string;
    selected_time: string;
    status: string;
}

const EMPTY_FORM = { title: '', description: '', staff_id: '', duration: '', rating: 4.5, mode: 'offline', price: 0, image_url: '' };

const ServiceList: React.FC = () => {
    const [services, setServices] = useState<Service[]>([]);
    const [staffOptions, setStaffOptions] = useState<StaffOption[]>([]);
    const [loading, setLoading] = useState(true);
    const [formOpen, setFormOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [saving, setSaving] = useState(false);
    // 预约记录
    const [bookingsOpen, setBookingsOpen] = useState(false);
    const [bookingsTitle, setBookingsTitle] = useState('');
    const [bookings, setBookings] = useState<BookingRecord[]>([]);

    const fetchServices = async () => {
        const { data } = await supabase.from('services').select('*').order('created_at', { ascending: false });
        setServices(data || []);
        setLoading(false);
    };

    const fetchStaff = async () => {
        const { data } = await supabase.from('staff').select('id, full_name, title').eq('status', 'active').order('full_name');
        setStaffOptions(data || []);
    };

    useEffect(() => { fetchServices(); fetchStaff(); }, []);

    const toggleStatus = async (id: string, current: string) => {
        const newStatus = current === 'available' ? 'unavailable' : 'available';
        await supabase.from('services').update({ status: newStatus } as any).eq('id', id);
        setServices(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
    };

    const openCreate = () => { setForm(EMPTY_FORM); setEditingId(null); setFormOpen(true); };

    const openEdit = (s: Service) => {
        setForm({
            title: s.title,
            description: s.description,
            staff_id: s.staff_id || '',
            duration: s.duration,
            rating: s.rating,
            mode: s.mode,
            price: s.price,
            image_url: s.image_url || '',
        });
        setEditingId(s.id);
        setFormOpen(true);
    };

    const handleSave = async () => {
        setSaving(true);
        // 从选择的 staff 获取姓名和职称（保持向后兼容）
        const selectedStaff = staffOptions.find(s => s.id === form.staff_id);
        const payload: any = {
            title: form.title,
            description: form.description,
            staff_id: form.staff_id || null,
            provider_name: selectedStaff?.full_name || '',
            provider_title: selectedStaff?.title || '',
            duration: form.duration,
            rating: form.rating,
            mode: form.mode,
            price: form.price,
            image_url: form.image_url,
            status: 'available',
        };
        if (editingId) {
            await supabase.from('services').update(payload).eq('id', editingId);
        } else {
            await supabase.from('services').insert(payload);
        }
        setSaving(false);
        setFormOpen(false);
        fetchServices();
    };

    const showBookings = async (serviceTitle: string) => {
        setBookingsTitle(serviceTitle);
        const { data } = await supabase.from('registrations').select('id, child_name, parent_name, selected_date, selected_time, status').eq('item_type', 'service').eq('item_title', serviceTitle).order('created_at', { ascending: false });
        setBookings(data || []);
        setBookingsOpen(true);
    };

    const updateField = (key: string, value: string | number) => setForm(prev => ({ ...prev, [key]: value }));

    const statusText: Record<string, string> = { pending: '待确认', confirmed: '已确认', completed: '已完成', cancelled: '已取消' };
    const statusStyle: Record<string, string> = { pending: 'bg-amber-100 text-amber-700', confirmed: 'bg-primary-100 text-primary-700', completed: 'bg-green-100 text-green-700', cancelled: 'bg-red-100 text-red-600' };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="text-sm text-slate-500">共 <span className="font-bold text-slate-800">{services.length}</span> 项服务</div>
                <button onClick={openCreate} className="flex items-center gap-2 px-5 py-2.5 bg-primary-500 text-white rounded-xl text-sm font-semibold hover:bg-primary-600 shadow-lg shadow-primary-500/20 transition-all">
                    <span className="material-symbols-outlined !text-[18px]">add</span>新增服务
                </button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-16"><div className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin"></div></div>
            ) : (
                <div className="grid grid-cols-2 gap-6">
                    {services.map((s) => (
                        <div key={s.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                    <h3 className="text-sm font-bold text-slate-800 mb-1">{s.title}</h3>
                                    <p className="text-xs text-slate-500 line-clamp-2">{s.description}</p>
                                </div>
                                <button onClick={() => toggleStatus(s.id, s.status)} className={`ml-3 px-3 py-1 rounded-lg text-[10px] font-bold transition-colors ${s.status === 'available' ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                                    {s.status === 'available' ? '可用' : '已下架'}
                                </button>
                            </div>
                            {s.image_url && (
                                <div className="mb-3 rounded-xl overflow-hidden h-32">
                                    <img src={s.image_url} alt={s.title} className="w-full h-full object-cover" />
                                </div>
                            )}
                            <div className="grid grid-cols-2 gap-3 mt-4">
                                <div className="flex items-center gap-2 text-xs text-slate-500"><span className="material-symbols-outlined !text-[14px] text-primary-500">person</span>{s.provider_name} · {s.provider_title}</div>
                                <div className="flex items-center gap-2 text-xs text-slate-500"><span className="material-symbols-outlined !text-[14px] text-primary-500">schedule</span>{s.duration}</div>
                                <div className="flex items-center gap-2 text-xs text-slate-500"><span className="material-symbols-outlined !text-[14px] text-amber-500">star</span>{s.rating}</div>
                                <div className="flex items-center gap-2 text-xs text-slate-500"><span className="material-symbols-outlined !text-[14px] text-primary-500">sell</span>¥{s.price}</div>
                            </div>
                            <div className="flex gap-2 mt-4 pt-3 border-t border-slate-50">
                                <button onClick={() => openEdit(s)} className="flex-1 py-2 text-xs font-semibold text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors">编辑</button>
                                <button onClick={() => showBookings(s.title)} className="flex-1 py-2 text-xs font-semibold text-slate-500 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">预约记录</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* 新增/编辑表单 - 使用人员选择器 */}
            <Modal open={formOpen} onClose={() => setFormOpen(false)} title={editingId ? '编辑服务' : '新增服务'} width="max-w-xl">
                <div className="space-y-4">
                    <div><label className="block text-xs font-semibold text-slate-600 mb-1">服务名称 *</label><input value={form.title} onChange={e => updateField('title', e.target.value)} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400" /></div>
                    <div><label className="block text-xs font-semibold text-slate-600 mb-1">服务描述</label><textarea value={form.description} onChange={e => updateField('description', e.target.value)} rows={3} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 resize-none" /></div>

                    {/* 人员选择器 */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">服务人员 *（从已有人员中选择）</label>
                        <select
                            value={form.staff_id}
                            onChange={e => updateField('staff_id', e.target.value)}
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400"
                        >
                            <option value="">请选择服务人员</option>
                            {staffOptions.map(s => (
                                <option key={s.id} value={s.id}>{s.full_name} — {s.title}</option>
                            ))}
                        </select>
                        {form.staff_id && (
                            <div className="mt-2 flex items-center gap-2 text-xs text-primary-600 bg-primary-50 px-3 py-1.5 rounded-lg">
                                <span className="material-symbols-outlined !text-[14px]">check_circle</span>
                                已选择：{staffOptions.find(s => s.id === form.staff_id)?.full_name} — {staffOptions.find(s => s.id === form.staff_id)?.title}
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div><label className="block text-xs font-semibold text-slate-600 mb-1">时长</label><input value={form.duration} onChange={e => updateField('duration', e.target.value)} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400" placeholder="如 60分钟/次" /></div>
                        <div><label className="block text-xs font-semibold text-slate-600 mb-1">方式</label><select value={form.mode} onChange={e => updateField('mode', e.target.value)} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400"><option value="offline">线下</option><option value="online">线上</option></select></div>
                        <div><label className="block text-xs font-semibold text-slate-600 mb-1">价格</label><input type="number" value={form.price} onChange={e => updateField('price', parseFloat(e.target.value) || 0)} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400" /></div>
                    </div>

                    {/* 图片上传 */}
                    <ImageUpload value={form.image_url} onChange={(url) => updateField('image_url', url)} label="服务封面图" />

                    <div className="flex justify-end gap-3 pt-2">
                        <button onClick={() => setFormOpen(false)} className="px-5 py-2.5 text-sm font-semibold text-slate-500 bg-slate-100 rounded-xl hover:bg-slate-200">取消</button>
                        <button onClick={handleSave} disabled={saving || !form.title} className="px-6 py-2.5 text-sm font-semibold text-white bg-primary-500 rounded-xl hover:bg-primary-600 shadow-lg shadow-primary-500/20 disabled:opacity-50">{saving ? '保存中...' : '保存'}</button>
                    </div>
                </div>
            </Modal>

            {/* 预约记录 */}
            <Modal open={bookingsOpen} onClose={() => setBookingsOpen(false)} title={`${bookingsTitle} - 预约记录`} width="max-w-2xl">
                <table className="w-full">
                    <thead><tr className="border-b border-slate-100">
                        <th className="text-left py-2 text-xs font-semibold text-slate-500">儿童</th>
                        <th className="text-left py-2 text-xs font-semibold text-slate-500">联系人</th>
                        <th className="text-left py-2 text-xs font-semibold text-slate-500">预约日期</th>
                        <th className="text-left py-2 text-xs font-semibold text-slate-500">时间</th>
                        <th className="text-left py-2 text-xs font-semibold text-slate-500">状态</th>
                    </tr></thead>
                    <tbody>
                        {bookings.map(b => (
                            <tr key={b.id} className="border-b border-slate-50">
                                <td className="py-2.5 text-sm text-slate-800">{b.child_name}</td>
                                <td className="py-2.5 text-sm text-slate-600">{b.parent_name}</td>
                                <td className="py-2.5 text-xs text-slate-500">{b.selected_date}</td>
                                <td className="py-2.5 text-xs text-slate-500">{b.selected_time}</td>
                                <td className="py-2.5"><span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${statusStyle[b.status] || ''}`}>{statusText[b.status] || b.status}</span></td>
                            </tr>
                        ))}
                        {bookings.length === 0 && <tr><td colSpan={5} className="py-8 text-center text-sm text-slate-400">暂无预约记录</td></tr>}
                    </tbody>
                </table>
            </Modal>
        </div>
    );
};

export default ServiceList;
