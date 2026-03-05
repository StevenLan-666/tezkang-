/**
 * @description 系统设置页面
 */
import React from 'react';

const Settings: React.FC = () => {
    return (
        <div className="space-y-6 max-w-3xl">
            {/* 基本信息 */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <h3 className="text-base font-bold text-slate-800 mb-4">系统信息</h3>
                <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-slate-50">
                        <span className="text-sm text-slate-500">系统名称</span>
                        <span className="text-sm font-medium text-slate-800">特质康+ 后台管理系统</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-50">
                        <span className="text-sm text-slate-500">版本</span>
                        <span className="text-sm font-medium text-slate-800">v1.0.0</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-50">
                        <span className="text-sm text-slate-500">数据库</span>
                        <span className="text-sm font-medium text-primary-600">Supabase (PostgreSQL)</span>
                    </div>
                    <div className="flex justify-between py-2">
                        <span className="text-sm text-slate-500">前端框架</span>
                        <span className="text-sm font-medium text-slate-800">React 18 + TypeScript + Tailwind</span>
                    </div>
                </div>
            </div>

            {/* 数据库连接 */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <h3 className="text-base font-bold text-slate-800 mb-4">数据库连接状态</h3>
                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-green-700">已连接 Supabase</span>
                </div>
            </div>

            {/* 管理员 */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-bold text-slate-800">管理员账号</h3>
                    <button className="text-xs text-primary-600 font-semibold hover:text-primary-700">添加管理员</button>
                </div>
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                    <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold text-sm">A</div>
                    <div>
                        <p className="text-sm font-semibold text-slate-800">系统管理员</p>
                        <p className="text-xs text-slate-400">admin@tezkang.com</p>
                    </div>
                    <span className="ml-auto px-2.5 py-1 bg-primary-100 text-primary-700 text-[10px] font-bold rounded-lg">超级管理员</span>
                </div>
            </div>
        </div>
    );
};

export default Settings;
