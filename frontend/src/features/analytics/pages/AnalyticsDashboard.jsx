import React, { useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, RadialBarChart, RadialBar, Legend,
  AreaChart, Area
} from 'recharts';
import {
  BarChart3, TrendingUp, Users, Award, CheckCircle, XCircle,
  ChevronDown, AlertCircle, Zap, Target, Activity, BookOpen,
  ThumbsUp, ThumbsDown, Layers, Percent
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useRecruiterDashboardQuery, useAssessmentAnalyticsQuery } from '../hooks/useAnalytics';
import { getAllAssessments } from '../../assessments/api/assessmentsApi';
import { getQuestionsByAssessment } from '../../questions/api/questionsApi';
import { getQuestionAnalytics } from '../api/analyticsApi';

// ─── Palette ─────────────────────────────────────────────────────────────────
const BRAND   = '#6366f1';
const EMERALD = '#10b981';
const AMBER   = '#f59e0b';
const RED     = '#ef4444';
const PURPLE  = '#a855f7';
const PIE_PASS   = '#10b981';
const PIE_FAIL   = '#ef4444';

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3 shadow-2xl text-xs space-y-1">
      {label && <p className="text-zinc-400 font-semibold mb-1">{label}</p>}
      {payload.map((p, i) => (
        <div key={i} className="flex items-center space-x-2">
          <span className="h-2 w-2 rounded-full inline-block flex-shrink-0" style={{ background: p.fill || p.color || p.stroke }} />
          <span className="text-zinc-300">{p.name}:</span>
          <span className="font-bold text-white">{typeof p.value === 'number' ? p.value.toFixed(1) : p.value}{p.unit || ''}</span>
        </div>
      ))}
    </div>
  );
};

// ─── Skeleton block ──────────────────────────────────────────────────────────
const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-zinc-900/70 rounded-2xl ${className}`} />
);

// ─── Stat card ───────────────────────────────────────────────────────────────
const StatCard = ({ label, value, sub, icon: Icon, color, bar, barColor }) => (
  <div className="border border-zinc-900 light:border-zinc-200 bg-[#090909]/80 light:bg-white/80 p-6 rounded-2xl backdrop-blur-sm space-y-4 hover:border-zinc-700 transition">
    <div className="flex items-center justify-between">
      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{label}</span>
      <Icon size={17} className={color} />
    </div>
    <div>
      <span className="text-3xl font-extrabold text-white light:text-zinc-900 tracking-tight">{value ?? '—'}</span>
      {sub && <p className="text-[10px] text-zinc-500 mt-1">{sub}</p>}
    </div>
    {bar != null && (
      <div className="h-1.5 bg-zinc-900 light:bg-zinc-200 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ${barColor}`} style={{ width: `${Math.min(bar, 100)}%` }} />
      </div>
    )}
  </div>
);

