export type MentorMode = 'coach' | 'teacher' | 'debugger' | 'interviewer' | 'reflection';

export interface ChatSession {
  id: string;
  userId: string;
  mode: MentorMode;
  conceptSlug?: string;
  createdAt: Date;
  title?: string;
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: Date;
}

export const MENTOR_MODE_LABELS: Record<MentorMode, string> = {
  coach: 'Coach',
  teacher: 'Teacher',
  debugger: 'Debugger',
  interviewer: 'Interviewer',
  reflection: 'Reflection'
};

export const MENTOR_MODE_DESCRIPTIONS: Record<MentorMode, string> = {
  coach: 'Hints and guiding questions to help you find the answer',
  teacher: 'Clear explanations with examples and analogies',
  debugger: 'Help solving code issues step by step',
  interviewer: 'Tests your comprehension with targeted questions',
  reflection: 'Turns confusion into notes, principles, and next steps'
};
