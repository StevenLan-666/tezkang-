/**
 * @description 更新体格数据页面
 * 将体格数据（身高、体重）写入 Supabase physical_data 表
 */
import { useState, useEffect } from 'react';
import { useHealthData } from '../hooks/useHealthData';
import { useProfile } from '../hooks/useProfile';

export default function PhysicalDataUpdate({ onBack, onSubmit }: { onBack: () => void, onSubmit: () => void }) {
  const { activeChild } = useProfile();
  const { physicalData, updatePhysicalData } = useHealthData(activeChild?.id || null);
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // 加载已有数据作为默认值
  useEffect(() => {
    if (physicalData) {
      setWeight(String(physicalData.weight));
      setHeight(String(physicalData.height));
    }
  }, [physicalData]);

  const handleSave = async () => {
    const w = parseFloat(weight);
    const h = parseFloat(height);

    if (!w || !h || w <= 0 || h <= 0) {
      setError('请输入有效的体重和身高');
      return;
    }

    try {
      setSaving(true);
      setError('');
      await updatePhysicalData({ weight: w, height: h });
      onSubmit();
    } catch (err) {
      const message = err instanceof Error ? err.message : '保存失败，请重试';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark text-text-main dark:text-slate-200 min-h-screen transition-colors duration-200 antialiased pb-10 flex flex-col">
      <div className="px-6 py-3 flex justify-between items-center text-xs font-semibold text-text-main dark:text-slate-300 opacity-90 sticky top-0 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md z-20">
        <span>16:58</span>
        <div className="flex gap-1.5 items-center">
          <span className="material-symbols-outlined text-sm">signal_cellular_alt</span>
          <span className="material-symbols-outlined text-sm">wifi</span>
          <span className="material-symbols-outlined text-sm">battery_full</span>
        </div>
      </div>

      <header className="px-6 py-4 flex items-center justify-between relative sticky top-10 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md z-10">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-surface-light dark:bg-surface-dark shadow-sm flex items-center justify-center text-text-sub dark:text-slate-400 hover:text-primary transition-colors z-10">
          <span className="material-symbols-outlined !text-[20px]">arrow_back_ios_new</span>
        </button>
        <div className="absolute left-0 right-0 text-center pointer-events-none">
          <h1 className="text-lg font-bold text-text-main dark:text-white">更新体格数据</h1>
        </div>
        <div className="w-10"></div>
      </header>

      <main className="px-6 mt-6 space-y-6 pb-24 flex-1 overflow-y-auto">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm font-medium">
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
          <section className="bg-surface-light dark:bg-surface-dark p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-text-main dark:text-white mb-2 ml-1">体重 (kg)</label>
                <input
                  className="w-full bg-background-light dark:bg-background-dark border-none rounded-xl py-4 px-4 text-lg font-bold text-text-main dark:text-white placeholder-slate-400/50 focus:ring-2 focus:ring-primary/50 transition-all outline-none"
                  placeholder="例如: 32.5"
                  type="number"
                  step="0.1"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-text-main dark:text-white mb-2 ml-1">身高 (cm)</label>
                <input
                  className="w-full bg-background-light dark:bg-background-dark border-none rounded-xl py-4 px-4 text-lg font-bold text-text-main dark:text-white placeholder-slate-400/50 focus:ring-2 focus:ring-primary/50 transition-all outline-none"
                  placeholder="例如: 138"
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                />
              </div>
            </div>
          </section>

          {weight && height && parseFloat(weight) > 0 && parseFloat(height) > 0 && (
            <div className="bg-success/10 dark:bg-success/20 p-4 rounded-2xl border border-success/20">
              <div className="flex items-center gap-2 mb-1">
                <span className="material-symbols-outlined text-success text-lg">calculate</span>
                <span className="text-sm font-bold text-success">BMI 预计算</span>
              </div>
              <span className="text-2xl font-bold text-success">
                {(parseFloat(weight) / ((parseFloat(height) / 100) ** 2)).toFixed(1)}
              </span>
            </div>
          )}

          <div className="flex items-start gap-3 px-2">
            <span className="material-symbols-outlined text-primary text-lg mt-0.5">info</span>
            <p className="text-xs text-text-sub dark:text-slate-400 leading-relaxed">
              定期更新体格数据有助于我们为您提供更准确的健康评估和个性化建议。BMI指数将根据您输入的身高和体重自动计算。
            </p>
          </div>
        </form>
      </main>

      <div className="fixed bottom-0 w-full max-w-md p-6 bg-gradient-to-t from-background-light to-transparent dark:from-background-dark pointer-events-none z-50">
        <div className="pointer-events-auto">
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-transform active:scale-[0.98] disabled:opacity-50"
          >
            <span>{saving ? '保存中...' : '保存更新'}</span>
            <span className="material-symbols-outlined text-sm">check</span>
          </button>
        </div>
      </div>
    </div>
  );
}
