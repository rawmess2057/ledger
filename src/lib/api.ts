import axios, { AxiosInstance, AxiosError } from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

class ApiClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          this.clearToken();
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
        }
        return Promise.reject(error);
      }
    );
  }

  setToken(token: string | null) {
    this.token = token;
    if (token && typeof window !== "undefined") {
      localStorage.setItem("ledger_token", token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("ledger_token");
    }
  }

  loadToken() {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("ledger_token");
      if (token) {
        this.token = token;
      }
    }
  }

  // Auth endpoints
  async register(data: {
    name: string;
    email: string;
    phone?: string;
    password: string;
    level: string;
    exam_date?: string;
    daily_hours?: number;
  }) {
    const response = await this.client.post("/auth/register", data);
    return response.data;
  }

  async login(email: string, password: string) {
    const response = await this.client.post("/auth/login/json", { email, password });
    if (response.data.access_token) {
      this.setToken(response.data.access_token);
    }
    return response.data;
  }

  async guestLogin() {
    const response = await this.client.post("/auth/guest");
    if (response.data.access_token) {
      this.setToken(response.data.access_token);
    }
    return response.data;
  }

  async getMe() {
    this.loadToken();
    const response = await this.client.get("/auth/me");
    return response.data;
  }

  async updateMe(data: {
    name?: string;
    phone?: string;
    level?: string;
    exam_date?: string;
    daily_hours?: number;
  }) {
    const response = await this.client.put("/auth/me", data);
    return response.data;
  }

  // Quiz endpoints
  async getSubjects() {
    const response = await this.client.get("/quiz/questions/subjects");
    return response.data;
  }

  async getQuestions(params?: {
    subject?: string;
    topic?: string;
    difficulty?: string;
    exam?: string;
    limit?: number;
  }) {
    const response = await this.client.get("/quiz/questions", { params });
    return response.data;
  }

  async startQuiz(data: {
    subject?: string;
    topic?: string;
    exam?: string;
    question_count?: number;
    is_mock?: boolean;
    title?: string;
  }) {
    const response = await this.client.post("/quiz/start", data);
    return response.data;
  }

  async submitQuiz(
    sessionId: string,
    data: {
      answers: { question_id: string; user_answer: string }[];
      time_taken_seconds: number;
    }
  ) {
    const response = await this.client.post(`/quiz/${sessionId}/submit`, data);
    return response.data;
  }

  async getQuizHistory() {
    const response = await this.client.get("/quiz/history");
    return response.data;
  }

  async getQuizResult(sessionId: string) {
    const response = await this.client.get(`/quiz/${sessionId}`);
    return response.data;
  }

  // Tasks endpoints
  async getTasks(params?: {
    completed?: boolean;
    date_from?: string;
    date_to?: string;
  }) {
    const response = await this.client.get("/tasks", { params });
    return response.data;
  }

  async createTask(data: {
    title: string;
    subject: string;
    topic?: string;
    task_type: string;
    priority: string;
    duration: number;
    due_date: string;
  }) {
    const response = await this.client.post("/tasks", data);
    return response.data;
  }

  async updateTask(taskId: string, data: {
    title?: string;
    subject?: string;
    topic?: string;
    task_type?: string;
    priority?: string;
    duration?: number;
    due_date?: string;
    completed?: boolean;
  }) {
    const response = await this.client.put(`/tasks/${taskId}`, data);
    return response.data;
  }

  async toggleTaskComplete(taskId: string) {
    const response = await this.client.patch(`/tasks/${taskId}/complete`);
    return response.data;
  }

  async deleteTask(taskId: string) {
    await this.client.delete(`/tasks/${taskId}`);
  }

  // Progress endpoints
  async getProgressOverview() {
    const response = await this.client.get("/progress/overview");
    return response.data;
  }

  async getSubjectMastery() {
    const response = await this.client.get("/progress/mastery");
    return response.data;
  }

  async getWeeklyData() {
    const response = await this.client.get("/progress/weekly");
    return response.data;
  }
}

export const api = new ApiClient();
export default api;