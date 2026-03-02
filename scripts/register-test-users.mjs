/**
 * @description 自动注册 10 个测试用户脚本
 * 使用 Supabase JS SDK 批量注册用户
 * 执行方式: node scripts/register-test-users.mjs
 */
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://folwxlxuiltihtkdxduj.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_3DxZ-qJoxd02jrQNFzoUdw_am1Tmkw8';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 10 组测试用户数据
const TEST_USERS = [
    { account: 'testuser01@tezkang.local', password: 'Test123456', name: '张家长', childName: '张小明', childAge: 8, childGender: '男' },
    { account: 'testuser02@tezkang.local', password: 'Test123456', name: '李家长', childName: '李小红', childAge: 7, childGender: '女' },
    { account: 'testuser03@tezkang.local', password: 'Test123456', name: '王家长', childName: '王小华', childAge: 9, childGender: '男' },
    { account: 'testuser04@tezkang.local', password: 'Test123456', name: '赵家长', childName: '赵小亮', childAge: 6, childGender: '男' },
    { account: 'testuser05@tezkang.local', password: 'Test123456', name: '刘家长', childName: '刘小美', childAge: 10, childGender: '女' },
    { account: 'testuser06@tezkang.local', password: 'Test123456', name: '陈家长', childName: '陈小杰', childAge: 8, childGender: '男' },
    { account: 'testuser07@tezkang.local', password: 'Test123456', name: '杨家长', childName: '杨小芳', childAge: 7, childGender: '女' },
    { account: 'testuser08@tezkang.local', password: 'Test123456', name: '周家长', childName: '周小强', childAge: 11, childGender: '男' },
    { account: 'testuser09@tezkang.local', password: 'Test123456', name: '吴家长', childName: '吴小丽', childAge: 9, childGender: '女' },
    { account: 'testuser10@tezkang.local', password: 'Test123456', name: '孙家长', childName: '孙小飞', childAge: 8, childGender: '男' },
];

// 各用户的测试数据差异化配置
const USER_DATA_CONFIGS = [
    { healthScore: 85, socialScore: 72, behaviorScore: 68, decisionScore: 65, weight: 32.5, height: 138, heartRate: 98, activityMin: 45 },
    { healthScore: 78, socialScore: 80, behaviorScore: 62, decisionScore: 70, weight: 26.0, height: 125, heartRate: 95, activityMin: 50 },
    { healthScore: 92, socialScore: 88, behaviorScore: 85, decisionScore: 75, weight: 35.0, height: 142, heartRate: 90, activityMin: 60 },
    { healthScore: 65, socialScore: 55, behaviorScore: 50, decisionScore: 48, weight: 22.0, height: 118, heartRate: 105, activityMin: 25 },
    { healthScore: 88, socialScore: 82, behaviorScore: 78, decisionScore: 80, weight: 38.0, height: 148, heartRate: 88, activityMin: 55 },
    { healthScore: 72, socialScore: 60, behaviorScore: 65, decisionScore: 58, weight: 30.0, height: 135, heartRate: 100, activityMin: 35 },
    { healthScore: 80, socialScore: 75, behaviorScore: 72, decisionScore: 68, weight: 25.5, height: 123, heartRate: 96, activityMin: 40 },
    { healthScore: 70, socialScore: 58, behaviorScore: 55, decisionScore: 52, weight: 42.0, height: 155, heartRate: 92, activityMin: 30 },
    { healthScore: 90, socialScore: 85, behaviorScore: 82, decisionScore: 78, weight: 33.0, height: 140, heartRate: 94, activityMin: 50 },
    { healthScore: 76, socialScore: 68, behaviorScore: 70, decisionScore: 60, weight: 31.0, height: 136, heartRate: 97, activityMin: 38 },
];

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function registerUser(user, index) {
    console.log(`\n[${index + 1}/10] 注册用户: ${user.account}`);

    // 注册
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: user.account,
        password: user.password,
    });

    if (signUpError) {
        if (signUpError.message.includes('already registered') || signUpError.message.includes('already been registered')) {
            console.log(`  ⚠️ 用户已存在，尝试登录...`);
            const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
                email: user.account,
                password: user.password,
            });
            if (signInError) {
                console.error(`  ❌ 登录失败: ${signInError.message}`);
                return null;
            }
            return signInData.user;
        }
        console.error(`  ❌ 注册失败: ${signUpError.message}`);
        return null;
    }

    console.log(`  ✅ 注册成功, UID: ${signUpData.user?.id}`);
    return signUpData.user;
}

