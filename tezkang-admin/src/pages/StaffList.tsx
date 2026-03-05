/**
 * @description 人员管理页面 - 从 staff 表读取，含添加/编辑/查看详情
 * 字段：姓名、职称、擅长领域、工作年限
 */
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Modal from '../components/ui/Modal';

interface StaffMember {
    id: string;
    full_name: string;
    title: string;
    specialty: string[];
    years_of_experience: number;
    phone: string;
    email: string;
    bio: string;
    status: string;
}

const StaffList: React.FC = () => {
    const [staff, setStaff] = useState<StaffMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [formOpen, setFormOpen] = useState(false);
    const [detailOpen, setDetailOpen] = useState(false);
    const [detailStaff, setDetailStaff] = useState<StaffMember | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    // 表单字段
    const [formName, setFormName] = useState('');
    const [formTitle, setFormTitle] = useState('');
    const [formSpecialty, setFormSpecialty] = useState('');
    const [formYears, setFormYears] = useState('');
    const [formPhone, setFormPhone] = useState('');
    const [formEmail, setFormEmail] = useState('');
    const [formBio, setFormBio] = useState('');
    const [saving, setSaving] = useState(false);

    const fetchStaff = async () => {
        setLoading(true);
        const { data } = await supabase.from('staff').select('*').order('created_at', { ascending: false });
        if (data) setStaff(data as StaffMember[]);
        setLoading(false);
    };

    useEffect(() => { fetchStaff(); }, []);

    const resetForm = () => {
        setFormName(''); setFormTitle(''); setFormSpecialty(''); setFormYears('');
        setFormPhone(''); setFormEmail(''); setFormBio(''); setEditingId(null);
    };

    const openCreate = () => { resetForm(); setFormOpen(true); };

    const openEdit = (member: StaffMember) => {
        setFormName(member.full_name);
        setFormTitle(member.title);
        setFormSpecialty((member.specialty || []).join(', '));
        setFormYears(member.years_of_experience?.toString() || '');
        setFormPhone(member.phone || '');
        setFormEmail(member.email || '');
        setFormBio(member.bio || '');
        setEditingId(member.id);
        setFormOpen(true);
    };

    const openDetail = (s: StaffMember) => { setDetailStaff(s); setDetailOpen(true); };

    const handleSave = async () => {
        if (!formName.trim()) return;
        setSaving(true);
        const specialtyArr = formSpecialty.split(/[,，]/).map(s => s.trim()).filter(Boolean);
        const payload = {
            full_name: formName.trim(),
            title: formTitle.trim(),
            specialty: specialtyArr,
            years_of_experience: parseInt(formYears) || 0,
            phone: formPhone.trim(),
            email: formEmail.trim(),
            bio: formBio.trim(),
        };

        if (editingId) {
            await supabase.from('staff').update(payload as any).eq('id', editingId);
        } else {
            await supabase.from('staff').insert(payload as any);
        }

        setSaving(false);
        setFormOpen(false);
        fetchStaff();
    };

    const handleDelete = async (id: string) => {
        if (!confirm('确定删除该人员？')) return;
        await supabase.from('staff').delete().eq('id', id);
        fetchStaff();
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="text-sm text-slate-500">共 <span className="font-bold text-slate-800">{staff.length}</span> 位服务人员</div>
                <button onClick={openCreate} className="flex items-center gap-2 px-5 py-2.5 bg-primary-500 text-white rounded-xl text-sm font-semibold hover:bg-primary-600 shadow-lg shadow-primary-500/20 transition-all">
                    <span className="material-symbols-outlined !text-[18px]">person_add</span>添加人员
                </button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-16"><div className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin"></div></div>
            ) : (
                <div className="grid grid-cols-3 gap-6">
                    {staff.map(member => (
                        <div key={member.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-4 mb-3">
                                <div className="w-14 h-14 rounded-2xl bg-primary-100 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-primary-600 !text-[28px]">person</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-base font-bold text-slate-800 truncate">{member.full_name}</h3>
                                    <p className="text-xs text-slate-500">{member.title}</p>
                                </div>
                                <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${member.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                                    {member.status === 'active' ? '在职' : '离职'}
                                </span>
                            </div>

                            <div className="mb-3">
                                <p className="text-[10px] font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">擅长领域</p>
                                <div className="flex flex-wrap gap-1.5">
                                    {(member.specialty || []).map((s, i) => (
                                        <span key={i} className="px-2 py-0.5 rounded-lg bg-primary-50 text-primary-700 text-[11px] font-medium">{s}</span>
                                    ))}
                                    {(member.specialty || []).length === 0 && <span className="text-xs text-slate-400">暂无</span>}
                                </div>
                            </div>

                            <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                                <span className="flex items-center gap-1">
                                    <span className="material-symbols-outlined !text-[14px]">work</span>
                                    {member.years_of_experience || 0}年经验
                                </span>
                                {member.phone && (
                                    <span className="flex items-center gap-1">
                                        <span className="material-symbols-outlined !text-[14px]">call</span>
                                        {member.phone.slice(-4)}
                                    </span>
                                )}
                            </div>

                            <div className="flex gap-2 pt-3 border-t border-slate-50">
                                <button onClick={() => openEdit(member)} className="flex-1 py-2 text-xs font-semibold text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors">编辑</button>
                                <button onClick={() => openDetail(member)} className="flex-1 py-2 text-xs font-semibold text-slate-500 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">详情</button>
                                <button onClick={() => handleDelete(member.id)} className="py-2 px-3 text-xs font-semibold text-red-500 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                                    <span className="material-symbols-outlined !text-[14px]">delete</span>
                                </button>
                            </div>
                        </div>
                    ))}
                    {staff.length === 0 && <div className="col-span-3 py-16 text-center text-sm text-slate-400">暂无服务人员数据</div>}
                </div>
            )}

            {/* 添加/编辑弹窗 */}
            <Modal open={formOpen} onClose={() => setFormOpen(false)} title={editingId ? '编辑人员' : '添加人员'}>
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">姓名 *</label>
                        <input value={formName} onChange={e => setFormName(e.target.value)} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400" placeholder="请输入姓名" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">职称 *</label>
                        <input value={formTitle} onChange={e => setFormTitle(e.target.value)} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400" placeholder="如 主任医师、高级感统训练师" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">擅长领域</label>
                        <input value={formSpecialty} onChange={e => setFormSpecialty(e.target.value)} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400" placeholder="用逗号分隔，如：儿童心理学, ADHD诊断" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">工作年限</label>
                            <input type="number" value={formYears} onChange={e => setFormYears(e.target.value)} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400" placeholder="如 10" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">联系电话</label>
                            <input value={formPhone} onChange={e => setFormPhone(e.target.value)} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400" placeholder="手机号码" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">电子邮箱</label>
                        <input value={formEmail} onChange={e => setFormEmail(e.target.value)} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400" placeholder="email@example.com" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">个人简介</label>
                        <textarea rows={3} value={formBio} onChange={e => setFormBio(e.target.value)} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 resize-none" placeholder="专业背景和工作经历简介" />
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <button onClick={() => setFormOpen(false)} className="px-5 py-2.5 text-sm font-semibold text-slate-500 bg-slate-100 rounded-xl hover:bg-slate-200">取消</button>
                        <button onClick={handleSave} disabled={!formName.trim() || !formTitle.trim() || saving} className="px-6 py-2.5 text-sm font-semibold text-white bg-primary-500 rounded-xl hover:bg-primary-600 shadow-lg shadow-primary-500/20 disabled:opacity-50">
                            {saving ? '保存中...' : '保存'}
                        </button>
                    </div>
                </div>
            </Modal>

            {/* 详情弹窗 */}
            <Modal open={detailOpen} onClose={() => setDetailOpen(false)} title="人员详情">
                {detailStaff && (
                    <div className="space-y-5">
                        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                            <div className="w-16 h-16 rounded-2xl bg-primary-100 flex items-center justify-center"><span className="material-symbols-outlined text-primary-600 !text-[32px]">person</span></div>
                            <div>
                                <p className="text-lg font-bold text-slate-800">{detailStaff.full_name}</p>
                                <p className="text-sm text-slate-500">{detailStaff.title}</p>
                                <p className="text-xs text-primary-600 font-medium mt-0.5">{detailStaff.years_of_experience || 0} 年工作经验</p>
                            </div>
                        </div>

                        <div>
                            <p className="text-xs font-semibold text-slate-600 mb-2">擅长领域</p>
                            <div className="flex flex-wrap gap-2">
                                {(detailStaff.specialty || []).map((s, i) => (
                                    <span key={i} className="px-3 py-1 rounded-xl bg-primary-50 text-primary-700 text-sm font-medium">{s}</span>
                                ))}
                                {(detailStaff.specialty || []).length === 0 && <p className="text-sm text-slate-400">暂无</p>}
                            </div>
                        </div>

                        {detailStaff.bio && (
                            <div>
                                <p className="text-xs font-semibold text-slate-600 mb-2">个人简介</p>
                                <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl">{detailStaff.bio}</p>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            {detailStaff.phone && (
                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                    <span className="material-symbols-outlined !text-[16px] text-slate-400">call</span>
                                    {detailStaff.phone}
                                </div>
                            )}
                            {detailStaff.email && (
                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                    <span className="material-symbols-outlined !text-[16px] text-slate-400">mail</span>
                                    {detailStaff.email}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default StaffList;
