-- 1. 为 profiles 表增加新字段 relation，默认给一个妈妈 
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS relation VARCHAR(50);

-- 2. 批量将已存在却空缺的该字段填补为 妈妈
UPDATE public.profiles SET relation = '妈妈' WHERE relation IS NULL;
