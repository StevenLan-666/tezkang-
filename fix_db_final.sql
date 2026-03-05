-- 1. 清理这段时间因为修改冲突而造成的所有混乱的测试脏数据（基于之前生成的标题特征清理）
DELETE FROM public.history_records 
WHERE title LIKE '%综合评估（%' OR title LIKE '%一对一心理咨询%';

-- 2. 重写统一的 registrations 变为 completed 时的触发器，将评估生成的动作下放到数据库层并规范
CREATE OR REPLACE FUNCTION sync_completed_to_history()
RETURNS TRIGGER AS $$
DECLARE
  v_child_id UUID;
  v_category VARCHAR(20);
  v_description TEXT;
  v_month VARCHAR(2);
  v_period VARCHAR(20);
BEGIN
  IF OLD.status <> 'completed' AND NEW.status = 'completed' THEN
    v_child_id := NEW.child_id;
    v_month := EXTRACT(MONTH FROM COALESCE(NEW.completed_at, NOW()))::text;
    v_period := EXTRACT(YEAR FROM NOW())::text || '年' || v_month || '月';

    -- 构造描述，包含教师评语
    v_description := NEW.item_title;
    IF NEW.staff_comment IS NOT NULL AND NEW.staff_comment <> '' THEN
      v_description := v_description || ' | 教师评语：' || NEW.staff_comment;
    END IF;
    IF NEW.satisfaction_score > 0 THEN
      v_description := v_description || ' | 评分：' || NEW.satisfaction_score || '分';
    END IF;

    -- 拦截针对 一对一干预 服务的评估产生
    IF NEW.item_title LIKE '%一对一心理咨询%' OR NEW.item_title LIKE '%干预%' THEN
      -- 插入三条 history records
      INSERT INTO history_records (child_id, title, record_type, record_date, description, status, status_color, category) VALUES
      (v_child_id, '社交能力综合评估（' || v_month || '月）', 'test', TO_CHAR(COALESCE(NEW.completed_at, NOW()), 'YYYY-MM-DD'), v_description, '已完成', 'success', 'social'),
      (v_child_id, '行为表现综合评估（' || v_month || '月）', 'test', TO_CHAR(COALESCE(NEW.completed_at, NOW()), 'YYYY-MM-DD'), v_description, '已完成', 'primary', 'behavior'),
      (v_child_id, '决策方式综合评估（' || v_month || '月）', 'test', TO_CHAR(COALESCE(NEW.completed_at, NOW()), 'YYYY-MM-DD'), v_description, '已完成', 'success', 'decision');

      -- 分发对应的测试数据
      INSERT INTO assessments (child_id, category, score, improvement, period) VALUES
      (v_child_id, 'social', 92, '+3.5%', v_period),
      (v_child_id, 'behavior', 88, '+2.1%', v_period),
      (v_child_id, 'decision', 90, '+4.0%', v_period);

    ELSE
      -- 普通活动或服务照旧生成一条
      -- 普通活动或服务照旧生成一条：先基于名称强匹配
      IF NEW.item_title LIKE '%社交%' THEN v_category := 'social';
      ELSIF NEW.item_title LIKE '%行为%' OR NEW.item_title LIKE '%专注%' THEN v_category := 'behavior';
      ELSIF NEW.item_title LIKE '%决策%' THEN v_category := 'decision';
      ELSIF NEW.item_type = 'activity' THEN
        SELECT 
          CASE
            WHEN category IN ('情绪管理', '社交') THEN 'social'
            WHEN category IN ('专注力', '感统训练', '行为规范') THEN 'behavior'
            WHEN category IN ('决策', '冲动控制') THEN 'decision'
            ELSE 'social'
          END
        INTO v_category
        FROM activities WHERE title = NEW.item_title LIMIT 1;
      END IF;

      IF v_category IS NULL THEN v_category := 'social'; END IF;

      INSERT INTO history_records (child_id, title, record_type, record_date, description, status, status_color, category)
      VALUES (
        v_child_id,
        NEW.item_title,
        CASE WHEN NEW.item_type = 'activity' THEN 'activity' ELSE 'test' END,
        TO_CHAR(COALESCE(NEW.completed_at, NOW()), 'YYYY-MM-DD'),
        v_description,
        '已完成',
        'green',
        v_category
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. 补救刷新：强制把所有历史库里带有相关名字却分错类的记录拉回正轨
UPDATE public.history_records SET category = 'social' WHERE title LIKE '%社交%';
UPDATE public.history_records SET category = 'behavior' WHERE title LIKE '%行为%';
UPDATE public.history_records SET category = 'decision' WHERE title LIKE '%决策%';
