/**
 * @description Supabase Storage 图片上传工具
 * 替代 Cloudflare R2，使用 Supabase 自带的 Storage 服务
 */
import { supabase } from './supabase';

const BUCKET_NAME = 'tezkang-images';

/**
 * 生成唯一文件路径
 */
const generateFilePath = (originalName: string): string => {
    const ext = originalName.split('.').pop()?.toLowerCase() || 'png';
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `uploads/${timestamp}_${random}.${ext}`;
};

/**
 * 上传图片到 Supabase Storage
 * @param file - 要上传的文件
 * @returns 上传后的公开 URL
 */
export const uploadImage = async (file: File): Promise<string> => {
    const filePath = generateFilePath(file.name);

    const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, file, {
            contentType: file.type,
            // 不允许覆盖同名文件，因为路径已包含时间戳+随机数
            upsert: false,
        });

    if (error) {
        console.error('Supabase Storage 上传失败:', error);
        throw new Error(`上传失败: ${error.message}`);
    }

    // 获取公开访问 URL
    const { data: urlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(filePath);

    return urlData.publicUrl;
};

/**
 * 验证文件是否为有效图片
 */
export const validateImage = (file: File): { valid: boolean; error?: string } => {
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

    if (!ALLOWED_TYPES.includes(file.type)) {
        return { valid: false, error: '仅支持 JPG、PNG、WebP、GIF 格式' };
    }
    if (file.size > MAX_SIZE) {
        return { valid: false, error: '文件大小不能超过 10MB' };
    }
    return { valid: true };
};
