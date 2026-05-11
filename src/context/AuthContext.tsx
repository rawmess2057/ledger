"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import api from "@/lib/api";

export interface UserStats {
  streak: number;
  lastStudyDate: string | null;
  totalQuestions: number;
  correctAnswers: number;
  totalStudyMinutes: number;
  tasksCompleted: number;
  tasksTotal: number;
  weeklyData: { date: string; minutes: number; questions: number }[];
  accuracyRate: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  level: "foundation" | "application" | "advisory";
  examDate: string;
  dailyHours: number;
  avatar?: string;
  joinedAt: string;
  stats?: UserStats;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  updateStats: (stats: Partial<UserStats>) => void;
  refreshUser: () => Promise<void>;
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load user on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        api.loadToken();
        const storedToken = typeof window !== "undefined" 
          ? localStorage.getItem("ledger_token") 
          : null;
        
        if (storedToken) {
          const userData = await api.getMe();
          // Transform API response to match frontend User interface
          const transformedUser: User = {
            id: userData.id,
            name: userData.name,
            email: userData.email,
            phone: userData.phone,
            level: userData.level,
            examDate: userData.exam_date,
            dailyHours: userData.daily_hours,
            avatar: userData.avatar,
            joinedAt: userData.created_at,
            stats: userData.stats ? {
              streak: userData.stats.streak,
              lastStudyDate: userData.stats.last_study_date,
              totalQuestions: userData.stats.total_questions,
              correctAnswers: userData.stats.correct_answers,
              totalStudyMinutes: userData.stats.total_study_minutes,
              tasksCompleted: userData.stats.tasks_completed,
              tasksTotal: userData.stats.tasks_total,
              weeklyData: userData.stats.weekly_data || [],
              accuracyRate: userData.stats.accuracy_rate || 0,
            } : undefined,
          };
          setUser(transformedUser);
        }
      } catch (error) {
        console.error("Failed to load user:", error);
        api.clearToken();
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
      }
    };

    initAuth();
  }, []);

  const refreshUser = async () => {
    try {
      const userData = await api.getMe();
      const transformedUser: User = {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        level: userData.level,
        examDate: userData.exam_date,
        dailyHours: userData.daily_hours,
        avatar: userData.avatar,
        joinedAt: userData.created_at,
        stats: userData.stats ? {
          streak: userData.stats.streak,
          lastStudyDate: userData.stats.last_study_date,
          totalQuestions: userData.stats.total_questions,
          correctAnswers: userData.stats.correct_answers,
          totalStudyMinutes: userData.stats.total_study_minutes,
          tasksCompleted: userData.stats.tasks_completed,
          tasksTotal: userData.stats.tasks_total,
          weeklyData: userData.stats.weekly_data || [],
          accuracyRate: userData.stats.accuracy_rate || 0,
        } : undefined,
      };
      setUser(transformedUser);
    } catch (error) {
      console.error("Failed to refresh user:", error);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      await api.login(email, password);
      await refreshUser();
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      if (data.password !== data.confirmPassword) {
        throw new Error("Passwords do not match");
      }

      await api.register({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        level: data.level,
        exam_date: data.examDate,
        daily_hours: 3,
      });

      // Auto login after registration
      await api.login(data.email, data.password);
      await refreshUser();
      return true;
    } catch (error) {
      console.error("Registration failed:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    api.clearToken();
    setUser(null);
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      const apiData: Record<string, unknown> = {};
      if (data.name) apiData.name = data.name;
      if (data.phone) apiData.phone = data.phone;
      if (data.level) apiData.level = data.level;
      if (data.examDate) apiData.exam_date = data.examDate;
      if (data.dailyHours) apiData.daily_hours = data.dailyHours;

      await api.updateMe(apiData);
      await refreshUser();
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const updateStats = (statsUpdate: Partial<UserStats>) => {
    if (user) {
      setUser({
        ...user,
        stats: {
          ...user.stats!,
          ...statsUpdate,
        },
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user && isInitialized,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        updateStats,
        refreshUser,
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