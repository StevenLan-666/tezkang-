-- ============================================
-- 特质康+ 人员管理与服务同步 v4
-- 在 Supabase SQL Editor 中执行此脚本
-- ============================================

-- 1. 扩展 staff 表字段（如已有 staff 表则添加列，如没有则创建）
DO $$
BEGIN
  -- 检查 staff 表是否存在
  IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'staff') THEN
    CREATE TABLE staff (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      full_name VARCHAR(100) NOT NULL,
      title VARCHAR(100) NOT NULL DEFAULT '',
      specialty TEXT[] DEFAULT '{}',
      years_of_experience INTEGER DEFAULT 0,
      phone VARCHAR(20),
      email VARCHAR(100),
      avatar_url TEXT,
      bio TEXT,
      status VARCHAR(20) DEFAULT 'active',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  ELSE
    -- 如果表已存在，添加缺少的列
    ALTER TABLE staff ADD COLUMN IF NOT EXISTS title VARCHAR(100) DEFAULT '';
    ALTER TABLE staff ADD COLUMN IF NOT EXISTS specialty TEXT[] DEFAULT '{}';
    ALTER TABLE staff ADD COLUMN IF NOT EXISTS years_of_experience INTEGER DEFAULT 0;
    ALTER TABLE staff ADD COLUMN IF NOT EXISTS phone VARCHAR(20);
    ALTER TABLE staff ADD COLUMN IF NOT EXISTS email VARCHAR(100);
    ALTER TABLE staff ADD COLUMN IF NOT EXISTS avatar_url TEXT;
    ALTER TABLE staff ADD COLUMN IF NOT EXISTS bio TEXT;
    ALTER TABLE staff ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active';
  END IF;
END $$;

-- 2. 给 services 表添加 staff_id 关联字段
ALTER TABLE services ADD COLUMN IF NOT EXISTS staff_id UUID REFERENCES staff(id);
ALTER TABLE services ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE services ADD COLUMN IF NOT EXISTS category_tags TEXT[] DEFAULT '{}';

-- 3. RLS 策略
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS staff_select_all ON staff;
CREATE POLICY staff_select_all ON staff FOR SELECT USING (true);
DROP POLICY IF EXISTS staff_insert_all ON staff;
CREATE POLICY staff_insert_all ON staff FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS staff_update_all ON staff;
CREATE POLICY staff_update_all ON staff FOR UPDATE USING (true);
DROP POLICY IF EXISTS staff_delete_all ON staff;
CREATE POLICY staff_delete_all ON staff FOR DELETE USING (true);

-- 4. 批量插入 10 组服务人员
INSERT INTO staff (full_name, title, specialty, years_of_experience, phone, email, bio, status) VALUES
('李明辉', '主任医师', '{儿童心理学,ADHD诊断,认知行为治疗}', 15, '13800000001', 'li.minghui@tezkang.com', '从事儿童心理卫生工作15年，擅长儿童及青少年多动症（ADHD）、抽动症、孤独症谱系障碍的诊断与综合干预。曾赴海外进修儿童认知行为治疗。', 'active'),
('张晓燕', '高级感统训练师', '{感统训练,运动协调,专注力提升}', 10, '13800000002', 'zhang.xiaoyan@tezkang.com', '国家二级心理咨询师，高级感觉统合训练师。擅长游戏化干预治疗，帮助ADHD儿童提升身体协调性和专注力。', 'active'),
('王丽华', '家庭教育指导师', '{家庭教育,亲子关系,行为管理}', 12, '13800000003', 'wang.lihua@tezkang.com', '高级家庭教育指导师，擅长家庭系统疗法。帮助家长建立科学的养育方式，改善亲子沟通和家庭互动模式。', 'active'),
('刘建国', '康复治疗师', '{行为矫正,社交技能,情绪调节}', 8, '13800000004', 'liu.jianguo@tezkang.com', '持国际认证行为分析师(BCBA)证书，专注ADHD儿童行为干预。擅长运用正向行为支持(PBS)帮助儿童改善行为问题。', 'active'),
('陈美玲', '心理评估师', '{心理评估,量表测评,发展性评估}', 9, '13800000005', 'chen.meiling@tezkang.com', '资深心理评估师，擅长使用WISC-V、Conners等国际标准化量表进行儿童认知和行为评估，出具专业评估报告。', 'active'),
('赵志强', '儿科医生', '{儿科诊疗,发育评估,药物治疗}', 20, '13800000006', 'zhao.zhiqiang@tezkang.com', '三甲医院儿科主任医师，博士生导师。专注ADHD药物治疗与非药物干预结合方案，发表SCI论文30余篇。', 'active'),
('孙雨婷', '言语治疗师', '{语言发展,社交沟通,口腔运动}', 6, '13800000007', 'sun.yuting@tezkang.com', '持美国言语-语言病理学硕士学位。擅长ADHD儿童语言发展迟缓、社交沟通障碍的评估和治疗。', 'active'),
('周大伟', '运动治疗师', '{运动疗法,体能训练,注意力训练}', 7, '13800000008', 'zhou.dawei@tezkang.com', '体育教育学硕士，持适应性体育教师资格证。通过结构化运动干预帮助ADHD儿童改善执行功能和自我调节能力。', 'active'),
('吴晓梅', '艺术治疗师', '{艺术治疗,情绪表达,创造力培养}', 5, '13800000009', 'wu.xiaomei@tezkang.com', '注册艺术治疗师，擅长使用绘画、音乐、戏剧等艺术媒介帮助ADHD儿童进行情绪表达和自我探索。', 'active'),
('黄海龙', '特殊教育教师', '{特殊教育,学习策略,课堂支持}', 11, '13800000010', 'huang.hailong@tezkang.com', '特殊教育硕士，持注册特殊教育教师资格证。擅长为ADHD儿童制定个别化教育计划(IEP)，提供学习策略指导。', 'active')
ON CONFLICT DO NOTHING;

-- 5. 更新 services 表中的 category_tags（用于推荐分类）
UPDATE services SET category_tags = '{social,behavior}' WHERE title LIKE '%心理咨询%';
UPDATE services SET category_tags = '{social}' WHERE title LIKE '%家庭教育%';
UPDATE services SET category_tags = '{behavior,decision}' WHERE title LIKE '%认知功能%';
UPDATE services SET category_tags = '{social}' WHERE title LIKE '%社交%';
UPDATE services SET category_tags = '{behavior}' WHERE title LIKE '%行为%';
UPDATE services SET category_tags = '{decision}' WHERE title LIKE '%情绪%' AND category_tags = '{}';

-- 6. 给 registrations 表补充必要字段（如果缺少）
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS satisfaction_score INTEGER DEFAULT 0;
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;