async function populateUserData(userId, user, config, index) {
    console.log(`  📝 写入测试数据...`);

    // 更新 profile
    const { error: profileError } = await supabase
        .from('profiles')
        .update({ full_name: user.name, phone: `1380013800${index + 1}` })
        .eq('id', userId);

    if (profileError) {
        console.error(`  ❌ Profile 更新失败: ${profileError.message}`);
        return;
    }

    // 创建儿童
    const { data: childData, error: childError } = await supabase
        .from('children')
        .insert({
            profile_id: userId,
            full_name: user.childName,
            age: user.childAge,
            gender: user.childGender,
        })
        .select()
        .single();

    if (childError) {
        if (childError.message.includes('duplicate') || childError.code === '23505') {
            console.log(`  ⚠️ 儿童已存在，跳过创建`);
            const { data: existingChild } = await supabase
                .from('children')
                .select('id')
                .eq('profile_id', userId)
                .limit(1)
                .single();
            if (!existingChild) return;
            await insertChildData(existingChild.id, userId, user, config, index);
            return;
        }
        console.error(`  ❌ 儿童创建失败: ${childError.message}`);
        return;
    }

    await insertChildData(childData.id, userId, user, config, index);
}

async function insertChildData(childId, userId, user, config, index) {
    const bmi = +(config.weight / ((config.height / 100) ** 2)).toFixed(1);
    const improvement = `+${(Math.random() * 4 + 1).toFixed(1)}%`;

    // 体格数据（3 条历史）
    await supabase.from('physical_data').insert([
        { child_id: childId, weight: config.weight - 2, height: config.height - 5, bmi: +((config.weight - 2) / (((config.height - 5) / 100) ** 2)).toFixed(1), recorded_at: '2024-07-01T10:00:00+08:00' },
        { child_id: childId, weight: config.weight - 1, height: config.height - 2, bmi: +((config.weight - 1) / (((config.height - 2) / 100) ** 2)).toFixed(1), recorded_at: '2024-08-15T10:00:00+08:00' },
        { child_id: childId, weight: config.weight, height: config.height, bmi, recorded_at: '2024-10-01T10:00:00+08:00' },
    ]);

    // 健康指数（3 个月趋势）
    await supabase.from('health_scores').insert([
        { child_id: childId, score: config.healthScore - 13, improvement: '+1.5%', grade: '良', heart_rate: config.heartRate + 4, activity_minutes: config.activityMin - 15, recorded_at: '2024-07-15T10:00:00+08:00' },
        { child_id: childId, score: config.healthScore - 7, improvement: '+3.2%', grade: '良+', heart_rate: config.heartRate + 2, activity_minutes: config.activityMin - 10, recorded_at: '2024-08-15T10:00:00+08:00' },
        { child_id: childId, score: config.healthScore, improvement, grade: config.healthScore >= 85 ? '优+' : config.healthScore >= 75 ? '良+' : '良', heart_rate: config.heartRate, activity_minutes: config.activityMin, recorded_at: '2024-10-01T10:00:00+08:00' },
    ]);

    // 三维度评估
    const dimensions = ['social', 'behavior', 'decision'];
    const scores = [config.socialScore, config.behaviorScore, config.decisionScore];
    const dimLabels = [
        ['主动交流', '情绪识别', '冲突处理', '团队合作', '同理心'],
        ['课堂纪律', '任务完成', '情绪控制', '规则遵守', '自我管理'],
        ['独立思考', '风险评估', '目标设定', '方案比较', '后果预判'],
    ];
    const valueOptions = ['优秀', '良好', '中等', '需改善'];

    for (let d = 0; d < 3; d++) {
        const { data: assessment } = await supabase
            .from('assessments')
            .insert({
                child_id: childId,
                category: dimensions[d],
                score: scores[d],
                improvement: `+${(Math.random() * 5 + 2).toFixed(1)}%`,
                period: '2024年 10月',
                recorded_at: '2024-10-15T10:00:00+08:00',
            })
            .select()
            .single();

        if (assessment) {
            await supabase.from('assessment_details').insert(
                dimLabels[d].map((name, i) => ({
                    assessment_id: assessment.id,
                    dimension_name: name,
                    dimension_value: valueOptions[Math.min(Math.floor((100 - scores[d]) / 20) + (i % 3), 3)],
                    sort_order: i + 1,
                }))
            );
        }
    }

    // 历史记录
    await supabase.from('history_records').insert([
        { child_id: childId, title: '社交能力综合评估 (10月)', record_type: 'test', record_date: '2024-10-15', description: `${user.childName}的社交互动能力有进步`, status: '已完成', status_color: 'emerald', category: 'social' },
        { child_id: childId, title: '行为表现综合评估 (10月)', record_type: 'test', record_date: '2024-10-15', description: `${user.childName}的课堂行为有改善`, status: '已完成', status_color: 'blue', category: 'behavior' },
        { child_id: childId, title: '决策方式综合评估 (10月)', record_type: 'test', record_date: '2024-10-15', description: `${user.childName}的决策能力提升中`, status: '已完成', status_color: 'purple', category: 'decision' },
        { child_id: childId, title: 'ADHD儿童情绪管理夏令营', record_type: 'activity', record_date: '2024-10-15', description: '完成情绪管理训练', status: '已参加', status_color: 'teal', category: 'social' },
        { child_id: childId, title: '感统训练公开课', record_type: 'activity', record_date: '2024-09-20', description: '参与体验课程', status: '已参加', status_color: 'teal', category: 'behavior' },
    ]);

    // 预约
    await supabase.from('appointments').insert({
        profile_id: userId,
        title: '专注力绘画工作坊',
        appointment_date: '12月1日',
        appointment_time: '09:00',
        item_type: 'activity',
    });

    // 反馈
    await supabase.from('feedback').insert({
        profile_id: userId,
        feedback_type: '建议',
        description: `${user.name}的反馈：希望增加更多适合${user.childAge}岁孩子的活动。`,
        allow_contact: true,
        status: 'pending',
    });

    console.log(`  ✅ 测试数据写入完成 (${user.childName})`);
}

async function main() {
    console.log('========================================');
    console.log('特质康+ 自动化测试数据生成');
    console.log('========================================');

    let successCount = 0;

    for (let i = 0; i < TEST_USERS.length; i++) {
        const user = TEST_USERS[i];
        const config = USER_DATA_CONFIGS[i];

        const registeredUser = await registerUser(user, i);
        if (registeredUser) {
            // 登录该用户以确保 RLS 权限
            const { error: loginErr } = await supabase.auth.signInWithPassword({
                email: user.account,
                password: user.password,
            });

            if (loginErr) {
                console.error(`  ❌ 登录失败: ${loginErr.message}`);
                continue;
            }

            await populateUserData(registeredUser.id, user, config, i);
            successCount++;
        }

        // 避免频率限制
        await delay(1500);
    }

    // 登出
    await supabase.auth.signOut();

    console.log('\n========================================');
    console.log(`完成！成功创建 ${successCount}/10 个测试用户`);
    console.log('========================================');
    console.log('\n测试账号列表：');
    TEST_USERS.forEach((u, i) => {
        console.log(`  ${i + 1}. ${u.account} / ${u.password} (${u.name} → ${u.childName})`);
    });
}

main().catch(console.error);
