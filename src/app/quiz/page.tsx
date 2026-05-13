"use client";

import { useState, useEffect, useCallback } from "react";
import { Sidebar, TopBar, MobileNav } from "@/components/Navigation";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/Progress";
import api from "@/lib/api";
import { emitQuizEvent } from "@/lib/taskEvents";
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
  Loader2,
  GraduationCap,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

interface Question {
  id: string;
  type: string;
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
  difficulty: string;
  topic: string;
  subtopic?: string;
  subject: string;
  marks: number;
  created_at?: string;
}

interface QuestionState {
  selectedAnswer: string | null;
  isAnswered: boolean;
  showExplanation: boolean;
}

interface QuizSession {
  session_id: string;
  questions: Question[];
  started_at: string;
}

function QuizContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300);
  const [quizComplete, setQuizComplete] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [startTime] = useState(Date.now());
  const [session, setSession] = useState<QuizSession | null>(null);
  const [quizResult, setQuizResult] = useState<any>(null);

  const [questionStates, setQuestionStates] = useState<Record<string, QuestionState>>({});

  const question = session?.questions[currentIndex];
  const totalQuestions = session?.questions.length || 0;
  const currentState = question ? questionStates[question.id] : null;

  // Initialize quiz
  useEffect(() => {
    const initQuiz = async () => {
      try {
        setIsLoading(true);
        const subject = searchParams.get("subject");
        const topic = searchParams.get("topic");
        const exam = searchParams.get("exam");
        
        const examTitles: Record<string, string> = {
          "june-2019": "CA Membership June 2019",
        };
        
        const response = await api.startQuiz({
          subject: subject || undefined,
          topic: topic || undefined,
          exam: exam || undefined,
          question_count: 5,
          title: exam ? examTitles[exam] || "CA Membership Practice" : "Practice Quiz",
        });
        
        setSession(response);
        
        // Initialize question states
        const initialStates: Record<string, QuestionState> = {};
        response.questions.forEach((q: Question) => {
          initialStates[q.id] = {
            selectedAnswer: null,
            isAnswered: false,
            showExplanation: false,
          };
        });
        setQuestionStates(initialStates);
      } catch (error) {
        console.error("Failed to start quiz:", error);
        // Fallback to mock questions if API fails
        setSession({
          session_id: "mock-session",
          questions: [],
          started_at: new Date().toISOString(),
        });
      } finally {
        setIsLoading(false);
      }
    };

    initQuiz();
  }, [searchParams]);

  useEffect(() => {
    if (!session || quizComplete) return;

    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setQuizComplete(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [session, quizComplete]);

  useEffect(() => {
    setInputValue("");
  }, [currentIndex]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getScore = useCallback(() => {
    if (!session) return 0;
    let correct = 0;
    session.questions.forEach((q) => {
      const state = questionStates[q.id];
      if (state?.isAnswered && q.correctAnswer === state.selectedAnswer) {
        correct++;
      }
    });
    return correct;
  }, [session, questionStates]);

  const handleSelectAnswer = (answer: string) => {
    if (!question) return;
    setQuestionStates((prev) => ({
      ...prev,
      [question.id]: {
        ...prev[question.id],
        selectedAnswer: answer,
      },
    }));
  };

  const handleTextInput = (value: string) => {
    if (!question) return;
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
      [question!.id]: {
        ...prev[question!.id],
        isAnswered: true,
        showExplanation: true,
      },
    }));
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      submitQuiz();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const submitQuiz = async () => {
    if (!session) return;
    
    try {
      setIsSubmitting(true);
      
      const answers = session.questions.map((q) => ({
        question_id: q.id,
        user_answer: questionStates[q.id]?.selectedAnswer || "",
      }));

      const result = await api.submitQuiz(session.session_id, {
        answers,
        time_taken_seconds: Math.round((Date.now() - startTime) / 1000),
      });

      setQuizResult(result);
      setQuizComplete(true);
      emitQuizEvent('ledger:quiz:completed', result);
    } catch (error) {
      console.error("Failed to submit quiz:", error);
      // Still show results locally
      setQuizComplete(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isQuestionAnswered = (qId: string) => {
    return questionStates[qId]?.isAnswered;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-teal animate-spin" />
          <p className="text-slate">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (quizComplete && quizResult) {
    const percentage = quizResult.score_percentage;

    return (
      <div className="min-h-screen bg-navy flex items-center justify-center p-4 md:p-6">
        <Card className="max-w-2xl w-full p-6 md:p-8 text-center">
          <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full mx-auto mb-4 md:mb-6 flex items-center justify-center ${
            percentage >= 70 ? "bg-emerald-500/20" : percentage >= 50 ? "bg-amber-500/20" : "bg-red-500/20"
          }`}>
            {percentage >= 70 ? (
              <CheckCircle2 className="w-10 h-10 md:w-12 md:h-12 text-emerald-400" />
            ) : percentage >= 50 ? (
              <Lightbulb className="w-10 h-10 md:w-12 md:h-12 text-amber-400" />
            ) : (
              <XCircle className="w-10 h-10 md:w-12 md:h-12 text-red-400" />
            )}
          </div>

          <h1 className="text-2xl md:text-3xl font-bold mb-2">Quiz Complete!</h1>
          <p className="text-slate-light text-sm md:text-base mb-6">
            {percentage >= 70 ? "Excellent work! Keep it up!" : percentage >= 50 ? "Good attempt. Room for improvement." : "Keep practicing! You'll get there."}
          </p>

          <div className="text-5xl md:text-6xl font-bold mb-6 gradient-text">{percentage}%</div>

          <div className="grid grid-cols-3 gap-2 md:gap-4 mb-6 md:mb-8">
            <div className="p-3 md:p-4 bg-navy rounded-xl">
              <p className="text-xl md:text-2xl font-bold text-emerald-400">{quizResult.correct_answers}</p>
              <p className="text-xs md:text-sm text-slate">Correct</p>
            </div>
            <div className="p-3 md:p-4 bg-navy rounded-xl">
              <p className="text-xl md:text-2xl font-bold text-red-400">{quizResult.total_questions - quizResult.correct_answers}</p>
              <p className="text-xs md:text-sm text-slate">Incorrect</p>
            </div>
            <div className="p-3 md:p-4 bg-navy rounded-xl">
              <p className="text-xl md:text-2xl font-bold text-amber-400">{formatTime(quizResult.time_taken_seconds)}</p>
              <p className="text-xs md:text-sm text-slate">Time Taken</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/practice">
              <Button variant="secondary" className="w-full">
                <ArrowLeft className="w-4 h-4" />
                Practice More
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button className="w-full">
                <Home className="w-4 h-4" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  if (!session || !question) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="text-slate-light mb-4">Failed to load quiz questions</p>
          <Link href="/practice">
            <Button>Back to Practice</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy">
      <TopBar />

      <main className="pt-16 pb-28 md:pb-8 px-3 md:px-4">
        <div className="max-w-4xl mx-auto py-4 md:py-8">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <Link href="/practice">
              <Button variant="ghost" size="sm" className="text-xs md:text-sm">
                <ArrowLeft className="w-3 h-3 md:w-4 md:h-4" />
                Exit
              </Button>
            </Link>
            <div className="flex items-center gap-2 md:gap-4">
              <div className="flex items-center gap-1 md:gap-2 bg-navy-light px-2 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl">
                <Clock className="w-3 h-3 md:w-5 md:h-5 text-slate" />
                <span className={cn("font-mono font-bold text-sm md:text-base", timeLeft < 60 && "text-red-400")}>
                  {formatTime(timeLeft)}
                </span>
              </div>
              <Button variant="outline" size="sm" className="hidden sm:flex">
                <Flag className="w-3 h-3 md:w-4 md:h-4" />
                <span className="hidden md:inline">Mark for Review</span>
              </Button>
            </div>
          </div>

          <Progress value={(currentIndex + 1) / totalQuestions * 100} className="mb-4 md:mb-6" />

          <div className="flex items-center justify-between text-xs md:text-sm text-slate mb-3 md:mb-4">
            <span>Question {currentIndex + 1} of {totalQuestions}</span>
            <div className="flex gap-1 flex-wrap justify-end max-w-[160px] md:max-w-none">
              {session.questions.map((q, i) => (
                <div
                  key={i}
                  className={cn(
                    "w-6 h-6 md:w-7 md:h-7 rounded-lg flex items-center justify-center text-xs font-medium cursor-pointer transition-all",
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

          <Card className="p-4 md:p-6 mb-4 md:mb-6">
            <div className="flex flex-wrap items-center gap-1 md:gap-2 mb-3 md:mb-4">
              <span className={cn(
                "text-xs px-1.5 md:px-2 py-0.5 md:py-1 rounded-full capitalize",
                question.difficulty === "easy" ? "bg-emerald-500/20 text-emerald-400" :
                question.difficulty === "medium" ? "bg-amber-500/20 text-amber-400" : "bg-red-500/20 text-red-400"
              )}>
                {question.difficulty}
              </span>
              <span className="text-xs text-slate capitalize hidden sm:inline">{question.type.replace("-", " ")}</span>
              <span className="text-xs text-slate">• {question.topic}</span>
              <span className="text-xs text-slate">• {question.marks} marks</span>
            </div>

            <h2 className="text-base md:text-xl font-medium mb-4 md:mb-6 whitespace-pre-wrap">{question.question}</h2>

            {question.type === "mcq" && question.options && (
              <div className="space-y-2 md:space-y-3">
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
                        "w-full p-3 md:p-4 rounded-xl text-left transition-all border-2 min-h-[48px] md:min-h-0",
                        isSelected && !showResult ? "border-teal bg-teal/10" :
                        showResult && isCorrect ? "border-emerald-400 bg-emerald-500/10" :
                        showResult && isSelected && !isCorrect ? "border-red-400 bg-red-500/10" :
                        "border-slate/20 bg-navy hover:border-teal/50"
                      )}
                    >
                      <div className="flex items-center gap-2 md:gap-3">
                        <span className={cn(
                          "w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs md:text-sm font-medium shrink-0",
                          isSelected && !showResult ? "bg-teal text-navy" :
                          showResult && isCorrect ? "bg-emerald-400 text-navy" :
                          showResult && isSelected ? "bg-red-400 text-white" :
                          "bg-navy-light"
                        )}>
                          {String.fromCharCode(65 + index)}
                        </span>
                        <span className="flex-1 text-sm md:text-base">{option}</span>
                        {showResult && isCorrect && <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-emerald-400 shrink-0" />}
                        {showResult && isSelected && !isCorrect && <XCircle className="w-4 h-4 md:w-5 md:h-5 text-red-400 shrink-0" />}
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
                  className="w-full p-3 md:p-4 bg-navy border border-slate/20 rounded-xl text-sm md:text-lg font-mono focus:outline-none focus:border-teal disabled:opacity-60"
                />
                {currentState?.showExplanation && (
                  <p className="mt-3 md:mt-4 text-slate-light text-sm">
                    Correct: <span className="text-teal font-mono">{question.correctAnswer}</span>
                  </p>
                )}
              </div>
            )}

            {(question.type === "journal-entry" || question.type === "case-study") && (
              <div>
                <textarea
                  placeholder={`Enter your ${question.type === "journal-entry" ? "journal entry" : "answer"}...`}
                  value={currentState?.selectedAnswer || ""}
                  onChange={(e) => handleTextInput(e.target.value)}
                  disabled={currentState?.showExplanation}
                  rows={4}
                  className="w-full p-3 md:p-4 bg-navy border border-slate/20 rounded-xl text-sm md:text-base focus:outline-none focus:border-teal disabled:opacity-60 resize-none font-mono"
                />
                {currentState?.showExplanation && (
                  <div className="mt-3 md:mt-4 p-3 md:p-4 bg-navy-light rounded-xl">
                    <p className="text-xs md:text-sm text-slate-light">Expected:</p>
                    <pre className="text-teal font-mono whitespace-pre-wrap mt-2 text-xs md:text-sm">{question.correctAnswer}</pre>
                  </div>
                )}
              </div>
            )}
          </Card>

          {currentState?.showExplanation && (
            <Card className="p-4 md:p-6 border-l-4 border-l-teal mb-4 md:mb-6">
              <div className="flex items-center gap-2 mb-2 md:mb-3">
                <Lightbulb className="w-4 h-4 md:w-5 md:h-5 text-teal" />
                <h3 className="font-semibold text-sm md:text-base">Explanation</h3>
              </div>
              <p className="text-slate-light text-xs md:text-sm mb-3 md:mb-4">{question.explanation}</p>
            </Card>
          )}

          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handlePrev} 
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden sm:inline">Previous</span>
            </Button>

            <div className="flex gap-2 md:gap-3">
              {!currentState?.showExplanation ? (
                <Button 
                  onClick={handleSubmit} 
                  disabled={!currentState?.selectedAnswer}
                  size="sm"
                  className="text-xs md:text-sm"
                >
                  <Send className="w-3 h-3 md:w-4 md:h-4" />
                  <span className="hidden sm:inline">Submit Answer</span>
                  <span className="sm:hidden">Submit</span>
                </Button>
              ) : (
                <Button onClick={handleNext} disabled={isSubmitting} size="sm" className="text-xs md:text-sm">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3 h-3 md:w-4 md:h-4 animate-spin" />
                      <span className="hidden sm:inline">Submitting...</span>
                    </>
                  ) : (
                    <>
                      {currentIndex === totalQuestions - 1 ? "Finish" : "Next"}
                      <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
                    </>
                  )}
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