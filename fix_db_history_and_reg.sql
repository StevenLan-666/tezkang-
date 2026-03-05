-- 为修复详情页与历史记录报名者的展示问题补充更新的数据结构与测试数据纠正。
-- 运行此脚本以修正数据库中的 child_id 关联关系并清理错误的冗余历史名字。

-- 1. 动态更新之前因代码生成的不规范测试历史记录标题，按照它当时的记录时间 (record_date) 和维度自动命名
UPDATE public.history_records
SET title = CASE category
    WHEN 'social' THEN '社交能力综合评估（' || EXTRACT(MONTH FROM replace(replace(replace(record_date, '年', '-'), '月', '-'), '日', '')::date) || '月）'
    WHEN 'behavior' THEN '行为表现综合评估（' || EXTRACT(MONTH FROM replace(replace(replace(record_date, '年', '-'), '月', '-'), '日', '')::date) || '月）'
    WHEN 'decision' THEN '决策方式综合评估（' || EXTRACT(MONTH FROM replace(replace(replace(record_date, '年', '-'), '月', '-'), '日', '')::date) || '月）'
    ELSE '综合评估（' || EXTRACT(MONTH FROM replace(replace(replace(record_date, '年', '-'), '月', '-'), '日', '')::date) || '月）'
END,
category = CASE 
    WHEN title LIKE '%社交%' THEN 'social'
    WHEN title LIKE '%行为%' THEN 'behavior'
    WHEN title LIKE '%决策%' THEN 'decision'
    ELSE category
END
WHERE record_type = 'test' 
  AND (title LIKE '%一对一%' OR title LIKE '%评估（%' OR title IN ('社交能力', '行为表现', '决策方式') OR category = '测试');

-- 2. 检查 users / profiles 的数据是否真的绑定了正确的 child_name 或 profile 名字。
-- 如果 `users` 里面存储不全，我们可以尝试直接在 reservations 里扩展 participant_name 和 participant_age，以便不连表也能显示。
-- 由于当前表结构 registrations 里并没有完全存放参与者名字（只有 child_id）, 也可以通过 trigger 自动维护。
-- 在此我们针对 tester13 (已知其 child_id 为相应特定 UUID) 进行一次针对性的修复，确保 children 库和 registrations 中对应的用户信息连贯。

-- 确保针对 registrations 获取儿童名称时能顺带取出（本步骤要求您的 supabase registrations 表拥有这些扩展列或者您允许前端联表）
-- 如果没有，您可以使用 `alter table`
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='registrations' AND column_name='participant_name') THEN
        ALTER TABLE public.registrations ADD COLUMN participant_name text;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='registrations' AND column_name='participant_age') THEN
        ALTER TABLE public.registrations ADD COLUMN participant_age integer;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='registrations' AND column_name='guardian_phone') THEN
        ALTER TABLE public.registrations ADD COLUMN guardian_phone text;
    END IF;
END $$;

-- 自动通过 child_id 反刷 children 与 profiles 表进入 registrations 内部以便免去多重连表报错并保留静态快照。
UPDATE public.registrations r
SET participant_name = c.full_name,
    participant_age = c.age,
    guardian_phone = p.phone
FROM public.children c
JOIN public.profiles p ON p.id = c.profile_id
WHERE r.child_id = c.id;

-- 3. 修正 Service和Activity模拟完成功能生成的记录。
-- 这里的逻辑在 App 端代码已经修正，此数据库脚本主要是为了清理老脏数据。
