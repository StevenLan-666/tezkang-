-- ============================================
-- 特质康+ (TezKang+) Supabase 数据库 Schema
-- 在 Supabase SQL Editor 中执行此脚本
-- 设计兼容 MySQL 迁移（避免 PostgreSQL 特有语法）
-- ============================================

-- 1. 用户档案表 (监护人信息)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name VARCHAR(100) NOT NULL DEFAULT '',
  phone VARCHAR(20) DEFAULT '',
  avatar_url TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 儿童信息表 (受监护人)
CREATE TABLE IF NOT EXISTS children (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  full_name VARCHAR(100) NOT NULL,
  age INTEGER DEFAULT 0,
  gender VARCHAR(10) DEFAULT '男',
  avatar_url TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 体格数据记录表
CREATE TABLE IF NOT EXISTS physical_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  weight DECIMAL(5, 1) NOT NULL,
  height DECIMAL(5, 1) NOT NULL,
  bmi DECIMAL(4, 1),
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. 健康指数表
CREATE TABLE IF NOT EXISTS health_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  score INTEGER NOT NULL DEFAULT 0,
  improvement VARCHAR(20) DEFAULT '',
  grade VARCHAR(20) DEFAULT '',
  heart_rate INTEGER DEFAULT 0,
  activity_minutes INTEGER DEFAULT 0,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. 评估记录表 (社交/行为/决策三维度)
CREATE TABLE IF NOT EXISTS assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  category VARCHAR(20) NOT NULL, -- 'social', 'behavior', 'decision'
  score INTEGER NOT NULL DEFAULT 0,
  improvement VARCHAR(20) DEFAULT '',
  period VARCHAR(30) NOT NULL, -- 如 '2023年 10月'
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. 评估详细维度数据
CREATE TABLE IF NOT EXISTS assessment_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  dimension_name VARCHAR(50) NOT NULL,
  dimension_value VARCHAR(50) NOT NULL,
  sort_order INTEGER DEFAULT 0
);

-- 7. 活动列表
CREATE TABLE IF NOT EXISTS activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  description TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  location VARCHAR(200) DEFAULT '',
  event_date TIMESTAMP WITH TIME ZONE,
  max_participants INTEGER DEFAULT 0,
  current_participants INTEGER DEFAULT 0,
  price DECIMAL(10, 2) DEFAULT 0,
  status VARCHAR(20) DEFAULT 'open', -- 'open', 'full', 'ended'
  category VARCHAR(50) DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. 服务列表
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  description TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  provider_name VARCHAR(100) DEFAULT '',
  provider_title VARCHAR(100) DEFAULT '',
  duration VARCHAR(50) DEFAULT '',
  rating DECIMAL(2, 1) DEFAULT 0,
  mode VARCHAR(20) DEFAULT 'offline', -- 'online', 'offline'
  price DECIMAL(10, 2) DEFAULT 0,
  status VARCHAR(20) DEFAULT 'available', -- 'available', 'unavailable'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. 报名/预约记录
CREATE TABLE IF NOT EXISTS registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  item_type VARCHAR(20) NOT NULL, -- 'activity', 'service'
  item_id TEXT DEFAULT '',
  item_title VARCHAR(200) NOT NULL,
  child_name VARCHAR(100) DEFAULT '',
  child_age INTEGER DEFAULT 0,
  child_gender VARCHAR(10) DEFAULT '',
  health_notes TEXT DEFAULT '',
  selected_date VARCHAR(50) DEFAULT '',
  selected_time VARCHAR(100) DEFAULT '',
  parent_name VARCHAR(100) DEFAULT '',
  parent_phone VARCHAR(20) DEFAULT '',
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'confirmed', 'completed', 'cancelled'
  completed_at TIMESTAMP WITH TIME ZONE,
  satisfaction_score DECIMAL(3, 1) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. 预约信息（下次预约快捷入口）
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  appointment_date VARCHAR(50) NOT NULL,
  appointment_time VARCHAR(50) NOT NULL,
  item_type VARCHAR(20) NOT NULL, -- 'activity', 'service'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. 用户反馈表
