"use client";

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
} from "lucide-react";

const resources = [
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
];

function ResourcesContent() {
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
          { icon: FileText, label: "PDFs", count: 45 },
          { icon: Video, label: "Videos", count: 12 },
          { icon: BookOpen, label: "Notes", count: 28 },
          { icon: Download, label: "Downloads", count: 156 },
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

            <Button variant="secondary" size="sm" className="w-full">
              <Download className="w-4 h-4" />
              {resource.type === "pdf" ? "Download" : "Watch"}
            </Button>
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