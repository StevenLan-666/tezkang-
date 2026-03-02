-- ============================================
-- 特质康+ 批量历史记录 & 评估数据
-- 在 Supabase SQL Editor 中执行
-- ============================================
-- 为每个测试用户的孩子批量创建：
-- 1. history_records (各分类历史记录)
-- 2. assessments (对应的评估记录)
-- ============================================

DO $$
DECLARE
  rec RECORD;
  child_rec RECORD;
  i INTEGER := 0;
  -- 社交能力历史记录
  social_titles TEXT[] := ARRAY['社交能力评估', '社交能力评估', '社交能力评估', '社交技能提升班', 'ADHD儿童情绪管理夏令营'];
  social_types TEXT[] := ARRAY['test', 'test', 'test', 'activity', 'activity'];
  social_dates TEXT[] := ARRAY['10月24日', '9月24日', '8月24日', '10月20日', '10月15日'];
  social_descs TEXT[] := ARRAY[
    '完成了阶段性社交能力评估，各项指标表现稳定，社交主动性有所提升。',
    '社交互动频率增加，能够更好地理解同伴的非语言信号。',
    '初步建立社交自信，开始尝试参与集体活动。',
    '在小组互动中表现积极，能够主动分享玩具并与同伴进行有效沟通。',
    '通过情绪管理训练，社交主动性显著提升，与同伴互动更加自然。'
  ];
  social_statuses TEXT[] := ARRAY['有进步', '表现稳定', '已完成', '表现稳定', '已完成'];
  social_colors TEXT[] := ARRAY['green', 'blue', 'slate', 'blue', 'green'];

  -- 行为表现历史记录
  behavior_titles TEXT[] := ARRAY['行为规范评估', '行为规范评估', '行为规范评估', '行为规范指导课', 'ADHD 儿童感统专注力训练营'];
  behavior_types TEXT[] := ARRAY['test', 'test', 'test', 'activity', 'activity'];
  behavior_dates TEXT[] := ARRAY['10月24日', '9月24日', '8月24日', '10月18日', '10月10日'];
  behavior_descs TEXT[] := ARRAY[
    '完成了行为规范阶段性评估，专注时长显著增加，冲动行为频率降低。',
    '课堂纪律意识增强，能够较好地遵循老师的指令。',
    '行为习惯初步养成，冲动行为有所改善。',
    '在课堂上能够遵守规则，按时完成任务，展现出良好的自律性。',
    '感统训练后专注力和行为控制能力均有明显提升。'
  ];
  behavior_statuses TEXT[] := ARRAY['有进步', '表现稳定', '已完成', '表现稳定', '已完成'];
  behavior_colors TEXT[] := ARRAY['green', 'blue', 'slate', 'blue', 'green'];

  -- 决策方式历史记录
  decision_titles TEXT[] := ARRAY['决策逻辑评估', '决策逻辑评估', '决策逻辑评估', '一对一心理咨询与行为干预'];
  decision_types TEXT[] := ARRAY['test', 'test', 'test', 'activity'];
  decision_dates TEXT[] := ARRAY['10月24日', '9月24日', '8月24日', '10月15日'];
  decision_descs TEXT[] := ARRAY[
    '完成了决策逻辑评估，在复杂情境下的判断力有所增强。',
    '逻辑思维能力提升，能够进行简单的因果关系分析。',
    '决策速度加快，在简单选择题中表现果断。',
    '通过情境模拟训练，孩子在面对冲突时的决策更加理性和冷静。'
  ];
  decision_statuses TEXT[] := ARRAY['已完成', '表现稳定', '已完成', '有进步'];
  decision_colors TEXT[] := ARRAY['slate', 'blue', 'slate', 'green'];

  -- 差异化评分基础
  social_scores DECIMAL[] := ARRAY[85.0, 78.0, 82.0, 70.0, 88.0, 75.0, 80.0, 68.0, 90.0, 76.0];
  behavior_scores DECIMAL[] := ARRAY[78.0, 82.0, 75.0, 68.0, 85.0, 72.0, 80.0, 65.0, 88.0, 74.0];
  decision_scores DECIMAL[] := ARRAY[72.0, 75.0, 80.0, 65.0, 78.0, 70.0, 76.0, 62.0, 82.0, 68.0];

  j INTEGER;
  reg_id UUID;
  desc_variant TEXT;
  score_variant DECIMAL;
