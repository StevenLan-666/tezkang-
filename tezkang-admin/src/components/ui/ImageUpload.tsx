/**
 * @description 图片上传组件
 * 支持拖拽上传、点击上传，自动上传至 Supabase Storage
 */
import React, { useState, useRef, useCallback } from 'react';
import { uploadImage, validateImage } from '../../lib/supabaseUpload';

interface ImageUploadProps {
    value?: string;
    onChange: (url: string) => void;
    label?: string;
    className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ value, onChange, label = '上传图片', className = '' }) => {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleUpload = useCallback(async (file: File) => {
        const validation = validateImage(file);
        if (!validation.valid) {
            setError(validation.error || '文件格式错误');
            return;
        }

        setUploading(true);
        setError(null);

        try {
            const url = await uploadImage(file);
            onChange(url);
        } catch (err) {
            console.error('上传失败:', err);
            setError('上传失败，请重试');
        } finally {
            setUploading(false);
        }
    }, [onChange]);

    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleUpload(file);
    }, [handleUpload]);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        const file = e.dataTransfer.files?.[0];
        if (file) handleUpload(file);
    }, [handleUpload]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
    }, []);

    return (
        <div className={className}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
            )}

            {value ? (
                <div className="relative group">
                    <img
                        src={value}
                        alt="已上传"
                        className="w-full h-48 object-cover rounded-xl border border-gray-200"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-3">
                        <button
                            onClick={() => inputRef.current?.click()}
                            className="px-4 py-2 bg-white text-gray-800 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
                        >
                            更换
                        </button>
                        <button
                            onClick={() => onChange('')}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
                        >
                            删除
                        </button>
                    </div>
                </div>
            ) : (
                <div
                    onClick={() => inputRef.current?.click()}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    className={`
            relative cursor-pointer border-2 border-dashed rounded-xl h-48 flex flex-col items-center justify-center transition-all
            ${dragActive
                            ? 'border-teal-500 bg-teal-50'
                            : 'border-gray-300 hover:border-teal-400 hover:bg-gray-50'
                        }
            ${uploading ? 'pointer-events-none opacity-70' : ''}
          `}
                >
                    {uploading ? (
                        <>
                            <div className="w-8 h-8 border-3 border-teal-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                            <span className="text-sm text-gray-500">上传中...</span>
                        </>
                    ) : (
                        <>
                            <span className="material-symbols-outlined text-4xl text-gray-400 mb-2">cloud_upload</span>
                            <span className="text-sm text-gray-500 font-medium">点击或拖拽上传图片</span>
                            <span className="text-xs text-gray-400 mt-1">支持 JPG、PNG、WebP、GIF，最大 10MB</span>
                        </>
                    )}
                </div>
            )}

            {error && (
                <div className="mt-2 flex items-center gap-1 text-red-500 text-sm">
                    <span className="material-symbols-outlined text-sm">error</span>
                    {error}
                </div>
            )}

            <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleFileChange}
                className="hidden"
            />
        </div>
    );
};

export default ImageUpload;
