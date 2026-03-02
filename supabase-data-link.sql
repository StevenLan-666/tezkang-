-- ============================================
-- 特质康+ 数据链路完善 + 批量测试数据 V2
-- 在 Supabase SQL Editor 中执行
-- ============================================

-- ============================================
-- Part 1: 完善数据关联（新增字段）
-- 实现：活动名称 → 参与儿童 → 详细信息 → 参与情况 → 各项提升 → 反馈
-- ============================================

-- 1.1 activity_report_details 增加 registration_id（关联报名记录）
ALTER TABLE activity_report_details
  ADD COLUMN IF NOT EXISTS registration_id UUID REFERENCES registrations(id) ON DELETE SET NULL;

-- 1.2 feedback 增加 activity_id 和 registration_id（关联到具体活动和报名）
ALTER TABLE feedback
  ADD COLUMN IF NOT EXISTS activity_id UUID REFERENCES activities(id) ON DELETE SET NULL;
ALTER TABLE feedback
  ADD COLUMN IF NOT EXISTS registration_id UUID REFERENCES registrations(id) ON DELETE SET NULL;
ALTER TABLE feedback
  ADD COLUMN IF NOT EXISTS activity_title TEXT DEFAULT '';

-- 1.3 registrations 增加完成相关字段
ALTER TABLE registrations
  ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE registrations
  ADD COLUMN IF NOT EXISTS satisfaction_score DECIMAL(3, 1) DEFAULT 0;

-- ============================================
-- Part 2: 为10个测试用户批量创建「已完成」的活动数据
-- 数据链路：registration → activity_report_details → feedback
-- ============================================

DO $$
DECLARE
  -- 活动 ID
  act1_id UUID;  -- ADHD儿童情绪管理夏令营
  act2_id UUID;  -- ADHD 儿童感统专注力训练营
  act3_id UUID;  -- 感统训练公开课
  -- 活动报告 ID
  rpt1_id UUID;
  rpt2_id UUID;
  rpt3_id UUID;
  -- 循环变量
  rec RECORD;
  child_rec RECORD;
  reg_id UUID;
  detail_id UUID;
  i INTEGER := 0;
  -- 差异化数据参数
  durations DECIMAL[] := ARRAY[88.0, 92.5, 85.0, 78.5, 95.0, 82.0, 90.0, 75.5, 93.0, 86.5];
  social_imps DECIMAL[] := ARRAY[8.5, 6.0, 9.5, 4.5, 7.0, 5.5, 8.0, 3.5, 9.0, 6.5];
  behavior_imps DECIMAL[] := ARRAY[7.2, 8.5, 6.0, 5.0, 9.0, 4.5, 7.5, 4.0, 8.5, 5.5];
  decision_imps DECIMAL[] := ARRAY[5.0, 4.5, 7.0, 3.0, 5.5, 3.5, 6.0, 2.5, 6.5, 4.0];
  focus_imps DECIMAL[] := ARRAY[6.8, 7.0, 5.5, 4.0, 8.0, 6.0, 5.0, 3.0, 7.5, 5.0];
  satisfactions DECIMAL[] := ARRAY[4.8, 4.5, 4.9, 3.8, 4.7, 4.2, 4.6, 3.5, 4.9, 4.3];
  comments TEXT[] := ARRAY[
    '进步显著，特别是在情绪表达方面有很大突破。建议继续参加后续课程。',
    '团队合作中表现出色，需要加强独立思考能力。',
    '社交主动性明显增强，沟通技巧有质的飞跃！',
    '中途需要休息较多，建议逐步增加训练强度，循序渐进。',
    '全程表现优秀，各方面均衡发展，是本期的标杆学员。',
    '基础不错但注意力持续时间有限，需要更多专注力训练。',
    '进步稳定，情绪控制能力提升明显，与同伴互动更加自然。',
    '首次参加此类活动，适应期较长，建议家长在家配合练习。',
    '综合能力提升显著，尤其在冲突处理和换位思考方面表现优异。',
    '参与度良好，但抗挫折能力需要加强，建议参加更多团队活动。'
  ];
  fb_texts TEXT[] := ARRAY[
    '活动很有趣，孩子参加后情绪管理能力明显提升了！',
    '老师很专业，但活动时间偏长，孩子容易疲倦。',
    '非常满意！希望能多举办类似的训练营。',
    '活动内容丰富，但希望增加更多户外环节。',
    '孩子很喜欢这个活动，回家后一直在练习学到的技巧。',
    '整体不错，建议后续课程能分更多小组，老师能关注到每个孩子。',
    '感统训练效果明显，孩子的平衡感和协调性都有进步。',
    '建议增加更多亲子互动环节，家长也能学到一些方法。',
    '课程设计很科学，循序渐进，孩子接受度很高。',
    '期待后续课程！建议开放周末场次方便上班族家长。'
  ];