BEGIN
  i := 0;
  FOR rec IN
    SELECT p.id as profile_id, p.full_name
    FROM profiles p
    WHERE p.id IN (SELECT DISTINCT profile_id FROM children)
    ORDER BY p.created_at
    LIMIT 10
  LOOP
    i := i + 1;
    SELECT * INTO child_rec FROM children WHERE profile_id = rec.profile_id LIMIT 1;
    IF child_rec IS NULL THEN CONTINUE; END IF;

    -- ========== 清除该孩子旧的历史记录（防止重复插入） ==========
    DELETE FROM history_records WHERE child_id = child_rec.id;

    -- ========== 社交能力历史记录 ==========
    FOR j IN 1..5 LOOP
      -- 为每个用户创建略有差异的描述
      desc_variant := social_descs[j] || CASE
        WHEN i <= 3 THEN ' ' || child_rec.full_name || '整体表现优秀。'
        WHEN i <= 6 THEN ' 相比上月有一定进步。'
        WHEN i <= 8 THEN ' 需要更多练习巩固。'
        ELSE ' 综合表现良好。'
      END;

      INSERT INTO history_records (child_id, title, record_type, record_date, description, status, status_color, category)
      VALUES (child_rec.id, social_titles[j], social_types[j], social_dates[j], desc_variant, social_statuses[j], social_colors[j], 'social');
    END LOOP;

    -- ========== 行为表现历史记录 ==========
    FOR j IN 1..5 LOOP
      desc_variant := behavior_descs[j] || CASE
        WHEN i <= 3 THEN ' ' || child_rec.full_name || '在此方面进步显著。'
        WHEN i <= 6 THEN ' 逐步养成良好习惯。'
        WHEN i <= 8 THEN ' 仍需持续关注和训练。'
        ELSE ' 表现持续向好。'
      END;

      INSERT INTO history_records (child_id, title, record_type, record_date, description, status, status_color, category)
      VALUES (child_rec.id, behavior_titles[j], behavior_types[j], behavior_dates[j], desc_variant, behavior_statuses[j], behavior_colors[j], 'behavior');
    END LOOP;

    -- ========== 决策方式历史记录 ==========
    FOR j IN 1..4 LOOP
      desc_variant := decision_descs[j] || CASE
        WHEN i <= 3 THEN ' ' || child_rec.full_name || '判断力增强。'
        WHEN i <= 6 THEN ' 思维更加清晰。'
        WHEN i <= 8 THEN ' 需要更多引导和练习。'
        ELSE ' 独立思考能力提升。'
      END;

      INSERT INTO history_records (child_id, title, record_type, record_date, description, status, status_color, category)
      VALUES (child_rec.id, decision_titles[j], decision_types[j], decision_dates[j], desc_variant, decision_statuses[j], decision_colors[j], 'decision');
    END LOOP;

    -- ========== 更新/补充评估数据 ==========
    -- 先清除旧评估（防重复）
    DELETE FROM assessment_details WHERE assessment_id IN (SELECT id FROM assessments WHERE child_id = child_rec.id);
    DELETE FROM assessments WHERE child_id = child_rec.id;

    -- 社交评估
    INSERT INTO assessments (child_id, category, score, improvement, period)
    VALUES (child_rec.id, 'social', social_scores[i]::INTEGER, '+5%', '2024年 10月')
    RETURNING id INTO reg_id;  -- 临时复用 reg_id 变量

    INSERT INTO assessment_details (assessment_id, dimension_name, dimension_value, sort_order) VALUES
      (reg_id, '沟通表达', CASE WHEN social_scores[i] > 80 THEN '优秀' WHEN social_scores[i] > 70 THEN '良好' ELSE '一般' END, 1),
      (reg_id, '共情能力', CASE WHEN social_scores[i] > 82 THEN '良好' ELSE '一般' END, 2),
      (reg_id, '团队协作', CASE WHEN social_scores[i] > 85 THEN '良好' ELSE '一般' END, 3),
      (reg_id, '情绪控制', CASE WHEN social_scores[i] > 78 THEN '优秀' ELSE '良好' END, 4),
      (reg_id, '冲突处理', CASE WHEN social_scores[i] > 83 THEN '良好' ELSE '一般' END, 5);

    -- 行为评估
    INSERT INTO assessments (child_id, category, score, improvement, period)
    VALUES (child_rec.id, 'behavior', behavior_scores[i]::INTEGER, '+4%', '2024年 10月')
    RETURNING id INTO reg_id;

    INSERT INTO assessment_details (assessment_id, dimension_name, dimension_value, sort_order) VALUES
      (reg_id, '自律性', CASE WHEN behavior_scores[i] > 78 THEN '优秀' ELSE '良好' END, 1),
      (reg_id, '专注力', CASE WHEN behavior_scores[i] > 80 THEN '良好' ELSE '一般' END, 2),
      (reg_id, '规则遵守', '良好', 3),
      (reg_id, '冲动控制', CASE WHEN behavior_scores[i] > 75 THEN '良好' ELSE '一般' END, 4),
      (reg_id, '抗挫折能力', '一般', 5);

    -- 决策评估
    INSERT INTO assessments (child_id, category, score, improvement, period)
    VALUES (child_rec.id, 'decision', decision_scores[i]::INTEGER, '+5%', '2024年 10月')
    RETURNING id INTO reg_id;

    INSERT INTO assessment_details (assessment_id, dimension_name, dimension_value, sort_order) VALUES
      (reg_id, '逻辑思维', CASE WHEN decision_scores[i] > 75 THEN '良好' ELSE '一般' END, 1),
      (reg_id, '因果分析', '一般', 2),
      (reg_id, '独立判断', CASE WHEN decision_scores[i] > 72 THEN '良好' ELSE '一般' END, 3),
      (reg_id, '风险评估', '一般', 4),
      (reg_id, '目标导向', '良好', 5);

    RAISE NOTICE '用户 % → 孩子 %：14条历史记录 + 3项评估 已创建', i, child_rec.full_name;
  END LOOP;

  RAISE NOTICE '========================================';
  RAISE NOTICE '完成！每个用户创建了：';
  RAISE NOTICE '  - 5 条社交能力历史记录';
  RAISE NOTICE '  - 5 条行为表现历史记录';
  RAISE NOTICE '  - 4 条决策方式历史记录';
  RAISE NOTICE '  - 3 项评估（social/behavior/decision）';
  RAISE NOTICE '========================================';
END $$;

-- 验证查询
SELECT
  c.full_name AS "儿童姓名",
  hr.category AS "分类",
  hr.title AS "标题",
  hr.record_type AS "类型",
  hr.record_date AS "日期",
  hr.status AS "状态",
  hr.status_color AS "颜色",
  LEFT(hr.description, 40) AS "描述(前40字)"
FROM history_records hr
JOIN children c ON hr.child_id = c.id
ORDER BY c.full_name, hr.category, hr.created_at DESC
LIMIT 30;
