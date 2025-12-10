
export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isTyping?: boolean;
}

export interface MoodEntry {
  id: string;
  date: Date;
  mood: 'happy' | 'neutral' | 'sad' | 'anxious' | 'angry';
  note: string;
}

export interface AssessmentData {
  summary: string;
  moodTrend: string;
  stressors: string[];
  suggestions: string[];
  warmMessage: string;
  generatedDate: Date;
}

export enum AppView {
  CHAT = 'chat',
  MOOD = 'mood',
  RELAX = 'relax',
  REPORT = 'report'
}

export enum UserRole {
  STUDENT = 'student',
  COUNSELOR = 'counselor'
}

export type RiskLevel = 'high' | 'medium' | 'low';

export interface StudentProfile {
  id: string;
  name: string;
  studentId: string;
  avatarId: string; // New field for avatar emoji
  avatarColor?: string; // CSS styling for avatar
  riskLevel: RiskLevel;
  lastActive: Date;
  moodHistory: MoodEntry[];
  latestReport: AssessmentData | null;
}

export const MOOD_EMOJIS: Record<string, string> = {
  happy: '😊',
  neutral: '😐',
  sad: '😔',
  anxious: '😰',
  angry: '😠'
};

export const MOOD_COLORS: Record<string, string> = {
  happy: 'bg-yellow-100 text-yellow-600 border-yellow-200',
  neutral: 'bg-gray-100 text-gray-600 border-gray-200',
  sad: 'bg-blue-100 text-blue-600 border-blue-200',
  anxious: 'bg-purple-100 text-purple-600 border-purple-200',
  angry: 'bg-red-100 text-red-600 border-red-200'
};
