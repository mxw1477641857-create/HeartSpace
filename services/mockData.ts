
import { StudentProfile, RiskLevel } from '../types';

const generateDate = (daysAgo: number) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date;
};

export const MOCK_STUDENTS: StudentProfile[] = [
  {
    id: 's1',
    name: '张同学',
    studentId: '2021001',
    avatarColor: 'bg-orange-100 text-orange-600',
    riskLevel: 'high',
    lastActive: generateDate(0),
    moodHistory: [
      { id: 'm1', date: generateDate(0), mood: 'sad', note: '感觉没有力气，不想去上课。' },
      { id: 'm2', date: generateDate(1), mood: 'anxious', note: '失眠到凌晨三点。' },
      { id: 'm3', date: generateDate(2), mood: 'sad', note: '我想回家。' },
    ],
    latestReport: {
      summary: "用户近期表现出持续的低落情绪和回避社交的倾向，睡眠质量受到显著影响。",
      moodTrend: "呈现持续下降趋势，焦虑与抑郁情绪交织。",
      stressors: ["学业压力", "睡眠障碍", "社交孤立"],
      suggestions: ["建议辅导员介入关注", "尝试简单的呼吸练习助眠", "鼓励参与集体活动"],
      warmMessage: "无论黑夜多么漫长，黎明终会到来。我们一直在你身边。",
      generatedDate: generateDate(0)
    }
  },
  {
    id: 's2',
    name: '李同学',
    studentId: '2021045',
    avatarColor: 'bg-blue-100 text-blue-600',
    riskLevel: 'medium',
    lastActive: generateDate(1),
    moodHistory: [
      { id: 'm1', date: generateDate(1), mood: 'anxious', note: '期末考快到了，复习不完。' },
      { id: 'm2', date: generateDate(3), mood: 'neutral', note: '一般般的一天。' },
      { id: 'm3', date: generateDate(5), mood: 'happy', note: '打球赢了！' },
    ],
    latestReport: {
      summary: "主要压力来源于即将到来的考试，存在考前焦虑，但仍保有积极的调节能力。",
      moodTrend: "波动较大，随外部事件（考试、娱乐）变化明显。",
      stressors: ["期末考试", "时间管理"],
      suggestions: ["制定合理的复习计划", "保持运动习惯"],
      warmMessage: "压力也是动力的一部分，相信你之前的努力。",
      generatedDate: generateDate(1)
    }
  },
  {
    id: 's3',
    name: '王同学',
    studentId: '2021088',
    avatarColor: 'bg-green-100 text-green-600',
    riskLevel: 'low',
    lastActive: generateDate(2),
    moodHistory: [
      { id: 'm1', date: generateDate(2), mood: 'happy', note: '图书馆的猫好可爱。' },
      { id: 'm2', date: generateDate(4), mood: 'happy', note: '食堂新菜不错。' },
    ],
    latestReport: {
      summary: "心态积极阳光，善于发现生活中的小确幸，心理韧性强。",
      moodTrend: "稳定且积极。",
      stressors: ["无明显压力源"],
      suggestions: ["继续保持", "可以尝试帮助身边焦虑的同学"],
      warmMessage: "你的笑容很有感染力，继续发光吧！",
      generatedDate: generateDate(2)
    }
  }
];
