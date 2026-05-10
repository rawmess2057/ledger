"use client";

import { useState, useEffect, useCallback } from "react";
import { Sidebar, TopBar, MobileNav } from "@/components/Navigation";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/Progress";
import { mockQuestions } from "@/data/mockData";
import { cn } from "@/lib/utils";
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  Flag,
  Lightbulb,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Home,
  Send,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

interface QuestionState {
  selectedAnswer: string | null;
  isAnswered: boolean;
  showExplanation: boolean;
}

function QuizContent() {
  const { recordStudySession } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300);
  const [quizComplete, setQuizComplete] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [startTime] = useState(Date.now());
  const [sessionRecorded, setSessionRecorded] = useState(false);

  const [questionStates, setQuestionStates] = useState<Record<string, QuestionState>>(() => {
    const initial: Record<string, QuestionState> = {};
    mockQuestions.forEach((q) => {
      initial[q.id] = {
        selectedAnswer: null,
        isAnswered: false,
        showExplanation: false,
      };
    });
    return initial;
  });

  const question = mockQuestions[currentIndex];
  const totalQuestions = mockQuestions.length;
  const currentState = questionStates[question.id];

  useEffect(() => {
    if (timeLeft > 0 && !quizComplete) {
      const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !quizComplete) {
      setQuizComplete(true);
    }
  }, [timeLeft, quizComplete]);

  useEffect(() => {
    setInputValue("");
  }, [currentIndex]);

  useEffect(() => {
    if (quizComplete && !sessionRecorded && recordStudySession) {
      const score = getScore();
      const timeTakenMinutes = Math.max(1, Math.round((Date.now() - startTime) / 60000));
      const answeredCount = Object.values(questionStates).filter(s => s.isAnswered).length;
      
      if (answeredCount > 0) {
        recordStudySession(timeTakenMinutes, answeredCount, score);
        setSessionRecorded(true);
      }
    }
  }, [quizComplete, sessionRecorded, recordStudySession, startTime, questionStates]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getScore = useCallback(() => {
    let correct = 0;
    Object.entries(questionStates).forEach(([qId, state]) => {
      const q = mockQuestions.find((q) => q.id === qId);
      if (q && state.isAnswered && q.correctAnswer === state.selectedAnswer) correct++;
    });
    return correct;
  }, [questionStates]);

  const handleSelectAnswer = (answer: string) => {
    setQuestionStates((prev) => ({
      ...prev,
      [question.id]: {
        ...prev[question.id],
        selectedAnswer: answer,
      },
    }));
  };

  const handleTextInput = (value: string) => {
    setInputValue(value);
    setQuestionStates((prev) => ({
      ...prev,
      [question.id]: {
        ...prev[question.id],
        selectedAnswer: value,
      },
    }));
  };

  const handleSubmit = () => {
    if (!currentState?.selectedAnswer) return;
    
    setQuestionStates((prev) => ({
      ...prev,
      [question.id]: {
        ...prev[question.id],
        isAnswered: true,
        showExplanation: true,
      },
    }));
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setQuizComplete(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const isQuestionAnswered = (qId: string) => {
    return questionStates[qId]?.isAnswered;
  };

  if (quizComplete) {
    const score = getScore();
    const percentage = Math.round((score / totalQuestions) * 100);

    return (
      <div className="min-h-screen bg-navy flex items-center justify-center p-6">
        <Card className="max-w-2xl w-full p-8 text-center">
          <div className={`w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center ${
            percentage >= 70 ? "bg-emerald-500/20" : percentage >= 50 ? "bg-amber-500/20" : "bg-red-500/20"
          }`}>
            {percentage >= 70 ? (
              <CheckCircle2 className="w-12 h-12 text-emerald-400" />
            ) : percentage >= 50 ? (
              <Lightbulb className="w-12 h-12 text-amber-400" />
            ) : (
              <XCircle className="w-12 h-12 text-red-400" />
            )}
          </div>

          <h1 className="text-3xl font-bold mb-2">Quiz Complete!</h1>
          <p className="text-slate-light mb-6">
            {percentage >= 70 ? "Excellent work! Keep it up!" : percentage >= 50 ? "Good attempt. Room for improvement." : "Keep practicing! You'll get there."}
          </p>

          <div className="text-6xl font-bold mb-6 gradient-text">{percentage}%</div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="p-4 bg-navy rounded-xl">
              <p className="text-2xl font-bold text-emerald-400">{score}</p>
              <p className="text-sm text-slate">Correct</p>
            </div>
            <div className="p-4 bg-navy rounded-xl">
              <p className="text-2xl font-bold text-red-400">{totalQuestions - score}</p>
              <p className="text-sm text-slate">Incorrect</p>
            </div>
            <div className="p-4 bg-navy rounded-xl">
              <p className="text-2xl font-bold text-amber-400">{formatTime(300 - timeLeft)}</p>
              <p className="text-sm text-slate">Time Taken</p>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <Link href="/practice">
              <Button variant="secondary">
                <ArrowLeft className="w-4 h-4" />
                Practice More
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button>
                <Home className="w-4 h-4" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy">
      <TopBar />

      <main className="pt-16 pb-24 md:pb-8 px-4">
        <div className="max-w-4xl mx-auto py-8">
          <div className="flex items-center justify-between mb-6">
            <Link href="/practice">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4" />
                Exit Quiz
              </Button>
            </Link>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-navy-light px-4 py-2 rounded-xl">
                <Clock className="w-5 h-5 text-slate" />
                <span className={cn("font-mono font-bold", timeLeft < 60 && "text-red-400")}>
                  {formatTime(timeLeft)}
                </span>
              </div>
              <Button variant="outline" size="sm">
                <Flag className="w-4 h-4" />
                Mark for Review
              </Button>
            </div>
          </div>

          <Progress value={(currentIndex + 1) / totalQuestions * 100} className="mb-8" />

          <div className="flex items-center justify-between text-sm text-slate mb-4">
            <span>Question {currentIndex + 1} of {totalQuestions}</span>
            <div className="flex gap-2">
              {mockQuestions.map((q, i) => (
                <div
                  key={i}
                  className={cn(
                    "w-6 h-6 rounded-lg flex items-center justify-center text-xs font-medium cursor-pointer transition-all",
                    i === currentIndex ? "bg-teal text-navy" : 
                    isQuestionAnswered(q.id) ? "bg-emerald-500/20 text-emerald-400" : "bg-navy-light text-slate hover:bg-slate/30"
                  )}
                  onClick={() => setCurrentIndex(i)}
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </div>

          <Card className="p-8 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <span className={cn(
                "text-xs px-2 py-1 rounded-full capitalize",
                question.difficulty === "easy" ? "bg-emerald-500/20 text-emerald-400" :
                question.difficulty === "medium" ? "bg-amber-500/20 text-amber-400" : "bg-red-500/20 text-red-400"
              )}>
                {question.difficulty}
              </span>
              <span className="text-xs text-slate capitalize">{question.type.replace("-", " ")}</span>
              <span className="text-xs text-slate">• {question.topic} • {question.marks} marks</span>
            </div>

            <h2 className="text-xl font-medium mb-6 whitespace-pre-wrap">{question.question}</h2>

            {question.type === "mcq" && question.options && (
              <div className="space-y-3">
                {question.options.map((option, index) => {
                  const isSelected = currentState?.selectedAnswer === option;
                  const isCorrect = option === question.correctAnswer;
                  const showResult = currentState?.showExplanation;
                  
                  return (
                    <button
                      key={index}
                      onClick={() => handleSelectAnswer(option)}
                      disabled={showResult}
                      className={cn(
                        "w-full p-4 rounded-xl text-left transition-all border-2",
                        isSelected && !showResult ? "border-teal bg-teal/10" :
                        showResult && isCorrect ? "border-emerald-400 bg-emerald-500/10" :
                        showResult && isSelected && !isCorrect ? "border-red-400 bg-red-500/10" :
                        "border-slate/20 bg-navy hover:border-teal/50"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <span className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                          isSelected && !showResult ? "bg-teal text-navy" :
                          showResult && isCorrect ? "bg-emerald-400 text-navy" :
                          showResult && isSelected ? "bg-red-400 text-white" :
                          "bg-navy-light"
                        )}>
                          {String.fromCharCode(65 + index)}
                        </span>
                        <span className="flex-1">{option}</span>
                        {showResult && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                        {showResult && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-400" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {(question.type === "numerical" || question.type === "short-answer") && (
              <div>
                <input
                  type="text"
                  placeholder={`Enter your ${question.type === "numerical" ? "numeric answer" : "answer"}`}
                  value={currentState?.selectedAnswer || ""}
                  onChange={(e) => handleTextInput(e.target.value)}
                  disabled={currentState?.showExplanation}
                  className="w-full p-4 bg-navy border border-slate/20 rounded-xl text-lg font-mono focus:outline-none focus:border-teal disabled:opacity-60"
                />
                {currentState?.showExplanation && (
                  <p className="mt-4 text-slate-light">
                    Correct answer: <span className="text-teal font-mono">{question.correctAnswer}</span>
                  </p>
                )}
              </div>
            )}

            {(question.type === "journal-entry" || question.type === "case-study") && (
              <div>
                <textarea
                  placeholder={`Enter your ${question.type === "journal-entry" ? "journal entry" : "answer"} here...`}
                  value={currentState?.selectedAnswer || ""}
                  onChange={(e) => handleTextInput(e.target.value)}
                  disabled={currentState?.showExplanation}
                  rows={6}
                  className="w-full p-4 bg-navy border border-slate/20 rounded-xl text-base focus:outline-none focus:border-teal disabled:opacity-60 resize-none font-mono"
                />
                <p className="mt-2 text-sm text-slate">Write your answer clearly. Use proper formatting for journal entries.</p>
                {currentState?.showExplanation && (
                  <div className="mt-4 p-4 bg-navy-light rounded-xl">
                    <p className="text-sm text-slate-light">Expected answer:</p>
                    <pre className="text-teal font-mono whitespace-pre-wrap mt-2">{question.correctAnswer}</pre>
                  </div>
                )}
              </div>
            )}
          </Card>

          {currentState?.showExplanation && (
            <Card className="p-6 border-l-4 border-l-teal mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-5 h-5 text-teal" />
                <h3 className="font-semibold">Explanation</h3>
              </div>
              <p className="text-slate-light mb-4">{question.explanation}</p>
              <div className="p-3 bg-teal/10 rounded-xl">
                <p className="text-sm text-teal">
                  <span className="font-semibold">Tip:</span> This concept is frequently tested in ICAN exams. 
                  Review the related standard/law for deeper understanding.
                </p>
              </div>
            </Card>
          )}

          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={handlePrev} 
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>

            <div className="flex gap-3">
              {!currentState?.showExplanation ? (
                <Button 
                  onClick={handleSubmit} 
                  disabled={!currentState?.selectedAnswer}
                >
                  <Send className="w-4 h-4" />
                  Submit Answer
                </Button>
              ) : (
                <Button onClick={handleNext}>
                  {currentIndex === totalQuestions - 1 ? "Finish Quiz" : "Next Question"}
                  <ChevronRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>

      <MobileNav />
    </div>
  );
}

export default function QuizPage() {
  return (
    <ProtectedRoute>
      <QuizContent />
    </ProtectedRoute>
  );
}