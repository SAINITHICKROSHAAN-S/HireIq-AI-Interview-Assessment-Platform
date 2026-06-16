import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ClipboardList, 
  Award, 
  FileText, 
  ArrowRight, 
  Calendar,
  Clock,
  Sparkles
} from 'lucide-react';

const CandidateDashboard = () => {
  // Mock data representing standard dashboard state for Candidate
  const availableAssessments = [
    { id: 1, title: 'Senior React Developer Assessment', questions: 15, duration: 45, creator: 'Acme Corp', difficulty: 'Hard' },
    { id: 2, title: 'Java Spring Boot Core Concepts', questions: 20, duration: 60, creator: 'TechSoft Inc', difficulty: 'Medium' },
    { id: 3, title: 'AI & Machine Learning Foundations', questions: 10, duration: 30, creator: 'FutureAI Ltd', difficulty: 'Medium' },
  ];

  const pastAttempts = [
    { id: 101, title: 'Frontend Basics & JS Essentials', score: 85, totalQuestions: 10, date: '2026-06-14', status: 'COMPLETED' },
    { id: 102, title: 'SQL & Database Design Quiz', score: 60, totalQuestions: 15, date: '2026-06-11', status: 'COMPLETED' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
      
      {/* Header banner */}
      <div className="relative border border-brand-900/30 bg-brand-950/20 p-8 rounded-3xl overflow-hidden backdrop-blur-sm">
        {/* Glow behind */}
        <div className="absolute top-0 right-0 h-40 w-40 bg-brand-500/10 rounded-full filter blur-3xl"></div>
        <div className="relative z-10 space-y-4 max-w-xl">
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full border border-brand-900/40 bg-brand-950/40 text-brand-400 text-[10px] font-bold uppercase tracking-wider">
            <Sparkles size={12} />
            <span>AI Powered Tools Available</span>
          </div>
          <h2 className="text-2xl font-bold text-white light:text-black">Supercharge your interview preparation</h2>
          <p className="text-sm text-zinc-400 light:text-zinc-500 leading-relaxed">
            Run your resume through our AI Resume Analyzer to get instant scoring, strength identification, and recommendations matched directly to core job metrics.
          </p>
          <Link 
            to="/candidate/resume-analyzer"
            className="inline-flex items-center space-x-2 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-sm font-semibold transition cursor-pointer"
          >
            <span>Launch Resume Analyzer</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* Available Assessments */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white light:text-black flex items-center space-x-2">
          <ClipboardList size={18} className="text-brand-500" />
          <span>Available Assessments</span>
        </h3>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {availableAssessments.map((assessment) => (
            <div 
              key={assessment.id} 
              className="border border-[#1a1a1a] light:border-zinc-200 bg-[#0a0a0a]/60 light:bg-white/60 p-6 rounded-2xl backdrop-blur-sm flex flex-col justify-between hover:border-zinc-800 light:hover:border-zinc-300 transition"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-zinc-500 light:text-zinc-400 font-bold uppercase tracking-wider">
                    {assessment.creator}
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                    assessment.difficulty === 'Hard' 
                      ? 'bg-red-950/30 border-red-900/30 text-red-400'
                      : 'bg-amber-950/30 border-amber-900/30 text-amber-400'
                  }`}>
                    {assessment.difficulty}
                  </span>
                </div>
                <h4 className="text-base font-semibold text-white light:text-black">{assessment.title}</h4>
                <div className="flex items-center space-x-3 text-xs text-zinc-500 light:text-zinc-400 pt-2">
                  <span className="flex items-center space-x-1">
                    <ClipboardList size={14} />
                    <span>{assessment.questions} Questions</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Clock size={14} />
                    <span>{assessment.duration} mins</span>
                  </span>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-[#161616] light:border-zinc-200">
                <Link 
                  to={`/candidate/attempt/${assessment.id}`}
                  className="w-full inline-flex items-center justify-center space-x-2 py-2 bg-zinc-900 light:bg-zinc-100 hover:bg-zinc-800 light:hover:bg-zinc-200 text-zinc-300 light:text-zinc-800 rounded-xl text-xs font-semibold border border-zinc-800/80 light:border-zinc-300 transition cursor-pointer"
                >
                  <span>Start Assessment</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Past attempts list */}
      <div className="border border-[#1a1a1a] light:border-zinc-200 bg-[#0a0a0a]/60 light:bg-white/60 rounded-2xl p-6 backdrop-blur-sm space-y-6">
        <h3 className="text-base font-bold text-white light:text-black flex items-center space-x-2">
          <Award size={18} className="text-purple-500" />
          <span>Past Attempts & Results</span>
        </h3>

        <div className="space-y-4">
          {pastAttempts.map((attempt) => (
            <div 
              key={attempt.id} 
              className="flex items-center justify-between p-4 rounded-xl border border-zinc-900 light:border-zinc-200 hover:bg-[#161616]/40 light:hover:bg-zinc-50 transition"
            >
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-white light:text-black">{attempt.title}</h4>
                <div className="flex items-center space-x-3 text-xs text-zinc-500 light:text-zinc-400">
                  <span className="flex items-center space-x-1">
                    <Calendar size={12} />
                    <span>Completed: {attempt.date}</span>
                  </span>
                  <span>•</span>
                  <span>{attempt.totalQuestions} Questions</span>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="text-right">
                  <div className="text-sm font-bold text-emerald-400">{attempt.score}%</div>
                  <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">Score</div>
                </div>
                <Link 
                  to={`/candidate/results/${attempt.id}`}
                  className="px-3.5 py-1.5 bg-[#161616] light:bg-zinc-100 hover:bg-zinc-900 light:hover:bg-zinc-200 border border-zinc-800 light:border-zinc-300 text-zinc-300 light:text-zinc-700 rounded-lg text-xs font-medium transition cursor-pointer"
                >
                  View Report
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default CandidateDashboard;
