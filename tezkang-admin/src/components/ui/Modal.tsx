/**
 * @description 通用 Modal 弹窗组件
 */
import React from 'react';

interface ModalProps {
    open: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    width?: string;
}

const Modal: React.FC<ModalProps> = ({ open, onClose, title, children, width = 'max-w-lg' }) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose}></div>
            <div className={`relative bg-white rounded-2xl shadow-2xl ${width} w-full mx-4 max-h-[90vh] flex flex-col animate-in`}>
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <h3 className="text-base font-bold text-slate-800">{title}</h3>
                    <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors">
                        <span className="material-symbols-outlined !text-[20px]">close</span>
                    </button>
                </div>
                <div className="px-6 py-5 overflow-y-auto flex-1">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
