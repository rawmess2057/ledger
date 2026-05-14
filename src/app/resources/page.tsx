"use client";

import { useState } from "react";
import { Sidebar, TopBar, MobileNav, Breadcrumb } from "@/components/Navigation";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  BookOpen,
  FileText,
  Video,
  Download,
  Search,
  ChevronRight,
  ExternalLink,
  Play,
  Star,
  Clock,
  X,
  Eye,
  GraduationCap,
  Calendar,
} from "lucide-react";

interface Resource {
  id: string;
  title: string;
  type: "pdf" | "video";
  size?: string;
  duration?: string;
  description: string;
  downloads?: number;
  views?: number;
  rating: number;
  category?: string;
  pdfPath?: string;
}

interface CAExam {
  id: string;
  name: string;
  date: string;
  pdfPath: string;
  description: string;
  subjects: string[];
}

const caExams: CAExam[] = [
  {
    id: "september-2024",
    name: "September 2024",
    date: "September 2024",
    pdfPath: "/doc/Suggested_Answer-Membership_Examination_September_2024.pdf",
    description: "CA Membership Examination with suggested answers",
    subjects: ["Corporate Laws", "Advanced Taxation"],
  },
  {
    id: "march-2023",
    name: "March 2023",
    date: "March 2023",
    pdfPath: "/doc/Suggested_Answer_-_Member_Examination_March_2023.pdf",
    description: "CA Membership Examination with suggested answers",
    subjects: ["Corporate Laws", "Advanced Taxation"],
  },
  {
    id: "september-2021",
    name: "September 2021",
    date: "September 2021",
    pdfPath: "/doc/Suggested_Answer_Membership_Exam_September_2021.pdf",
    description: "CA Membership Examination with suggested answers",
    subjects: ["Corporate Laws", "Advanced Taxation"],
  },
  {
    id: "june-2019",
    name: "June 2019",
    date: "June 2019",
    pdfPath: "/doc/CA_Membership_Suggested_Answer_June2019.pdf",
    description: "Corporate Laws, Advanced Taxation with suggested answers",
    subjects: ["Corporate Laws", "Advanced Taxation"],
  },
];

interface CAPExam {
  id: string;
  name: string;
  date: string;
  pdfPath: string;
  description: string;
  subjects: string[];
}

const cap1Exams: CAPExam[] = [
  {
    id: "dec-2022",
    name: "December 2022",
    date: "December 2022",
    pdfPath: "/doc/Suggested_CAP_I_Dec_2022.pdf",
    description: "CAP-I Level Examination with suggested answers",
    subjects: ["Accounting", "Business Mathematics", "Law"],
  },
  {
    id: "mercantile-laws-mcq",
    name: "Mercantile Laws MCQ",
    date: "2019",
    pdfPath: "/doc/1573972756_Mercantile Laws MCQ.pdf",
    description: "Mercantile Laws Multiple Choice Questions with answers",
    subjects: ["Law"],
  },
  {
    id: "commercial-maths-mcq",
    name: "Commercial Mathematics and Statistics MCQ",
    date: "2019",
    pdfPath: "/doc/1573367563_CAP I_Paper 3B_MCQ.pdf",
    description: "Commercial Mathematics and Statistics Multiple Choice Questions with answers",
    subjects: ["Business Mathematics", "Statistics"],
  },
];

interface CAP3Exam {
  id: string;
  name: string;
  date: string;
  pdfPath: string;
  description: string;
  subjects: string[];
}

const cap3Exams: CAP3Exam[] = [
  {
    id: "dec-2022-group1",
    name: "December 2022 - Group I",
    date: "December 2022",
    pdfPath: "/doc/Suggested_December_2022_CAP_III_Group_I.pdf",
    description: "CAP-III Level Examination Group I with suggested answers",
    subjects: ["Advanced Taxation", "Advanced Assurance", "Financial Management"],
  },
  {
    id: "june-2021-group2",
    name: "June 2021 - Group II",
    date: "June 2021",
    pdfPath: "/doc/CAP-III_SA_Group-II_June2021_Final.pdf",
    description: "CAP-III Level Examination Group II (SA) with suggested answers",
    subjects: ["Advanced Taxation", "Advanced Assurance", "Financial Management"],
  },
];

