export interface HistoryItem {
  id: number;
  title: string;
  type: 'test' | 'activity';
  date: string;
  desc: string;
  status: string;
  statusColor: string;
  category: 'social' | 'behavior' | 'decision';
}

export const historyData: HistoryItem[] = [
  {
    id: 1,
    title: '社交能力评估',
    type: 'test',
    date: '10月24日',
    desc: '完成了阶段性社交能力评估，各项指标表现稳定，社交主动性有所提升。',
    status: '有进步',
    statusColor: 'green',
    category: 'social'
  },
  {
    id: 101,
    title: '社交能力评估',
    type: 'test',
    date: '9月24日',
    desc: '社交互动频率增加，能够更好地理解同伴的非语言信号。',
    status: '表现稳定',
    statusColor: 'blue',
    category: 'social'
  },
  {
    id: 102,
    title: '社交能力评估',
    type: 'test',
    date: '8月24日',
    desc: '初步建立社交自信，开始尝试参与集体活动。',
    status: '已完成',
    statusColor: 'slate',
    category: 'social'
  },
  {
    id: 2,
    title: '社交技能提升班',
    type: 'activity',
    date: '10月20日',
    desc: '在小组互动中表现积极，能够主动分享玩具并与同伴进行有效沟通。',
    status: '表现稳定',
    statusColor: 'blue',
    category: 'social'
  },
  {
    id: 3,
    title: '行为规范评估',
    type: 'test',
    date: '10月22日',
    desc: '完成了行为规范阶段性评估，专注时长显著增加，冲动行为频率降低。',
    status: '有进步',
    statusColor: 'green',
    category: 'behavior'
  },
  {
    id: 201,
    title: '行为规范评估',
    type: 'test',
    date: '9月22日',
    desc: '课堂纪律意识增强，能够较好地遵循老师的指令。',
    status: '表现稳定',
    statusColor: 'blue',
    category: 'behavior'
  },
  {
    id: 202,
    title: '行为规范评估',
    type: 'test',
    date: '8月22日',
    desc: '行为习惯初步养成，冲动行为有所改善。',
    status: '已完成',
    statusColor: 'slate',
    category: 'behavior'
  },
  {
    id: 4,
    title: '行为规范指导课',
    type: 'activity',
    date: '10月18日',
    desc: '在课堂上能够遵守规则，按时完成任务，展现出良好的自律性。',
    status: '表现稳定',
    statusColor: 'blue',
    category: 'behavior'
  },
  {
    id: 5,
    title: '决策逻辑评估',
    type: 'test',
    date: '10月21日',
    desc: '完成了决策逻辑评估，在复杂情境下的判断力有所增强。',
    status: '已完成',
    statusColor: 'slate',
    category: 'decision'
  },
  {
    id: 301,
    title: '决策逻辑评估',
    type: 'test',
    date: '9月21日',
    desc: '逻辑思维能力提升，能够进行简单的因果关系分析。',
    status: '表现稳定',
    statusColor: 'blue',
    category: 'decision'
  },
  {
    id: 302,
    title: '决策逻辑评估',
    type: 'test',
    date: '8月21日',
    desc: '决策速度加快，在简单选择题中表现果断。',
    status: '已完成',
    statusColor: 'slate',
    category: 'decision'
  },
  {
    id: 6,
    title: '一对一心理咨询与行为干预',
    type: 'activity',
    date: '10月15日',
    desc: '通过情境模拟训练，孩子在面对冲突时的决策更加理性和冷静。',
    status: '有进步',
    statusColor: 'green',
    category: 'decision'
  }
];
