import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Award, 
  Clock, 
  CheckCircle, 
  XCircle,
  HelpCircle,
  ChevronDown
} from 'lucide-react';

const AnalyticsDashboard = () => {
  const [selectedAssessment, setSelectedAssessment] = useState(1);

  // Mock assessments catalog for filter dropdown
  const assessments = [
    { id: 1, title: 'Senior React Developer Assessment' },
    { id: 2, title: 'Java Spring Boot Core Concepts' },
    { id: 3, title: 'AI & Machine Learning Foundations' },
  ];

  // Mock analytics matching AssessmentAnalyticsResponse
  const assessmentAnalytics = {
    assessmentId: 1,
    assessmentTitle: 'Senior React Developer Assessment',
    totalAttempts: 124,
    averageScore: 74.2,
    highestScore: 100,
    lowestScore: 20,
    passPercentage: 78.5,
    completionPercentage: 92.4,
  };

  // Mock accuracy matching QuestionAccuracySummary DTO
  const questionAccuracy = [
    { questionId: 101, questionText: 'What is the virtual DOM in React?', accuracyPercentage: 88.0, isHigh: true },
    { questionId: 102, questionText: 'Explain hooks lifecycle rules.', accuracyPercentage: 74.5, isHigh: true },
    { questionId: 103, questionText: 'Difference between useEffect cleanup and componentWillUnmount.', accuracyPercentage: 35.2, isHigh: false },
    { questionId: 104, questionText: 'How does React.memo optimize components?', accuracyPercentage: 42.0, isHigh: false },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white light:text-black">Analytics Dashboard</h2>
          <p className="text-sm text-zinc-500 light:text-zinc-400">
            Track performance metrics, success percentages, and question accuracies
          </p>
        </div>

        {/* Assessment selector dropdown */}
        <div className="relative">
          <select
            value={selectedAssessment}
            onChange={(e) => setSelectedAssessment(Number(e.target.value))}
            className="w-full md:w-64 appearance-none rounded-xl border border-zinc-900 light:border-zinc-200 bg-[#0a0a0a] light:bg-zinc-50 px-4 py-2.5 text-xs font-semibold text-white light:text-black focus:outline-none focus:ring-1 focus:ring-brand-500 cursor-pointer"
          >
            {assessments.map(a => (
              <option key={a.id} value={a.id}>{a.title}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" size={14} />
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        
        {/* Total Attempts */}
        <div className="border border-[#1a1a1a] light:border-zinc-200 bg-[#0a0a0a]/60 light:bg-white/60 p-6 rounded-2xl backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Total Attempts</span>
            <Users className="text-brand-400" size={18} />
          </div>
          <div className="mt-4 flex items-baseline space-x-2">
            <h3 className="text-3xl font-bold text-white light:text-black">{assessmentAnalytics.totalAttempts}</h3>
            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/20 px-1.5 py-0.5 rounded border border-emerald-900/30">
              Completed
            </span>
          </div>
        </div>

        {/* Average Score */}
        <div className="border border-[#1a1a1a] light:border-zinc-200 bg-[#0a0a0a]/60 light:bg-white/60 p-6 rounded-2xl backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Average Score</span>
            <Award className="text-purple-400" size={18} />
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-bold text-white light:text-black">{assessmentAnalytics.averageScore}%</h3>
            <div className="mt-2 w-full bg-zinc-950 rounded-full h-1.5 overflow-hidden">
              <div className="bg-purple-500 h-full" style={{ width: `${assessmentAnalytics.averageScore}%` }}></div>
            </div>
          </div>
        </div>

        {/* Pass Percentage */}
        <div className="border border-[#1a1a1a] light:border-zinc-200 bg-[#0a0a0a]/60 light:bg-white/60 p-6 rounded-2xl backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Passing Rate</span>
            <CheckCircle className="text-emerald-400" size={18} />
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-bold text-white light:text-black">{assessmentAnalytics.passPercentage}%</h3>
            <div className="mt-2 w-full bg-zinc-950 rounded-full h-1.5 overflow-hidden">
              <div className="bg-emerald-500 h-full" style={{ width: `${assessmentAnalytics.passPercentage}%` }}></div>
            </div>
          </div>
        </div>

        {/* High / Low score bounds */}
        <div className="border border-[#1a1a1a] light:border-zinc-200 bg-[#0a0a0a]/60 light:bg-white/60 p-6 rounded-2xl backdrop-blur-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Score Bounds</span>
            <TrendingUp className="text-amber-400" size={18} />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] text-zinc-500 block uppercase">Highest</span>
              <span className="text-lg font-bold text-emerald-400">{assessmentAnalytics.highestScore}%</span>
            </div>
            <div>
              <span className="text-[10px] text-zinc-500 block uppercase">Lowest</span>
              <span className="text-lg font-bold text-red-400">{assessmentAnalytics.lowestScore}%</span>
            </div>
          </div>
        </div>

      </div>

      {/* Accuracy Table */}
      <div className="border border-[#1a1a1a] light:border-zinc-200 bg-[#0a0a0a]/60 light:bg-white/60 rounded-2xl p-6 backdrop-blur-sm space-y-6">
        <div>
          <h3 className="text-base font-bold text-white light:text-black">Question Performance Breakdown</h3>
          <p className="text-xs text-zinc-500 mt-1">Review average correctness for each query inside the assessment</p>
        </div>

        <div className="space-y-4">
          {questionAccuracy.map((q) => (
            <div 
              key={q.questionId}
              className="p-4 rounded-xl border border-zinc-900 light:border-zinc-150 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1 max-w-xl">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Question ID: #{q.questionId}</span>
                <p className="text-sm font-semibold text-white light:text-black">{q.questionText}</p>
              </div>

              <div className="flex items-center space-x-6 min-w-[200px]">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-zinc-500">Accuracy</span>
                    <span className={q.isHigh ? 'text-emerald-400' : 'text-red-400'}>{q.accuracyPercentage}%</span>
                  </div>
                  <div className="w-full bg-zinc-950 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className={`h-full ${q.isHigh ? 'bg-emerald-500' : 'bg-red-500'}`} 
                      style={{ width: `${q.accuracyPercentage}%` }}
                    ></div>
                  </div>
                </div>

                <span className={`text-[10px] px-2 py-1 rounded-lg font-bold uppercase ${
                  q.isHigh 
                    ? 'bg-emerald-950/20 border border-emerald-900/30 text-emerald-400' 
                    : 'bg-red-950/20 border border-red-900/30 text-red-400'
                }`}>
                  {q.isHigh ? 'Stable' : 'Review Needed'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default AnalyticsDashboard;