interface CAP2Exam {
  id: string;
  name: string;
  date: string;
  pdfPath: string;
  description: string;
  subjects: string[];
}

const cap2Exams: CAP2Exam[] = [
  {
    id: "june-2022-group1",
    name: "June 2022 - Group I",
    date: "June 2022",
    pdfPath: "/doc/1__CAP-II_SA_Group-I_June2022.pdf",
    description: "CAP-II Level Examination Group I with suggested answers",
    subjects: ["Advanced Accounting", "Audit and Assurance", "Corporate and Other Laws"],
  },
  {
    id: "dec-2022-group1",
    name: "December 2022 - Group I",
    date: "December 2022",
    pdfPath: "/doc/Suggested_CAP_II_Dec_2022_CAP_II_Group_I.pdf",
    description: "CAP-II Level Examination Group I with suggested answers",
    subjects: ["Advanced Accounting", "Audit and Assurance", "Corporate and Other Laws"],
  },
];

const resources: Resource[] = [
  {
    id: "new-ca-syllabus",
    title: "New CA Syllabus 2026",
    type: "pdf",
    size: "Updated",
    description: "New CA Syllabus 2026 for ICAN examination",
    downloads: 0,
    rating: 0,
    pdfPath: "/doc/New_CA_Syllabus.pdf",
  },
  {
    id: "1",
    title: "ICAN Foundation Syllabus 2026",
    type: "pdf",
    size: "2.4 MB",
    description: "Official ICAN syllabus for Foundation level",
    downloads: 1245,
    rating: 4.8,
  },
  {
    id: "2",
    title: "NFRS Summary Notes",
    type: "pdf",
    size: "5.1 MB",
    description: "Complete NFRS summary with examples",
    downloads: 892,
    rating: 4.9,
  },
  {
    id: "3",
    title: "Tax Act 2025 - Nepal",
    type: "pdf",
    size: "8.2 MB",
    description: "Income Tax Act with amendments",
    downloads: 756,
    rating: 4.7,
  },
  {
    id: "4",
    title: "Accounting Standards Video Series",
    type: "video",
    duration: "4h 30m",
    description: "Video lectures on accounting standards",
    views: 3421,
    rating: 4.6,
  },
  {
    id: "5",
    title: "Past 5 Years Question Papers",
    type: "pdf",
    size: "15.8 MB",
    description: "Compilation of past exam questions",
    downloads: 1892,
    rating: 4.8,
  },
  {
    id: "6",
    title: "VAT Calculation Guide",
    type: "pdf",
    size: "1.8 MB",
    description: "Step-by-step VAT calculation methods",
    downloads: 623,
    rating: 4.5,
  },
  {
    id: "7",
    title: "CA Membership Exam",
    type: "pdf",
    size: "1.2 MB",
    description: "Past exam papers with suggested answers",
    downloads: 456,
    rating: 4.9,
    category: "membership",
  },
  {
    id: "8",
    title: "CAP-I Level Exams",
    type: "pdf",
    size: "2.5 MB",
    description: "CAP-I past exam papers with suggested answers",
    downloads: 234,
    rating: 4.7,
    category: "cap-i",
  },
  {
    id: "9",
    title: "CAP-III Level Exams",
    type: "pdf",
    size: "3.0 MB",
    description: "CAP-III past exam papers with suggested answers",
    downloads: 156,
    rating: 4.8,
    category: "cap-iii",
  },
  {
    id: "10",
    title: "CAP-II Level Exams",
    type: "pdf",
    size: "2.8 MB",
    description: "CAP-II past exam papers with suggested answers",
    downloads: 189,
    rating: 4.7,
    category: "cap-ii",
  },
];

