/**
 * @description 顶部头部栏组件
 * 包含页面标题、全局搜索、通知中心
 */
import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

interface Notification {
    id: string;
    type: string;
    title: string;
    message: string;
    related_id: string;
    is_read: boolean;
    created_at: string;
}

interface SearchResult {
    type: string;
    label: string;
    path: string;
}

const PAGE_TITLES: Record<string, string> = {
    '/': '仪表盘',
    '/users': '用户管理',
    '/activities': '活动管理',
    '/services': '服务管理',
    '/staff': '人员管理',
    '/staff/schedule': '排班管理',
    '/health': '健康数据',
    '/registrations': '报名管理',
    '/feedback': '反馈管理',
    '/settings': '系统设置',
};

const Header: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const currentTitle = PAGE_TITLES[location.pathname]
        || Object.entries(PAGE_TITLES).find(([path]) => path !== '/' && location.pathname.startsWith(path))?.[1]
        || '后台管理';

    // 搜索
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [searchOpen, setSearchOpen] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    // 通知
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [showNotif, setShowNotif] = useState(false);
    const notifRef = useRef<HTMLDivElement>(null);
    const unreadCount = notifications.filter(n => !n.is_read).length;

    // 加载通知
    useEffect(() => {
        const fetchNotifications = async () => {
            const { data } = await supabase
                .from('admin_notifications')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(20);
            setNotifications(data || []);
        };
        fetchNotifications();

        // 实时订阅新通知
        const channel = supabase
            .channel('admin_notifications')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'admin_notifications' }, (payload) => {
                setNotifications(prev => [payload.new as Notification, ...prev]);
            })
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, []);

    // 搜索逻辑
    useEffect(() => {
        if (!searchQuery.trim()) { setSearchResults([]); return; }
        const timer = setTimeout(async () => {
            const q = searchQuery.toLowerCase();
            const results: SearchResult[] = [];

            // 搜索用户
            const { data: users } = await supabase.from('profiles').select('id, full_name, phone').or(`full_name.ilike.%${q}%,phone.ilike.%${q}%`).limit(3);
            (users || []).forEach(u => results.push({ type: '用户', label: u.full_name || u.phone, path: `/users/${u.id}` }));

            // 搜索活动
            const { data: activities } = await supabase.from('activities').select('id, title').ilike('title', `%${q}%`).limit(3);
            (activities || []).forEach(a => results.push({ type: '活动', label: a.title, path: '/activities' }));

            // 搜索服务
            const { data: services } = await supabase.from('services').select('id, title').ilike('title', `%${q}%`).limit(3);
            (services || []).forEach(s => results.push({ type: '服务', label: s.title, path: '/services' }));

            // 搜索报名
            const { data: regs } = await supabase.from('registrations').select('id, item_title, child_name').or(`item_title.ilike.%${q}%,child_name.ilike.%${q}%`).limit(3);
            (regs || []).forEach(r => results.push({ type: '报名', label: `${r.item_title} - ${r.child_name}`, path: '/registrations' }));

            setSearchResults(results);
            setSearchOpen(results.length > 0);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // 点击外部关闭
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchOpen(false);
            if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotif(false);
        };
        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, []);

    const markAllRead = async () => {
        const unreadIds = notifications.filter(n => !n.is_read).map(n => n.id);
        if (unreadIds.length === 0) return;
        await supabase.from('admin_notifications').update({ is_read: true }).in('id', unreadIds);
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    };

    const handleNotifClick = (n: Notification) => {
        // 标记已读
        if (!n.is_read) {
            supabase.from('admin_notifications').update({ is_read: true }).eq('id', n.id);
            setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, is_read: true } : x));
        }
        // 跳转
        if (n.type === 'new_registration' || n.type === 'cancelled') navigate('/registrations');
        else if (n.type === 'feedback') navigate('/feedback');
        setShowNotif(false);
    };

    const typeIcon: Record<string, string> = { new_registration: 'how_to_reg', cancelled: 'cancel', feedback: 'feedback' };
    const typeColor: Record<string, string> = { new_registration: 'text-primary-500', cancelled: 'text-red-500', feedback: 'text-amber-500' };
    const resultTypeColor: Record<string, string> = { '用户': 'bg-primary-100 text-primary-700', '活动': 'bg-blue-100 text-blue-700', '服务': 'bg-purple-100 text-purple-700', '报名': 'bg-amber-100 text-amber-700' };

    return (
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-30">
            <div>
                <h2 className="text-lg font-bold text-slate-800">{currentTitle}</h2>
            </div>

            <div className="flex items-center gap-4">
                {/* 搜索框 */}
                <div className="relative" ref={searchRef}>
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 !text-[18px]">search</span>
                    <input
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder="搜索用户、活动、服务..."
                        className="pl-9 pr-4 py-2 w-64 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all"
                    />
                    {/* 搜索结果下拉 */}
                    {searchOpen && searchResults.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50 max-h-80 overflow-y-auto">
                            {searchResults.map((r, i) => (
                                <button
                                    key={i}
                                    onClick={() => { navigate(r.path); setSearchOpen(false); setSearchQuery(''); }}
                                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors text-left"
                                >
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${resultTypeColor[r.type] || 'bg-slate-100 text-slate-600'}`}>{r.type}</span>
                                    <span className="text-sm text-slate-700 truncate">{r.label}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* 通知中心 */}
                <div className="relative" ref={notifRef}>
                    <button
                        onClick={() => setShowNotif(!showNotif)}
                        className="relative w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                    >
                        <span className="material-symbols-outlined !text-[20px]">notifications</span>
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 min-w-[16px] h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                                {unreadCount > 99 ? '99+' : unreadCount}
                            </span>
                        )}
                    </button>

                    {/* 通知下拉 */}
                    {showNotif && (
                        <div className="absolute top-full right-0 mt-2 w-96 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50">
                            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                                <h4 className="text-sm font-bold text-slate-800">通知中心</h4>
                                {unreadCount > 0 && (
                                    <button onClick={markAllRead} className="text-[10px] text-primary-600 font-semibold hover:text-primary-700">全部已读</button>
                                )}
                            </div>
                            <div className="max-h-80 overflow-y-auto">
                                {notifications.length === 0 ? (
                                    <div className="py-8 text-center text-sm text-slate-400">暂无通知</div>
                                ) : notifications.map(n => (
                                    <button
                                        key={n.id}
                                        onClick={() => handleNotifClick(n)}
                                        className={`w-full flex items-start gap-3 px-4 py-3 hover:bg-slate-50 transition-colors text-left ${!n.is_read ? 'bg-primary-50/30' : ''}`}
                                    >
                                        <span className={`material-symbols-outlined !text-[18px] mt-0.5 ${typeColor[n.type] || 'text-slate-400'}`}>
                                            {typeIcon[n.type] || 'info'}
                                        </span>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-xs ${!n.is_read ? 'font-bold text-slate-800' : 'text-slate-600'} truncate`}>{n.title}</p>
                                            <p className="text-[10px] text-slate-400 mt-0.5 truncate">{n.message}</p>
                                            <p className="text-[10px] text-slate-300 mt-0.5">{new Date(n.created_at).toLocaleString('zh-CN')}</p>
                                        </div>
                                        {!n.is_read && <div className="w-2 h-2 rounded-full bg-primary-500 mt-1.5 shrink-0"></div>}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
