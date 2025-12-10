
import React, { useState } from 'react';
import { X, ArrowRight, Check } from 'lucide-react';

interface TutorialOverlayProps {
  onClose: () => void;
}

const TutorialOverlay: React.FC<TutorialOverlayProps> = ({ onClose }) => {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "欢迎来到 HeartSpace",
      desc: "这是专属于你的心理疗愈空间。我是你的伙伴「心语」。",
      icon: "👋"
    },
    {
      title: "随时倾诉",
      desc: "点击底部的「倾诉」按钮，随时和我聊天。无论是开心还是难过，我都在这里。",
      icon: "💬"
    },
    {
      title: "记录心情",
      desc: "在「心情」版块记录每一刻的感受，看到自己的情绪变化。",
      icon: "📅"
    },
    {
      title: "生成报告",
      desc: "当你和我聊了一段时间后，去「报告」版块，我会为你生成一份暖心的心理状态分析。",
      icon: "📄"
    }
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-teal-100 rounded-full blur-2xl -mr-10 -mt-10 opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-orange-100 rounded-full blur-2xl -ml-10 -mb-10 opacity-50"></div>

        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-300 hover:text-slate-500 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="relative z-10 flex flex-col items-center text-center mt-4">
          <div className="w-20 h-20 bg-gradient-to-br from-teal-50 to-white border border-teal-100 rounded-2xl flex items-center justify-center text-4xl shadow-sm mb-6">
            {steps[step].icon}
          </div>
          
          <h3 className="text-xl font-bold text-slate-800 mb-3">
            {steps[step].title}
          </h3>
          
          <p className="text-slate-500 text-sm leading-relaxed mb-8 min-h-[60px]">
            {steps[step].desc}
          </p>

          <div className="flex gap-1 mb-8">
            {steps.map((_, i) => (
              <div 
                key={i} 
                className={`w-2 h-2 rounded-full transition-all duration-300 ${i === step ? 'w-6 bg-teal-500' : 'bg-slate-200'}`}
              ></div>
            ))}
          </div>

          <button
            onClick={handleNext}
            className="w-full py-3.5 bg-teal-600 text-white rounded-xl font-bold shadow-lg shadow-teal-600/20 hover:bg-teal-700 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            {step === steps.length - 1 ? (
              <>开始体验 <Check size={18} /></>
            ) : (
              <>下一步 <ArrowRight size={18} /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TutorialOverlay;