function ResourcesContent() {
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);
  const [showExamList, setShowExamList] = useState(false);
  const [showCAPList, setShowCAPList] = useState(false);
  const [showCAP3List, setShowCAP3List] = useState(false);
  const [showCAP2List, setShowCAP2List] = useState(false);
  const [selectedExam, setSelectedExam] = useState<CAExam | null>(null);
  const [selectedCAPExam, setSelectedCAPExam] = useState<CAPExam | null>(null);
  const [selectedCAP3Exam, setSelectedCAP3Exam] = useState<CAP3Exam | null>(null);
  const [selectedCAP2Exam, setSelectedCAP2Exam] = useState<CAP2Exam | null>(null);

  const handleExamClick = (exam: CAExam) => {
    setSelectedExam(exam);
    setSelectedPdf(exam.pdfPath);
    setShowExamList(false);
  };

  const handleCAPExamClick = (exam: CAPExam) => {
    setSelectedCAPExam(exam);
    setSelectedPdf(exam.pdfPath);
    setShowCAPList(false);
  };

  const handleCAP3ExamClick = (exam: CAP3Exam) => {
    setSelectedCAP3Exam(exam);
    setSelectedPdf(exam.pdfPath);
    setShowCAP3List(false);
  };

  const handleCAP2ExamClick = (exam: CAP2Exam) => {
    setSelectedCAP2Exam(exam);
    setSelectedPdf(exam.pdfPath);
    setShowCAP2List(false);
  };

  const pdfCount = resources.filter(r => r.type === "pdf").length;
  const videoCount = resources.filter(r => r.type === "video").length;
  const totalDownloads = resources.reduce((sum, r) => sum + (r.downloads || 0), 0);

  return (
    <div className="max-w-6xl mx-auto py-8">
      <Breadcrumb items={[{ label: "Dashboard", href: "/dashboard" }, { label: "Resources" }]} />

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Study Resources</h1>
          <p className="text-slate-light">Access ICAN materials, notes, and past papers</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate" />
            <input
              type="text"
              placeholder="Search resources..."
              className="pl-10 pr-4 py-2 bg-navy-light border border-slate/20 rounded-xl text-sm focus:outline-none focus:border-teal"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { icon: FileText, label: "PDFs", count: pdfCount },
          { icon: Video, label: "Videos", count: videoCount },
          { icon: BookOpen, label: "Notes", count: 0 },
          { icon: Download, label: "Downloads", count: totalDownloads },
        ].map((cat) => (
          <Card key={cat.label} className="p-4 text-center cursor-pointer hover:border-teal/30 transition-colors">
            <cat.icon className="w-6 h-6 text-teal mx-auto mb-2" />
            <p className="font-semibold">{cat.count}</p>
            <p className="text-sm text-slate">{cat.label}</p>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((resource) => (
          <Card key={resource.id} className="p-5 hover:border-teal/30 transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                resource.type === "pdf" ? "bg-red-500/20" : "bg-violet-500/20"
              }`}>
                {resource.type === "pdf" ? (
                  <FileText className="w-6 h-6 text-red-400" />
                ) : (
                  <Play className="w-6 h-6 text-violet-400" />
                )}
              </div>
              <div className="flex items-center gap-1 bg-amber-500/20 px-2 py-1 rounded-full">
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                <span className="text-xs text-amber-400 font-medium">{resource.rating}</span>
              </div>
            </div>

            <h3 className="font-semibold mb-2">{resource.title}</h3>
            <p className="text-sm text-slate mb-4">{resource.description}</p>

            <div className="flex items-center justify-between text-xs text-slate mb-4">
              <div className="flex items-center gap-1">
                {resource.type === "pdf" ? (
                  <>
                    <FileText className="w-3 h-3" />
                    {resource.size}
                  </>
                ) : (
                  <>
                    <Clock className="w-3 h-3" />
                    {resource.duration}
                  </>
                )}
              </div>
              <span>{resource.type === "pdf" ? `${resource.downloads} downloads` : `${resource.views} views`}</span>
            </div>

            {resource.category === "membership" ? (
              <Button 
                variant="secondary" 
                size="sm" 
                className="w-full"
                onClick={() => setShowExamList(true)}
              >
                <GraduationCap className="w-4 h-4" />
                View Exams
              </Button>
            ) : resource.category === "cap-i" ? (
              <Button 
                variant="secondary" 
                size="sm" 
                className="w-full"
                onClick={() => setShowCAPList(true)}
              >
                <GraduationCap className="w-4 h-4" />
                View Exams
              </Button>
            ) : resource.category === "cap-iii" ? (
              <Button 
                variant="secondary" 
                size="sm" 
                className="w-full"
                onClick={() => setShowCAP3List(true)}
              >
                <GraduationCap className="w-4 h-4" />
                View Exams
              </Button>
            ) : resource.category === "cap-ii" ? (
              <Button 
                variant="secondary" 
                size="sm" 
                className="w-full"
                onClick={() => setShowCAP2List(true)}
              >
                <GraduationCap className="w-4 h-4" />
                View Exams
              </Button>
            ) : resource.pdfPath ? (
              <Button 
                variant="secondary" 
                size="sm" 
                className="w-full"
                onClick={() => setSelectedPdf(resource.pdfPath!)}
              >
                <Eye className="w-4 h-4" />
                View PDF
              </Button>
            ) : (
              <Button variant="secondary" size="sm" className="w-full">
                <Download className="w-4 h-4" />
                {resource.type === "pdf" ? "Download" : "Watch"}
              </Button>
            )}
          </Card>
        ))}
      </div>

      <Card className="p-6 mt-8 gradient-primary border-0">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold mb-2">Need Custom Study Material?</h3>
            <p className="text-slate-light">Our AI can generate personalized notes based on your weak areas</p>
          </div>
          <Button>
            Generate with AI
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </Card>

      {/* CA Exam List Modal */}
      {showExamList && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-navy rounded-2xl w-full max-w-2xl">
            <div className="flex items-center justify-between p-4 border-b border-slate/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">CA Membership Exams</h3>
                  <p className="text-xs text-slate">Select an exam to view</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowExamList(false)}
                className="rounded-full"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
              {caExams.map((exam) => (
                <div 
                  key={exam.id}
                  className="p-4 bg-navy-light rounded-xl hover:bg-navy border border-slate/20 hover:border-teal/30 transition-all cursor-pointer"
                  onClick={() => handleExamClick(exam)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-lg">{exam.name}</h4>
                      <p className="text-sm text-slate">{exam.description}</p>
                    </div>
                    <div className="flex items-center gap-1 bg-amber-500/20 px-2 py-1 rounded-full">
                      <FileText className="w-3 h-3 text-amber-400" />
                      <span className="text-xs text-amber-400 font-medium">PDF</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <div className="flex items-center gap-1 text-xs text-slate">
                      <Calendar className="w-3 h-3" />
                      {exam.date}
                    </div>
                    <span className="text-slate/30">•</span>
                    <div className="flex gap-1">
                      {exam.subjects.map((subject, idx) => (
                        <span key={idx} className="text-xs bg-teal/20 text-teal px-2 py-0.5 rounded-full">
                          {subject}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CAP-I Exam List Modal */}
      {showCAPList && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-navy rounded-2xl w-full max-w-2xl">
            <div className="flex items-center justify-between p-4 border-b border-slate/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">CAP-I Level Exams</h3>
                  <p className="text-xs text-slate">Select an exam to view</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowCAPList(false)}
                className="rounded-full"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
              {cap1Exams.map((exam) => (
                <div 
                  key={exam.id}
                  className="p-4 bg-navy-light rounded-xl hover:bg-navy border border-slate/20 hover:border-teal/30 transition-all cursor-pointer"
                  onClick={() => handleCAPExamClick(exam)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-lg">{exam.name}</h4>
                      <p className="text-sm text-slate">{exam.description}</p>
                    </div>
                    <div className="flex items-center gap-1 bg-violet-500/20 px-2 py-1 rounded-full">
                      <FileText className="w-3 h-3 text-violet-400" />
                      <span className="text-xs text-violet-400 font-medium">PDF</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <div className="flex items-center gap-1 text-xs text-slate">
                      <Calendar className="w-3 h-3" />
                      {exam.date}
                    </div>
                    <span className="text-slate/30">•</span>
                    <div className="flex gap-1">
                      {exam.subjects.map((subject, idx) => (
                        <span key={idx} className="text-xs bg-teal/20 text-teal px-2 py-0.5 rounded-full">
                          {subject}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CAP-III Exam List Modal */}
      {showCAP3List && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-navy rounded-2xl w-full max-w-2xl">
            <div className="flex items-center justify-between p-4 border-b border-slate/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">CAP-III Level Exams</h3>
                  <p className="text-xs text-slate">Select an exam to view</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowCAP3List(false)}
                className="rounded-full"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
              {cap3Exams.map((exam) => (
                <div 
                  key={exam.id}
                  className="p-4 bg-navy-light rounded-xl hover:bg-navy border border-slate/20 hover:border-teal/30 transition-all cursor-pointer"
                  onClick={() => handleCAP3ExamClick(exam)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-lg">{exam.name}</h4>
                      <p className="text-sm text-slate">{exam.description}</p>
                    </div>
                    <div className="flex items-center gap-1 bg-rose-500/20 px-2 py-1 rounded-full">
                      <FileText className="w-3 h-3 text-rose-400" />
                      <span className="text-xs text-rose-400 font-medium">PDF</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <div className="flex items-center gap-1 text-xs text-slate">
                      <Calendar className="w-3 h-3" />
                      {exam.date}
                    </div>
                    <span className="text-slate/30">•</span>
                    <div className="flex gap-1">
                      {exam.subjects.map((subject, idx) => (
                        <span key={idx} className="text-xs bg-teal/20 text-teal px-2 py-0.5 rounded-full">
                          {subject}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CAP-II Exam List Modal */}
      {showCAP2List && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-navy rounded-2xl w-full max-w-2xl">
            <div className="flex items-center justify-between p-4 border-b border-slate/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">CAP-II Level Exams</h3>
                  <p className="text-xs text-slate">Select an exam to view</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowCAP2List(false)}
                className="rounded-full"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
              {cap2Exams.map((exam) => (
                <div 
                  key={exam.id}
                  className="p-4 bg-navy-light rounded-xl hover:bg-navy border border-slate/20 hover:border-teal/30 transition-all cursor-pointer"
                  onClick={() => handleCAP2ExamClick(exam)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-lg">{exam.name}</h4>
                      <p className="text-sm text-slate">{exam.description}</p>
                    </div>
                    <div className="flex items-center gap-1 bg-cyan-500/20 px-2 py-1 rounded-full">
                      <FileText className="w-3 h-3 text-cyan-400" />
                      <span className="text-xs text-cyan-400 font-medium">PDF</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <div className="flex items-center gap-1 text-xs text-slate">
                      <Calendar className="w-3 h-3" />
                      {exam.date}
                    </div>
                    <span className="text-slate/30">•</span>
                    <div className="flex gap-1">
                      {exam.subjects.map((subject, idx) => (
                        <span key={idx} className="text-xs bg-teal/20 text-teal px-2 py-0.5 rounded-full">
                          {subject}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PDF Viewer Modal */}
      {selectedPdf && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-navy rounded-2xl w-full max-w-4xl h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-slate/20">
              <h3 className="font-semibold">
                {selectedExam?.name || selectedCAPExam?.name || selectedCAP3Exam?.name || selectedCAP2Exam?.name || "PDF Viewer"}
              </h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  setSelectedPdf(null);
                  setSelectedExam(null);
                  setSelectedCAPExam(null);
                }}
                className="rounded-full"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="flex-1 overflow-hidden">
              <iframe
                src={selectedPdf}
                className="w-full h-full"
                title="PDF Viewer"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-navy">
      <Sidebar />
      <TopBar />

      <main className="ml-64 pt-16 pb-24 md:pb-8 px-6">
        <ProtectedRoute>
          <ResourcesContent />
        </ProtectedRoute>
      </main>

      <MobileNav />
    </div>
  );
}