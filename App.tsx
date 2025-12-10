
import React, { useState, useMemo } from 'react';
import { HashRouter as Router } from 'react-router-dom';
import { MessageSquare, Heart, Wind, FileText, UserCog, LogOut } from 'lucide-react';
import ChatInterface from './components/ChatInterface';
import MoodTracker from './components/MoodTracker';
import Relaxation from './components/Relaxation';
import AssessmentReport from './components/AssessmentReport';
import CounselorDashboard from './components/CounselorDashboard';
import WelcomeScreen from './components/WelcomeScreen';
import TutorialOverlay from './components/TutorialOverlay';
import { AppView, Message, MoodEntry, UserRole, StudentProfile, AssessmentData } from './types';
import { MOCK_STUDENTS } from './services/mockData';

const App: React.FC = () => {
  const [userRole, setUserRole] = useState<UserRole>(UserRole.STUDENT);
  const [currentView, setCurrentView] = useState<AppView>(AppView.CHAT);
  
  // User Identity State
  const [userInfo, setUserInfo] = useState<{name: string, id: string, avatar: string} | null>(null);
  const [showTutorial, setShowTutorial] = useState(false);

  // Lifted State for Student View
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      text: '嗨！我是心语，你的专属树洞 🌱。\n\n今天过得怎么样？无论是开心的事，还是想找人吐槽，我都在这里陪着你哦。',
      timestamp: new Date()
    }
  ]);

  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [currentReport, setCurrentReport] = useState<AssessmentData | null>(null);

  // Handlers
  const handleLogin = (name: string, studentId: string, avatar: string) => {
    setUserInfo({ name, id: studentId, avatar });
    // Show tutorial after successful login
    setShowTutorial(true);
  };

  const handleAddMessage = (msg: Message) => {
    setMessages(prev => [...prev, msg]);
  };

  const handleAddMood = (entry: MoodEntry) => {
    setMoodHistory(prev => [entry, ...prev]);
  };

  const handleDeleteMood = (id: string) => {
    setMoodHistory(prev => prev.filter(h => h.id !== id));
  };

  const handleReportGenerated = (data: AssessmentData) => {
    setCurrentReport(data);
  };

  // Switch Role Utility
  const toggleRole = () => {
    setUserRole(prev => prev === UserRole.STUDENT ? UserRole.COUNSELOR : UserRole.STUDENT);
  };

  // Combine Real User Data with Mock Data for Counselor View
  const combinedStudents = useMemo(() => {
    if (!userInfo) return MOCK_STUDENTS;

    // Create a profile object for the current live user
    const liveStudentProfile: StudentProfile = {
      id: 'live-user',
      name: userInfo.name,
      studentId: userInfo.id,
      avatarId: userInfo.avatar, // Use real selected avatar
      avatarColor: 'bg-teal-600 text-white', // Fallback color
      riskLevel: currentReport ? 'medium' : 'low', // Simple logic for demo
      lastActive: new Date(),
      moodHistory: moodHistory,
      latestReport: currentReport
    };

    // Put the live user at the top
    return [liveStudentProfile, ...MOCK_STUDENTS.map(s => ({ ...s, avatarId: s.name[0] }))]; // Mocks use first letter as avatar fallback logic
  }, [userInfo, moodHistory, currentReport]);

  // Render Logic
  
  // 1. Show Welcome Screen if no user logged in
  if (!userInfo && userRole === UserRole.STUDENT) {
    return <WelcomeScreen onLogin={handleLogin} />;
  }

  // 2. Show Counselor Dashboard
  if (userRole === UserRole.COUNSELOR) {
    return (
      <div className="relative h-screen w-full">
        <CounselorDashboard students={combinedStudents} />
        <button 
          onClick={toggleRole}
          className="fixed bottom-4 left-4 bg-slate-800 text-white p-3 rounded-full shadow-lg z-50 hover:bg-slate-700 transition-all flex items-center gap-2 text-sm font-medium pr-4"
        >
          <LogOut size={16} /> 返回学生版
        </button>
      </div>
    );
  }

  // 3. Student View Render
  const renderStudentContent = () => {
    switch (currentView) {
      case AppView.CHAT:
        return <ChatInterface messages={messages} onAddMessage={handleAddMessage} userAvatar={userInfo?.avatar || '😊'} />;
      case AppView.MOOD:
        return <MoodTracker history={moodHistory} onAddMood={handleAddMood} onDeleteMood={handleDeleteMood} />;
      case AppView.RELAX:
        return <Relaxation />;
      case AppView.REPORT:
        // We pass a callback to capture the report when generated, so we can show it in the dashboard
        return <AssessmentReport messages={messages} moods={moodHistory} onReportGenerated={handleReportGenerated} />;
      default:
        return <ChatInterface messages={messages} onAddMessage={handleAddMessage} userAvatar={userInfo?.avatar || '😊'} />;
    }
  };

  const NavButton = ({ view, icon: Icon, label }: { view: AppView, icon: React.ElementType, label: string }) => (
    <button
      onClick={() => setCurrentView(view)}
      className={`flex flex-col items-center gap-1 transition-all w-16 ${
        currentView === view ? 'text-teal-600' : 'text-slate-400 hover:text-slate-600'
      }`}
    >
      <div className={`p-1.5 rounded-xl transition-all ${currentView === view ? 'bg-teal-50 scale-110' : 'bg-transparent'}`}>
        <Icon size={24} strokeWidth={currentView === view ? 2.5 : 2} />
      </div>
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );

  return (
    <Router>
      <div className="flex flex-col h-screen w-full max-w-md mx-auto bg-slate-50 shadow-2xl relative overflow-hidden">
        
        {/* Tutorial Overlay */}
        {showTutorial && <TutorialOverlay onClose={() => setShowTutorial(false)} />}

        {/* Role Switcher (Secret Button) */}
        <button 
          onClick={toggleRole}
          className="absolute top-2 right-2 z-50 p-2 text-slate-300 hover:text-teal-600 transition-colors opacity-50 hover:opacity-100"
          title="切换至咨询师后台"
        >
          <UserCog size={20} />
        </button>

        {/* Main Content Area */}
        <main className="flex-1 overflow-hidden relative">
          {renderStudentContent()}
        </main>

        {/* Bottom Navigation */}
        <nav className="bg-white border-t border-slate-100 pb-safe pt-2 px-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-30">
          <div className="flex justify-between items-center h-16">
            <NavButton view={AppView.CHAT} icon={MessageSquare} label="倾诉" />
            <NavButton view={AppView.MOOD} icon={Heart} label="心情" />
            <NavButton view={AppView.RELAX} icon={Wind} label="放松" />
            <NavButton view={AppView.REPORT} icon={FileText} label="报告" />
          </div>
        </nav>
      </div>
    </Router>
  );
};

export default App;
