"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useStore } from "@/store";

export interface UserStats {
  streak: number;
  lastStudyDate: string | null;
  totalQuestions: number;
  correctAnswers: number;
  totalStudyMinutes: number;
  tasksCompleted: number;
  tasksTotal: number;
  weeklyData: { date: string; minutes: number; questions: number }[];
}

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  level: "foundation" | "application" | "advisory";
  examDate: string;
  dailyHours: number;
  avatar?: string;
  joinedAt: string;
  stats: UserStats;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  updateStats: (stats: Partial<UserStats>) => void;
  recordStudySession: (minutes: number, questions: number, correct: number) => void;
}

interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  level: "foundation" | "application" | "advisory";
  examDate: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

const createInitialStats = (): UserStats => ({
  streak: 1,
  lastStudyDate: new Date().toISOString().split("T")[0],
  totalQuestions: 0,
  correctAnswers: 0,
  totalStudyMinutes: 0,
  tasksCompleted: 0,
  tasksTotal: 0,
  weeklyData: Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return {
      date: date.toISOString().split("T")[0],
      minutes: 0,
      questions: 0,
    };
  }),
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const store = useStore();

  useEffect(() => {
    if (typeof window === "undefined") {
      setIsLoading(false);
      return;
    }
    
    const storedUser = localStorage.getItem("ledger_user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        const userWithStats = parsedUser.stats ? parsedUser : {
          ...parsedUser,
          stats: createInitialStats(),
        };
        setUser(userWithStats);
        store.setAuthenticated(true);
      } catch (e) {
        // Invalid stored data
      }
    }
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (email && password.length >= 6) {
      const storedUser = localStorage.getItem("ledger_user");
      const userData = storedUser ? JSON.parse(storedUser) : null;

      if (userData) {
        const userWithStats = userData.stats ? userData : {
          ...userData,
          stats: createInitialStats(),
        };
        setUser(userWithStats);
        store.setAuthenticated(true);
        store.setUser(userWithStats);
      }
      setIsLoading(false);
      return true;
    }
    setIsLoading(false);
    return false;
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (data.password !== data.confirmPassword) {
      setIsLoading(false);
      return false;
    }

    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
      level: data.level,
      examDate: data.examDate,
      dailyHours: 3,
      avatar: data.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2),
      joinedAt: new Date().toISOString().split("T")[0],
      stats: createInitialStats(),
    };

    setUser(newUser);
    localStorage.setItem("ledger_user", JSON.stringify(newUser));
    store.setAuthenticated(true);
    store.setUser(newUser);
    store.updateProgress({
      totalQuestions: 0,
      correctAnswers: 0,
      streak: 1,
    });
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("ledger_user");
    store.setAuthenticated(false);
    store.setUser(null);
    store.updateProgress({
      totalQuestions: 0,
      correctAnswers: 0,
      streak: 0,
    });
  };

  const updateProfile = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem("ledger_user", JSON.stringify(updatedUser));
      store.setUser(updatedUser);
    }
  };

  const updateStats = (statsUpdate: Partial<UserStats>) => {
    if (user) {
      const updatedStats = { ...user.stats, ...statsUpdate };
      const updatedUser = { ...user, stats: updatedStats };
      setUser(updatedUser);
      localStorage.setItem("ledger_user", JSON.stringify(updatedUser));
      store.updateProgress({
        totalQuestions: updatedStats.totalQuestions,
        correctAnswers: updatedStats.correctAnswers,
        streak: updatedStats.streak,
      });
    }
  };

  const recordStudySession = (minutes: number, questions: number, correct: number) => {
    if (!user || !user.stats) return;

    const today = new Date().toISOString().split("T")[0];
    const lastStudyDate = user.stats.lastStudyDate;
    
    let newStreak = user.stats.streak;
    
    if (lastStudyDate === today) {
      newStreak = user.stats.streak;
    } else {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split("T")[0];
      
      if (lastStudyDate === yesterdayStr) {
        newStreak = user.stats.streak + 1;
      } else {
        newStreak = 1;
      }
    }

    const updatedWeeklyData = user.stats.weeklyData.map((day) => {
      if (day.date === today) {
        return {
          ...day,
          minutes: day.minutes + minutes,
          questions: day.questions + questions,
        };
      }
      return day;
    });

    updateStats({
      streak: newStreak,
      lastStudyDate: today,
      totalQuestions: user.stats.totalQuestions + questions,
      correctAnswers: user.stats.correctAnswers + correct,
      totalStudyMinutes: user.stats.totalStudyMinutes + minutes,
      weeklyData: updatedWeeklyData,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        updateStats,
        recordStudySession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}