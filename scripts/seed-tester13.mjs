/**
 * @description 为 tester13 注册账号并插入多组测试数据
 * 执行方式: node scripts/seed-tester13.mjs
 */
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://folwxlxuiltihtkdxduj.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_3DxZ-qJoxd02jrQNFzoUdw_am1Tmkw8';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvbHd4bHh1aWx0aWh0a2R4ZHVqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjM3MjE1NSwiZXhwIjoyMDg3OTQ4MTU1fQ.comlmICCJriCGp07wtLQPjFNUOMqoLys17ttA5qFwt0';

// anon client 用于注册/登录（触发 RLS 身份验证）
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
// admin client 用于数据写入（绕过 RLS）
const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const ACCOUNT = 'tester13@tezkang.local';
const PASSWORD = '7777777';
const PARENT_NAME = '郑家长';
const CHILD = { name: '郑小宇', age: 9, gender: '男' };

// 三个月的评估数据（逐月进步趋势）
const MONTHLY_DATA = [
    {
        period: '2024年 8月',
        recordedAt: '2024-08-15T10:00:00+08:00',
        recordDate: '2024-08-15',
        social: {
            score: 68, improvement: '-', details: [
                { name: '主动交流', value: '中等' }, { name: '情绪识别', value: '需改善' },
                { name: '冲突处理', value: '需改善' }, { name: '团队合作', value: '中等' }, { name: '同理心', value: '需改善' },
            ]
        },
        behavior: {
            score: 62, improvement: '-', details: [
                { name: '自律性', value: '65%' }, { name: '注意力', value: '58%' },
                { name: '对立违抗', value: '22%' }, { name: '攻击性', value: '10%' },
            ]
        },
        decision: {
            score: 55, improvement: '-', details: [
                { name: '理性', value: '35%' }, { name: '深思熟虑', value: '55%' }, { name: '独立', value: '20%' },
            ]
        },
        health: { score: 72, grade: '良', heartRate: 102, activityMin: 28 },
        physical: { weight: 30.0, height: 133 },
    },
    {
        period: '2024年 9月',
        recordedAt: '2024-09-15T10:00:00+08:00',
        recordDate: '2024-09-15',
        social: {
            score: 76, improvement: '+12%', details: [
                { name: '主动交流', value: '良好' }, { name: '情绪识别', value: '中等' },
                { name: '冲突处理', value: '中等' }, { name: '团队合作', value: '良好' }, { name: '同理心', value: '中等' },
            ]
        },
        behavior: {
            score: 70, improvement: '+13%', details: [
                { name: '自律性', value: '75%' }, { name: '注意力', value: '65%' },
                { name: '对立违抗', value: '18%' }, { name: '攻击性', value: '7%' },
            ]
        },
        decision: {
            score: 62, improvement: '+13%', details: [
                { name: '理性', value: '40%' }, { name: '深思熟虑', value: '62%' }, { name: '独立', value: '25%' },
            ]
        },
        health: { score: 78, grade: '良+', heartRate: 98, activityMin: 35 },
        physical: { weight: 31.0, height: 135 },
    },
    {
        period: '2024年 10月',
        recordedAt: '2024-10-15T10:00:00+08:00',
        recordDate: '2024-10-15',
        social: {
            score: 85, improvement: '+12%', details: [
                { name: '主动交流', value: '优秀' }, { name: '情绪识别', value: '良好' },
                { name: '冲突处理', value: '良好' }, { name: '团队合作', value: '良好' }, { name: '同理心', value: '优秀' },
            ]
        },
        behavior: {
            score: 78, improvement: '+11%', details: [
                { name: '自律性', value: '85%' }, { name: '注意力', value: '72%' },
                { name: '对立违抗', value: '15%' }, { name: '攻击性', value: '5%' },
            ]
        },
        decision: {
            score: 72, improvement: '+16%', details: [
                { name: '理性', value: '48%' }, { name: '深思熟虑', value: '72%' }, { name: '独立', value: '32%' },
            ]
        },
        health: { score: 86, grade: '优', heartRate: 92, activityMin: 48 },
        physical: { weight: 32.0, height: 137 },
    },
];

