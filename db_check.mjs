import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function check() {
    const { data: users } = await supabase.from('users').select('*').eq('account', 'tester13');
    if (!users || users.length === 0) {
        console.log('tester13 not found'); return;
    }
    const childId = users[0].child_id;
    console.log('Child ID:', childId);
    const { data: regs } = await supabase.from('registrations').select('*').eq('child_id', childId);
    console.log('Registrations:', regs.map(r => ({ id: r.id, title: r.item_title, status: r.status, type: r.item_type })));

    const { data: history } = await supabase.from('history_records').select('*').eq('child_id', childId).order('record_date', { ascending: false });
    console.log('History Records:', history.map(h => ({ title: h.title, type: h.record_type, date: h.record_date })));
}
check();
