"use client";

import { create } from "zustand";

export interface Question {
  id: string;
  type: "mcq" | "numerical" | "short-answer" | "journal-entry" | "case-study";
  question: string;
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
  topic: string;
  subtopic: string;
  marks: number;
}

export interface UserProgress {
  totalQuestions: number;
  correctAnswers: number;
  streak: number;
  lastPractice: Date;
  subjectMastery: Record<string, number>;
  weakTopics: string[];
}

export interface StudyTask {
  id: string;
  title: string;
  subject: string;
  topic: string;
  completed: boolean;
  dueDate: Date;
  type: "quiz" | "revision" | "mock" | "practice";
}

export interface MockExamResult {
  id: string;
  title: string;
  score: number;
  totalMarks: number;
  timeTaken: number;
  completedAt: Date;
  weakAreas: string[];
  improvement: string[];
}

interface AppState {
  isAuthenticated: boolean;
  currentUser: {
    id: string;
    name: string;
    email: string;
    level: "foundation" | "application" | "advisory";
    examDate: string | Date;
    dailyHours: number;
  } | null;
  progress: UserProgress;
  currentQuiz: Question[];
  quizAnswers: Record<string, string | number>;
  showFeedback: boolean;
  currentQuestionIndex: number;
  tasks: StudyTask[];
  
  setUser: (user: AppState["currentUser"]) => void;
  setAuthenticated: (value: boolean) => void;
  submitAnswer: (questionId: string, answer: string | number) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  setShowFeedback: (value: boolean) => void;
  updateProgress: (progress: Partial<UserProgress>) => void;
  markTaskComplete: (taskId: string) => void;
  addStudyTask: (task: StudyTask) => void;
  logout: () => void;
}

export const useStore = create<AppState>((set) => ({
  isAuthenticated: false,
  currentUser: null,
  progress: {
    totalQuestions: 0,
    correctAnswers: 0,
    streak: 0,
    lastPractice: new Date(),
    subjectMastery: {
      accounting: 45,
      assurance: 30,
      "business-finance": 55,
      law: 40,
      taxation: 35,
    },
    weakTopics: [
      "Consolidation Accounting",
      "Bank Reconciliation",
      "NFRС 10",
      "VAT Calculation",
      "Partnership Dissolution",
    ],
  },
  currentQuiz: [],
  quizAnswers: {},
  showFeedback: false,
  currentQuestionIndex: 0,
  tasks: [],

  setUser: (user) => set({ currentUser: user }),
  setAuthenticated: (value) => set({ isAuthenticated: value }),
  
  submitAnswer: (questionId, answer) =>
    set((state) => ({
      quizAnswers: { ...state.quizAnswers, [questionId]: answer },
    })),
  
  nextQuestion: () =>
    set((state) => ({
      currentQuestionIndex: Math.min(
        state.currentQuestionIndex + 1,
        state.currentQuiz.length - 1
      ),
    })),
  
  prevQuestion: () =>
    set((state) => ({
      currentQuestionIndex: Math.max(state.currentQuestionIndex - 1, 0),
    })),
  
  setShowFeedback: (value) => set({ showFeedback: value }),
  
  updateProgress: (progressUpdate) =>
    set((state) => ({
      progress: { ...state.progress, ...progressUpdate },
    })),
  
  markTaskComplete: (taskId) =>
    set((state) => ({
      tasks: state.tasks?.map((t) =>
        t.id === taskId ? { ...t, completed: true } : t
      ),
    })),
  
  addStudyTask: (task) =>
    set((state) => ({
      tasks: [...(state.tasks || []), task],
    })),
  
  logout: () =>
    set({
      isAuthenticated: false,
      currentUser: null,
      currentQuiz: [],
      quizAnswers: {},
    }),
}));