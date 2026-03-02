-- ============================================
-- 特质康+ 增量更新脚本
-- 1. 新增：活动完成后详细报告数据表
-- 2. 新增：10 组测试用户数据
-- 在 Supabase SQL Editor 中执行此脚本
-- ============================================

-- ============================================
-- Part 1: 活动完成报告数据表
-- ============================================

-- 13. 活动完成报告表（每次活动结束后生成的总结报告）
CREATE TABLE IF NOT EXISTS activity_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id UUID NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
  -- 活动基本统计
  actual_participants INTEGER NOT NULL DEFAULT 0,      -- 实际参与人数
  avg_duration_minutes DECIMAL(6, 1) DEFAULT 0,        -- 人均实际参与时间（分钟）
  completion_rate DECIMAL(5, 2) DEFAULT 0,             -- 完成率 (%)
  satisfaction_score DECIMAL(3, 1) DEFAULT 0,          -- 满意度评分 (1-5)
  -- 参与前后各维度平均提升
  social_before DECIMAL(5, 1) DEFAULT 0,               -- 社交能力 - 参与前平均分
  social_after DECIMAL(5, 1) DEFAULT 0,                -- 社交能力 - 参与后平均分
  behavior_before DECIMAL(5, 1) DEFAULT 0,             -- 行为表现 - 参与前平均分
  behavior_after DECIMAL(5, 1) DEFAULT 0,              -- 行为表现 - 参与后平均分
  decision_before DECIMAL(5, 1) DEFAULT 0,             -- 决策方式 - 参与前平均分
  decision_after DECIMAL(5, 1) DEFAULT 0,              -- 决策方式 - 参与后平均分
  focus_before DECIMAL(5, 1) DEFAULT 0,                -- 专注力 - 参与前平均分
  focus_after DECIMAL(5, 1) DEFAULT 0,                 -- 专注力 - 参与后平均分
  -- 报告摘要
  summary TEXT DEFAULT '',                             -- 活动总结文字
  highlights TEXT DEFAULT '',                          -- 亮点/特色
  recommendations TEXT DEFAULT '',                     -- 后续建议
  report_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),  -- 报告生成日期
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 14. 活动报告-个人明细表（每位参与者在该活动中的表现）
CREATE TABLE IF NOT EXISTS activity_report_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID NOT NULL REFERENCES activity_reports(id) ON DELETE CASCADE,
  child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  -- 个人参与数据
  actual_duration_minutes DECIMAL(6, 1) DEFAULT 0,     -- 实际参与时间（分钟）
  completed BOOLEAN DEFAULT TRUE,                      -- 是否完成
  -- 个人各维度提升
  social_improvement DECIMAL(4, 1) DEFAULT 0,          -- 社交能力提升分
  behavior_improvement DECIMAL(4, 1) DEFAULT 0,        -- 行为表现提升分
  decision_improvement DECIMAL(4, 1) DEFAULT 0,        -- 决策方式提升分
  focus_improvement DECIMAL(4, 1) DEFAULT 0,           -- 专注力提升分
  -- 教师评语
  teacher_comment TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS 策略
ALTER TABLE activity_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_report_details ENABLE ROW LEVEL SECURITY;

-- 活动报告：所有认证用户可读（公开数据）
CREATE POLICY "activity_reports_select_all" ON activity_reports
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- 个人明细：只能看自己孩子的
CREATE POLICY "activity_report_details_select_own" ON activity_report_details
  FOR SELECT USING (child_id IN (SELECT id FROM children WHERE profile_id = auth.uid()));

-- ============================================
-- Part 2: 10 组测试用户数据
-- ============================================

-- 注意：Supabase 的 auth.users 无法直接 INSERT，
-- 测试用户需要通过登录页面注册（输入账号密码即可自动注册）。
-- 这里先创建 10 个测试用户的 profiles 和 children 数据。
-- 为了让数据关联正确，先用登录页创建用户，然后执行下面的脚本。

