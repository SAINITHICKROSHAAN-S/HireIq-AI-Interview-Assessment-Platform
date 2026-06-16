import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Plus, 
  Trash2, 
  Edit3, 
  ExternalLink, 
  Clock, 
  BookOpen,
  Search,
  CheckCircle,
  XCircle
} from 'lucide-react';

const AssessmentManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Sample assessments list
  const [assessments, setAssessments] = useState([
    { id: 1, title: 'Senior React Developer Assessment', description: 'Advanced React patterns, state management, hooks, and hooks performance testing.', duration: 45, passingScore: 70, questionCount: 15 },
    { id: 2, title: 'Java Spring Boot Core Concepts', description: 'Core Spring Framework DI/IOC, Spring MVC, REST APIs, JPA/Hibernate & Spring Security.', duration: 60, passingScore: 75, questionCount: 20 },
    { id: 3, title: 'AI & Machine Learning Foundations', description: 'Basic concepts, supervised/unsupervised learning models, neural networks and basic NLP.', duration: 30, passingScore: 65, questionCount: 10 },
  ]);

  const filteredAssessments = assessments.filter(assessment => 
    assessment.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white light:text-black">Assessment Management</h2>
          <p className="text-sm text-zinc-500 light:text-zinc-400">
            Create assessments, configure settings, and link question lists
          </p>
        </div>
        <button
          className="flex items-center space-x-2 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-brand-500/10 hover:shadow-brand-500/20 transition cursor-pointer"
        >
          <Plus size={16} />
          <span>Create Assessment</span>
        </button>
      </div>

      {/* Filter / Search bar */}
      <div className="relative max-w-md">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-500" />
        <input
          type="text"
          placeholder="Search assessments..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-xl border border-zinc-900 light:border-zinc-200 bg-zinc-950/50 light:bg-zinc-50 py-2.5 pl-10 pr-4 text-sm text-white light:text-black focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-all"
        />
      </div>

      {/* Grid of assessments */}
      <div className="grid gap-6 md:grid-cols-2">
        {filteredAssessments.map((assessment) => (
          <div 
            key={assessment.id} 
            className="border border-[#1a1a1a] light:border-zinc-200 bg-[#0a0a0a]/60 light:bg-white/60 p-6 rounded-2xl backdrop-blur-sm flex flex-col justify-between hover:border-zinc-800 light:hover:border-zinc-300 transition"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-xl bg-brand-600/10 text-brand-400 border border-brand-500/20">
                    <FileSpreadsheet size={20} />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-white light:text-black">{assessment.title}</h3>
                    <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider">
                      Assessment ID: #{assessment.id}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-zinc-400 light:text-zinc-500 leading-relaxed min-h-[40px]">
                {assessment.description}
              </p>

              <div className="grid grid-cols-3 gap-4 py-3 border-y border-[#161616] light:border-zinc-200">
                <div className="text-center">
                  <div className="text-xs font-semibold text-zinc-500">Duration</div>
                  <div className="mt-1 flex items-center justify-center space-x-1 text-sm font-bold text-white light:text-black">
                    <Clock size={12} className="text-brand-400" />
                    <span>{assessment.duration}m</span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs font-semibold text-zinc-500">Questions</div>
                  <div className="mt-1 flex items-center justify-center space-x-1 text-sm font-bold text-white light:text-black">
                    <BookOpen size={12} className="text-purple-400" />
                    <span>{assessment.questionCount}</span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs font-semibold text-zinc-500">Passing Score</div>
                  <div className="mt-1 flex items-center justify-center space-x-1 text-sm font-bold text-emerald-400">
                    <CheckCircle size={12} />
                    <span>{assessment.passingScore}%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-6 pt-2">
              <Link
                to={`/recruiter/analytics`}
                className="text-xs font-semibold text-zinc-400 light:text-zinc-500 hover:text-white light:hover:text-black flex items-center space-x-1 cursor-pointer"
              >
                <span>Analytics</span>
                <ExternalLink size={12} />
              </Link>
              
              <div className="flex items-center space-x-2">
                <button 
                  className="p-2 bg-zinc-950 light:bg-zinc-50 border border-zinc-900 light:border-zinc-200 rounded-lg text-zinc-400 hover:text-white light:hover:text-black transition cursor-pointer"
                  aria-label="Edit assessment"
                >
                  <Edit3 size={14} />
                </button>
                <button 
                  className="p-2 bg-red-950/20 light:bg-red-50 border border-red-950/50 light:border-red-100 rounded-lg text-red-400 hover:text-red-300 transition cursor-pointer"
                  aria-label="Delete assessment"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default AssessmentManagement;
