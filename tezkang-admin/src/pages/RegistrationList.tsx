/**
 * @description 报名管理页面 - 完整流程
 * - 详情：展示服务人员 + 用户备注
 * - 确认：选择/确认服务人员 → 写入排班表
 * - 完成：评价表单（评分 + 评语）→ 写入 DB
 */
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Modal from '../components/ui/Modal';

interface RegistrationRow {
    id: string;
    item_title: string;
    item_type: string;
    child_name: string;
    child_age: number;
    parent_name: string;
    parent_phone: string;
    selected_date: string;
    selected_time: string;
    health_notes: string;
    assigned_staff: string;
    staff_comment: string;
    satisfaction_score: number;
    status: string;
    created_at: string;
}

const STATUS_OPTIONS = [
    { value: 'all', label: '全部' },
    { value: 'pending', label: '待确认' },
    { value: 'confirmed', label: '已确认' },
    { value: 'completed', label: '已完成' },
    { value: 'cancelled', label: '已取消' },
];
const STATUS_STYLE: Record<string, string> = { pending: 'bg-amber-100 text-amber-700', confirmed: 'bg-primary-100 text-primary-700', completed: 'bg-green-100 text-green-700', cancelled: 'bg-red-100 text-red-600' };
const STATUS_TEXT: Record<string, string> = { pending: '待确认', confirmed: '已确认', completed: '已完成', cancelled: '已取消' };

