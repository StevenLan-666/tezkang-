/**
 * @description 登录页面
 * 支持手机号/邮箱 + 密码登录，未注册自动注册
 * 找回密码通过邮箱，首次注册可选绑定邮箱
 */
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';

export default function Login({ onLogin }: { onLogin: () => void }) {
  const { signIn, signUp, resetPassword } = useAuth();
  const [view, setView] = useState<'login' | 'forgot_password' | 'register' | 'bind_email'>('login');
  const [account, setAccount] = useState('tester13');
  const [password, setPassword] = useState('7777777');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  /** 清除状态 */
  const resetState = () => {
    setError('');
    setSuccess('');
    setPassword('');
    setConfirmPassword('');
    setEmail('');
  };

  /**
   * 登录：先尝试登录，失败则自动注册
   */
  const handleLogin = async () => {
    if (!account.trim()) { setError('请输入手机号或邮箱'); return; }
    if (!password.trim()) { setError('请输入密码'); return; }
    if (password.length < 6) { setError('密码至少6位'); return; }

    try {
      setLoading(true);
      setError('');
      await signIn(account, password);
      onLogin();
    } catch (err) {
      const msg = err instanceof Error ? err.message : '登录失败';
      // 如果自动注册也失败了，显示更友好的消息
      if (msg.includes('User already registered')) {
        setError('密码错误，请重试或找回密码');
      } else if (msg.includes('Email not confirmed')) {
        setError('账号已注册但邮箱未验证，请检查邮箱或直接登录');
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * 注册：手动注册流程
   */
  const handleRegister = async () => {
    if (!account.trim()) { setError('请输入手机号或邮箱'); return; }
    if (!password.trim()) { setError('请输入密码'); return; }
    if (password.length < 6) { setError('密码至少6位'); return; }
    if (password !== confirmPassword) { setError('两次密码不一致'); return; }

    try {
      setLoading(true);
      setError('');
      await signUp(account, password);
      // 注册成功，进入绑定邮箱页面（可跳过）
      setView('bind_email');
    } catch (err) {
      const msg = err instanceof Error ? err.message : '注册失败';
      if (msg.includes('User already registered')) {
        setError('该账号已注册，请直接登录');
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * 绑定邮箱（可选）
   */
  const handleBindEmail = async () => {
    if (!email.trim() || !email.includes('@')) {
      setError('请输入有效的邮箱地址');
      return;
    }
    try {
      setLoading(true);
      setError('');
      // 使用已登录的 session 更新邮箱
      const { error: updateErr } = await supabase.auth.updateUser({ email });
      if (updateErr) throw updateErr;
      onLogin();
    } catch (err) {
      const msg = err instanceof Error ? err.message : '绑定失败';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 找回密码
   */
  const handleResetPassword = async () => {
    if (!email.trim() || !email.includes('@')) {
      setError('请输入有效的邮箱地址');
      return;
    }
    try {
      setLoading(true);
      setError('');
      await resetPassword(email);
      setSuccess('重置链接已发送到您的邮箱，请查收');
    } catch (err) {
      const msg = err instanceof Error ? err.message : '发送失败';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // ====== 绑定邮箱页面（注册成功后）======
  if (view === 'bind_email') {
    return (
      <div className="flex-1 flex flex-col p-6 bg-background-light dark:bg-background-dark">
        <header className="flex items-center mb-8 pt-8">
          <div className="w-10"></div>
          <h1 className="flex-1 text-center text-lg font-bold text-text-main dark:text-white">注册成功</h1>
          <div className="w-10"></div>
        </header>
        <main className="flex-1 flex flex-col gap-6">
          <div className="text-center space-y-3 mb-2">
            <div className="w-16 h-16 mx-auto bg-success/20 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-success text-3xl">check_circle</span>
            </div>
            <h2 className="text-2xl font-bold text-text-main dark:text-white">🎉 欢迎加入</h2>
            <p className="text-sm text-text-sub dark:text-slate-400">绑定邮箱可用于找回密码，也可以跳过</p>
          </div>
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm font-medium">{error}</div>
          )}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-text-main dark:text-gray-300 ml-1">邮箱地址</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-gray-400">mail</span>
              </div>
              <input
                className="block w-full pl-11 pr-4 py-3.5 bg-surface-light dark:bg-surface-dark rounded-xl text-text-main dark:text-white placeholder-gray-400 shadow-sm outline-none ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-primary"
                placeholder="example@email.com"
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
              />
            </div>
          </div>
          <button
            onClick={handleBindEmail}
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/30 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {loading ? '绑定中...' : '绑定邮箱'}
          </button>
          <button
            onClick={onLogin}
            className="w-full text-text-sub dark:text-slate-400 font-semibold py-3 text-sm hover:text-primary transition-colors"
          >
            跳过，稍后设置
          </button>
        </main>
      </div>
    );
  }

  // ====== 找回密码页面 ======
  if (view === 'forgot_password') {
    return (
      <div className="flex-1 flex flex-col p-6 bg-background-light dark:bg-background-dark">
        <header className="flex items-center mb-8 pt-8">
          <button onClick={() => { setView('login'); resetState(); }} className="w-10 h-10 rounded-full bg-white dark:bg-surface-dark shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-center text-text-main dark:text-white">
            <span className="material-symbols-outlined !text-[20px]">arrow_back_ios_new</span>
          </button>
          <h1 className="flex-1 text-center text-lg font-bold text-text-main dark:text-white pr-10">找回密码</h1>
        </header>
        <main className="flex-1 flex flex-col gap-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-text-main dark:text-white">重置您的密码</h2>
            <p className="text-sm text-text-sub dark:text-slate-400">输入注册时绑定的邮箱，我们将发送密码重置链接</p>
          </div>
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm font-medium">{error}</div>
          )}
          {success && (
            <div className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 px-4 py-3 rounded-xl text-sm font-medium">{success}</div>
          )}
          <div className="space-y-1.5 mt-4">
            <label className="block text-sm font-semibold text-text-main dark:text-gray-300 ml-1">邮箱地址</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-gray-400">mail</span>
              </div>
              <input
                className="block w-full pl-11 pr-4 py-3.5 bg-surface-light dark:bg-surface-dark rounded-xl text-text-main dark:text-white placeholder-gray-400 shadow-sm outline-none ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-primary"
                placeholder="请输入绑定的邮箱"
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); setSuccess(''); }}
              />
            </div>
          </div>
          <button
            onClick={handleResetPassword}
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/30 mt-4 disabled:opacity-50 active:scale-[0.98] transition-all"
          >
            {loading ? '发送中...' : '发送重置链接'}
          </button>
        </main>
      </div>
    );
  }

  // ====== 注册页面 ======
  if (view === 'register') {
    return (
      <div className="flex-1 flex flex-col p-6 bg-background-light dark:bg-background-dark">
        <header className="flex items-center mb-8 pt-8">
          <button onClick={() => { setView('login'); resetState(); }} className="w-10 h-10 rounded-full bg-white dark:bg-surface-dark shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-center text-text-main dark:text-white">
            <span className="material-symbols-outlined !text-[20px]">arrow_back_ios_new</span>
          </button>
          <h1 className="flex-1 text-center text-lg font-bold text-text-main dark:text-white pr-10">立即注册</h1>
        </header>
        <main className="flex-1 flex flex-col gap-6 overflow-y-auto pb-10">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-text-main dark:text-white">创建新账号</h2>
            <p className="text-sm text-text-sub dark:text-slate-400">加入我们，开始孩子的成长之旅</p>
          </div>
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm font-medium">{error}</div>
          )}
          <div className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-text-main dark:text-gray-300 ml-1">手机号 / 邮箱</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-gray-400">person</span>
                </div>
                <input
                  className="block w-full pl-11 pr-4 py-3.5 bg-surface-light dark:bg-surface-dark rounded-xl text-text-main dark:text-white placeholder-gray-400 shadow-sm outline-none ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-primary"
                  placeholder="请输入手机号或邮箱"
                  type="text"
                  value={account}
                  onChange={(e) => { setAccount(e.target.value); setError(''); }}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-text-main dark:text-gray-300 ml-1">密码</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-gray-400">lock</span>
                </div>
                <input
                  className="block w-full pl-11 pr-4 py-3.5 bg-surface-light dark:bg-surface-dark rounded-xl text-text-main dark:text-white placeholder-gray-400 shadow-sm outline-none ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-primary"
                  placeholder="请设置密码（至少6位）"
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-text-main dark:text-gray-300 ml-1">确认密码</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-gray-400">lock</span>
                </div>
                <input
                  className="block w-full pl-11 pr-4 py-3.5 bg-surface-light dark:bg-surface-dark rounded-xl text-text-main dark:text-white placeholder-gray-400 shadow-sm outline-none ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-primary"
                  placeholder="请再次输入密码"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
                />
              </div>
            </div>
          </div>
          <div className="flex items-start gap-2 mt-2">
            <input className="mt-1 rounded text-primary focus:ring-primary border-gray-300" type="checkbox" defaultChecked />
            <p className="text-xs text-gray-500">注册即表示您已阅读并同意 <span className="text-primary cursor-pointer">《用户协议》</span> 和 <span className="text-primary cursor-pointer">《隐私政策》</span></p>
          </div>
          <button
            onClick={handleRegister}
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/30 mt-2 disabled:opacity-50 active:scale-[0.98] transition-all"
          >
            {loading ? '注册中...' : '立即注册'}
          </button>
        </main>
      </div>
    );
  }

  // ====== 登录页面（默认）======
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden transition-colors duration-200">
      <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-primary/20 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-blue-300/20 rounded-full blur-3xl -z-10 dark:bg-blue-900/20"></div>

      <div className="absolute top-0 w-full h-12 flex justify-between items-center px-6 text-sm font-medium text-text-main dark:text-slate-300 opacity-70">
        <span>9:41</span>
        <div className="flex gap-1">
          <span className="material-symbols-outlined text-sm">signal_cellular_alt</span>
          <span className="material-symbols-outlined text-sm">wifi</span>
          <span className="material-symbols-outlined text-sm">battery_full</span>
        </div>
      </div>

      <main className="w-full max-w-sm flex flex-col gap-8 z-10">
        <div className="text-center space-y-4 mb-2">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary to-teal-400 rounded-3xl flex items-center justify-center shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined text-white text-5xl">psychology</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-text-main dark:text-white tracking-tight">欢迎回来</h1>
            <p className="text-text-sub mt-2 text-sm">专注成长，用心陪伴</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm font-medium text-center">{error}</div>
        )}

        <div className="space-y-5">
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-text-main dark:text-gray-300 ml-1" htmlFor="account">手机号 / 邮箱</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-gray-400">phone_android</span>
              </div>
              <input
                className="block w-full pl-11 pr-4 py-3.5 bg-surface-light dark:bg-surface-dark rounded-xl text-text-main dark:text-white placeholder-gray-400 shadow-sm transition-all duration-200 outline-none ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-primary"
                id="account"
                placeholder="请输入手机号或邮箱"
                type="text"
                value={account}
                onChange={(e) => { setAccount(e.target.value); setError(''); }}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-text-main dark:text-gray-300 ml-1" htmlFor="password">密码</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-gray-400">lock</span>
              </div>
              <input
                className="block w-full pl-11 pr-4 py-3.5 bg-surface-light dark:bg-surface-dark rounded-xl text-text-main dark:text-white placeholder-gray-400 shadow-sm transition-all duration-200 outline-none ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-primary"
                id="password"
                placeholder="请输入密码"
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                onKeyDown={(e) => { if (e.key === 'Enter') handleLogin(); }}
              />
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => { setView('forgot_password'); resetState(); }}
                className="text-xs text-primary hover:underline font-medium"
              >
                忘记密码？
              </button>
            </div>
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/30 transform active:scale-[0.98] transition-all duration-200 text-lg disabled:opacity-50"
          >
            {loading ? '登录中...' : '登录'}
          </button>

          <p className="text-center text-xs text-text-sub dark:text-slate-400">
            未注册的账号将自动创建
          </p>
        </div>

        <div className="mt-2 space-y-6">
          <div className="relative flex items-center justify-center">
            <div className="absolute border-t border-gray-200 dark:border-gray-700 w-full"></div>
            <div className="relative bg-background-light dark:bg-background-dark px-4 text-xs text-gray-400 uppercase tracking-wider">其他登录方式</div>
          </div>

          <div className="flex justify-center gap-6">
            <button className="w-12 h-12 rounded-full bg-white dark:bg-surface-dark shadow-md flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border border-gray-100 dark:border-gray-700">
              <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-[20px]">chat</span>
              </div>
            </button>
            <button className="w-12 h-12 rounded-full bg-white dark:bg-surface-dark shadow-md flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border border-gray-100 dark:border-gray-700">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-[20px]">fingerprint</span>
              </div>
            </button>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
          还没有账号？
          <button type="button" onClick={() => { setView('register'); resetState(); }} className="text-primary font-bold hover:underline ml-1">立即注册</button>
        </p>
      </main>

      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
    </div>
  );
}
