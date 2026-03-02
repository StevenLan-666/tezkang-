/**
 * @description 反馈页面
 * 将反馈内容写入 Supabase feedback 表
 */
import { useState } from 'react';
import { useFeedback } from '../hooks/useActivities';

export default function Feedback({ onBack }: { onBack: () => void }) {
  const { submitFeedback, submitting } = useFeedback();
  const [feedbackType, setFeedbackType] = useState('普通问题');
  const [description, setDescription] = useState('');
  const [allowContact, setAllowContact] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const types = ['普通问题', '程序漏洞', '建议', '服务相关'];

  const handleSubmit = async () => {
    if (!description.trim()) {
      setError('请输入反馈描述');
      return;
    }

    try {
      setError('');
      await submitFeedback({ feedbackType, description, allowContact });
      setSubmitted(true);
      // 2秒后自动返回
      setTimeout(() => onBack(), 2000);
    } catch (err) {
      const message = err instanceof Error ? err.message : '提交失败，请重试';
      setError(message);
    }
  };

  if (submitted) {
    return (
      <div className="bg-background-light dark:bg-background-dark text-text-main dark:text-slate-200 min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-success/20 rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-success text-3xl">check_circle</span>
          </div>
          <h2 className="text-xl font-bold text-text-main dark:text-white">提交成功</h2>
          <p className="text-sm text-text-sub dark:text-slate-400">感谢您的反馈，我们会尽快处理</p>
        </div>
      </div>
    );
  }

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
          <h1 className="text-lg font-bold text-text-main dark:text-white">反馈</h1>
        </div>
        <div className="w-10"></div>
      </header>

      <main className="px-6 mt-2 space-y-6 pb-24 flex-1 overflow-y-auto">
        <div className="text-center px-4 mb-4">
          <p className="text-sm text-text-sub dark:text-slate-400">您的意见对我们非常重要，请帮助我们改进体验。</p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm font-medium">
            {error}
          </div>
        )}

        <section>
          <label className="block text-sm font-bold text-text-main dark:text-white mb-3 ml-1">问题类型</label>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
            {types.map(type => (
              <button
                key={type}
                onClick={() => setFeedbackType(type)}
                className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors ${feedbackType === type
                    ? 'bg-primary text-white shadow-sm shadow-primary/20'
                    : 'bg-surface-light dark:bg-surface-dark text-text-sub dark:text-slate-400 border border-transparent dark:border-white/5'
                  }`}
              >
                {type}
              </button>
            ))}
          </div>
        </section>

        <section>
          <label className="block text-sm font-bold text-text-main dark:text-white mb-3 ml-1" htmlFor="feedback-desc">描述</label>
          <div className="relative">
            <textarea
              className="w-full bg-surface-light dark:bg-surface-dark rounded-2xl border-0 ring-1 ring-gray-100 dark:ring-gray-700 focus:ring-2 focus:ring-primary p-4 text-sm text-text-main dark:text-white placeholder-text-sub/50 dark:placeholder-slate-400/50 resize-none shadow-sm"
              id="feedback-desc"
              placeholder="请详细描述您遇到的问题或建议..."
              rows={6}
              maxLength={500}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
            <span className="absolute bottom-3 right-4 text-xs text-text-sub dark:text-slate-400">{description.length}/500</span>
          </div>
        </section>

        <section>
          <label className="block text-sm font-bold text-text-main dark:text-white mb-3 ml-1">
            截图
            <span className="text-xs font-normal text-text-sub dark:text-slate-400 ml-1">(可选, 最多3张)</span>
          </label>
          <div className="grid grid-cols-3 gap-4">
            <button className="aspect-square bg-surface-light dark:bg-surface-dark rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-600 flex flex-col items-center justify-center gap-1 hover:border-primary/50 hover:bg-primary/5 transition-all group">
              <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                <span className="material-symbols-outlined text-text-sub dark:text-slate-400 text-xl group-hover:text-primary">add_a_photo</span>
              </div>
              <span className="text-[10px] font-semibold text-text-sub dark:text-slate-400 group-hover:text-primary">上传</span>
            </button>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-3 ml-1">
            <input
              className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4"
              id="contact-permission"
              type="checkbox"
              checked={allowContact}
              onChange={(e) => setAllowContact(e.target.checked)}
            />
            <label className="text-xs text-text-sub dark:text-slate-400" htmlFor="contact-permission">允许支持团队就此反馈联系我</label>
          </div>
        </section>
      </main>

      <div className="fixed bottom-0 w-full max-w-md p-6 bg-gradient-to-t from-background-light to-transparent dark:from-background-dark pointer-events-none z-50">
        <div className="pointer-events-auto">
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-transform active:scale-[0.98] disabled:opacity-50"
          >
            <span>{submitting ? '提交中...' : '提交反馈'}</span>
            <span className="material-symbols-outlined text-sm">send</span>
          </button>
        </div>
      </div>
    </div>
  );
}