-- 但为了方便测试，我们使用「公共测试数据」方式：
-- 直接在 activities, services, assessments 等表中插入丰富的测试数据。

-- === 活动报告测试数据 ===

-- 为已有的活动插入完成报告
INSERT INTO activity_reports (
  activity_id, actual_participants, avg_duration_minutes, completion_rate,
  satisfaction_score, social_before, social_after, behavior_before,
  behavior_after, decision_before, decision_after, focus_before,
  focus_after, summary, highlights, recommendations, report_date
) VALUES
-- 报告1: ADHD儿童情绪管理夏令营
(
  (SELECT id FROM activities WHERE title = 'ADHD儿童情绪管理夏令营' LIMIT 1),
  22, 85.5, 91.7, 4.6,
  62.3, 71.8, 58.5, 67.2, 55.0, 61.3, 60.2, 68.5,
  '本期情绪管理夏令营共22名儿童参与，整体表现优秀。通过系统的情绪识别训练和角色扮演活动，孩子们在社交互动和情绪调节方面取得了显著进步。',
  '1. 情绪日记环节受到广泛好评；2. 小组合作游戏有效促进社交互动；3. 冥想放松训练帮助孩子建立自我调节能力',
  '建议家长在家中继续使用情绪卡片工具，每日10分钟的亲子互动可以巩固训练效果。推荐参加后续的专注力训练营。',
  '2024-10-20 16:00:00+08'
),
-- 报告2: ADHD 儿童感统专注力训练营
(
  (SELECT id FROM activities WHERE title = 'ADHD 儿童感统专注力训练营' LIMIT 1),
  28, 92.0, 93.3, 4.8,
  65.0, 72.5, 60.8, 70.3, 57.2, 64.8, 55.0, 72.0,
  '感统专注力训练营圆满结束，28名学员全程参与度极高。通过感统器材训练和专注力游戏，孩子们的注意力持续时间平均提升了31%。',
  '1. 平衡木训练显著提升身体协调性；2. 注意力分配练习效果突出；3. 团队竞赛激发孩子主动参与',
  '建议每周保持2-3次感统训练，可在家进行简单的平衡和触觉刺激练习。专注力提升需要持续训练，推荐报名下期训练营。',
  '2024-11-20 16:00:00+08'
),
-- 报告3: 感统训练公开课
(
  (SELECT id FROM activities WHERE title = '感统训练公开课' LIMIT 1),
  47, 55.0, 94.0, 4.3,
  60.0, 63.5, 57.0, 61.0, 54.0, 57.5, 58.0, 63.0,
  '公开课吸引了47组家庭参与，超出预期。家长和孩子们对感统训练有了初步了解，活动中的亲子互动环节最受欢迎。',
  '1. 亲子感统游戏体验广受好评；2. 专家讲座帮助家长理解感统训练的重要性；3. 现场互动答疑解决家长疑虑',
  '建议有兴趣的家庭参加系统性训练课程。日常可多进行户外活动和精细动作训练。',
  '2024-09-20 16:00:00+08'
);

-- === 为当前登录的测试用户生成丰富数据 ===
-- 以下数据使用函数自动关联到新注册的用户

-- 创建一个辅助函数：为指定 profile 生成完整测试数据
CREATE OR REPLACE FUNCTION generate_test_data_for_user(target_profile_id UUID)
RETURNS VOID AS $$
DECLARE
  child1_id UUID;
  assessment1_id UUID;
  assessment2_id UUID;
  assessment3_id UUID;
