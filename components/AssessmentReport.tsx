
import React, { useState } from 'react';
import { Message, MoodEntry, AssessmentData } from '../types';
import { generatePsychologicalReport } from '../services/geminiService';
import { Sparkles, Activity, AlertCircle, Lightbulb, RefreshCcw, Download } from 'lucide-react';

interface Props {
  messages: Message[];
  moods: MoodEntry[];
  onReportGenerated?: (data: AssessmentData) => void;
}

const AssessmentReport: React.FC<Props> = ({ messages, moods, onReportGenerated }) => {
  const [report, setReport] = useState<AssessmentData | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (messages.length < 2 && moods.length === 0) {
      alert("心语需要更多一点的聊天或心情记录才能生成报告哦 🌱");
      return;
    }

    setLoading(true);
    const data = await generatePsychologicalReport(messages, moods);
    setReport(data);
    
    // Notify parent component about the new report
    if (data && onReportGenerated) {
      onReportGenerated(data);
    }
    
    setLoading(false);
  };

  const handleExport = () => {
    if (!report) return;

    const content = `
=== HeartSpace 心理成长档案 ===
生成时间: ${report.generatedDate.toLocaleString()}

【状态速览】
${report.summary}

【情绪天气】
${report.moodTrend}

【压力源识别】
${report.stressors.map(s => `- ${s}`).join('\n')}

【心语建议】
${report.suggestions.map(s => `- ${s}`).join('\n')}

【给你的寄语】
"${report.warmMessage}"

--------------------------------
*本报告由AI生成，仅供参考。
    `;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `HeartSpace_Report_${new Date().toISOString().slice(0,10)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 bg-slate-50 text-center">
        <div className="relative mb-6">
          <div className="w-20 h-20 rounded-full bg-teal-100 animate-ping absolute opacity-75"></div>
          <div className="w-20 h-20 rounded-full bg-teal-500 flex items-center justify-center relative shadow-xl z-10">
            <Sparkles className="text-white animate-spin-slow" size={32} />
          </div>
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">心语正在整理思绪...</h3>
        <p className="text-slate-500 text-sm max-w-xs">
          正在回顾我们的对话和你的心情记录，为你生成专属的暖心分析。
        </p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="flex flex-col h-full bg-slate-50 p-6 overflow-y-auto pb-24">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-800">心理成长档案</h2>
          <p className="text-sm text-slate-500 mt-1">这是属于你的心灵小结，看看这段时间的状态吧。</p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col items-center text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-indigo-50 to-teal-50 rounded-full flex items-center justify-center mb-6">
            <Activity className="text-teal-600" size={40} />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">准备好生成报告了吗？</h3>
          <p className="text-slate-500 text-sm mb-8 leading-relaxed">
            心语会根据你最近的对话和心情记录，为你生成一份非医疗性质的心理状态分析，包含情绪趋势和温暖建议。
          </p>
          <button
            onClick={handleGenerate}
            className="w-full py-4 bg-teal-600 text-white rounded-2xl font-bold shadow-lg shadow-teal-600/20 hover:bg-teal-700 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles size={20} /> 生成我的分析报告
          </button>
        </div>

        <div className="mt-8 px-4">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">报告包含</h4>
          <div className="space-y-4">
            <div className="flex gap-4 items-center">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center"><Activity size={20}/></div>
              <div className="text-sm font-medium text-slate-600">情绪天气趋势</div>
            </div>
            <div className="flex gap-4 items-center">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center"><AlertCircle size={20}/></div>
              <div className="text-sm font-medium text-slate-600">潜在压力源识别</div>
            </div>
            <div className="flex gap-4 items-center">
              <div className="w-10 h-10 rounded-xl bg-green-100 text-green-600 flex items-center justify-center"><Lightbulb size={20}/></div>
              <div className="text-sm font-medium text-slate-600">心语的专属建议</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 p-4 overflow-y-auto no-scrollbar pb-24">
      <div className="flex justify-between items-end mb-6 px-2">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">分析报告</h2>
          <p className="text-xs text-slate-400 mt-1">生成时间: {report.generatedDate.toLocaleString()}</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleExport}
            className="p-2 bg-white border border-slate-200 rounded-full text-slate-500 hover:text-teal-600 hover:border-teal-200 transition-all shadow-sm"
            title="导出/下载"
          >
            <Download size={18} />
          </button>
          <button 
            onClick={handleGenerate}
            className="p-2 bg-white border border-slate-200 rounded-full text-slate-500 hover:text-teal-600 hover:border-teal-200 transition-all shadow-sm"
            title="重新生成"
          >
            <RefreshCcw size={18} />
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Summary Card */}
        <div className="bg-gradient-to-br from-teal-500 to-emerald-600 rounded-3xl p-6 text-white shadow-lg shadow-teal-600/20 relative overflow-hidden">
          <Activity className="absolute right-4 top-4 opacity-20" size={80} />
          <h3 className="font-bold text-teal-50 mb-1 flex items-center gap-2">
            <Activity size={18} /> 状态速览
          </h3>
          <p className="text-lg font-medium leading-relaxed relative z-10">"{report.summary}"</p>
          <div className="mt-4 pt-4 border-t border-white/20">
             <div className="text-xs font-semibold uppercase tracking-wider text-teal-100 mb-1">情绪趋势</div>
             <p className="text-sm opacity-95">{report.moodTrend}</p>
          </div>
        </div>

        {/* Stressors */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
            <AlertCircle size={20} className="text-orange-500" /> 
            最近可能在烦恼...
          </h3>
          <ul className="space-y-3">
            {report.stressors.map((s, i) => (
              <li key={i} className="flex gap-3 text-sm text-slate-600 bg-orange-50/50 p-3 rounded-xl">
                <span className="text-orange-400 font-bold">•</span>
                {s}
              </li>
            ))}
          </ul>
        </div>

        {/* Suggestions */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
            <Lightbulb size={20} className="text-yellow-500" /> 
            心语的小建议
          </h3>
          <div className="space-y-4">
            {report.suggestions.map((s, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-yellow-100 text-yellow-600 flex-shrink-0 flex items-center justify-center text-xs font-bold">
                  {i + 1}
                </div>
                <p className="text-sm text-slate-600 pt-0.5">{s}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Warm Message */}
        <div className="bg-indigo-50 rounded-3xl p-6 border border-indigo-100 relative">
          <div className="absolute -top-3 -left-2 text-4xl">💌</div>
          <h3 className="font-bold text-indigo-800 mb-2 flex items-center gap-2 pl-6">
            给你的寄语
          </h3>
          <p className="text-indigo-600/80 text-sm leading-relaxed italic">
            {report.warmMessage}
          </p>
          <div className="mt-4 flex justify-end">
            <span className="text-xs font-bold text-indigo-400">—— 你的朋友 心语</span>
          </div>
        </div>
        
        <div className="flex justify-center pt-2">
          <button 
             onClick={handleExport}
             className="text-teal-600 text-sm font-medium flex items-center gap-1 hover:underline"
          >
             <Download size={14} /> 导出为文本文件
          </button>
        </div>

        <p className="text-[10px] text-slate-300 text-center pb-4">
          *本报告由AI生成，仅供参考，不作为医疗诊断依据。
        </p>
      </div>
    </div>
  );
};

export default AssessmentReport;