BEGIN
  -- 获取活动 ID
  SELECT id INTO act1_id FROM activities WHERE title = 'ADHD儿童情绪管理夏令营' LIMIT 1;
  SELECT id INTO act2_id FROM activities WHERE title = 'ADHD 儿童感统专注力训练营' LIMIT 1;
  SELECT id INTO act3_id FROM activities WHERE title = '感统训练公开课' LIMIT 1;

  IF act1_id IS NULL OR act2_id IS NULL THEN
    RAISE NOTICE '活动数据不存在，请先执行 supabase-schema.sql 中的活动插入';
    RETURN;
  END IF;

  -- 获取或创建活动报告
  SELECT id INTO rpt1_id FROM activity_reports WHERE activity_id = act1_id LIMIT 1;
  SELECT id INTO rpt2_id FROM activity_reports WHERE activity_id = act2_id LIMIT 1;
  IF act3_id IS NOT NULL THEN
    SELECT id INTO rpt3_id FROM activity_reports WHERE activity_id = act3_id LIMIT 1;
  END IF;

  -- 如果报告不存在则创建
  IF rpt1_id IS NULL THEN
    INSERT INTO activity_reports (activity_id, actual_participants, avg_duration_minutes, completion_rate, satisfaction_score,
      social_before, social_after, behavior_before, behavior_after, decision_before, decision_after, focus_before, focus_after,
      summary, highlights, recommendations, report_date)
    VALUES (act1_id, 0, 0, 0, 0, 62.3, 71.8, 58.5, 67.2, 55.0, 61.3, 60.2, 68.5,
      '情绪管理夏令营综合报告', '情绪日记、小组合作、冥想放松', '建议继续使用情绪卡片工具', NOW())
    RETURNING id INTO rpt1_id;
  END IF;

  IF rpt2_id IS NULL THEN
    INSERT INTO activity_reports (activity_id, actual_participants, avg_duration_minutes, completion_rate, satisfaction_score,
      social_before, social_after, behavior_before, behavior_after, decision_before, decision_after, focus_before, focus_after,
      summary, highlights, recommendations, report_date)
    VALUES (act2_id, 0, 0, 0, 0, 65.0, 72.5, 60.8, 70.3, 57.2, 64.8, 55.0, 72.0,
      '感统专注力训练营综合报告', '平衡感训练、注意力分配', '建议每周保持2-3次感统训练', NOW())
    RETURNING id INTO rpt2_id;
  END IF;

  -- 遍历所有测试用户（通过 profiles 表）
  i := 0;
  FOR rec IN
    SELECT p.id as profile_id, p.full_name as parent_name, p.phone
    FROM profiles p
    WHERE p.id IN (SELECT DISTINCT profile_id FROM children)
    ORDER BY p.created_at
    LIMIT 10
  LOOP
    i := i + 1;

    -- 获取该用户的第一个孩子
    SELECT * INTO child_rec FROM children WHERE profile_id = rec.profile_id LIMIT 1;
    IF child_rec IS NULL THEN CONTINUE; END IF;

    -- ========== 活动 1: 情绪管理夏令营（已完成） ==========
    -- 创建已完成的报名记录
    INSERT INTO registrations (profile_id, child_id, item_type, item_id, item_title,
      child_name, child_age, child_gender, parent_name, parent_phone,
      status, completed_at, satisfaction_score)
    VALUES (rec.profile_id, child_rec.id, 'activity', act1_id::TEXT, 'ADHD儿童情绪管理夏令营',
      child_rec.full_name, child_rec.age, child_rec.gender, rec.parent_name, rec.phone,
      'completed', '2024-10-20 16:00:00+08', satisfactions[i])
    ON CONFLICT DO NOTHING
    RETURNING id INTO reg_id;

    -- 如果报名记录已存在，获取它
    IF reg_id IS NULL THEN
      SELECT id INTO reg_id FROM registrations
      WHERE profile_id = rec.profile_id AND item_title = 'ADHD儿童情绪管理夏令营'
      LIMIT 1;
      -- 更新为已完成
      IF reg_id IS NOT NULL THEN
        UPDATE registrations SET status = 'completed',
          completed_at = '2024-10-20 16:00:00+08',
          satisfaction_score = satisfactions[i]
        WHERE id = reg_id;
      END IF;
    END IF;

    -- 创建个人明细（关联到报名记录和报告）
    IF reg_id IS NOT NULL AND rpt1_id IS NOT NULL THEN
      -- 检查是否已有该 child 的明细
      SELECT id INTO detail_id FROM activity_report_details
        WHERE report_id = rpt1_id AND child_id = child_rec.id LIMIT 1;

      IF detail_id IS NULL THEN
        INSERT INTO activity_report_details (
          report_id, child_id, registration_id,
          actual_duration_minutes, completed,
          social_improvement, behavior_improvement, decision_improvement, focus_improvement,
          teacher_comment)
        VALUES (
          rpt1_id, child_rec.id, reg_id,
          durations[i], TRUE,
          social_imps[i], behavior_imps[i], decision_imps[i], focus_imps[i],
          comments[i]);
      ELSE
        -- 更新已有记录
        UPDATE activity_report_details SET
          registration_id = reg_id,
          actual_duration_minutes = durations[i],
          social_improvement = social_imps[i],
          behavior_improvement = behavior_imps[i],
          decision_improvement = decision_imps[i],
          focus_improvement = focus_imps[i],
          teacher_comment = comments[i]
        WHERE id = detail_id;
      END IF;

      -- 创建针对该活动的反馈
      INSERT INTO feedback (profile_id, activity_id, registration_id, activity_title,
        feedback_type, description, allow_contact, status)
      VALUES (rec.profile_id, act1_id, reg_id, 'ADHD儿童情绪管理夏令营',
        '活动反馈', fb_texts[i], TRUE, 'resolved')
      ON CONFLICT DO NOTHING;
    END IF;

    -- ========== 活动 2: 感统专注力训练营（已完成） ==========
    INSERT INTO registrations (profile_id, child_id, item_type, item_id, item_title,
      child_name, child_age, child_gender, parent_name, parent_phone,
      status, completed_at, satisfaction_score)
    VALUES (rec.profile_id, child_rec.id, 'activity', act2_id::TEXT, 'ADHD 儿童感统专注力训练营',
      child_rec.full_name, child_rec.age, child_rec.gender, rec.parent_name, rec.phone,
      'completed', '2024-11-20 16:00:00+08', satisfactions[i] - 0.2)
    ON CONFLICT DO NOTHING
    RETURNING id INTO reg_id;

    IF reg_id IS NULL THEN
      SELECT id INTO reg_id FROM registrations
      WHERE profile_id = rec.profile_id AND item_title = 'ADHD 儿童感统专注力训练营'
      LIMIT 1;
      IF reg_id IS NOT NULL THEN
        UPDATE registrations SET status = 'completed',
          completed_at = '2024-11-20 16:00:00+08',
          satisfaction_score = satisfactions[i] - 0.2
        WHERE id = reg_id;
      END IF;
    END IF;

    IF reg_id IS NOT NULL AND rpt2_id IS NOT NULL THEN
      SELECT id INTO detail_id FROM activity_report_details
        WHERE report_id = rpt2_id AND child_id = child_rec.id LIMIT 1;

      IF detail_id IS NULL THEN
        INSERT INTO activity_report_details (
          report_id, child_id, registration_id,
          actual_duration_minutes, completed,
          social_improvement, behavior_improvement, decision_improvement, focus_improvement,
          teacher_comment)
        VALUES (
          rpt2_id, child_rec.id, reg_id,
          durations[i] + 5, TRUE,
          social_imps[i] - 1.0, behavior_imps[i] + 1.5, decision_imps[i] + 0.5, focus_imps[i] + 5.0,
          '感统训练：' || comments[i]);
      ELSE
        UPDATE activity_report_details SET
          registration_id = reg_id,
          actual_duration_minutes = durations[i] + 5,
          social_improvement = social_imps[i] - 1.0,
          behavior_improvement = behavior_imps[i] + 1.5,
          decision_improvement = decision_imps[i] + 0.5,
          focus_improvement = focus_imps[i] + 5.0,
          teacher_comment = '感统训练：' || comments[i]
        WHERE id = detail_id;
      END IF;
    END IF;

    -- 更新历史记录的状态
    UPDATE history_records SET status = '已完成', description = child_rec.full_name || '完成情绪管理训练，各维度有显著提升'
    WHERE child_id = child_rec.id AND title = 'ADHD儿童情绪管理夏令营';

    RAISE NOTICE '用户 % (%) → 孩子 % 数据完成', i, rec.parent_name, child_rec.full_name;
  END LOOP;

  -- 更新活动报告的汇总统计
  UPDATE activity_reports SET
    actual_participants = (SELECT COUNT(*) FROM activity_report_details WHERE report_id = rpt1_id),
    avg_duration_minutes = (SELECT AVG(actual_duration_minutes) FROM activity_report_details WHERE report_id = rpt1_id),
    completion_rate = 100.0 * (SELECT COUNT(*) FILTER (WHERE completed) FROM activity_report_details WHERE report_id = rpt1_id)
                      / GREATEST((SELECT COUNT(*) FROM activity_report_details WHERE report_id = rpt1_id), 1),
    satisfaction_score = (SELECT AVG(r.satisfaction_score) FROM activity_report_details d
                          JOIN registrations r ON d.registration_id = r.id WHERE d.report_id = rpt1_id)
  WHERE id = rpt1_id;

  UPDATE activity_reports SET
    actual_participants = (SELECT COUNT(*) FROM activity_report_details WHERE report_id = rpt2_id),
    avg_duration_minutes = (SELECT AVG(actual_duration_minutes) FROM activity_report_details WHERE report_id = rpt2_id),
    completion_rate = 100.0 * (SELECT COUNT(*) FILTER (WHERE completed) FROM activity_report_details WHERE report_id = rpt2_id)
                      / GREATEST((SELECT COUNT(*) FROM activity_report_details WHERE report_id = rpt2_id), 1),
    satisfaction_score = (SELECT AVG(r.satisfaction_score) FROM activity_report_details d
                          JOIN registrations r ON d.registration_id = r.id WHERE d.report_id = rpt2_id)
  WHERE id = rpt2_id;

  RAISE NOTICE '========================================';
  RAISE NOTICE '完成！数据链路已建立：';
  RAISE NOTICE '活动 → registrations → activity_report_details → feedback';
  RAISE NOTICE '每个链路可通过 registration_id 完整追溯';
  RAISE NOTICE '========================================';
END $$;

-- ============================================
-- 验证查询：完整数据链路
-- 活动 → 报名 → 儿童 → 参与情况 → 提升 → 反馈
-- ============================================
SELECT
  a.title AS "活动名称",
  c.full_name AS "参与儿童",
  c.age AS "年龄",
  c.gender AS "性别",
  r.status AS "报名状态",
  r.completed_at AS "完成时间",
  d.actual_duration_minutes AS "实际参与(分钟)",
  d.social_improvement AS "社交提升",
  d.behavior_improvement AS "行为提升",
  d.decision_improvement AS "决策提升",
  d.focus_improvement AS "专注提升",
  d.teacher_comment AS "教师评语",
  r.satisfaction_score AS "满意度",
  f.description AS "家长反馈"
FROM activity_report_details d
JOIN activity_reports rpt ON d.report_id = rpt.id
JOIN activities a ON rpt.activity_id = a.id
JOIN children c ON d.child_id = c.id
LEFT JOIN registrations r ON d.registration_id = r.id
LEFT JOIN feedback f ON f.registration_id = r.id AND f.activity_id = a.id
ORDER BY a.title, c.full_name;
