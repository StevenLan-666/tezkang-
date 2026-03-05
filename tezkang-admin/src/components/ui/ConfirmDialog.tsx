/**
 * @description 二次确认弹窗组件
 */
import React from 'react';

interface ConfirmDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    confirmColor?: 'red' | 'primary';
    loading?: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    open, onClose, onConfirm, title, message,
    confirmText = '确认', confirmColor = 'red', loading = false,
}) => {
    if (!open) return null;

    const btnClass = confirmColor === 'red'
        ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20'
        : 'bg-primary-500 hover:bg-primary-600 shadow-primary-500/20';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full mx-4 p-6">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                        <span className="material-symbols-outlined text-amber-600 !text-[22px]">warning</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-800">{title}</h3>
                </div>
                <p className="text-sm text-slate-500 mb-6 ml-[52px]">{message}</p>
                <div className="flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-500 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors">
                        取消
                    </button>
                    <button onClick={onConfirm} disabled={loading} className={`px-5 py-2 text-sm font-semibold text-white rounded-xl shadow-lg transition-all ${btnClass} disabled:opacity-50`}>
                        {loading ? '处理中...' : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;