BEGIN
  -- 更新 profile 名字
  UPDATE profiles SET full_name = '张家长', phone = '13800138001'
  WHERE id = target_profile_id AND full_name = '';

  -- 创建儿童
  INSERT INTO children (id, profile_id, full_name, age, gender)
  VALUES (gen_random_uuid(), target_profile_id, '张小明', 8, '男')
  ON CONFLICT DO NOTHING
  RETURNING id INTO child1_id;

  -- 如果儿童已存在，获取 ID
  IF child1_id IS NULL THEN
    SELECT id INTO child1_id FROM children WHERE profile_id = target_profile_id LIMIT 1;
  END IF;

  IF child1_id IS NULL THEN RETURN; END IF;

  -- 体格数据（多条历史记录）
  INSERT INTO physical_data (child_id, weight, height, bmi, recorded_at) VALUES
  (child1_id, 30.0, 132.0, 17.2, '2024-07-01 10:00:00+08'),
  (child1_id, 31.2, 135.0, 17.1, '2024-08-15 10:00:00+08'),
  (child1_id, 32.5, 138.0, 17.1, '2024-10-01 10:00:00+08');

  -- 健康指数（多月数据）
  INSERT INTO health_scores (child_id, score, improvement, grade, heart_rate, activity_minutes, recorded_at) VALUES
  (child1_id, 72, '+1.5%', '良', 102, 30, '2024-07-15 10:00:00+08'),
  (child1_id, 78, '+3.2%', '良+', 100, 35, '2024-08-15 10:00:00+08'),
  (child1_id, 85, '+2.4%', '优+', 98, 45, '2024-10-01 10:00:00+08');

  -- 社交能力评估
  INSERT INTO assessments (id, child_id, category, score, improvement, period, recorded_at)
  VALUES (gen_random_uuid(), child1_id, 'social', 72, '+5.2%', '2024年 10月', '2024-10-15 10:00:00+08')
  RETURNING id INTO assessment1_id;

  INSERT INTO assessment_details (assessment_id, dimension_name, dimension_value, sort_order) VALUES
  (assessment1_id, '主动交流', '良好', 1),
  (assessment1_id, '情绪识别', '中等', 2),
  (assessment1_id, '冲突处理', '需改善', 3),
  (assessment1_id, '团队合作', '良好', 4),
  (assessment1_id, '同理心', '中等', 5);

  -- 行为表现评估
  INSERT INTO assessments (id, child_id, category, score, improvement, period, recorded_at)
  VALUES (gen_random_uuid(), child1_id, 'behavior', 68, '+3.8%', '2024年 10月', '2024-10-15 10:00:00+08')
  RETURNING id INTO assessment2_id;

  INSERT INTO assessment_details (assessment_id, dimension_name, dimension_value, sort_order) VALUES
  (assessment2_id, '课堂纪律', '中等', 1),
  (assessment2_id, '任务完成', '良好', 2),
  (assessment2_id, '情绪控制', '需改善', 3),
  (assessment2_id, '规则遵守', '中等', 4),
  (assessment2_id, '自我管理', '中等', 5);

  -- 决策方式评估
  INSERT INTO assessments (id, child_id, category, score, improvement, period, recorded_at)
  VALUES (gen_random_uuid(), child1_id, 'decision', 65, '+4.1%', '2024年 10月', '2024-10-15 10:00:00+08')
  RETURNING id INTO assessment3_id;

  INSERT INTO assessment_details (assessment_id, dimension_name, dimension_value, sort_order) VALUES
  (assessment3_id, '独立思考', '中等', 1),
  (assessment3_id, '风险评估', '需改善', 2),
  (assessment3_id, '目标设定', '良好', 3),
  (assessment3_id, '方案比较', '中等', 4),
  (assessment3_id, '后果预判', '需改善', 5);

  -- 历史记录
  INSERT INTO history_records (child_id, title, record_type, record_date, description, status, status_color, category) VALUES
  (child1_id, '社交能力综合评估 (10月)', 'test', '2024-10-15', '本次评估显示社交互动能力有明显进步', '已完成', 'emerald', 'social'),
  (child1_id, '社交能力综合评估 (9月)', 'test', '2024-09-10', '社交技能基线评估', '已完成', 'emerald', 'social'),
  (child1_id, '行为表现综合评估 (10月)', 'test', '2024-10-15', '课堂行为表现有所改善', '已完成', 'blue', 'behavior'),
  (child1_id, '行为表现综合评估 (9月)', 'test', '2024-09-10', '行为基线评估', '已完成', 'blue', 'behavior'),
  (child1_id, '决策方式综合评估 (10月)', 'test', '2024-10-15', '决策能力逐步提升', '已完成', 'purple', 'decision'),
  (child1_id, 'ADHD儿童情绪管理夏令营', 'activity', '2024-10-15', '完成情绪管理训练，表现优秀', '已参加', 'teal', 'social'),
  (child1_id, '感统训练公开课', 'activity', '2024-09-20', '参与体验课程', '已参加', 'teal', 'behavior'),
  (child1_id, '一对一心理咨询', 'activity', '2024-10-08', '第3次咨询，聚焦注意力训练', '已完成', 'amber', 'decision');

  -- 预约信息
  INSERT INTO appointments (profile_id, title, appointment_date, appointment_time, item_type) VALUES
  (target_profile_id, '专注力绘画工作坊', '12月1日', '09:00', 'activity');

  -- 反馈记录
  INSERT INTO feedback (profile_id, feedback_type, description, allow_contact, status) VALUES
  (target_profile_id, '建议', '希望增加更多周末的活动场次，方便上班族家长参与。', true, 'resolved'),
  (target_profile_id, '普通问题', '报名后如何修改预约时间？', false, 'resolved');

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- === 批量创建10个测试用户 ===
-- 注意：由于 Supabase 的 auth.users 无法通过 SQL 直接创建
-- 我们使用以下策略：在 profiles 中直接插入测试数据
-- 这些用户通过登录页面（输入用户名+密码）自动注册后，
-- 调用 generate_test_data_for_user(profile_id) 即可生成完整数据

