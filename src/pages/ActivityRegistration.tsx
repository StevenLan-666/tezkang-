import React, { useState } from 'react';

interface ActivityRegistrationProps {
  onBack: () => void;
  onSubmit: (formData: {
    childName: string;
    childAge: number;
    childGender: string;
    healthNotes: string;
    selectedDate: string;
    selectedTime: string;
    parentName: string;
    parentPhone: string;
  }) => void;
  title?: string;
  defaultChildName?: string;
  defaultChildAge?: string;
  defaultChildGender?: string;
  defaultParentName?: string;
  defaultParentPhone?: string;
}

export default function ActivityRegistration({ onBack, onSubmit, title, defaultChildName, defaultChildAge, defaultChildGender, defaultParentName, defaultParentPhone }: ActivityRegistrationProps) {
  const [childName, setChildName] = useState(defaultChildName || '');
  const [childAge, setChildAge] = useState(defaultChildAge || '');
  const [childGender, setChildGender] = useState(defaultChildGender || '男');
  const [healthNotes, setHealthNotes] = useState('');
  const [selectedDate, setSelectedDate] = useState<number | null>(24);
  const [selectedTime, setSelectedTime] = useState<string | null>('上午场 09:00-12:00');
  const [parentName, setParentName] = useState(defaultParentName || '');
  const [parentPhone, setParentPhone] = useState(defaultParentPhone || '');
  const [submitting, setSubmitting] = useState(false);

  const dates = [
    { day: '周六', date: 24 },
    { day: '周日', date: 25 },
    { day: '周六', date: 31 },
    { day: '周日', date: 1 },
  ];

  const times = [
    { time: '上午场 09:00-12:00', available: true },
    { time: '下午场 14:00-17:00', available: true },
    { time: '全天场 09:00-17:00', available: false },
  ];

  const handleSubmit = async () => {
    if (!childName.trim()) { alert('请输入儿童姓名'); return; }
    if (!parentName.trim()) { alert('请输入家长姓名'); return; }
    if (!parentPhone.trim()) { alert('请输入手机号码'); return; }

    setSubmitting(true);
    try {
      await onSubmit({
        childName,
        childAge: parseInt(childAge) || 0,
        childGender,
        healthNotes,
        selectedDate: selectedDate ? `${selectedDate}日` : '',
        selectedTime: selectedTime || '',
        parentName,
        parentPhone,
      });
    } catch {
      // 错误已在 App.tsx 中处理
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark text-text-main dark:text-white min-h-screen transition-colors duration-200 antialiased pb-24 flex flex-col">
      <div className="px-6 py-3 flex justify-between items-center text-xs font-semibold text-text-main dark:text-slate-300 opacity-90">
        <span>16:58</span>
        <div className="flex gap-1.5 items-center">
          <span className="material-symbols-outlined text-sm">signal_cellular_alt</span>
          <span className="material-symbols-outlined text-sm">wifi</span>
          <span className="material-symbols-outlined text-sm">battery_full</span>
        </div>
      </div>

      <header className="px-6 py-4 flex items-center relative justify-center">
        <button onClick={onBack} className="absolute left-6 w-10 h-10 rounded-full bg-white dark:bg-surface-dark shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-center text-text-main dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors z-10">
          <span className="material-symbols-outlined !text-[20px]">arrow_back_ios_new</span>
        </button>
        <div className="text-center">
          <h1 className="text-lg font-bold text-text-main dark:text-white">活动报名</h1>
          {title && <p className="text-[10px] text-text-sub dark:text-slate-400 font-medium">{title}</p>}
        </div>
      </header>

      <main className="px-6 space-y-6 pt-2 flex-1 overflow-y-auto">
        {/* 步骤指示 - 测试阶段简化为2步 */}
        <div className="flex items-center justify-between px-2">
          <div className="flex flex-col items-center gap-1 w-1/3">
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold shadow-lg shadow-primary/20">1</div>
            <span className="text-[10px] font-semibold text-primary">填写信息</span>
          </div>
          <div className="h-[2px] w-full bg-primary/20 rounded-full"></div>
          <div className="flex flex-col items-center gap-1 w-1/3">
            <div className="w-8 h-8 rounded-full bg-surface-light dark:bg-surface-dark border-2 border-primary/20 text-text-sub dark:text-slate-400 flex items-center justify-center text-sm font-bold">2</div>
            <span className="text-[10px] font-semibold text-text-sub dark:text-slate-400">确认报名</span>
          </div>
        </div>

        {/* 测试阶段提示 */}
        <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl px-4 py-2.5 flex items-center gap-2">
          <span className="material-symbols-outlined text-amber-500 !text-[16px]">info</span>
          <span className="text-xs text-amber-700 dark:text-amber-400">测试阶段：暂不需要实际支付</span>
        </div>

        <div className="space-y-6">
          <section className="bg-surface-light dark:bg-surface-dark p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
            <h2 className="text-base font-bold text-text-main dark:text-white mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">face</span>
              参与者信息
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-text-sub dark:text-slate-400 mb-1.5 ml-1">儿童姓名 *</label>
                <input value={childName} onChange={e => setChildName(e.target.value)} className="w-full bg-background-light dark:bg-background-dark border-none rounded-xl py-3 px-4 text-sm text-text-main dark:text-white placeholder-slate-400/50 focus:ring-2 focus:ring-primary/50 transition-all outline-none" placeholder="请输入儿童姓名" type="text" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-text-sub dark:text-slate-400 mb-1.5 ml-1">年龄</label>
                  <input value={childAge} onChange={e => setChildAge(e.target.value)} className="w-full bg-background-light dark:bg-background-dark border-none rounded-xl py-3 px-4 text-sm text-text-main dark:text-white focus:ring-2 focus:ring-primary/50 transition-all outline-none" placeholder="例如: 8" type="number" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-sub dark:text-slate-400 mb-1.5 ml-1">性别</label>
                  <div className="relative">
                    <select value={childGender} onChange={e => setChildGender(e.target.value)} className="w-full bg-background-light dark:bg-background-dark border-none rounded-xl py-3 px-4 text-sm text-text-main dark:text-white focus:ring-2 focus:ring-primary/50 transition-all appearance-none outline-none">
                      <option>男</option>
                      <option>女</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-3 text-text-sub pointer-events-none text-sm">expand_more</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-surface-light dark:bg-surface-dark p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
            <h2 className="text-base font-bold text-text-main dark:text-white mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-orange-400">medical_services</span>
              健康备注
            </h2>
            <div>
              <label className="block text-xs font-semibold text-text-sub dark:text-slate-400 mb-1.5 ml-1">是否有食物过敏或其他需要注意的健康状况？</label>
              <textarea value={healthNotes} onChange={e => setHealthNotes(e.target.value)} className="w-full bg-background-light dark:bg-background-dark border-none rounded-xl py-3 px-4 text-sm text-text-main dark:text-white placeholder-slate-400/50 focus:ring-2 focus:ring-primary/50 transition-all resize-none outline-none" placeholder="无特殊情况可不填" rows={3}></textarea>
            </div>
          </section>

          <section className="bg-surface-light dark:bg-surface-dark p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
            <h2 className="text-base font-bold text-text-main dark:text-white mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">event</span>
              活动场次
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-text-sub dark:text-slate-400 mb-2 ml-1">选择日期</label>
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                  {dates.map((d, idx) => (
                    <button
                      key={`${d.date}-${idx}`}
                      onClick={() => setSelectedDate(d.date)}
                      className={`flex-shrink-0 w-14 h-20 rounded-2xl flex flex-col items-center justify-center transition-all ${selectedDate === d.date
                        ? 'bg-primary text-white shadow-lg shadow-primary/30'
                        : 'bg-background-light dark:bg-background-dark border border-transparent hover:border-primary/30 text-text-sub dark:text-slate-400'
                        }`}
                      type="button"
                    >
                      <span className={`text-xs font-medium ${selectedDate === d.date ? 'opacity-80' : ''}`}>{d.day}</span>
                      <span className="text-xl font-bold">{d.date}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-sub dark:text-slate-400 mb-2 ml-1">可选时间段</label>
                <div className="grid grid-cols-1 gap-3">
                  {times.map((t) => (
                    <button
                      key={t.time}
                      disabled={!t.available}
                      onClick={() => setSelectedTime(t.time)}
                      className={`py-3 px-4 rounded-xl text-sm transition-colors text-left ${!t.available
                        ? 'border border-slate-200 dark:border-slate-700 font-medium text-text-sub dark:text-slate-400 opacity-50 cursor-not-allowed bg-slate-50 dark:bg-slate-900 line-through'
                        : selectedTime === t.time
                          ? 'bg-primary text-white font-bold shadow-md shadow-primary/20'
                          : 'border border-slate-200 dark:border-slate-700 font-medium text-text-sub dark:text-slate-400 hover:border-primary hover:text-primary bg-white dark:bg-slate-800'
                        }`}
                      type="button"
                    >
                      {t.time}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="bg-surface-light dark:bg-surface-dark p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
            <h2 className="text-base font-bold text-text-main dark:text-white mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-green-500">contact_phone</span>
              联系人信息
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-text-sub dark:text-slate-400 mb-1.5 ml-1">家长姓名 *</label>
                <input value={parentName} onChange={e => setParentName(e.target.value)} className="w-full bg-background-light dark:bg-background-dark border-none rounded-xl py-3 px-4 text-sm text-text-main dark:text-white focus:ring-2 focus:ring-primary/50 transition-all outline-none" type="text" placeholder="请输入家长姓名" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-sub dark:text-slate-400 mb-1.5 ml-1">手机号码 *</label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-transparent bg-background-light dark:bg-background-dark text-text-sub sm:text-sm">
                    +86
                  </span>
                  <input value={parentPhone} onChange={e => setParentPhone(e.target.value)} className="w-full bg-background-light dark:bg-background-dark border-none rounded-r-xl py-3 px-4 text-sm text-text-main dark:text-white focus:ring-2 focus:ring-primary/50 transition-all border-l border-slate-200 dark:border-slate-700 outline-none" type="tel" placeholder="请输入手机号" />
                </div>
              </div>
            </div>
          </section>

          <div className="flex items-start gap-3 px-2 pb-6">
            <input defaultChecked className="mt-1 rounded border-slate-300 text-primary shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50" type="checkbox" />
            <p className="text-xs text-text-sub dark:text-slate-400 leading-tight">
              我已阅读并同意<a className="text-primary font-bold underline" href="#">活动须知</a>及<a className="text-primary font-bold underline" href="#">退改政策</a>。
            </p>
          </div>
          <div className="h-24"></div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-50 bg-surface-light dark:bg-surface-dark border-t border-slate-100 dark:border-slate-800 p-4 pb-8 shadow-[0_-4px_20px_-2px_rgba(0,0,0,0.05)] pb-safe flex justify-center">
        <div className="w-full max-w-md flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-xs text-text-sub dark:text-slate-400 font-medium">活动费用</span>
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-bold text-primary">¥</span>
              <span className="text-2xl font-bold text-text-main dark:text-white font-display">299.00</span>
            </div>
            <span className="text-[10px] text-amber-500">测试阶段免支付</span>
          </div>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-1 bg-primary hover:bg-primary-dark text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-primary/30 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
          >
            {submitting ? '提交中...' : '确认报名'}
            {!submitting && <span className="material-symbols-outlined text-sm">arrow_forward</span>}
          </button>
        </div>
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-1/3 h-1 bg-slate-300 dark:bg-slate-600 rounded-full"></div>
      </div>
    </div>
  );
}
