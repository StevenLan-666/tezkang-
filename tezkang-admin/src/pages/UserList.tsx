/**
 * @description 用户管理页面
 * 展示所有注册用户（监护人）及其关联的儿童信息
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface UserRow {
    id: string;
    full_name: string;
    phone: string;
    created_at: string;
    children: { id: string; full_name: string; age: number; gender: string }[];
}

const UserList: React.FC = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState<UserRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            const { data } = await supabase
                .from('profiles')
                .select('id, full_name, phone, created_at, children(id, full_name, age, gender)')
                .order('created_at', { ascending: false });
            setUsers((data as UserRow[]) || []);
            setLoading(false);
        };
        fetchUsers();
    }, []);

    const filteredUsers = users.filter(u =>
        u.full_name.includes(search) || u.phone.includes(search) ||
        u.children.some(c => c.full_name.includes(search))
    );

    return (
        <div className="space-y-6">
            {/* 工具栏 */}
            <div className="flex items-center justify-between">
                <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 !text-[18px]">search</span>
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="搜索用户名或手机号..."
                        className="pl-9 pr-4 py-2.5 w-72 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400"
                    />
                </div>
                <div className="text-sm text-slate-500">共 <span className="font-bold text-slate-800">{filteredUsers.length}</span> 位用户</div>
            </div>

            {/* 表格 */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-16">
                        <div className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead>
                            <tr className="bg-slate-50/80">
                                <th className="text-left py-3.5 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wider">监护人</th>
                                <th className="text-left py-3.5 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wider">手机号</th>
                                <th className="text-left py-3.5 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wider">儿童档案</th>
                                <th className="text-left py-3.5 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wider">注册时间</th>
                                <th className="text-left py-3.5 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wider">操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                    <td className="py-3.5 px-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-sm">
                                                {user.full_name?.charAt(0) || '?'}
                                            </div>
                                            <span className="text-sm font-medium text-slate-800">{user.full_name || '未设置'}</span>
                                        </div>
                                    </td>
                                    <td className="py-3.5 px-5 text-sm text-slate-600">{user.phone || '-'}</td>
                                    <td className="py-3.5 px-5">
                                        <div className="flex flex-wrap gap-1.5">
                                            {user.children.map((child) => (
                                                <span key={child.id} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-blue-50 text-blue-700 text-[11px] font-medium">
                                                    {child.full_name} ({child.age}岁/{child.gender})
                                                </span>
                                            ))}
                                            {user.children.length === 0 && <span className="text-xs text-slate-400">无</span>}
                                        </div>
                                    </td>
                                    <td className="py-3.5 px-5 text-xs text-slate-400">
                                        {new Date(user.created_at).toLocaleDateString('zh-CN')}
                                    </td>
                                    <td className="py-3.5 px-5">
                                        <button onClick={() => navigate(`/users/${user.id}`)} className="text-primary-600 hover:text-primary-700 text-xs font-semibold">查看详情</button>
                                    </td>
                                </tr>
                            ))}
                            {filteredUsers.length === 0 && (
                                <tr><td colSpan={5} className="py-12 text-center text-sm text-slate-400">暂无用户数据</td></tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default UserList;