-- 为方便测试，我们创建一个一键生成测试数据的函数
CREATE OR REPLACE FUNCTION seed_test_data()
RETURNS TEXT AS $$
DECLARE
  p_id UUID;
  user_count INTEGER := 0;
BEGIN
  -- 为所有已注册但没有 children 数据的用户生成测试数据
  FOR p_id IN
    SELECT id FROM profiles
    WHERE id NOT IN (SELECT DISTINCT profile_id FROM children)
  LOOP
    PERFORM generate_test_data_for_user(p_id);
    user_count := user_count + 1;
  END LOOP;

  RETURN '已为 ' || user_count || ' 个用户生成测试数据';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 立即执行：为所有已注册用户生成测试数据
-- ============================================
SELECT seed_test_data();

-- ============================================
-- 额外：创建 9 个模拟儿童数据用于活动报告的个人明细
-- （这些是其他家庭的孩子，丰富报告数据）
-- ============================================
DO $$
DECLARE
  report1_id UUID;
  report2_id UUID;
  report3_id UUID;
  sim_child_ids UUID[] := ARRAY[
    gen_random_uuid(), gen_random_uuid(), gen_random_uuid(),
    gen_random_uuid(), gen_random_uuid(), gen_random_uuid(),
    gen_random_uuid(), gen_random_uuid(), gen_random_uuid()
  ];
  child_names TEXT[] := ARRAY['李小红', '王小华', '赵小亮', '刘小美', '陈小杰', '杨小芳', '周小强', '吴小丽', '孙小飞'];
  i INTEGER;
