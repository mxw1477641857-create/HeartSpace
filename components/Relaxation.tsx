import React, { useState, useEffect } from 'react';
import { Play, Pause, Wind } from 'lucide-react';

const Relaxation: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [instruction, setInstruction] = useState("准备开始");
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (isActive) {
      interval = setInterval(() => {
        setTimer((prev) => {
          const cycle = prev % 8; // 8 second cycle (4 in, 4 out)
          if (cycle < 4) {
            setInstruction("吸气... (Inhale)");
          } else {
            setInstruction("呼气... (Exhale)");
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      setInstruction("点击开始深呼吸练习");
      setTimer(0);
    }

    return () => clearInterval(interval);
  }, [isActive]);

  const toggleBreathing = () => {
    setIsActive(!isActive);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 bg-gradient-to-b from-teal-50 to-white">
      <h2 className="text-2xl font-bold text-teal-800 mb-2">呼吸空间</h2>
      <p className="text-teal-600 mb-8 text-center max-w-xs">
        跟随圆圈的节奏，慢慢吸气，慢慢呼气。让焦虑随风而去。
      </p>

      <div className="relative w-64 h-64 flex items-center justify-center mb-10">
        {/* Animated Background Circle */}
        <div 
          className={`absolute inset-0 bg-teal-200 rounded-full transition-all duration-[4000ms] ease-in-out opacity-30 blur-xl ${isActive ? (timer % 8 < 4 ? 'scale-125' : 'scale-75') : 'scale-100'}`}
        ></div>
        
        {/* Main Breathing Circle */}
        <div 
          className={`w-48 h-48 bg-teal-400 rounded-full flex items-center justify-center shadow-lg transition-all duration-[4000ms] ease-in-out z-10 ${isActive ? (timer % 8 < 4 ? 'scale-110 opacity-90' : 'scale-90 opacity-80') : 'scale-100'}`}
        >
          <div className="text-white text-xl font-medium text-center px-4">
            {instruction}
          </div>
        </div>
      </div>

      <button
        onClick={toggleBreathing}
        className={`flex items-center gap-2 px-8 py-4 rounded-full text-lg font-semibold shadow-md transition-all ${
          isActive 
            ? 'bg-amber-100 text-amber-600 hover:bg-amber-200' 
            : 'bg-teal-600 text-white hover:bg-teal-700'
        }`}
      >
        {isActive ? <><Pause size={24} /> 暂停练习</> : <><Play size={24} /> 开始练习</>}
      </button>

      <div className="mt-12 p-4 bg-white rounded-xl shadow-sm border border-teal-100 w-full max-w-sm">
        <h3 className="flex items-center gap-2 font-semibold text-teal-800 mb-2">
          <Wind size={20} /> 为什么深呼吸？
        </h3>
        <p className="text-sm text-gray-600">
          深呼吸可以激活副交感神经系统，帮助降低心率，减少压力荷尔蒙，让你在几分钟内恢复平静。
        </p>
      </div>
    </div>
  );
};

export default Relaxation;