CREATE TABLE IF NOT EXISTS feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  activity_id UUID REFERENCES activities(id) ON DELETE SET NULL,
  registration_id UUID REFERENCES registrations(id) ON DELETE SET NULL,
  activity_title TEXT DEFAULT '',
  feedback_type VARCHAR(50) NOT NULL DEFAULT '普通问题',
  description TEXT NOT NULL DEFAULT '',
  allow_contact BOOLEAN DEFAULT FALSE,
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'processing', 'resolved'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. 历史记录表
CREATE TABLE IF NOT EXISTS history_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  record_type VARCHAR(20) NOT NULL, -- 'test', 'activity'
  record_date VARCHAR(50) NOT NULL,
  description TEXT DEFAULT '',
  status VARCHAR(20) DEFAULT '',
  status_color VARCHAR(20) DEFAULT 'slate',
  category VARCHAR(20) NOT NULL, -- 'social', 'behavior', 'decision'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. 活动完成报告表
CREATE TABLE IF NOT EXISTS activity_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id UUID NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
  actual_participants INTEGER NOT NULL DEFAULT 0,
  avg_duration_minutes DECIMAL(6, 1) DEFAULT 0,
  completion_rate DECIMAL(5, 2) DEFAULT 0,
  satisfaction_score DECIMAL(3, 1) DEFAULT 0,
  social_before DECIMAL(5, 1) DEFAULT 0,
  social_after DECIMAL(5, 1) DEFAULT 0,
  behavior_before DECIMAL(5, 1) DEFAULT 0,
  behavior_after DECIMAL(5, 1) DEFAULT 0,
  decision_before DECIMAL(5, 1) DEFAULT 0,
  decision_after DECIMAL(5, 1) DEFAULT 0,
  focus_before DECIMAL(5, 1) DEFAULT 0,
  focus_after DECIMAL(5, 1) DEFAULT 0,
  summary TEXT DEFAULT '',
  highlights TEXT DEFAULT '',
  recommendations TEXT DEFAULT '',
  report_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 14. 活动报告-个人明细表
CREATE TABLE IF NOT EXISTS activity_report_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID NOT NULL REFERENCES activity_reports(id) ON DELETE CASCADE,
  child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  registration_id UUID REFERENCES registrations(id) ON DELETE SET NULL,
  actual_duration_minutes DECIMAL(6, 1) DEFAULT 0,
  completed BOOLEAN DEFAULT TRUE,
  social_improvement DECIMAL(4, 1) DEFAULT 0,
  behavior_improvement DECIMAL(4, 1) DEFAULT 0,
  decision_improvement DECIMAL(4, 1) DEFAULT 0,
  focus_improvement DECIMAL(4, 1) DEFAULT 0,
  teacher_comment TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- Row Level Security (RLS) 策略
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE children ENABLE ROW LEVEL SECURITY;
ALTER TABLE physical_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE history_records ENABLE ROW LEVEL SECURITY;

-- profiles: 用户只能读写自己的档案
CREATE POLICY "profiles_select_own" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE USING (auth.uid() = id);

-- children: 通过 profile_id 关联
CREATE POLICY "children_select_own" ON children FOR SELECT USING (profile_id = auth.uid());
CREATE POLICY "children_insert_own" ON children FOR INSERT WITH CHECK (profile_id = auth.uid());
CREATE POLICY "children_update_own" ON children FOR UPDATE USING (profile_id = auth.uid());

-- physical_data: 通过 child_id 关联
CREATE POLICY "physical_data_select_own" ON physical_data FOR SELECT
  USING (child_id IN (SELECT id FROM children WHERE profile_id = auth.uid()));
CREATE POLICY "physical_data_insert_own" ON physical_data FOR INSERT
  WITH CHECK (child_id IN (SELECT id FROM children WHERE profile_id = auth.uid()));

-- health_scores
CREATE POLICY "health_scores_select_own" ON health_scores FOR SELECT
  USING (child_id IN (SELECT id FROM children WHERE profile_id = auth.uid()));

-- assessments
CREATE POLICY "assessments_select_own" ON assessments FOR SELECT
  USING (child_id IN (SELECT id FROM children WHERE profile_id = auth.uid()));

-- assessment_details
CREATE POLICY "assessment_details_select_own" ON assessment_details FOR SELECT
  USING (assessment_id IN (
    SELECT a.id FROM assessments a
    JOIN children c ON a.child_id = c.id
    WHERE c.profile_id = auth.uid()
  ));

