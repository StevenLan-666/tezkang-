/**
 * @description 个人选项页面
 * 支持编辑监护人信息和受监护人(儿童)信息
 */
import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

interface ProfileProps {
  onLogout: () => void;
  onBack: () => void;
  profileName?: string;
  profilePhone?: string;
  childName?: string;
  childAge?: number;
  childGender?: string;
  profileId?: string;
  childId?: string;
  onProfileUpdated?: () => void;
}

export default function Profile({
  onLogout, onBack, profileName, profilePhone,
  childName, childAge, childGender, profileId, childId, onProfileUpdated,
}: ProfileProps) {
  // 监护人编辑
  const [editGuardian, setEditGuardian] = useState(false);
  const [guardianName, setGuardianName] = useState(profileName || '');
  const [guardianPhone, setGuardianPhone] = useState(profilePhone || '');
  const [savingGuardian, setSavingGuardian] = useState(false);

  // 儿童编辑
  const [editChild, setEditChild] = useState(false);
  const [cName, setCName] = useState(childName || '');
  const [cAge, setCAge] = useState(childAge?.toString() || '');
  const [cGender, setCGender] = useState(childGender || '男');
  const [savingChild, setSavingChild] = useState(false);

  const handleSaveGuardian = async () => {
    setSavingGuardian(true);
    try {
      if (profileId) {
        await (supabase.from('profiles') as any).update({
          full_name: guardianName,
          phone: guardianPhone,
          updated_at: new Date().toISOString(),
        }).eq('id', profileId);
      }
      onProfileUpdated?.();
      setEditGuardian(false);
    } catch (err) {
      console.error('保存失败:', err);
      alert('保存失败，请重试');
    } finally {
      setSavingGuardian(false);
    }
  };

  const handleSaveChild = async () => {
    setSavingChild(true);
    try {
      if (childId) {
        await (supabase.from('children') as any).update({
          full_name: cName,
          age: parseInt(cAge) || 0,
          gender: cGender,
          updated_at: new Date().toISOString(),
        }).eq('id', childId);
      } else if (profileId) {
        // 没有儿童记录，创建新的
        await (supabase.from('children') as any).insert({
          profile_id: profileId,
          full_name: cName,
          age: parseInt(cAge) || 0,
          gender: cGender,
        });
      }
      onProfileUpdated?.();
      setEditChild(false);
    } catch (err) {
      console.error('保存失败:', err);
      alert('保存失败，请重试');
    } finally {
      setSavingChild(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto pb-24 bg-background-light dark:bg-background-dark">
      <div className="px-5 pt-3 pb-2 flex justify-between items-center bg-background-light dark:bg-background-dark z-20 sticky top-0">
        <div className="text-sm font-semibold tracking-wide text-text-main dark:text-slate-300">16:58</div>
        <div className="flex items-center space-x-1.5 text-text-main dark:text-slate-300">
          <span className="material-symbols-outlined text-[18px]">signal_cellular_alt</span>
          <span className="material-symbols-outlined text-[18px]">bluetooth</span>
          <span className="material-symbols-outlined text-[18px]">volume_off</span>
          <span className="material-symbols-outlined text-[18px] rotate-90">battery_full</span>
        </div>
      </div>

      <div className="flex items-center justify-between px-4 py-3 bg-background-light dark:bg-background-dark sticky top-8 z-10">
        <button onClick={onBack} className="p-1 -ml-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
          <span className="material-symbols-outlined text-2xl text-text-main dark:text-white">arrow_back</span>
        </button>
        <h1 className="text-lg font-bold text-text-main dark:text-white absolute left-1/2 transform -translate-x-1/2">选项</h1>
        <div className="w-8"></div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-8">
        {/* 监护人信息 */}
        <div className="mt-4 bg-surface-light dark:bg-surface-dark">
          <button onClick={() => setEditGuardian(!editGuardian)} className="w-full flex items-center justify-between px-4 py-4 active:bg-gray-100 dark:active:bg-gray-800 transition-colors border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <span className="text-[17px] text-text-main dark:text-white">监护人信息</span>
              <div className="flex items-center gap-2 text-text-sub dark:text-slate-400 text-[15px]">
                <span>{profileName || '未设置'}</span>
                <span>{profilePhone || '未设置'}</span>
              </div>
            </div>
            <span className="material-symbols-outlined text-text-sub dark:text-slate-400 text-xl">{editGuardian ? 'expand_less' : 'chevron_right'}</span>
          </button>

          {/* 监护人编辑表单 */}
          {editGuardian && (
            <div className="px-4 py-4 space-y-3 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
              <div>
                <label className="block text-xs font-semibold text-text-sub dark:text-slate-400 mb-1 ml-1">姓名</label>
                <input value={guardianName} onChange={e => setGuardianName(e.target.value)} className="w-full bg-white dark:bg-background-dark border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-4 text-sm text-text-main dark:text-white outline-none focus:ring-2 focus:ring-primary/50" placeholder="请输入姓名" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-sub dark:text-slate-400 mb-1 ml-1">手机号</label>
                <input value={guardianPhone} onChange={e => setGuardianPhone(e.target.value)} className="w-full bg-white dark:bg-background-dark border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-4 text-sm text-text-main dark:text-white outline-none focus:ring-2 focus:ring-primary/50" placeholder="请输入手机号" type="tel" />
              </div>
              <button onClick={handleSaveGuardian} disabled={savingGuardian} className="w-full bg-primary text-white py-2.5 rounded-xl text-sm font-bold hover:bg-primary-dark transition-colors disabled:opacity-50">
                {savingGuardian ? '保存中...' : '保存'}
              </button>
            </div>
          )}

          {/* 受监护人信息 */}
          <button onClick={() => setEditChild(!editChild)} className="w-full flex items-center justify-between px-4 py-4 active:bg-gray-100 dark:active:bg-gray-800 transition-colors">
            <div className="flex items-center gap-3">
              <span className="text-[17px] text-text-main dark:text-white">受监护人信息</span>
              <span className="text-text-sub dark:text-slate-400 text-[15px]">{childName || '未设置'}</span>
            </div>
            <span className="material-symbols-outlined text-text-sub dark:text-slate-400 text-xl">{editChild ? 'expand_less' : 'chevron_right'}</span>
          </button>

          {/* 儿童编辑表单 */}
          {editChild && (
            <div className="px-4 py-4 space-y-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
              <div>
                <label className="block text-xs font-semibold text-text-sub dark:text-slate-400 mb-1 ml-1">儿童姓名</label>
                <input value={cName} onChange={e => setCName(e.target.value)} className="w-full bg-white dark:bg-background-dark border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-4 text-sm text-text-main dark:text-white outline-none focus:ring-2 focus:ring-primary/50" placeholder="请输入儿童姓名" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-text-sub dark:text-slate-400 mb-1 ml-1">年龄</label>
                  <input value={cAge} onChange={e => setCAge(e.target.value)} className="w-full bg-white dark:bg-background-dark border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-4 text-sm text-text-main dark:text-white outline-none focus:ring-2 focus:ring-primary/50" type="number" placeholder="年龄" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-sub dark:text-slate-400 mb-1 ml-1">性别</label>
                  <select value={cGender} onChange={e => setCGender(e.target.value)} className="w-full bg-white dark:bg-background-dark border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-4 text-sm text-text-main dark:text-white outline-none focus:ring-2 focus:ring-primary/50 appearance-none">
                    <option>男</option>
                    <option>女</option>
                  </select>
                </div>
              </div>
              <button onClick={handleSaveChild} disabled={savingChild} className="w-full bg-primary text-white py-2.5 rounded-xl text-sm font-bold hover:bg-primary-dark transition-colors disabled:opacity-50">
                {savingChild ? '保存中...' : '保存'}
              </button>
            </div>
          )}
        </div>

        <div className="mt-8 bg-surface-light dark:bg-surface-dark">
          <button className="w-full flex items-center justify-between px-4 py-4 active:bg-gray-100 dark:active:bg-gray-800 transition-colors border-b border-slate-200 dark:border-slate-700">
            <span className="text-[17px] text-text-main dark:text-white">账号安全</span>
            <span className="material-symbols-outlined text-text-sub dark:text-slate-400 text-xl">chevron_right</span>
          </button>
        </div>

        <div className="mt-8 bg-surface-light dark:bg-surface-dark">
          <button className="w-full flex items-center justify-between px-4 py-4 active:bg-gray-100 dark:active:bg-gray-800 transition-colors border-b border-slate-200 dark:border-slate-700">
            <span className="text-[17px] text-text-main dark:text-white">设置</span>
            <span className="material-symbols-outlined text-text-sub dark:text-slate-400 text-xl">chevron_right</span>
          </button>
          <button className="w-full flex items-center justify-between px-4 py-4 active:bg-gray-100 dark:active:bg-gray-800 transition-colors border-b border-slate-200 dark:border-slate-700">
            <span className="text-[17px] text-text-main dark:text-white">用户协议</span>
            <span className="material-symbols-outlined text-text-sub dark:text-slate-400 text-xl">chevron_right</span>
          </button>
          <button className="w-full flex items-center justify-between px-4 py-4 active:bg-gray-100 dark:active:bg-gray-800 transition-colors border-b border-slate-200 dark:border-slate-700">
            <span className="text-[17px] text-text-main dark:text-white">隐私协议</span>
            <span className="material-symbols-outlined text-text-sub dark:text-slate-400 text-xl">chevron_right</span>
          </button>
          <button className="w-full flex items-center justify-between px-4 py-4 active:bg-gray-100 dark:active:bg-gray-800 transition-colors border-b border-slate-200 dark:border-slate-700">
            <span className="text-[17px] text-text-main dark:text-white">通知管理</span>
            <span className="material-symbols-outlined text-text-sub dark:text-slate-400 text-xl">chevron_right</span>
          </button>
          <button className="w-full flex items-center justify-between px-4 py-4 active:bg-gray-100 dark:active:bg-gray-800 transition-colors">
            <span className="text-[17px] text-text-main dark:text-white">版本更新</span>
            <span className="material-symbols-outlined text-text-sub dark:text-slate-400 text-xl">chevron_right</span>
          </button>
        </div>

        <div className="mt-8 bg-surface-light dark:bg-surface-dark mb-10">
          <button onClick={onLogout} className="w-full flex items-center justify-start px-4 py-4 active:bg-gray-100 dark:active:bg-gray-800 transition-colors">
            <span className="text-[17px] text-red-500 dark:text-red-400">退出账号</span>
          </button>
        </div>
      </div>
    </div>
  );
}
