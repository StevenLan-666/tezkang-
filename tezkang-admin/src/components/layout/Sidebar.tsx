/**
 * @description 侧边导航栏组件
 * 包含应用 Logo、导航菜单项（含子菜单）和底部管理员信息
 */
import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

interface NavItem {
    label: string;
    icon: string;
    path: string;
    children?: { label: string; path: string }[];
}

const NAV_ITEMS: NavItem[] = [
    { label: '仪表盘', icon: 'dashboard', path: '/' },
    { label: '用户管理', icon: 'group', path: '/users' },
    { label: '活动管理', icon: 'event', path: '/activities' },
    { label: '服务管理', icon: 'medical_services', path: '/services' },
    {
        label: '人员管理', icon: 'badge', path: '/staff',
        children: [
            { label: '人员管理', path: '/staff' },
            { label: '排班管理', path: '/staff/schedule' },
        ],
    },
    { label: '健康数据', icon: 'monitor_heart', path: '/health' },
    { label: '报名管理', icon: 'how_to_reg', path: '/registrations' },
    { label: '反馈管理', icon: 'feedback', path: '/feedback' },
    { label: '系统设置', icon: 'settings', path: '/settings' },
];

const Sidebar: React.FC = () => {
    const location = useLocation();
    const [expandedItem, setExpandedItem] = useState<string | null>(null);

    // 自动展开包含当前路由的父菜单
    const isChildActive = (item: NavItem) =>
        item.children?.some(c => location.pathname === c.path) || false;

    const handleItemClick = (item: NavItem) => {
        if (item.children) {
            setExpandedItem(prev => prev === item.label ? null : item.label);
        }
    };

    return (
        <aside className="fixed left-0 top-0 h-screen w-60 bg-white border-r border-slate-200 flex flex-col z-40">
            {/* Logo */}
            <div className="h-16 flex items-center px-6 border-b border-slate-100">
                <div className="w-9 h-9 rounded-xl bg-primary-500 flex items-center justify-center mr-3">
                    <span className="material-symbols-outlined text-white !text-[20px]">psychology</span>
                </div>
                <div>
                    <h1 className="text-sm font-bold text-slate-800 leading-tight">特质康+</h1>
                    <p className="text-[10px] text-slate-400 leading-tight">后台管理系统</p>
                </div>
            </div>

            {/* 导航菜单 */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                {NAV_ITEMS.map((item) => {
                    const hasChildren = !!item.children;
                    const isExpanded = expandedItem === item.label || isChildActive(item);
                    const isActive = hasChildren
                        ? isChildActive(item)
                        : location.pathname === item.path;

                    return (
                        <div key={item.label}>
                            {/* 主菜单项 */}
                            {hasChildren ? (
                                <button
                                    onClick={() => handleItemClick(item)}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                                            ? 'bg-primary-50 text-primary-700'
                                            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                                        }`}
                                >
                                    <span className="material-symbols-outlined !text-[20px]">{item.icon}</span>
                                    <span className="flex-1 text-left">{item.label}</span>
                                    <span className={`material-symbols-outlined !text-[16px] transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                                        expand_more
                                    </span>
                                </button>
                            ) : (
                                <NavLink
                                    to={item.path}
                                    end={item.path === '/'}
                                    className={({ isActive: active }) =>
                                        `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${active
                                            ? 'bg-primary-50 text-primary-700 shadow-sm'
                                            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                                        }`
                                    }
                                >
                                    <span className="material-symbols-outlined !text-[20px]">{item.icon}</span>
                                    {item.label}
                                </NavLink>
                            )}

                            {/* 子菜单 */}
                            {hasChildren && isExpanded && (
                                <div className="ml-8 mt-1 space-y-0.5">
                                    {item.children!.map((child) => (
                                        <NavLink
                                            key={child.path}
                                            to={child.path}
                                            end
                                            className={({ isActive: active }) =>
                                                `block px-3 py-2 rounded-lg text-xs font-medium transition-all ${active
                                                    ? 'text-primary-700 bg-primary-50/60'
                                                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                                                }`
                                            }
                                        >
                                            {child.label}
                                        </NavLink>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </nav>

            {/* 底部 */}
            <div className="px-3 py-4 border-t border-slate-100">
                <div className="flex items-center gap-3 px-3 py-2">
                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary-600 !text-[16px]">admin_panel_settings</span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-700 truncate">管理员</p>
                        <p className="text-[10px] text-slate-400 truncate">admin@tezkang.com</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
