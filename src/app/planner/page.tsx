"use client";

import { useState, useEffect } from "react";
import { Sidebar, TopBar, MobileNav, Breadcrumb } from "@/components/Navigation";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { emitTaskEvent } from "@/lib/taskEvents";
import { cn } from "@/lib/utils";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  Play,
  CheckCircle2,
  Circle,
  Clock,
  Target,
  Sparkles,
  Trash2,
  Edit2,
  X,
  Loader2,
} from "lucide-react";

interface Task {
  id: string;
  title: string;
  subject: string;
  topic?: string;
  completed: boolean;
  due_date: string;
  task_type: string;
  priority: string;
  duration: number;
}

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const subjects = [
  { value: "accounting", label: "Accounting" },
  { value: "assurance", label: "Assurance & IS" },
  { value: "business-finance", label: "Business & Finance" },
  { value: "law", label: "Business Law" },
  { value: "taxation", label: "Taxation" },
];
const taskTypes = [
  { value: "practice", label: "Practice" },
  { value: "revision", label: "Revision" },
  { value: "quiz", label: "Quiz" },
  { value: "mock", label: "Mock Exam" },
];

function AddTaskModal({
  isOpen,
  onClose,
  onAdd,
  selectedDate
}: {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (task: Task) => void;
  selectedDate: Date;
}) {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState(subjects[0].value);
  const [taskType, setTaskType] = useState("practice");
  const [priority, setPriority] = useState("medium");
  const [duration, setDuration] = useState(45);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const year = selectedDate.getFullYear();
    const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
    const day = selectedDate.getDate().toString().padStart(2, '0');
    
    const newTask: Task = {
      id: `temp_${Date.now()}`,
      title: title.trim(),
      subject,
      topic: "General",
      completed: false,
      due_date: `${year}-${month}-${day}T12:00:00`,
      task_type: taskType,
      priority,
      duration,
    };

    onAdd(newTask);
    setTitle("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <Card className="relative w-full max-w-md sm:max-w-lg p-4 sm:p-6 z-10 rounded-b-none sm:rounded-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold">Add New Task</h3>
          <button onClick={onClose} className="p-2 hover:bg-navy rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Task Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Complete Journal Entries Chapter"
              className="w-full p-3 bg-navy border border-slate/20 rounded-xl focus:outline-none focus:border-teal"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Subject</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full p-3 bg-navy border border-slate/20 rounded-xl focus:outline-none focus:border-teal"
            >
              {subjects.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Task Type</label>
            <div className="grid grid-cols-2 gap-2">
              {taskTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setTaskType(type.value)}
                  className={cn(
                    "p-3 rounded-xl border-2 text-center transition-all",
                    taskType === type.value
                      ? "border-teal bg-teal/10"
                      : "border-slate/20 hover:border-teal/50"
                  )}
                >
                  <p className="text-sm font-medium">{type.label}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full p-3 bg-navy border border-slate/20 rounded-xl focus:outline-none focus:border-teal"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Duration (min)</label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                min={15}
                max={180}
                step={15}
                className="w-full p-3 bg-navy border border-slate/20 rounded-xl focus:outline-none focus:border-teal"
              />
            </div>
          </div>

          <div className="pt-4">
            <p className="text-sm text-slate mb-3">
              Scheduled for: <span className="text-teal">{selectedDate.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}</span>
            </p>
            <Button type="submit" className="w-full">
              <Plus className="w-4 h-4" />
              Add Task
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

function PlannerContent() {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddModal, setShowAddModal] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay() === 0 ? 6 : new Date(currentYear, currentMonth, 1).getDay() - 1;

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    try {
      setLoading(true);
      const data = await api.getTasks();
      setTasks(data.tasks || []);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }

  const navigateMonth = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

    const getDateFromString = (dateStr: string) => {
    const parts = dateStr.split('T')[0].split('-');
    return {
      year: parseInt(parts[0]),
      month: parseInt(parts[1]) - 1,
      day: parseInt(parts[2]),
    };
  };

  const tasksForDate = (day: number) => {
    return tasks.filter((task) => {
      const { year, month, day: d } = getDateFromString(task.due_date);
      return (
        d === day &&
        month === currentMonth &&
        year === currentYear
      );
    });
  };

  const selectedDateTasks = tasksForDate(selectedDate.getDate());

  const handleAddTask = async (newTask: Task) => {
    try {
      const createdTask = await api.createTask({
        title: newTask.title,
        subject: newTask.subject,
        topic: newTask.topic || "General",
        task_type: newTask.task_type,
        priority: newTask.priority,
        duration: newTask.duration,
        due_date: newTask.due_date,
      });
      setTasks([...tasks, createdTask]);
      emitTaskEvent('ledger:task:created', createdTask);
    } catch (error) {
      console.error("Failed to create task:", error);
      alert("Failed to add task. Please try again.");
    }
  };

  const handleToggleTask = async (taskId: string) => {
    try {
      const updatedTask = await api.toggleTaskComplete(taskId);
      setTasks(tasks.map(task =>
        task.id === taskId ? { ...task, completed: updatedTask.completed } : task
      ));
      emitTaskEvent('ledger:task:updated', updatedTask);
    } catch (error) {
      console.error("Failed to toggle task:", error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await api.deleteTask(taskId);
      setTasks(tasks.filter(task => task.id !== taskId));
      emitTaskEvent('ledger:task:deleted', { id: taskId });
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const completedTasks = tasks.filter(t => t.completed).length;
  const pendingTasks = tasks.filter(t => !t.completed).length;
  const totalStudyHours = tasks.reduce((sum, t) => sum + (t.completed ? t.duration : 0), 0) / 60;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-teal" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-6 md:py-8">
      <Breadcrumb items={[{ label: "Dashboard", href: "/dashboard" }, { label: "Study Planner" }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 md:mb-8 gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-1">Study Planner</h1>
          <p className="text-slate-light text-sm">Plan your studies and stay on track</p>
        </div>
        <Button size="sm" onClick={() => setShowAddModal(true)} className="w-full sm:w-auto">
          <Plus className="w-3 h-3 md:w-4 md:h-4" />
          Add Task
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-4 md:gap-6">
        <div className="lg:col-span-2">
          <Card className="p-3 md:p-6">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h2 className="text-base md:text-xl font-semibold">
                {currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </h2>
              <div className="flex gap-1 md:gap-2">
                <Button variant="ghost" size="sm" onClick={() => navigateMonth(-1)} className="p-1 md:p-2">
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setCurrentDate(new Date())} className="text-xs md:text-sm px-2">
                  Today
                </Button>
                <Button variant="ghost" size="sm" onClick={() => navigateMonth(1)} className="p-1 md:p-2">
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1 md:gap-2 mb-2 md:mb-4">
              {weekDays.map((day) => (
                <div key={day} className="text-center text-xs md:text-sm text-slate font-medium py-1 md:py-2">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1 md:gap-2">
              {[...Array(firstDayOfMonth)].map((_, i) => (
                <div key={`empty-${i}`} className="h-12 md:h-20 bg-navy rounded-xl"></div>
              ))}
              {[...Array(daysInMonth)].map((_, i) => {
                const day = i + 1;
                const dayTasks = tasksForDate(day);
                const isSelected = selectedDate.getDate() === day && selectedDate.getMonth() === currentMonth && selectedDate.getFullYear() === currentYear;
                const isToday = new Date().getDate() === day && new Date().getMonth() === currentMonth && new Date().getFullYear() === currentYear;

                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDate(new Date(currentYear, currentMonth, day))}
                    className={cn(
                      "h-12 md:h-20 p-1 md:p-2 rounded-xl transition-all text-xs md:text-sm",
                      isSelected ? "bg-teal/20 border border-teal" : "bg-navy hover:bg-navy-light",
                      isToday && !isSelected && "ring-2 ring-amber-500"
                    )}
                  >
                    <span className={cn(
                      "font-medium block",
                      isSelected ? "text-teal" : "text-white"
                    )}>
                      {day}
                    </span>
                    {dayTasks.length > 0 && (
                      <div className="flex gap-1 mt-1 flex-wrap justify-center">
                        {dayTasks.slice(0, 2).map((task, j) => (
                          <div
                            key={j}
                            className={cn(
                              "w-1.5 h-1.5 md:w-2 md:h-2 rounded-full",
                              task.completed ? "bg-emerald-400" : "bg-amber-400"
                            )}
                          />
                        ))}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

        <div className="space-y-4 md:space-y-6">
          <Card className="p-3 md:p-6">
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <h3 className="font-semibold text-sm md:text-base">
                {selectedDate.toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short" })}
              </h3>
              <Button size="sm" variant="ghost" onClick={() => setShowAddModal(true)} className="p-1 md:p-2">
                <Plus className="w-3 h-3 md:w-4 md:h-4" />
              </Button>
            </div>

            {selectedDateTasks.length === 0 ? (
              <div className="text-center py-6 md:py-8">
                <Calendar className="w-10 h-10 md:w-12 md:h-12 text-slate mx-auto mb-3" />
                <p className="text-slate text-xs md:text-sm">No tasks scheduled</p>
                <Button variant="secondary" size="sm" className="mt-3" onClick={() => setShowAddModal(true)}>
                  Add Task
                </Button>
              </div>
            ) : (
              <div className="space-y-2 md:space-y-3 max-h-[40vh] overflow-y-auto">
                {selectedDateTasks.map((task) => (
                  <div
                    key={task.id}
                    className={cn(
                      "p-2 md:p-4 rounded-xl border transition-colors",
                      task.completed ? "bg-emerald-500/10 border-emerald-500/20" : "bg-navy border-slate/20"
                    )}
                  >
                    <div className="flex items-start justify-between mb-1 md:mb-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleTask(task.id)}
                          className="flex-shrink-0"
                        >
                          {task.completed ? (
                            <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-emerald-400" />
                          ) : (
                            <Circle className="w-4 h-4 md:w-5 md:h-5 text-slate" />
                          )}
                        </button>
                        <span className={cn("font-medium text-xs md:text-sm", task.completed && "line-through text-slate")}>
                          {task.title}
                        </span>
                      </div>
                      <button onClick={() => handleDeleteTask(task.id)} className="p-1 hover:bg-navy-light rounded shrink-0">
                        <Trash2 className="w-3 h-3 md:w-4 md:h-4 text-red-400" />
                      </button>
                    </div>
                    <p className="text-xs text-slate ml-6 md:ml-7 capitalize hidden sm:block">{task.subject.replace("-", " & ")}</p>
                    <div className="flex items-center gap-2 md:gap-3 mt-1 md:mt-2 ml-6 md:ml-7">
                      <span className={cn(
                        "text-xs px-1.5 md:px-2 py-0.5 rounded-full capitalize",
                        task.priority === "high" ? "bg-red-500/20 text-red-400" :
                        task.priority === "medium" ? "bg-amber-500/20 text-amber-400" : "bg-slate/20 text-slate"
                      )}>
                        {task.priority}
                      </span>
                      <span className="text-xs text-slate flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {task.duration}m
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card className="p-3 md:p-6">
            <h3 className="font-semibold mb-3 md:mb-4 text-sm md:text-base">Weekly Summary</h3>
            <div className="space-y-2 md:space-y-3">
              <div className="flex items-center justify-between p-2 md:p-3 bg-navy rounded-xl">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 md:w-5 md:h-5 text-emerald-400" />
                  <span className="text-xs md:text-sm">Completed</span>
                </div>
                <span className="font-bold text-emerald-400 text-sm md:text-base">{completedTasks}</span>
              </div>
              <div className="flex items-center justify-between p-2 md:p-3 bg-navy rounded-xl">
                <div className="flex items-center gap-2">
                  <Circle className="w-4 h-4 md:w-5 md:h-5 text-amber-400" />
                  <span className="text-xs md:text-sm">Pending</span>
                </div>
                <span className="font-bold text-amber-400 text-sm md:text-base">{pendingTasks}</span>
              </div>
              <div className="flex items-center justify-between p-2 md:p-3 bg-navy rounded-xl">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 md:w-5 md:h-5 text-teal" />
                  <span className="text-xs md:text-sm">Study Hours</span>
                </div>
                <span className="font-bold text-teal text-sm md:text-base">{totalStudyHours.toFixed(1)}h</span>
              </div>
            </div>
          </Card>

          <Card className="p-3 md:p-6 gradient-primary border-0">
            <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
              <Sparkles className="w-5 h-5 md:w-6 md:h-6" />
              <h3 className="font-semibold text-sm md:text-base">AI Suggestion</h3>
            </div>
            <p className="text-xs md:text-sm text-slate-light mb-3 md:mb-4">
              Based on your weak areas, focus on Journal Entries and VAT calculation today.
            </p>
            <Button size="sm" variant="secondary" className="w-full" onClick={() => window.location.href = "/quiz"}>
              <Play className="w-3 h-3 md:w-4 md:h-4" />
              Start Practice
            </Button>
          </Card>
        </div>
      </div>

      <AddTaskModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddTask}
        selectedDate={selectedDate}
      />
    </div>
  );
}

export default function PlannerPage() {
  return (
    <div className="min-h-screen bg-navy">
      <Sidebar />
      <TopBar />

      <main className="md:ml-64 pt-16 pb-24 md:pb-8 px-4 md:px-6">
        <ProtectedRoute>
          <PlannerContent />
        </ProtectedRoute>
      </main>

      <MobileNav />
    </div>
  );
}