async function main() {
    console.log('========================================');
    console.log('tester13 数据种子脚本');
    console.log('========================================');

    // 1. 注册/登录
    console.log('\n[1] 注册/登录 tester13...');
    let userId;
    const { data: signInData, error: signInErr } = await supabase.auth.signInWithPassword({
        email: ACCOUNT, password: PASSWORD,
    });

    if (signInErr) {
        console.log('  账号不存在，自动注册...');
        const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({
            email: ACCOUNT, password: PASSWORD,
        });
        if (signUpErr) { console.error('  ❌ 注册失败:', signUpErr.message); return; }

        // 注册后尝试登录
        if (!signUpData.session) {
            const { data: retryData, error: retryErr } = await supabase.auth.signInWithPassword({
                email: ACCOUNT, password: PASSWORD,
            });
            if (retryErr) { console.error('  ❌ 登录失败:', retryErr.message); return; }
            userId = retryData.user.id;
        } else {
            userId = signUpData.user.id;
        }
    } else {
        userId = signInData.user.id;
    }
    console.log(`  ✅ 用户 ID: ${userId}`);

    // 2. 更新 Profile
    console.log('\n[2] 更新家长档案...');
    await adminClient.from('profiles').update({ full_name: PARENT_NAME, phone: '13800138013' }).eq('id', userId);

    // 3. 创建/获取儿童
    console.log('\n[3] 创建儿童档案...');
    let childId;
    const { data: existingChild } = await adminClient.from('children').select('id').eq('profile_id', userId).limit(1).single();
    if (existingChild) {
        childId = existingChild.id;
        console.log(`  ⚠️ 儿童已存在: ${childId}`);
        // 清理旧数据以避免重复
        console.log('  🧹 清理旧测试数据...');
        await adminClient.from('history_records').delete().eq('child_id', childId);
        await adminClient.from('assessment_details').delete().in(
            'assessment_id',
            (await adminClient.from('assessments').select('id').eq('child_id', childId)).data?.map(a => a.id) || []
        );
        await adminClient.from('assessments').delete().eq('child_id', childId);
        await adminClient.from('health_scores').delete().eq('child_id', childId);
        await adminClient.from('physical_data').delete().eq('child_id', childId);
    } else {
        const { data: newChild, error: childErr } = await adminClient.from('children').insert({
            profile_id: userId, full_name: CHILD.name, age: CHILD.age, gender: CHILD.gender,
        }).select().single();
        if (childErr) { console.error('  ❌ 创建失败:', childErr.message); return; }
        childId = newChild.id;
    }
    console.log(`  ✅ 儿童 ID: ${childId}`);

    // 4. 插入多月数据
    for (const month of MONTHLY_DATA) {
        console.log(`\n[4] 插入 ${month.period} 数据...`);

        // 体格数据
        const bmi = +(month.physical.weight / ((month.physical.height / 100) ** 2)).toFixed(1);
        await adminClient.from('physical_data').insert({
            child_id: childId, weight: month.physical.weight, height: month.physical.height, bmi,
            recorded_at: month.recordedAt,
        });

        // 健康指数
        await adminClient.from('health_scores').insert({
            child_id: childId, score: month.health.score, improvement: month.social.improvement,
            grade: month.health.grade, heart_rate: month.health.heartRate,
            activity_minutes: month.health.activityMin, recorded_at: month.recordedAt,
        });

        // 三维度评估 + 子维度 + 历史记录
        const dims = [
            { category: 'social', data: month.social, label: '社交能力综合评估', desc: `${CHILD.name}的社交互动能力评估` },
            { category: 'behavior', data: month.behavior, label: '行为表现综合评估', desc: `${CHILD.name}的课堂行为表现评估` },
            { category: 'decision', data: month.decision, label: '决策方式综合评估', desc: `${CHILD.name}的决策思维能力评估` },
        ];

        for (const dim of dims) {
            // assessment
            const { data: assessment, error: aErr } = await adminClient.from('assessments').insert({
                child_id: childId, category: dim.category, score: dim.data.score,
                improvement: dim.data.improvement, period: month.period,
                recorded_at: month.recordedAt,
            }).select().single();

            if (aErr) { console.error(`  ❌ ${dim.category} assessment 插入失败:`, aErr.message); continue; }

            // assessment_details
            await adminClient.from('assessment_details').insert(
                dim.data.details.map((d, i) => ({
                    assessment_id: assessment.id, dimension_name: d.name,
                    dimension_value: d.value, sort_order: i + 1,
                }))
            );

            // history_records
            await adminClient.from('history_records').insert({
                child_id: childId, title: `${dim.label} (${month.period.split(' ')[1]})`,
                record_type: 'test', record_date: month.recordDate,
                description: `${dim.desc}，综合得分 ${dim.data.score}`,
                status: '已完成', status_color: 'emerald', category: dim.category,
            });
        }

        console.log(`  ✅ ${month.period} 数据写入完成`);
    }

    // 5. 额外的活动类历史记录
    console.log('\n[5] 插入活动参与记录...');
    await adminClient.from('history_records').insert([
        { child_id: childId, title: 'ADHD儿童情绪管理夏令营', record_type: 'activity', record_date: '2024-10-10', description: '完成情绪管理训练课程', status: '已参加', status_color: 'teal', category: 'social' },
        { child_id: childId, title: '感统训练公开课', record_type: 'activity', record_date: '2024-09-20', description: '参与体验课程', status: '已参加', status_color: 'teal', category: 'behavior' },
        { child_id: childId, title: '专注力绘画工作坊', record_type: 'activity', record_date: '2024-08-25', description: '参与创意绘画训练', status: '已参加', status_color: 'teal', category: 'decision' },
    ]);

    await supabase.auth.signOut();

    console.log('\n========================================');
    console.log('✅ tester13 数据种子完成！');
    console.log(`  账号: tester13 / ${PASSWORD}`);
    console.log(`  家长: ${PARENT_NAME}`);
    console.log(`  儿童: ${CHILD.name} (${CHILD.age}岁, ${CHILD.gender})`);
    console.log(`  数据: 3个月 × 3维度评估 + 3条活动记录`);
    console.log('========================================');
}

main().catch(console.error);