const RegistrationList: React.FC = () => {
    const [registrations, setRegistrations] = useState<RegistrationRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [staffOptions, setStaffOptions] = useState<string[]>([]);

    // 详情弹窗
    const [detailOpen, setDetailOpen] = useState(false);
    const [detail, setDetail] = useState<RegistrationRow | null>(null);
    const [editDate, setEditDate] = useState('');
    const [editTime, setEditTime] = useState('');
    const [editStaff, setEditStaff] = useState('');
    const [savingDetail, setSavingDetail] = useState(false);

    // 确认弹窗（分配服务人员）
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmTarget, setConfirmTarget] = useState<RegistrationRow | null>(null);
    const [confirmStaff, setConfirmStaff] = useState('');
    const [confirming, setConfirming] = useState(false);

    // 完成弹窗（评价表单）
    const [completeOpen, setCompleteOpen] = useState(false);
    const [completeTarget, setCompleteTarget] = useState<RegistrationRow | null>(null);
    const [evalScore, setEvalScore] = useState(5);
    const [evalComment, setEvalComment] = useState('');
    const [completing, setCompleting] = useState(false);

    useEffect(() => {
        const fetchAll = async () => {
            const [regRes, staffRes] = await Promise.all([
                supabase.from('registrations').select('*').order('created_at', { ascending: false }),
                supabase.from('services').select('provider_name'),
            ]);
            setRegistrations(regRes.data || []);
            const names = [...new Set((staffRes.data || []).map((s: { provider_name: string }) => s.provider_name).filter(Boolean))];
            setStaffOptions(names);
            setLoading(false);
        };
        fetchAll();
    }, []);

    const filtered = filter === 'all' ? registrations : registrations.filter(r => r.status === filter);

    // 查看详情
    const openDetail = (r: RegistrationRow) => {
        setDetail(r);
        setEditDate(r.selected_date || '');
        setEditTime(r.selected_time || '');
        setEditStaff(r.assigned_staff || '');
        setDetailOpen(true);
    };

    const saveDetail = async () => {
        if (!detail) return;
        setSavingDetail(true);
        await supabase.from('registrations').update({
            selected_date: editDate, selected_time: editTime, assigned_staff: editStaff,
        }).eq('id', detail.id);
        setRegistrations(prev => prev.map(r => r.id === detail.id ? { ...r, selected_date: editDate, selected_time: editTime, assigned_staff: editStaff } : r));
        setSavingDetail(false);
        setDetailOpen(false);
    };

    // 确认（分配人员 + 写排班）
    const openConfirm = (r: RegistrationRow) => {
        setConfirmTarget(r);
        setConfirmStaff(r.assigned_staff || (staffOptions.length > 0 ? staffOptions[0] : ''));
        setConfirmOpen(true);
    };

    const handleConfirm = async () => {
        if (!confirmTarget) return;
        setConfirming(true);
        // 更新 registrations
        await supabase.from('registrations').update({ status: 'confirmed', assigned_staff: confirmStaff }).eq('id', confirmTarget.id);
        // 写入排班表
        await supabase.from('staff_schedule').insert({
            staff_name: confirmStaff,
            registration_id: confirmTarget.id,
            schedule_date: confirmTarget.selected_date,
            schedule_time: confirmTarget.selected_time,
            child_name: confirmTarget.child_name,
            item_title: confirmTarget.item_title,
            status: 'booked',
        });
        setRegistrations(prev => prev.map(r => r.id === confirmTarget.id ? { ...r, status: 'confirmed', assigned_staff: confirmStaff } : r));
        setConfirming(false);
        setConfirmOpen(false);
    };

    // 取消
    const handleCancel = async (id: string) => {
        await supabase.from('registrations').update({ status: 'cancelled' }).eq('id', id);
        // 同步取消排班
        await supabase.from('staff_schedule').update({ status: 'cancelled' }).eq('registration_id', id);
        setRegistrations(prev => prev.map(r => r.id === id ? { ...r, status: 'cancelled' } : r));
    };

    // 完成（评价）
    const openComplete = (r: RegistrationRow) => {
        setCompleteTarget(r);
        setEvalScore(5);
        setEvalComment('');
        setCompleteOpen(true);
    };

    const handleComplete = async () => {
        if (!completeTarget) return;
        setCompleting(true);
        await supabase.from('registrations').update({
            status: 'completed',
            completed_at: new Date().toISOString(),
            satisfaction_score: evalScore,
            staff_comment: evalComment,
        }).eq('id', completeTarget.id);
        await supabase.from('staff_schedule').update({ status: 'completed' }).eq('registration_id', completeTarget.id);
        setRegistrations(prev => prev.map(r => r.id === completeTarget.id ? { ...r, status: 'completed', satisfaction_score: evalScore, staff_comment: evalComment } : r));
        setCompleting(false);
        setCompleteOpen(false);
    };

    return (
        <div className="space-y-6">
            {/* 过滤器 */}
            <div className="flex items-center gap-2">
                {STATUS_OPTIONS.map(opt => (
                    <button key={opt.value} onClick={() => setFilter(opt.value)} className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${filter === opt.value ? 'bg-primary-500 text-white' : 'bg-white border border-slate-200 text-slate-500 hover:border-primary-400'}`}>{opt.label}</button>
                ))}
            </div>

            {/* 表格 */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-16"><div className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin"></div></div>
                ) : (
                    <table className="w-full">
                        <thead><tr className="bg-slate-50/80">
                            <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">项目</th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">类型</th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">儿童</th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">服务人员</th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">预约时间</th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">状态</th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">操作</th>
                        </tr></thead>
                        <tbody>
                            {filtered.map(r => (
                                <tr key={r.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                                    <td className="py-3 px-4 text-sm font-medium text-slate-800">{r.item_title}</td>
                                    <td className="py-3 px-4"><span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${r.item_type === 'activity' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>{r.item_type === 'activity' ? '活动' : '服务'}</span></td>
                                    <td className="py-3 px-4 text-sm text-slate-600">{r.child_name}</td>
                                    <td className="py-3 px-4 text-sm text-slate-600">{r.assigned_staff || <span className="text-slate-300">未分配</span>}</td>
                                    <td className="py-3 px-4 text-xs text-slate-500">{r.selected_date} {r.selected_time}</td>
                                    <td className="py-3 px-4"><span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${STATUS_STYLE[r.status] || ''}`}>{STATUS_TEXT[r.status] || r.status}</span></td>
                                    <td className="py-3 px-4">
                                        <div className="flex gap-1.5 items-center">
                                            <button onClick={() => openDetail(r)} className="text-xs text-primary-600 font-semibold hover:text-primary-700">详情</button>
                                            {r.status === 'pending' && (<><span className="text-slate-200">|</span><button onClick={() => openConfirm(r)} className="text-xs text-primary-600 font-semibold">确认</button><span className="text-slate-200">|</span><button onClick={() => handleCancel(r.id)} className="text-xs text-red-500 font-semibold">取消</button></>)}
                                            {r.status === 'confirmed' && (<><span className="text-slate-200">|</span><button onClick={() => openComplete(r)} className="text-xs text-green-600 font-semibold">完成</button></>)}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && <tr><td colSpan={7} className="py-12 text-center text-sm text-slate-400">暂无报名记录</td></tr>}
                        </tbody>
                    </table>
                )}
            </div>

            {/* 详情弹窗 */}
            <Modal open={detailOpen} onClose={() => setDetailOpen(false)} title="报名详情" width="max-w-lg">
                {detail && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 bg-slate-50 rounded-xl"><p className="text-[10px] text-slate-400 mb-0.5">项目名称</p><p className="text-sm font-medium text-slate-800">{detail.item_title}</p></div>
                            <div className="p-3 bg-slate-50 rounded-xl"><p className="text-[10px] text-slate-400 mb-0.5">类型</p><p className="text-sm font-medium text-slate-800">{detail.item_type === 'activity' ? '活动' : '服务'}</p></div>
                            <div className="p-3 bg-slate-50 rounded-xl"><p className="text-[10px] text-slate-400 mb-0.5">儿童</p><p className="text-sm font-medium text-slate-800">{detail.child_name} ({detail.child_age}岁)</p></div>
                            <div className="p-3 bg-slate-50 rounded-xl"><p className="text-[10px] text-slate-400 mb-0.5">联系人</p><p className="text-sm font-medium text-slate-800">{detail.parent_name} {detail.parent_phone}</p></div>
                        </div>

                        {/* 用户备注 */}
                        {detail.health_notes && (
                            <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
                                <p className="text-[10px] text-amber-600 font-semibold mb-1">📝 用户报名备注</p>
                                <p className="text-sm text-amber-800">{detail.health_notes}</p>
                            </div>
                        )}

                        {/* 服务人员 */}
                        <div className="p-3 bg-primary-50/50 rounded-xl">
                            <p className="text-[10px] text-primary-600 font-semibold mb-1">👨‍⚕️ 服务人员</p>
                            <p className="text-sm font-medium text-slate-800">{detail.assigned_staff || '未分配'}</p>
                        </div>

                        {/* 评价（已完成时显示） */}
                        {detail.status === 'completed' && (detail.satisfaction_score > 0 || detail.staff_comment) && (
                            <div className="p-3 bg-green-50 rounded-xl border border-green-100">
                                <p className="text-[10px] text-green-600 font-semibold mb-1">⭐ 服务评价</p>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-sm font-bold text-green-700">{detail.satisfaction_score}分</span>
                                    <span className="text-yellow-500">{'★'.repeat(Math.round(detail.satisfaction_score))}{'☆'.repeat(5 - Math.round(detail.satisfaction_score))}</span>
                                </div>
                                {detail.staff_comment && <p className="text-sm text-green-800">{detail.staff_comment}</p>}
                            </div>
                        )}

                        {/* 修改信息 */}
                        <div className="border-t border-slate-100 pt-4">
                            <p className="text-xs font-semibold text-slate-600 mb-3">修改预约信息</p>
                            <div className="grid grid-cols-2 gap-3">
                                <div><label className="block text-xs text-slate-500 mb-1">预约日期</label><input value={editDate} onChange={e => setEditDate(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20" /></div>
                                <div><label className="block text-xs text-slate-500 mb-1">预约时间</label><input value={editTime} onChange={e => setEditTime(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20" /></div>
                            </div>
                            <div className="mt-3"><label className="block text-xs text-slate-500 mb-1">服务人员</label>
                                <select value={editStaff} onChange={e => setEditStaff(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 bg-white">
                                    <option value="">未分配</option>
                                    {staffOptions.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 pt-2">
                            <button onClick={() => setDetailOpen(false)} className="px-5 py-2.5 text-sm font-semibold text-slate-500 bg-slate-100 rounded-xl hover:bg-slate-200">关闭</button>
                            <button onClick={saveDetail} disabled={savingDetail} className="px-6 py-2.5 text-sm font-semibold text-white bg-primary-500 rounded-xl hover:bg-primary-600 shadow-lg shadow-primary-500/20 disabled:opacity-50">{savingDetail ? '保存中...' : '保存修改'}</button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* 确认弹窗 - 选择服务人员 */}
            <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)} title="确认报名 - 分配服务人员">
                {confirmTarget && (
                    <div className="space-y-4">
                        <div className="p-3 bg-slate-50 rounded-xl">
                            <p className="text-sm text-slate-700"><strong>{confirmTarget.child_name}</strong> 报名了 <strong>{confirmTarget.item_title}</strong></p>
                            <p className="text-xs text-slate-400 mt-1">预约时间：{confirmTarget.selected_date} {confirmTarget.selected_time}</p>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1.5">选择服务人员 *</label>
                            <select value={confirmStaff} onChange={e => setConfirmStaff(e.target.value)} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20">
                                {staffOptions.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                            <p className="text-[10px] text-slate-400 mt-1">确认后将自动写入排班表</p>
                        </div>
                        <div className="flex justify-end gap-3 pt-2">
                            <button onClick={() => setConfirmOpen(false)} className="px-5 py-2.5 text-sm font-semibold text-slate-500 bg-slate-100 rounded-xl hover:bg-slate-200">取消</button>
                            <button onClick={handleConfirm} disabled={confirming || !confirmStaff} className="px-6 py-2.5 text-sm font-semibold text-white bg-primary-500 rounded-xl hover:bg-primary-600 shadow-lg shadow-primary-500/20 disabled:opacity-50">{confirming ? '确认中...' : '确认并分配'}</button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* 完成弹窗 - 评价表单 */}
            <Modal open={completeOpen} onClose={() => setCompleteOpen(false)} title="服务完成 - 教师评价">
                {completeTarget && (
                    <div className="space-y-4">
                        <div className="p-3 bg-slate-50 rounded-xl">
                            <p className="text-sm text-slate-700"><strong>{completeTarget.child_name}</strong> · {completeTarget.item_title}</p>
                            <p className="text-xs text-slate-400 mt-1">服务人员：{completeTarget.assigned_staff || '未分配'}</p>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-2">满意度评分</label>
                            <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <button key={star} onClick={() => setEvalScore(star)} className={`text-2xl transition-colors ${star <= evalScore ? 'text-yellow-400' : 'text-slate-200'}`}>★</button>
                                ))}
                                <span className="ml-2 text-sm font-semibold text-slate-700">{evalScore} 分</span>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">教师评语</label>
                            <textarea value={evalComment} onChange={e => setEvalComment(e.target.value)} rows={3} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 resize-none" placeholder="请填写服务教师的评价..." />
                        </div>
                        <div className="flex justify-end gap-3 pt-2">
                            <button onClick={() => setCompleteOpen(false)} className="px-5 py-2.5 text-sm font-semibold text-slate-500 bg-slate-100 rounded-xl hover:bg-slate-200">取消</button>
                            <button onClick={handleComplete} disabled={completing} className="px-6 py-2.5 text-sm font-semibold text-white bg-green-500 rounded-xl hover:bg-green-600 shadow-lg shadow-green-500/20 disabled:opacity-50">{completing ? '提交中...' : '提交评价'}</button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default RegistrationList;
