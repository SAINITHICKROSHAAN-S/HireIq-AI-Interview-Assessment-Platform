import React from 'react';
import { Link } from 'react-router-dom';
import { useRecruiterDashboardQuery } from '../hooks/useDashboardQueries';
import { 
  FileSpreadsheet, 
  Users, 
  Database, 
  BarChart3, 
  PlusCircle, 
  ArrowRight,
  Award,
  AlertCircle,
  RefreshCcw,
  CheckCircle,
  HelpCircle,
  AlertOctagon
} from 'lucide-react';

const RecruiterDashboard = () => {
  // Fetch live dashboard analytics from backend
  const { data, isLoading, isError, error, refetch } = useRecruiterDashboardQuery();

  // 1. LOADING STATE - Sleek dark skeletons
  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-7 w-48 bg-zinc-900 rounded-lg"></div>
            <div className="h-4 w-72 bg-zinc-900/60 rounded"></div>
          </div>
          <div className="h-10 w-36 bg-zinc-900 rounded-xl"></div>
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, idx) => (
            <div key={idx} className="border border-zinc-900 bg-zinc-950/40 p-6 rounded-2xl h-36 flex flex-col justify-between">
              <div className="flex justify-between items-center">
                <div className="h-4 w-24 bg-zinc-900 rounded"></div>
                <div className="h-8 w-8 bg-zinc-900 rounded-lg"></div>
              </div>
              <div className="space-y-2">
                <div className="h-8 w-16 bg-zinc-900 rounded"></div>
                <div className="h-3 w-32 bg-zinc-900/60 rounded"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Dashboard Grid Skeleton */}
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 border border-zinc-900 bg-zinc-950/40 rounded-2xl p-6 h-96">
            <div className="h-5 w-36 bg-zinc-900 rounded mb-6"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, idx) => (
                <div key={idx} className="h-16 bg-zinc-900/40 rounded-xl border border-zinc-900/60"></div>
              ))}
            </div>
          </div>
          <div className="border border-zinc-900 bg-zinc-950/40 rounded-2xl p-6 h-96">
            <div className="h-5 w-36 bg-zinc-900 rounded mb-6"></div>
            <div className="h-32 bg-zinc-900/40 rounded-xl border border-zinc-900/60"></div>
          </div>
        </div>
      </div>
    );
  }

  // 2. ERROR STATE - SaaS Connection Error Card
  if (isError) {
    return (
      <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center">
        <div className="border border-red-950/40 bg-red-950/5 p-8 rounded-3xl max-w-md w-full text-center space-y-6 backdrop-blur-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-950/20 text-red-400 border border-red-900/30">
            <AlertOctagon size={24} />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-base font-bold text-white">Analytics connection failed</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              {error.response?.data || 'We encountered an error loading dashboard statistics. Please verify the backend service is online.'}
            </p>
          </div>

          <button
            onClick={() => refetch()}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white rounded-xl text-xs font-semibold hover:bg-zinc-800 transition cursor-pointer"
          >
            <RefreshCcw size={14} />
            <span>Try Again</span>
          </button>
        </div>
      </div>
    );
  }

  // Handle defaults if fields are empty
  const totalAssessments = data?.totalAssessmentsCreated || 0;
  const totalQuestions = data?.totalQuestionsCreated || 0;
  const totalAttempts = data?.totalCandidateAttempts || 0;
  const averageScore = data?.averageAssessmentScore ? Number(data.averageAssessmentScore).toFixed(1) : '0.0';

  const stats = [
    { name: 'Total Assessments', value: totalAssessments, change: 'Created assessments', icon: FileSpreadsheet, color: 'text-brand-400 bg-brand-600/10 border-brand-500/20' },
    { name: 'Total Questions', value: totalQuestions, change: 'Categorized pool', icon: Database, color: 'text-purple-400 bg-purple-600/10 border-purple-500/20' },
    { name: 'Candidate Attempts', value: totalAttempts, change: 'Submissions score logs', icon: Users, color: 'text-emerald-400 bg-emerald-600/10 border-emerald-500/20' },
    { name: 'Average Score', value: `${averageScore}%`, change: 'Avg assessment accuracy', icon: Award, color: 'text-amber-400 bg-amber-600/10 border-amber-500/20' },
  ];

  const hasMostCorrect = data?.mostCorrectQuestions && data.mostCorrectQuestions.length > 0;
  const hasMostIncorrect = data?.mostIncorrectQuestions && data.mostIncorrectQuestions.length > 0;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
      
      {/* Welcome header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white light:text-black font-sans">Dashboard</h2>
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

      {/* KPI Stats grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div 
              key={stat.name} 
              className="border border-[#1a1a1a] light:border-zinc-200 bg-[#0a0a0a]/60 light:bg-white/60 p-6 rounded-2xl backdrop-blur-sm transition hover:border-zinc-800/80 light:hover:border-zinc-350 shadow-lg shadow-black/10"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-500 light:text-zinc-400 uppercase tracking-wider">
                  {stat.name}
                </span>
                <div className={`p-2 rounded-lg border ${stat.color}`}>
                  <Icon size={18} />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-3xl font-extrabold text-white light:text-black">{stat.value}</h3>
                <p className="mt-1 text-xs text-zinc-500 light:text-zinc-400">{stat.change}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main split grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        
        {/* Left Side: Question Analytics */}
        <div className="lg:col-span-2 border border-[#1a1a1a] light:border-zinc-200 bg-[#0a0a0a]/60 light:bg-white/60 rounded-2xl p-6 backdrop-blur-sm space-y-6">
          <div>
            <h3 className="text-base font-bold text-white light:text-black">Top Question Insights</h3>
            <p className="text-xs text-zinc-500 mt-1">Review top-performing and lowest-accuracy questions pool</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            
            {/* High Accuracy Questions */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center space-x-1.5">
                <CheckCircle size={14} />
                <span>Highest Accuracy</span>
              </h4>
              {hasMostCorrect ? (
                <div className="space-y-3">
                  {data.mostCorrectQuestions.slice(0, 3).map((q) => (
                    <div key={q.questionId} className="p-3.5 rounded-xl border border-zinc-900/60 light:border-zinc-150 bg-zinc-950/20 light:bg-zinc-50 text-xs">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[10px] text-zinc-500">ID: #{q.questionId}</span>
                        <span className="font-bold text-emerald-400">{Number(q.accuracyPercentage).toFixed(0)}% accuracy</span>
                      </div>
                      <p className="text-zinc-300 light:text-zinc-700 font-medium truncate">{q.questionText}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 border border-dashed border-zinc-900 rounded-xl text-xs text-zinc-600">
                  No correct logs recorded yet.
                </div>
              )}
            </div>

            {/* Low Accuracy Questions */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center space-x-1.5">
                <AlertCircle size={14} />
                <span>Lowest Accuracy</span>
              </h4>
              {hasMostIncorrect ? (
                <div className="space-y-3">
                  {data.mostIncorrectQuestions.slice(0, 3).map((q) => (
                    <div key={q.questionId} className="p-3.5 rounded-xl border border-zinc-900/60 light:border-zinc-150 bg-zinc-950/20 light:bg-zinc-50 text-xs">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[10px] text-zinc-500">ID: #{q.questionId}</span>
                        <span className="font-bold text-red-400">{Number(q.accuracyPercentage).toFixed(0)}% accuracy</span>
                      </div>
                      <p className="text-zinc-300 light:text-zinc-700 font-medium truncate">{q.questionText}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 border border-dashed border-zinc-900 rounded-xl text-xs text-zinc-600">
                  No incorrect logs recorded yet.
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Right Side: Quick Action & Links */}
        <div className="border border-[#1a1a1a] light:border-zinc-200 bg-[#0a0a0a]/60 light:bg-white/60 rounded-2xl p-6 backdrop-blur-sm space-y-6">
          <h3 className="text-base font-bold text-white light:text-black">Quick Tools</h3>
          
          <div className="flex flex-col space-y-3">
            <Link 
              to="/recruiter/assessments"
              className="flex items-center space-x-3 p-4 rounded-xl border border-zinc-900 light:border-zinc-200 bg-[#0c0c0c] light:bg-zinc-50 hover:bg-zinc-900/60 light:hover:bg-zinc-100 transition text-sm font-medium text-white light:text-black cursor-pointer group"
            >
              <FileSpreadsheet size={18} className="text-brand-500" />
              <div className="flex-1 text-left">
                <div>Create Assessment</div>
                <div className="text-xs text-zinc-500">Configure settings and timings</div>
              </div>
              <ArrowRight size={14} className="text-zinc-600 group-hover:text-white transition-transform group-hover:translate-x-0.5" />
            </Link>

            <Link 
              to="/recruiter/questions"
              className="flex items-center space-x-3 p-4 rounded-xl border border-zinc-900 light:border-zinc-200 bg-[#0c0c0c] light:bg-zinc-50 hover:bg-zinc-900/60 light:hover:bg-zinc-100 transition text-sm font-medium text-white light:text-black cursor-pointer group"
            >
              <Database size={18} className="text-purple-500" />
              <div className="flex-1 text-left">
                <div>Manage Questions</div>
                <div className="text-xs text-zinc-500">Create, edit and catalog questions</div>
              </div>
              <ArrowRight size={14} className="text-zinc-600 group-hover:text-white transition-transform group-hover:translate-x-0.5" />
            </Link>

            <Link 
              to="/recruiter/analytics"
              className="flex items-center space-x-3 p-4 rounded-xl border border-zinc-900 light:border-zinc-200 bg-[#0c0c0c] light:bg-zinc-50 hover:bg-zinc-900/60 light:hover:bg-zinc-100 transition text-sm font-medium text-white light:text-black cursor-pointer group"
            >
              <BarChart3 size={18} className="text-emerald-500" />
              <div className="flex-1 text-left">
                <div>View Analytics</div>
                <div className="text-xs text-zinc-500">View assessment and question stats</div>
              </div>
              <ArrowRight size={14} className="text-zinc-600 group-hover:text-white transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
};

export default RecruiterDashboard;