// ─── Section header ──────────────────────────────────────────────────────────
const SectionHeader = ({ icon: Icon, title, desc, iconColor = 'text-brand-500' }) => (
  <div className="flex items-start space-x-3">
    <div className={`p-2 rounded-xl border border-zinc-900 bg-zinc-950 ${iconColor}`}>
      <Icon size={16} />
    </div>
    <div>
      <h3 className="text-base font-bold text-white light:text-zinc-900">{title}</h3>
      {desc && <p className="text-xs text-zinc-500 mt-0.5">{desc}</p>}
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const AnalyticsDashboard = () => {
  const [selectedAssessmentId, setSelectedAssessmentId] = useState('');

  // Fetch all assessments for selector
  const { data: assessments = [] } = useQuery({
    queryKey: ['assessments'],
    queryFn: getAllAssessments,
    staleTime: 30000
  });

  // Auto-select first assessment
  React.useEffect(() => {
    if (assessments.length > 0 && !selectedAssessmentId) {
      setSelectedAssessmentId(String(assessments[0].id));
    }
  }, [assessments, selectedAssessmentId]);

  // Recruiter overview
  const {
    data: overview,
    isLoading: overviewLoading,
    error: overviewError
  } = useRecruiterDashboardQuery();

  // Per-assessment analytics
  const {
    data: assessmentAnalytics,
    isLoading: assessmentLoading,
    error: assessmentError
  } = useAssessmentAnalyticsQuery(selectedAssessmentId);

  // Fetch questions for the selected assessment (for question-level analytics)
  const { data: questions = [] } = useQuery({
    queryKey: ['questions', selectedAssessmentId],
    queryFn: () => getQuestionsByAssessment(selectedAssessmentId),
    enabled: !!selectedAssessmentId,
    staleTime: 30000
  });

  // ── Chart data derived from assessmentAnalytics ──────────────────────────
  const scoreDistData = useMemo(() => {
    if (!assessmentAnalytics) return [];
    return [
      { label: 'Lowest',  value: assessmentAnalytics.lowestScore  ?? 0 },
      { label: 'Average', value: Math.round(assessmentAnalytics.averageScore ?? 0) },
      { label: 'Highest', value: assessmentAnalytics.highestScore ?? 0 }
    ];
  }, [assessmentAnalytics]);

  const passRateData = useMemo(() => {
    if (!assessmentAnalytics) return [];
    const pass = Math.round(assessmentAnalytics.passPercentage ?? 0);
    return [
      { name: 'Pass', value: pass,       fill: PIE_PASS },
      { name: 'Fail', value: 100 - pass, fill: PIE_FAIL }
    ];
  }, [assessmentAnalytics]);

  const performanceData = useMemo(() => {
    if (!assessmentAnalytics) return [];
    return [
      {
        name: 'Completion',
        percentage: Math.round(assessmentAnalytics.completionPercentage ?? 0)
      },
      {
        name: 'Pass Rate',
        percentage: Math.round(assessmentAnalytics.passPercentage ?? 0)
      },
      {
        name: 'Avg Score',
        percentage: Math.round(assessmentAnalytics.averageScore ?? 0)
      }
    ];
  }, [assessmentAnalytics]);

  // ── Error state ──────────────────────────────────────────────────────────
  if (overviewError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4 text-center">
        <AlertCircle size={44} className="text-red-400" />
        <h2 className="text-xl font-bold text-white">Failed to Load Analytics</h2>
        <p className="text-sm text-zinc-400 max-w-sm">
          {overviewError.response?.data?.message || overviewError.message || 'Please ensure the backend is running and you are authenticated.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-300">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white light:text-zinc-900">Analytics</h2>
          <p className="text-xs text-zinc-500 light:text-zinc-400 mt-1">
            Real-time platform metrics, assessment performance, and question-level intelligence.
          </p>
        </div>

        {/* Assessment selector */}
        <div className="relative w-full sm:w-72">
          <select
            value={selectedAssessmentId}
            onChange={e => setSelectedAssessmentId(e.target.value)}
            className="w-full appearance-none rounded-xl border border-zinc-900 light:border-zinc-200 bg-[#0a0a0a] light:bg-white px-4 py-2.5 pr-9 text-xs font-semibold text-white light:text-zinc-900 focus:outline-none focus:ring-1 focus:ring-brand-500 cursor-pointer transition"
          >
            {assessments.length === 0
              ? <option value="">No assessments</option>
              : assessments.map(a => (
                  <option key={a.id} value={a.id}>{a.title}</option>
                ))
            }
          </select>
          <ChevronDown size={13} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
        </div>
      </div>

      {/* ── Overview KPIs ──────────────────────────────────────────────────── */}
      <section className="space-y-5">
        <SectionHeader
          icon={Zap}
          title="Platform Overview"
          desc="Aggregate metrics across all your assessments and candidates."
          iconColor="text-amber-400"
        />

        {overviewLoading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-36" />)}
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Total Assessments"
              value={overview?.totalAssessmentsCreated ?? 0}
              sub="Created by you"
              icon={Layers}
              color="text-brand-400"
            />
            <StatCard
              label="Total Questions"
              value={overview?.totalQuestionsCreated ?? 0}
              sub="Across all assessments"
              icon={BookOpen}
              color="text-purple-400"
            />
            <StatCard
              label="Total Attempts"
              value={overview?.totalCandidateAttempts ?? 0}
              sub="Candidates participated"
              icon={Users}
              color="text-blue-400"
            />
            <StatCard
              label="Average Score"
              value={overview?.averageAssessmentScore != null
                ? `${overview.averageAssessmentScore.toFixed(1)}%`
                : '—'}
              sub="Across all attempts"
              icon={Award}
              color="text-amber-400"
              bar={overview?.averageAssessmentScore}
              barColor="bg-amber-500"
            />
          </div>
        )}
      </section>

      {/* ── Assessment Analytics ───────────────────────────────────────────── */}
      <section className="space-y-5">
        <SectionHeader
          icon={Target}
          title="Assessment Performance"
          desc={`Drill-down analytics for: ${assessmentAnalytics?.assessmentTitle || 'selected assessment'}`}
          iconColor="text-emerald-400"
        />

        {assessmentLoading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-32" />)}
          </div>
        ) : assessmentError ? (
          <div className="flex items-center space-x-3 p-5 border border-red-900/30 bg-red-950/10 rounded-2xl text-sm text-red-400">
            <AlertCircle size={18} />
            <span>Could not load analytics for this assessment.</span>
          </div>
        ) : assessmentAnalytics ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard label="Total Attempts"      value={assessmentAnalytics.totalAttempts}       sub="Candidates who attempted" icon={Users}        color="text-blue-400" />
            <StatCard label="Average Score"       value={`${(assessmentAnalytics.averageScore ?? 0).toFixed(1)}%`}   sub="Mean score across attempts"  icon={Activity}    color="text-purple-400" bar={assessmentAnalytics.averageScore} barColor="bg-purple-500" />
            <StatCard label="Highest Score"       value={`${assessmentAnalytics.highestScore ?? 0}%`}      sub="Top performer"          icon={TrendingUp}  color="text-emerald-400" />
            <StatCard label="Lowest Score"        value={`${assessmentAnalytics.lowestScore ?? 0}%`}       sub="Lowest recorded score"  icon={XCircle}     color="text-red-400" />
            <StatCard label="Pass Percentage"     value={`${(assessmentAnalytics.passPercentage ?? 0).toFixed(1)}%`}  sub="Candidates who passed (≥70%)" icon={CheckCircle} color="text-emerald-400" bar={assessmentAnalytics.passPercentage} barColor="bg-emerald-500" />
            <StatCard label="Completion Rate"     value={`${(assessmentAnalytics.completionPercentage ?? 0).toFixed(1)}%`} sub="Fully submitted attempts" icon={Percent}     color="text-brand-400" bar={assessmentAnalytics.completionPercentage} barColor="bg-brand-500" />
          </div>
        ) : (
          <div className="p-8 text-center text-zinc-600 text-sm">Select an assessment to view analytics.</div>
        )}
      </section>

      {/* ── Charts Row ─────────────────────────────────────────────────────── */}
      {assessmentAnalytics && !assessmentLoading && (
        <section className="space-y-5">
          <SectionHeader
            icon={BarChart3}
            title="Visual Analytics"
            desc="Charts derived from the selected assessment's performance data."
            iconColor="text-brand-400"
          />

          <div className="grid gap-6 lg:grid-cols-3">

            {/* 1 — Score Distribution Bar Chart */}
            <div className="lg:col-span-1 border border-zinc-900 light:border-zinc-200 bg-[#090909]/80 light:bg-white/80 p-5 rounded-2xl backdrop-blur-sm space-y-4">
              <div>
                <p className="text-xs font-bold text-white light:text-zinc-900">Score Distribution</p>
                <p className="text-[10px] text-zinc-500">Lowest / Average / Highest</p>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={scoreDistData} barCategoryGap="35%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" vertical={false} />
                  <XAxis dataKey="label" tick={{ fill: '#71717a', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#71717a', fontSize: 10 }} axisLine={false} tickLine={false} domain={[0, 100]} unit="%" />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: '#ffffff08' }} />
                  <Bar dataKey="value" name="Score" unit="%" radius={[6, 6, 0, 0]}>
                    {scoreDistData.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={index === 0 ? RED : index === 1 ? BRAND : EMERALD}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* 2 — Pass Rate Pie Chart */}
            <div className="lg:col-span-1 border border-zinc-900 light:border-zinc-200 bg-[#090909]/80 light:bg-white/80 p-5 rounded-2xl backdrop-blur-sm space-y-4">
              <div>
                <p className="text-xs font-bold text-white light:text-zinc-900">Pass / Fail Rate</p>
                <p className="text-[10px] text-zinc-500">Distribution of candidates who passed vs failed</p>
              </div>
              <div className="relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={passRateData}
                      cx="50%"
                      cy="50%"
                      innerRadius={58}
                      outerRadius={82}
                      paddingAngle={3}
                      dataKey="value"
                      nameKey="name"
                    >
                      {passRateData.map((entry, i) => (
                        <Cell key={i} fill={entry.fill} stroke="transparent" />
                      ))}
                    </Pie>
                    <Tooltip content={<ChartTooltip />} />
                    <Legend
                      iconType="circle"
                      iconSize={8}
                      formatter={(v) => <span className="text-[10px] text-zinc-400">{v}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
                {/* Centre label */}
                <div className="absolute text-center pointer-events-none" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -58%)' }}>
                  <p className="text-xl font-extrabold text-white">
                    {Math.round(assessmentAnalytics.passPercentage ?? 0)}%
                  </p>
                  <p className="text-[9px] text-zinc-500 uppercase tracking-wider font-bold">Pass Rate</p>
                </div>
              </div>
            </div>

            {/* 3 — Assessment Performance Area Chart */}
            <div className="lg:col-span-1 border border-zinc-900 light:border-zinc-200 bg-[#090909]/80 light:bg-white/80 p-5 rounded-2xl backdrop-blur-sm space-y-4">
              <div>
                <p className="text-xs font-bold text-white light:text-zinc-900">Performance Benchmarks</p>
                <p className="text-[10px] text-zinc-500">Completion · Pass Rate · Avg Score</p>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={performanceData} layout="vertical" barCategoryGap="30%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} tick={{ fill: '#71717a', fontSize: 10 }} axisLine={false} tickLine={false} unit="%" />
                  <YAxis dataKey="name" type="category" tick={{ fill: '#71717a', fontSize: 10 }} axisLine={false} tickLine={false} width={72} />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: '#ffffff05' }} />
                  <Bar dataKey="percentage" name="Value" unit="%" radius={[0, 6, 6, 0]}>
                    {performanceData.map((_, i) => (
                      <Cell key={i} fill={[EMERALD, BRAND, PURPLE][i]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

          </div>
        </section>
      )}

      {/* ── Question Performance (from recruiter-dashboard) ─────────────────── */}
      {!overviewLoading && (overview?.mostCorrectQuestions?.length > 0 || overview?.mostIncorrectQuestions?.length > 0) && (
        <section className="space-y-5">
          <SectionHeader
            icon={Activity}
            title="Question Intelligence"
            desc="Questions with highest and lowest accuracy across all your assessments."
            iconColor="text-purple-400"
          />

          <div className="grid gap-6 lg:grid-cols-2">

            {/* Top Correct */}
            <div className="border border-zinc-900 light:border-zinc-200 bg-[#090909]/80 light:bg-white/80 p-5 rounded-2xl backdrop-blur-sm space-y-4">
              <div className="flex items-center space-x-2">
                <ThumbsUp size={14} className="text-emerald-400" />
                <p className="text-xs font-bold text-white light:text-zinc-900">Highest Accuracy Questions</p>
              </div>
              <div className="space-y-3">
                {overview.mostCorrectQuestions.map((q, i) => (
                  <div key={q.questionId} className="space-y-1.5">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-xs text-zinc-400 light:text-zinc-600 leading-snug line-clamp-2 flex-1">
                        <span className="font-bold text-zinc-500 mr-1.5">#{i + 1}</span>
                        {q.questionText}
                      </p>
                      <span className="text-xs font-extrabold text-emerald-400 flex-shrink-0">
                        {(q.accuracyPercentage ?? 0).toFixed(0)}%
                      </span>
                    </div>
                    <div className="h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                        style={{ width: `${q.accuracyPercentage ?? 0}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Most Incorrect */}
            <div className="border border-zinc-900 light:border-zinc-200 bg-[#090909]/80 light:bg-white/80 p-5 rounded-2xl backdrop-blur-sm space-y-4">
              <div className="flex items-center space-x-2">
                <ThumbsDown size={14} className="text-red-400" />
                <p className="text-xs font-bold text-white light:text-zinc-900">Lowest Accuracy Questions</p>
              </div>
              <div className="space-y-3">
                {overview.mostIncorrectQuestions.map((q, i) => (
                  <div key={q.questionId} className="space-y-1.5">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-xs text-zinc-400 light:text-zinc-600 leading-snug line-clamp-2 flex-1">
                        <span className="font-bold text-zinc-500 mr-1.5">#{i + 1}</span>
                        {q.questionText}
                      </p>
                      <span className="text-xs font-extrabold text-red-400 flex-shrink-0">
                        {(q.accuracyPercentage ?? 0).toFixed(0)}%
                      </span>
                    </div>
                    <div className="h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-red-500 rounded-full transition-all duration-700"
                        style={{ width: `${q.accuracyPercentage ?? 0}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>
      )}

      {/* ── Per-question accuracy for selected assessment ─────────────────── */}
      {questions.length > 0 && (
        <section className="space-y-5">
          <SectionHeader
            icon={BookOpen}
            title="Question-Level Breakdown"
            desc={`Accuracy per question in: ${assessmentAnalytics?.assessmentTitle || 'selected assessment'}`}
            iconColor="text-blue-400"
          />

          <div className="border border-zinc-900 light:border-zinc-200 bg-[#090909]/80 light:bg-white/80 rounded-2xl backdrop-blur-sm divide-y divide-zinc-900/60 overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-12 px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
              <span className="col-span-1">#</span>
              <span className="col-span-6">Question</span>
              <span className="col-span-2 text-center">Type</span>
              <span className="col-span-2 text-right">Points</span>
              <span className="col-span-1 text-right">Pts</span>
            </div>

            {questions.map((q, i) => {
              const typeColor =
                q.type === 'SINGLE_CHOICE'   ? 'text-brand-400 bg-brand-950/20 border-brand-900/30' :
                q.type === 'MULTIPLE_CHOICE' ? 'text-purple-400 bg-purple-950/20 border-purple-900/30' :
                q.type === 'TRUE_FALSE'      ? 'text-amber-400 bg-amber-950/20 border-amber-900/30' :
                                               'text-zinc-400 bg-zinc-900/20 border-zinc-800/30';
              return (
                <div key={q.id} className="grid grid-cols-12 items-center px-5 py-4 hover:bg-zinc-900/20 transition">
                  <span className="col-span-1 text-[10px] text-zinc-600 font-bold">{i + 1}</span>
                  <p className="col-span-6 text-xs text-zinc-300 light:text-zinc-700 font-medium leading-snug line-clamp-2 pr-4">
                    {q.text}
                  </p>
                  <span className={`col-span-2 text-center text-[9px] font-bold px-1.5 py-0.5 rounded border ${typeColor}`}>
                    {q.type?.replace('_', ' ')}
                  </span>
                  <div className="col-span-2 pr-2">
                    <div className="h-1.5 bg-zinc-900 rounded-full overflow-hidden ml-auto w-full max-w-[60px]">
                      <div className="h-full bg-brand-600 rounded-full" style={{ width: '100%' }} />
                    </div>
                  </div>
                  <span className="col-span-1 text-right text-xs font-bold text-purple-400">{q.points}</span>
                </div>
              );
            })}
          </div>
        </section>
      )}

    </div>
  );
};

export default AnalyticsDashboard;
