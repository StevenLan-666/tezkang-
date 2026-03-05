-- ============================================
-- 特质康+ 后台管理系统 - RLS 策略扩展
-- 为所有认证用户添加全局读取权限（管理端使用）
-- 在 Supabase SQL Editor 中执行此脚本
-- ============================================

-- profiles: 管理端可以读取所有用户
CREATE POLICY "profiles_select_all" ON profiles
  FOR SELECT USING (true);

-- children: 管理端可以读取所有儿童
CREATE POLICY "children_select_all" ON children
  FOR SELECT USING (true);

-- physical_data: 管理端可以读取所有体格数据
CREATE POLICY "physical_data_select_all" ON physical_data
  FOR SELECT USING (true);

-- health_scores: 管理端可以读取所有健康评分
CREATE POLICY "health_scores_select_all" ON health_scores
  FOR SELECT USING (true);

-- assessments: 管理端可以读取所有评估
CREATE POLICY "assessments_select_all" ON assessments
  FOR SELECT USING (true);

-- assessment_details: 管理端可以读取所有评估详情
CREATE POLICY "assessment_details_select_all" ON assessment_details
  FOR SELECT USING (true);

-- registrations: 管理端可以读写所有报名
CREATE POLICY "registrations_select_all" ON registrations
  FOR SELECT USING (true);
CREATE POLICY "registrations_update_all" ON registrations
  FOR UPDATE USING (true);

-- feedback: 管理端可以读写所有反馈
CREATE POLICY "feedback_select_all" ON feedback
  FOR SELECT USING (true);
CREATE POLICY "feedback_update_all" ON feedback
  FOR UPDATE USING (true);

-- history_records: 管理端可以读取所有历史记录
CREATE POLICY "history_records_select_all" ON history_records
  FOR SELECT USING (true);

-- activities: 管理端可以完整 CRUD
CREATE POLICY "activities_insert_admin" ON activities
  FOR INSERT WITH CHECK (true);
CREATE POLICY "activities_update_admin" ON activities
  FOR UPDATE USING (true);
CREATE POLICY "activities_delete_admin" ON activities
  FOR DELETE USING (true);

-- services: 管理端可以完整 CRUD
CREATE POLICY "services_insert_admin" ON services
  FOR INSERT WITH CHECK (true);
CREATE POLICY "services_update_admin" ON services
  FOR UPDATE USING (true);
CREATE POLICY "services_delete_admin" ON services
  FOR DELETE USING (true);

-- activity_reports: 管理端可以读取所有报告
ALTER TABLE activity_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "activity_reports_select_all" ON activity_reports
  FOR SELECT USING (true);

-- activity_report_details: 管理端可以读取所有明细
ALTER TABLE activity_report_details ENABLE ROW LEVEL SECURITY;
CREATE POLICY "activity_report_details_select_all" ON activity_report_details
  FOR SELECT USING (true);
