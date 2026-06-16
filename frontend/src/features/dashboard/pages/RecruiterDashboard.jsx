import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FileSpreadsheet, 
  Users, 
  Database, 
  BarChart3, 
  TrendingUp, 
  PlusCircle, 
  ArrowRight,
  Award
} from 'lucide-react';

const RecruiterDashboard = () => {
  // Mock data representing standard dashboard state before API call integration
  const stats = [
    { name: 'Total Assessments', value: '12', change: '+2 this month', icon: FileSpreadsheet, color: 'text-brand-500 bg-brand-500/10' },
    { name: 'Total Questions', value: '148', change: 'Across 6 categories', icon: Database, color: 'text-purple-500 bg-purple-500/10' },
    { name: 'Candidate Attempts', value: '342', change: '+28 since last week', icon: Users, color: 'text-emerald-500 bg-emerald-500/10' },
    { name: 'Average Accuracy', value: '72.4%', change: 'Avg assessment score', icon: Award, color: 'text-amber-500 bg-amber-500/10' },
  ];

  const recentAssessments = [
    { id: 1, title: 'Senior React Developer Assessment', questions: 15, duration: 45, attempts: 89, date: '2026-06-15' },
    { id: 2, title: 'Java Spring Boot Core Concepts', questions: 20, duration: 60, attempts: 124, date: '2026-06-12' },
    { id: 3, title: 'AI & Machine Learning Foundations', questions: 10, duration: 30, attempts: 45, date: '2026-06-10' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
      
      {/* Welcome header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white light:text-black">Dashboard</h2>
          <p className="text-sm text-zinc-500 light:text-zinc-400">
            Monitor assessments, manage question banks, and review candidate metrics
          </p>
        </div>
        <Link 
          to="/recruiter/assessments"
          className="flex items-center space-x-2 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-brand-500/10 hover:shadow-brand-500/20 transition cursor-pointer"
        >
          <PlusCircle size={16} />
          <span>New Assessment</span>
        </Link>
      </div>

      {/* Stats grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div 
              key={stat.name} 
              className="border border-[#1a1a1a] light:border-zinc-200 bg-[#0a0a0a]/60 light:bg-white/60 p-6 rounded-2xl backdrop-blur-sm transition hover:border-zinc-800/80 light:hover:border-zinc-300"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-500 light:text-zinc-400 uppercase tracking-wider">
                  {stat.name}
                </span>
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <Icon size={18} />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-3xl font-bold text-white light:text-black">{stat.value}</h3>
                <p className="mt-1 text-xs text-zinc-500 light:text-zinc-400">{stat.change}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main split grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        
        {/* Left Side: Recent Assessments */}
        <div className="lg:col-span-2 border border-[#1a1a1a] light:border-zinc-200 bg-[#0a0a0a]/60 light:bg-white/60 rounded-2xl p-6 backdrop-blur-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white light:text-black">Recent Assessments</h3>
            <Link 
              to="/recruiter/assessments" 
              className="text-xs font-semibold text-brand-500 hover:text-brand-400 flex items-center space-x-1"
            >
              <span>Manage all</span>
              <ArrowRight size={12} />
            </Link>
          </div>

          <div className="space-y-4">
            {recentAssessments.map((assessment) => (
              <div 
                key={assessment.id} 
                className="flex items-center justify-between p-4 rounded-xl border border-zinc-900 light:border-zinc-150 hover:bg-[#161616]/40 light:hover:bg-zinc-50 transition"
              >
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-white light:text-black">{assessment.title}</h4>
                  <div className="flex items-center space-x-3 text-xs text-zinc-500 light:text-zinc-400">
                    <span>{assessment.questions} Questions</span>
                    <span>•</span>
                    <span>{assessment.duration} mins</span>
                    <span>•</span>
                    <span>Created: {assessment.date}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-white light:text-black">{assessment.attempts}</div>
                  <div className="text-[10px] text-zinc-500">attempts</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Quick Action & Links */}
        <div className="border border-[#1a1a1a] light:border-zinc-200 bg-[#0a0a0a]/60 light:bg-white/60 rounded-2xl p-6 backdrop-blur-sm space-y-6">
          <h3 className="text-base font-bold text-white light:text-black">Quick Tools</h3>
          
          <div className="flex flex-col space-y-3">
            <Link 
              to="/recruiter/questions"
              className="flex items-center space-x-3 p-4 rounded-xl border border-zinc-900 light:border-zinc-200 bg-[#0c0c0c] light:bg-zinc-50 hover:bg-zinc-900/60 light:hover:bg-zinc-100 transition text-sm font-medium text-white light:text-black cursor-pointer"
            >
              <Database size={18} className="text-purple-500" />
              <div className="flex-1 text-left">
                <div>Manage Question Bank</div>
                <div className="text-xs text-zinc-500">Create, edit and catalog questions</div>
              </div>
            </Link>

            <Link 
              to="/recruiter/analytics"
              className="flex items-center space-x-3 p-4 rounded-xl border border-zinc-900 light:border-zinc-200 bg-[#0c0c0c] light:bg-zinc-50 hover:bg-zinc-900/60 light:hover:bg-zinc-100 transition text-sm font-medium text-white light:text-black cursor-pointer"
            >
              <BarChart3 size={18} className="text-emerald-500" />
              <div className="flex-1 text-left">
                <div>Detailed Analytics</div>
                <div className="text-xs text-zinc-500">View assessment and question statistics</div>
              </div>
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
};

export default RecruiterDashboard;
