import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://folwxlxuiltihtkdxduj.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_3DxZ-qJoxd02jrQNFzoUdw_am1Tmkw8';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function check() {
    const { data, error } = await supabase
        .from('history_records')
        .select('id, title, category, record_type, record_date')
        .eq('record_type', 'test')
        .order('created_at', { ascending: false })
        .limit(20);

    if (error) console.error(error);
    console.log(data);
}

check();
