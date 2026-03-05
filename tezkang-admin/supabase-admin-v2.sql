-- ============================================
-- 特质康+ 后台管理系统 - 数据库扩展 v2
-- 在 Supabase SQL Editor 中执行此脚本
-- ============================================

-- 1. 扩展 registrations 表：新增服务人员指派和评价字段
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS assigned_staff VARCHAR(100) DEFAULT '';
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS staff_comment TEXT DEFAULT '';

-- 2. 创建排班表：记录服务人员的实际排班
CREATE TABLE IF NOT EXISTS staff_schedule (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_name VARCHAR(100) NOT NULL,
  registration_id UUID REFERENCES registrations(id) ON DELETE CASCADE,
  schedule_date VARCHAR(50) NOT NULL,
  schedule_time VARCHAR(100) NOT NULL,
  child_name VARCHAR(100) DEFAULT '',
  item_title VARCHAR(200) DEFAULT '',
  status VARCHAR(20) DEFAULT 'booked', -- 'booked', 'completed', 'cancelled'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 创建通知表
CREATE TABLE IF NOT EXISTS admin_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(50) NOT NULL, -- 'new_registration', 'cancelled', 'feedback'
  title VARCHAR(200) NOT NULL,
  message TEXT DEFAULT '',
  related_id UUID,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. 启用 RLS 并设置全局访问策略
ALTER TABLE staff_schedule ENABLE ROW LEVEL SECURITY;
CREATE POLICY "staff_schedule_select_all" ON staff_schedule FOR SELECT USING (true);
CREATE POLICY "staff_schedule_insert_all" ON staff_schedule FOR INSERT WITH CHECK (true);
CREATE POLICY "staff_schedule_update_all" ON staff_schedule FOR UPDATE USING (true);
CREATE POLICY "staff_schedule_delete_all" ON staff_schedule FOR DELETE USING (true);

ALTER TABLE admin_notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin_notifications_select_all" ON admin_notifications FOR SELECT USING (true);
CREATE POLICY "admin_notifications_insert_all" ON admin_notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "admin_notifications_update_all" ON admin_notifications FOR UPDATE USING (true);
CREATE POLICY "admin_notifications_delete_all" ON admin_notifications FOR DELETE USING (true);

-- 5. 创建触发器：新报名自动生成通知
CREATE OR REPLACE FUNCTION notify_new_registration()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO admin_notifications (type, title, message, related_id)
  VALUES (
    'new_registration',
    '新报名：' || NEW.item_title,
    NEW.child_name || ' 报名了 ' || NEW.item_title || '（' || CASE WHEN NEW.item_type = 'activity' THEN '活动' ELSE '服务' END || '）',
    NEW.id
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_new_registration ON registrations;
CREATE TRIGGER on_new_registration
  AFTER INSERT ON registrations
  FOR EACH ROW EXECUTE FUNCTION notify_new_registration();

-- 6. 创建触发器：报名取消自动通知
CREATE OR REPLACE FUNCTION notify_cancelled_registration()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status <> 'cancelled' AND NEW.status = 'cancelled' THEN
    INSERT INTO admin_notifications (type, title, message, related_id)
    VALUES (
      'cancelled',
      '报名取消：' || NEW.item_title,
      NEW.child_name || ' 取消了 ' || NEW.item_title || ' 的报名',
      NEW.id
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_registration_cancelled ON registrations;
CREATE TRIGGER on_registration_cancelled
  AFTER UPDATE ON registrations
  FOR EACH ROW EXECUTE FUNCTION notify_cancelled_registration();