-- activities: 所有认证用户可读
CREATE POLICY "activities_select_all" ON activities FOR SELECT USING (auth.uid() IS NOT NULL);

-- services: 所有认证用户可读
CREATE POLICY "services_select_all" ON services FOR SELECT USING (auth.uid() IS NOT NULL);

-- registrations
CREATE POLICY "registrations_select_own" ON registrations FOR SELECT USING (profile_id = auth.uid());
CREATE POLICY "registrations_insert_own" ON registrations FOR INSERT WITH CHECK (profile_id = auth.uid());
CREATE POLICY "registrations_update_own" ON registrations FOR UPDATE USING (profile_id = auth.uid());

-- appointments
CREATE POLICY "appointments_select_own" ON appointments FOR SELECT USING (profile_id = auth.uid());
CREATE POLICY "appointments_insert_own" ON appointments FOR INSERT WITH CHECK (profile_id = auth.uid());
CREATE POLICY "appointments_update_own" ON appointments FOR UPDATE USING (profile_id = auth.uid());
CREATE POLICY "appointments_delete_own" ON appointments FOR DELETE USING (profile_id = auth.uid());

-- feedback
CREATE POLICY "feedback_select_own" ON feedback FOR SELECT USING (profile_id = auth.uid());
CREATE POLICY "feedback_insert_own" ON feedback FOR INSERT WITH CHECK (profile_id = auth.uid());

-- history_records
CREATE POLICY "history_records_select_own" ON history_records FOR SELECT
  USING (child_id IN (SELECT id FROM children WHERE profile_id = auth.uid()));

-- ============================================
-- 自动创建触发器：新用户注册时自动创建 profile
-- 兼容手机号和邮箱两种注册方式
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, phone, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.phone, ''),
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 种子数据：活动和服务
-- ============================================

