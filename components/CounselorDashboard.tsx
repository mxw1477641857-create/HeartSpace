
import React, { useState, useEffect } from 'react';
import { StudentProfile, RiskLevel, MOOD_EMOJIS, MOOD_COLORS } from '../types';
import { Search, Activity, User, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

// Props definition
interface CounselorDashboardProps {
  students: StudentProfile[];
}

const RiskBadge: React.FC<{ level: RiskLevel }> = ({ level }) => {
  const config = {
    high: { color: 'bg-red-100 text-red-600 border-red-200', icon: AlertTriangle, text: '高风险' },
    medium: { color: 'bg-orange-100 text-orange-600 border-orange-200', icon: Activity, text: '关注' },
    low: { color: 'bg-green-100 text-green-600 border-green-200', icon: CheckCircle, text: '平稳' },
  };
  const { color, icon: Icon, text } = config[level];
  
  return (
    <span className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold border ${color}`}>
      <Icon size={12} /> {text}
    </span>
  );
};

const CounselorDashboard: React.FC<CounselorDashboardProps> = ({ students }) => {
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Automatically select the first student (usually the live user) if none selected
  useEffect(() => {
    if (!selectedStudent && students.length > 0) {
      setSelectedStudent(students[0]);
    }
  }, [students]);

  const filteredStudents = students.filter(s => 
    s.name.includes(searchTerm) || s.studentId.includes(searchTerm)
  );

  return (
    <div className="flex h-screen w-full bg-slate-100 text-slate-800 font-sans">
      {/* Sidebar / Student List */}
      <div className="w-80 bg-white border-r border-slate-200 flex flex-col h-full flex-shrink-0">
        <div className="p-5 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-4">
             🎓 心语咨询后台
          </h2>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="搜索姓名或学号..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredStudents.map(student => (
            <div 
              key={student.id}
              onClick={() => setSelectedStudent(student)}
              className={`p-4 border-b border-slate-50 cursor-pointer transition-colors hover:bg-slate-50 ${
                selectedStudent?.id === student.id ? 'bg-teal-50 border-l-4 border-l-teal-500' : 'border-l-4 border-l-transparent'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                  {/* Avatar Rendering */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-sm ${student.avatarId.match(/[\u{1F300}-\u{1F6FF}]/u) ? 'bg-white border border-slate-100' : student.avatarColor}`}>
                    {student.avatarId}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-700">{student.name}</h3>
                    <p className="text-xs text-slate-400">ID: {student.studentId}</p>
                  </div>
                </div>
                <RiskBadge level={student.riskLevel} />
              </div>
              <div className="flex items-center justify-between mt-2">
                 <p className="text-xs text-slate-500 truncate max-w-[140px]">
                   {student.latestReport?.summary.substring(0, 15) || "暂无评估报告..."}
                 </p>
                 <span className="text-[10px] text-slate-300">{student.lastActive.toLocaleDateString()}</span>
              </div>
            </div>
          ))}
          {filteredStudents.length === 0 && (
            <div className="p-8 text-center text-slate-400 text-sm">
              未找到匹配的学生
            </div>
          )}
        </div>
      </div>

      {/* Main Content / Detail View */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50">
        {selectedStudent ? (
          <div className="flex-1 overflow-y-auto p-8">
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-4">
                 <div className="w-16 h-16 bg-white border border-slate-200 rounded-full flex items-center justify-center text-3xl shadow-sm">
                   {selectedStudent.avatarId}
                 </div>
                 <div>
                    <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                      {selectedStudent.name} 
                      <span className="text-lg font-normal text-slate-400">#{selectedStudent.studentId}</span>
                    </h1>
                    <p className="text-slate-500 mt-2 flex items-center gap-2">
                      <Clock size={16} /> 最近活跃: {selectedStudent.lastActive.toLocaleString()}
                    </p>
                 </div>
              </div>
              
              <div className="flex gap-3">
                <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 text-sm font-medium hover:bg-slate-50">查看完整聊天记录</button>
                <button className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 shadow-lg shadow-teal-600/20">导出评估报告</button>
              </div>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Col: Report & Summary */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* AI Summary Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                  <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                    <Activity className="text-teal-600" size={20} /> AI 心理综合评估
                  </h3>
                  {selectedStudent.latestReport ? (
                    <>
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-4">
                        <p className="text-slate-700 leading-relaxed font-medium">"{selectedStudent.latestReport.summary}"</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-xs font-bold text-slate-400 uppercase">情绪趋势</span>
                          <p className="text-sm text-slate-600 mt-1">{selectedStudent.latestReport.moodTrend}</p>
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-400 uppercase">生成时间</span>
                          <p className="text-sm text-slate-600 mt-1">{selectedStudent.latestReport.generatedDate.toLocaleString()}</p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="bg-slate-50 p-8 rounded-xl border border-dashed border-slate-200 text-center">
                      <p className="text-slate-400 text-sm">该学生暂无生成的AI评估报告</p>
                    </div>
                  )}
                </div>

                {/* Stressors & Suggestions - Only show if report exists */}
                {selectedStudent.latestReport && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                      <h3 className="font-bold text-slate-700 mb-4 text-sm uppercase tracking-wider text-orange-600">识别压力源</h3>
                      <ul className="space-y-2">
                        {selectedStudent.latestReport.stressors.map((s, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-slate-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span> {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                      <h3 className="font-bold text-slate-700 mb-4 text-sm uppercase tracking-wider text-teal-600">AI 建议</h3>
                      <ul className="space-y-2">
                        {selectedStudent.latestReport.suggestions.map((s, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-slate-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span> {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Col: Mood History */}
              <div className="lg:col-span-1">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full">
                  <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                    <Activity size={20} /> 近期心情日记
                  </h3>
                  <div className="relative border-l border-slate-100 ml-3 space-y-6 py-2">
                    {selectedStudent.moodHistory.length > 0 ? (
                      selectedStudent.moodHistory.map((mood) => (
                        <div key={mood.id} className="relative pl-6">
                          <span className="absolute -left-3 top-0 w-6 h-6 bg-white border border-slate-100 rounded-full flex items-center justify-center text-xs shadow-sm z-10">
                            {MOOD_EMOJIS[mood.mood]}
                          </span>
                          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                            <div className="flex justify-between items-center mb-1">
                              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${MOOD_COLORS[mood.mood]}`}>
                                {mood.mood.toUpperCase()}
                              </span>
                              <span className="text-[10px] text-slate-400">{mood.date.toLocaleDateString()}</span>
                            </div>
                            <p className="text-xs text-slate-600 italic">"{mood.note}"</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-400 text-xs pl-6">暂无心情记录</p>
                    )}
                  </div>
                </div>
              </div>

            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-400">
            <User size={48} className="mb-4 opacity-20" />
            <p>请从左侧选择一名学生查看档案</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CounselorDashboard;
