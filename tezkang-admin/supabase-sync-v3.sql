-- ============================================
-- 特质康+ 数据同步触发器 v3
-- 在 Supabase SQL Editor 中执行此脚本
-- ============================================

-- 1. 给 activities 和 services 表添加 category_tags 字段
-- 用于在三维页面中按分类推荐活动/服务（social/behavior/decision）
ALTER TABLE activities ADD COLUMN IF NOT EXISTS category_tags TEXT[] DEFAULT '{}';
ALTER TABLE services ADD COLUMN IF NOT EXISTS category_tags TEXT[] DEFAULT '{}';

-- 2. 更新现有数据的分类标签
UPDATE activities SET category_tags = '{social}' WHERE category = '情绪管理';
UPDATE activities SET category_tags = '{behavior}' WHERE category = '专注力';
UPDATE activities SET category_tags = '{behavior,decision}' WHERE category = '感统训练';
UPDATE services SET category_tags = '{social,behavior}' WHERE title LIKE '%心理咨询%';
UPDATE services SET category_tags = '{social}' WHERE title LIKE '%家庭教育%';
UPDATE services SET category_tags = '{behavior,decision}' WHERE title LIKE '%认知功能%';

-- 3. 创建触发器：报名完成时自动写入 history_records
CREATE OR REPLACE FUNCTION sync_completed_to_history()
RETURNS TRIGGER AS $$
DECLARE
  v_child_id UUID;
  v_category VARCHAR(20);
  v_description TEXT;
BEGIN
  -- 仅在状态从非 completed 变为 completed 时触发
  IF OLD.status <> 'completed' AND NEW.status = 'completed' THEN
    v_child_id := NEW.child_id;

    -- 根据活动类型推断分类
    -- 查询活动的 category 来决定分类
    IF NEW.item_type = 'activity' THEN
      SELECT COALESCE(
        CASE
          WHEN category IN ('情绪管理', '社交') THEN 'social'
          WHEN category IN ('专注力', '感统训练', '行为规范') THEN 'behavior'
          WHEN category IN ('决策', '冲动控制') THEN 'decision'
          ELSE 'social'
        END,
        'social'
      ) INTO v_category
      FROM activities WHERE title = NEW.item_title LIMIT 1;
    ELSE
      v_category := 'social'; -- 服务默认归类为social
    END IF;

    -- 如果没找到分类，默认 social
    IF v_category IS NULL THEN
      v_category := 'social';
    END IF;

    -- 构造描述，包含教师评语
    v_description := NEW.item_title;
    IF NEW.staff_comment IS NOT NULL AND NEW.staff_comment <> '' THEN
      v_description := v_description || ' | 教师评语：' || NEW.staff_comment;
    END IF;
    IF NEW.satisfaction_score > 0 THEN
      v_description := v_description || ' | 评分：' || NEW.satisfaction_score || '分';
    END IF;

    INSERT INTO history_records (child_id, title, record_type, record_date, description, status, status_color, category)
    VALUES (
      v_child_id,
      NEW.item_title,
      CASE WHEN NEW.item_type = 'activity' THEN 'activity' ELSE 'test' END,
      TO_CHAR(COALESCE(NEW.completed_at, NOW()), 'YYYY年MM月DD日'),
      v_description,
      '已完成',
      'green',
      v_category
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_registration_completed ON registrations;
CREATE TRIGGER on_registration_completed
  AFTER UPDATE ON registrations
  FOR EACH ROW EXECUTE FUNCTION sync_completed_to_history();