-- 活动种子数据
INSERT INTO activities (title, description, image_url, location, event_date, max_participants, current_participants, price, status, category) VALUES
('ADHD儿童情绪管理夏令营', '专为ADHD儿童设计的情绪调节课程，通过游戏与互动帮助孩子识别和管理情绪，提升社交能力。', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAs-Z7O0AMJ7PXGl6vZu5-FQ3JNJd9HcocBNtMZNesLFyqbBV66gKk3wClj2D80s3lak4NkghL_YnzatCTslysoVkUV5FOMq0J2JgEH1DGif3vbt8wx5RfKo_VIC3GwZZttHAcZqSLvA6NXqsdii9RxYM49Pn6LS_vY8exPRsrGXMzW5LtkPxjrmW_ZI3wsgVHuUpzg8MceH_YfhLzUXSONk4ip3z7Ao0SVjBDkPc9ZXCCuTFwBw23LoCYTFMDL3acN2MXvxxhyE80O', '市少年宫 A区', '2024-10-15 09:00:00+08', 30, 24, 299.00, 'open', '情绪管理'),
('ADHD 儿童感统专注力训练营', '本次活动旨在通过专业的感统训练，帮助 ADHD 儿童提升专注力和身体协调能力。', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBvHIqFqNvn0mAA1t9NzBOQG4bikTbxO1Zv5aOMbGfwdLtgwRr0d4Zsl1g0zucdWEHln47VYNH7HVko9erS8lvPceDhiQ72hsIxguiCZmeQDyU3dIhKhUjfNn9U5eUVsY4F9DiuARRtgnsrhhoI6rptPYQv6R2fxj7Eks2IzVoM7TyFNRIVVTT8GPo9FGrsvfSuYfMIWtmfnQxPLn2vwdQLr1Lz24kjTx126CQBYa10oDVIZwNfrs7jM_2wBZJrNvpvqoWyTIsgOm5i', '康复中心 2楼', '2024-11-15 09:00:00+08', 30, 30, 399.00, 'full', '专注力'),
('专注力绘画工作坊', '通过绘画训练提升专注力和创造力', 'https://lh3.googleusercontent.com/aida-public/AB6AXuB8JDnRUxZcdhSs2RIUoMphmWjHjIxdMKPS9R8r7aeLMsRK7p4N6ODEMGqPLPVg7Awersvv9eyxcgiv5gdGx7rzbqGDazr45UYdY4oc5icDKkuf_sCs05R2QEBymXWYRBSlcIgi1NTEXliWxc-NzBQROcQeG8g_n0cHwB2WxrEPbWog9Iikniu1v8Ok9FZjUBe4GDxGT2m1zB9Jp1n7EjCefzgJ72AL3KnLaf_PI-m0yLSEm_vXkHXExaebKnPzuBHTK0MZ3IMM9U7q', '市少年宫 C区 201室', '2024-12-01 09:00:00+08', 15, 0, 199.00, 'open', '专注力'),
('感统训练公开课', '感统训练入门体验，适合所有年龄段儿童', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAHM3FLoPnHGZFEJfG-kUDaWhxrJ_-mB12PAlVLG24yWaYzQwleryGteRZSUtaEYbcn7ruLA6_x7Ty5nPcYskQvF4cTmhfGzWhaOEzpn54S_nyfmf-LlGe90y2xIi025KELJ046vj5OCgnNB1NODq7JAp90ihPi3t5Vqsi_21II7SpdGuk-uGSaO8WbZzJFxiKbHA_FRz1dvosd9-oDGI8fPUKxRUsUwjsVnMdcFjbhm5tRYaIz_1kAfn_Nu20smrnuw_5hE86cUFQt', '康复中心 3楼大厅', '2024-09-20 09:00:00+08', 50, 50, 0.00, 'ended', '感统训练');

-- 服务种子数据
INSERT INTO services (title, description, image_url, provider_name, provider_title, duration, rating, mode, price, status) VALUES
('一对一心理咨询与行为干预', '由资深儿童心理专家提供个性化的评估与干预方案，帮助孩子改善注意力、控制冲动，并提升社交技能。', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBWgXMCoejP-ji49PT_G4y_pHGMWgzucXvI-Dfg52VVmAGQfLoZoWgPyYzeem7tJK26t-lajTAtKWNe4MQUb2x06Hj2F9cUl6Erg-KGMtvl941P4324xD8bGo0TrJwZvRdvfh-ipNmYmI76nNKvlaCBH-3oMCryWuDSU3gTw5tbhssl6b_UsfOi1KoEbiIQKaL5OQvsaE4wj8oENafpGa_6KEerhbYY6ejkMGt5FWJAB9brFxtFbmh26BCg-gbkAO4WwyIyeFzH_sCs', '李医生', '主任医师', '60分钟/次', 4.9, 'offline', 599.00, 'available'),
('家庭教育指导', '帮助家长了解ADHD儿童的特点，提供科学的家庭教育方法和策略。', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDCJhrTGsnpisibkRqqOuKw0VRd0KD2uVn6RR0_B5aVlhvR-lyWVsnTO4Uy7KblhLfvwmAwdBt20SYfb6jbsUNlLD1e52HN_26J_lJ53PlmcbeJQhaCWQyJ0aVwItN8aYIr6svWEgvruhnvlKFeXRkhodLzz4Hhjv9l7XXyduZQ4lPrM0y7maScpmOxy495VWFED0ZwQqC1BV9nQb3GASvMqMhxS3kS5oFo5MvtQLMeYmZetPAoi57cgWxI2UwdGhWSON46c6vtqoMO', '王老师', '儿童教育专家', '45分钟/次', 4.8, 'online', 299.00, 'available'),
('认知功能训练', '结合游戏化方法，系统性地提升儿童的记忆力、注意力和执行功能。', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAs-Z7O0AMJ7PXGl6vZu5-FQ3JNJd9HcocBNtMZNesLFyqbBV66gKk3wClj2D80s3lak4NkghL_YnzatCTslysoVkUV5FOMq0J2JgEH1DGif3vbt8wx5RfKo_VIC3GwZZttHAcZqSLvA6NXqsdii9RxYM49Pn6LS_vY8exPRsrGXMzW5LtkPxjrmW_ZI3wsgVHuUpzg8MceH_YfhLzUXSONk4ip3z7Ao0SVjBDkPc9ZXCCuTFwBw23LoCYTFMDL3acN2MXvxxhyE80O', '张老师', '认知训练师', '60分钟/次', 4.7, 'offline', 399.00, 'available');
