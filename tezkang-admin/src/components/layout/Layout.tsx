/**
 * @description 主布局组件
 * 组装侧边栏 + 头部 + 内容区域
 */
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-50">
            <Sidebar />
            <div className="ml-60">
                <Header />
                <main className="p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