BEGIN
  -- 获取活动报告 ID
  SELECT id INTO report1_id FROM activity_reports
    WHERE activity_id = (SELECT id FROM activities WHERE title = 'ADHD儿童情绪管理夏令营' LIMIT 1) LIMIT 1;
  SELECT id INTO report2_id FROM activity_reports
    WHERE activity_id = (SELECT id FROM activities WHERE title = 'ADHD 儿童感统专注力训练营' LIMIT 1) LIMIT 1;
  SELECT id INTO report3_id FROM activity_reports
    WHERE activity_id = (SELECT id FROM activities WHERE title = '感统训练公开课' LIMIT 1) LIMIT 1;

  -- 为第一个报告插入个人明细（多样化数据）
  IF report1_id IS NOT NULL THEN
    INSERT INTO activity_report_details (report_id, child_id, actual_duration_minutes, completed, social_improvement, behavior_improvement, decision_improvement, focus_improvement, teacher_comment)
    VALUES
    (report1_id, sim_child_ids[1], 90.0, true, 8.5, 7.2, 5.0, 6.8, '小红进步显著，特别是在情绪表达方面有很大突破。'),
    (report1_id, sim_child_ids[2], 85.0, true, 6.0, 8.5, 4.5, 7.0, '小华在团队合作中表现出色，需要加强独立思考。'),
    (report1_id, sim_child_ids[3], 80.0, true, 9.0, 6.0, 6.5, 5.5, '小亮的社交主动性明显增强，继续保持！'),
    (report1_id, sim_child_ids[4], 92.0, true, 7.5, 9.0, 5.5, 8.0, '小美全程表现优秀，各方面均衡发展。'),
    (report1_id, sim_child_ids[5], 75.0, false, 5.0, 4.5, 3.0, 4.0, '小杰中途需要休息，建议逐步增加训练强度。');
  END IF;

  -- 为第二个报告插入个人明细
  IF report2_id IS NOT NULL THEN
    INSERT INTO activity_report_details (report_id, child_id, actual_duration_minutes, completed, social_improvement, behavior_improvement, decision_improvement, focus_improvement, teacher_comment)
    VALUES
    (report2_id, sim_child_ids[1], 95.0, true, 7.0, 8.0, 6.0, 15.0, '感统训练效果显著，专注力持续时间提升40%。'),
    (report2_id, sim_child_ids[3], 90.0, true, 6.5, 7.5, 5.5, 12.0, '平衡感明显改善，注意力训练需持续。'),
    (report2_id, sim_child_ids[6], 88.0, true, 5.0, 9.5, 4.0, 18.0, '小强在感统器材训练中非常投入，专注力提升最为显著。'),
    (report2_id, sim_child_ids[7], 92.0, true, 8.0, 6.5, 7.0, 10.0, '小丽协调性好，训练中展现出较强的学习能力。'),
    (report2_id, sim_child_ids[8], 85.0, true, 4.5, 5.0, 3.5, 8.0, '小飞初次参加，适应良好，建议持续训练。');
  END IF;

  -- 为第三个报告插入个人明细
  IF report3_id IS NOT NULL THEN
    INSERT INTO activity_report_details (report_id, child_id, actual_duration_minutes, completed, social_improvement, behavior_improvement, decision_improvement, focus_improvement, teacher_comment)
    VALUES
    (report3_id, sim_child_ids[2], 55.0, true, 3.0, 3.5, 2.5, 4.0, '公开课体验积极，建议参加完整课程。'),
    (report3_id, sim_child_ids[4], 58.0, true, 4.0, 4.0, 3.0, 5.0, '小美对感统训练表现出浓厚兴趣。'),
    (report3_id, sim_child_ids[5], 50.0, true, 2.5, 3.0, 2.0, 3.5, '亲子互动环节参与度高，家长配合良好。'),
    (report3_id, sim_child_ids[7], 55.0, true, 3.5, 3.0, 2.5, 4.5, '小丽基础不错，适合进阶训练。'),
    (report3_id, sim_child_ids[8], 52.0, true, 2.0, 2.5, 1.5, 3.0, '首次体验，总体表现平稳，需要更多练习。');
  END IF;
END $$;

-- ============================================
-- 完成提示
-- ============================================
-- 执行完毕后：
-- 1. activity_reports 表已有 3 条活动完成报告
-- 2. activity_report_details 表已有 15 条个人明细
-- 3. 已注册用户自动获得完整测试数据（儿童档案、体格数据、评估、历史记录等）
-- 4. 新注册用户可通过调用 SELECT seed_test_data(); 生成测试数据
