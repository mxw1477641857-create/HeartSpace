
import React, { useState } from 'react';
import { MoodEntry, MOOD_EMOJIS, MOOD_COLORS } from '../types';
import { Calendar, Save, Trash2, PenLine } from 'lucide-react';

interface MoodTrackerProps {
  history: MoodEntry[];
  onAddMood: (entry: MoodEntry) => void;
  onDeleteMood: (id: string) => void;
}

const MoodTracker: React.FC<MoodTrackerProps> = ({ history, onAddMood, onDeleteMood }) => {
  const [selectedMood, setSelectedMood] = useState<MoodEntry['mood'] | null>(null);
  const [note, setNote] = useState('');

  const handleSave = () => {
    if (!selectedMood) return;

    const newEntry: MoodEntry = {
      id: Date.now().toString(),
      date: new Date(),
      mood: selectedMood,
      note
    };

    onAddMood(newEntry);
    setSelectedMood(null);
    setNote('');
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 p-4 overflow-y-auto no-scrollbar pb-24">
      <div className="mb-6 px-2">
        <h2 className="text-2xl font-bold text-slate-800">心情日记</h2>
        <p className="text-sm text-slate-500 mt-1">记录此刻的感受，拥抱真实的自己。</p>
      </div>

      {/* Input Section */}
      <div className="bg-white p-6 rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 mb-8">
        <h3 className="text-lg font-bold text-slate-700 mb-6 flex items-center gap-2">
           今天感觉怎么样？
        </h3>
        
        <div className="flex justify-between mb-8 px-2">
          {Object.entries(MOOD_EMOJIS).map(([key, emoji]) => (
            <div key={key} className="flex flex-col items-center gap-2">
              <button
                onClick={() => setSelectedMood(key as any)}
                className={`text-4xl w-14 h-14 flex items-center justify-center rounded-2xl transition-all duration-300 transform ${
                  selectedMood === key 
                    ? 'bg-teal-100 scale-110 shadow-inner ring-2 ring-teal-200' 
                    : 'bg-slate-50 hover:bg-slate-100 hover:scale-105'
                }`}
              >
                <span className={selectedMood === key ? 'animate-bounce-short' : ''}>{emoji}</span>
              </button>
            </div>
          ))}
        </div>

        {selectedMood && (
          <div className="space-y-4 animate-fade-in-up">
            <div className="relative">
              <PenLine size={16} className="absolute top-4 left-4 text-slate-400" />
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="这一刻在想什么..."
                className="w-full pl-10 p-4 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 min-h-[120px] resize-none text-slate-700 text-sm leading-relaxed transition-all"
              />
            </div>
            <button
              onClick={handleSave}
              className="w-full py-3.5 bg-teal-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-teal-600/20 hover:bg-teal-700 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Save size={18} /> 记录心情
            </button>
          </div>
        )}
      </div>

      {/* History Section */}
      <h3 className="text-lg font-bold text-slate-700 mb-4 px-2 flex items-center gap-2">
        <Calendar size={20} className="text-teal-600" /> 历史足迹
      </h3>
      <div className="space-y-4">
        {history.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-200">
            <p className="text-slate-400">还没有记录哦，<br/>试着记录下第一篇心情吧！🌱</p>
          </div>
        ) : (
          history.map(entry => (
            <div key={entry.id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex gap-4 transition-transform hover:scale-[1.01]">
              <div className={`w-12 h-12 flex-shrink-0 rounded-2xl flex items-center justify-center text-2xl shadow-inner ${MOOD_COLORS[entry.mood].split(' ')[0]}`}>
                {MOOD_EMOJIS[entry.mood]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${MOOD_COLORS[entry.mood]}`}>
                    {entry.mood}
                  </div>
                  <button onClick={() => onDeleteMood(entry.id)} className="text-slate-300 hover:text-red-400 transition-colors p-1">
                    <Trash2 size={14} />
                  </button>
                </div>
                <p className="text-slate-700 text-sm leading-relaxed break-words mb-2">{entry.note}</p>
                <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
                  {entry.date.toLocaleDateString()} · {entry.date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MoodTracker;
