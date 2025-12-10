
import React, { useState } from 'react';
import { Heart, ArrowRight, Sparkles } from 'lucide-react';

interface WelcomeScreenProps {
  onLogin: (name: string, studentId: string, avatar: string) => void;
}

const AVATARS = ['🐻', '🐱', '🐰', '🦊', '🦁', '🐼', '🐨', '🐸'];

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[1]); // Default cat
  const [isAnimating, setIsAnimating] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && studentId.trim()) {
      setIsAnimating(true);
      // Delay slightly for animation effect
      setTimeout(() => {
        onLogin(name, studentId, selectedAvatar);
      }, 800);
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center min-h-full p-8 bg-gradient-to-b from-teal-50 to-white transition-opacity duration-700 overflow-y-auto ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
      
      <div className="mb-6 text-center relative mt-4">
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-32 h-32 bg-teal-200 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="w-16 h-16 bg-teal-600 rounded-2xl rotate-3 flex items-center justify-center mx-auto shadow-xl shadow-teal-600/20 mb-4 relative z-10">
          <Heart className="text-white" size={32} fill="white" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800 mb-1 tracking-tight">HeartSpace</h1>
        <p className="text-teal-600 font-medium text-sm">心语 · 你的心灵树洞</p>
      </div>

      <div className="w-full max-w-xs bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 mb-8">
        <h2 className="text-base font-bold text-slate-700 mb-4 flex items-center gap-2">
          <Sparkles size={16} className="text-amber-400" /> 创建你的档案
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Avatar Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">选择一个代表你的头像</label>
            <div className="grid grid-cols-4 gap-2 mb-2">
              {AVATARS.map((avatar) => (
                <button
                  key={avatar}
                  type="button"
                  onClick={() => setSelectedAvatar(avatar)}
                  className={`aspect-square rounded-xl text-2xl flex items-center justify-center transition-all ${
                    selectedAvatar === avatar 
                      ? 'bg-teal-100 ring-2 ring-teal-500 scale-110 shadow-md' 
                      : 'bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  {avatar}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">姓名 / 昵称</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="怎么称呼你呢？"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all placeholder:text-slate-300 text-sm"
              required
            />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">学号 / ID</label>
            <input
              type="text"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder="请输入你的学号"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all placeholder:text-slate-300 text-sm"
              required
            />
          </div>

          <button
            type="submit"
            disabled={!name || !studentId}
            className={`w-full py-3.5 mt-2 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-all transform ${
              name && studentId 
                ? 'bg-teal-600 hover:bg-teal-700 shadow-teal-600/30 hover:-translate-y-1' 
                : 'bg-slate-300 cursor-not-allowed'
            }`}
          >
            进入空间 <ArrowRight size={18} />
          </button>
        </form>
      </div>

      <p className="text-[10px] text-slate-400 text-center max-w-[200px] leading-relaxed">
        在这里，你的每一次倾诉都会被温柔以待。<br/>我们将严格保护你的隐私。
      </p>
    </div>
  );
};

export default WelcomeScreen;
