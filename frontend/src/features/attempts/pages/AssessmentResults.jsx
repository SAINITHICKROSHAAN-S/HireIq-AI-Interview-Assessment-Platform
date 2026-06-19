import React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Award,
  CheckCircle,
  XCircle,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  Clock,
  Loader2,
  AlertCircle,
  Hash,
  Minus
} from 'lucide-react';
import { useAttemptResultQuery } from '../hooks/useAttempts';

const AssessmentResults = () => {
  const { attemptId } = useParams();
  const { data: results, isLoading, error } = useAttemptResultQuery(attemptId);

  // Helper: format datetime string
  const formatDateTime = (dt) => {
    if (!dt) return 'N/A';
    try {
      return new Date(dt).toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short'
      });
    } catch {
      return dt;
    }
  };

  // Helper: calculate duration taken
  const calcDuration = (start, end) => {
    if (!start || !end) return 'N/A';
    try {
      const diff = Math.floor((new Date(end) - new Date(start)) / 1000);
      const m = Math.floor(diff / 60);
      const s = diff % 60;
      return `${m}m ${s}s`;
    } catch {
      return 'N/A';
    }
  };

  // ─── Loading skeleton ───────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-10 bg-zinc-900 rounded-xl w-64" />
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 h-44 bg-zinc-900 rounded-2xl" />
          <div className="h-44 bg-zinc-900 rounded-2xl" />
        </div>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 bg-zinc-900 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  // ─── Error state ────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4">
        <AlertCircle size={48} className="text-red-400" />
        <h2 className="text-xl font-bold text-white">Could Not Load Results</h2>
        <p className="text-sm text-zinc-400 max-w-sm">
          {error.response?.data || error.message || 'Results are only available after the assessment has been submitted.'}
        </p>
        <Link
          to="/candidate/dashboard"
          className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-sm font-semibold transition"
        >
          Back to Dashboard
        </Link>
      </div>
    );
  }

  if (!results) return null;

  // ─── Derived metrics ────────────────────────────────────────────────────────
  const totalQuestions = results.answers?.length || 0;
  const correctCount   = results.answers?.filter(a => a.isCorrect).length || 0;
  const wrongCount     = results.answers?.filter(a => !a.isCorrect && a.selectedOptionId).length || 0;
  const skippedCount   = results.answers?.filter(a => !a.selectedOptionId).length || 0;
  const maxScore       = results.maxPossibleScore || 1;
  const totalScore     = results.totalScore || 0;
  const percentage     = Math.round((totalScore / maxScore) * 100);
  const passed         = percentage >= 70; // 70% passing threshold

  return (
    <div className="space-y-8 animate-in fade-in duration-300">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-3">
          <Link
            to="/candidate/dashboard"
            className="p-2 border border-zinc-900 light:border-zinc-200 bg-[#0a0a0a] light:bg-zinc-50 rounded-xl text-zinc-400 hover:text-white light:hover:text-zinc-900 transition cursor-pointer"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white light:text-zinc-900">Assessment Scorecard</h2>
            <p className="text-xs text-zinc-500 light:text-zinc-400">
              {results.assessmentTitle} · Attempt #{attemptId}
            </p>
          </div>
        </div>

        <Link
          to="/candidate/dashboard"
          className="inline-flex items-center justify-center space-x-2 px-4 py-2 border border-zinc-800 hover:bg-zinc-900 light:border-zinc-200 light:hover:bg-zinc-50 rounded-xl text-xs font-semibold transition cursor-pointer self-start sm:self-auto"
        >
          <RotateCcw size={14} />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      {/* ── Score Hero + Accuracy Cards ─────────────────────────────────────── */}
      <div className="grid gap-6 md:grid-cols-3">

        {/* Score hero */}
        <div className="relative border border-zinc-900 light:border-zinc-200 bg-[#090909]/70 light:bg-white/70 p-6 rounded-2xl md:col-span-2 flex flex-col sm:flex-row items-center justify-between gap-6 overflow-hidden backdrop-blur-sm">
          <div className="accent-glow top-0 right-0 opacity-30" />
          <div className="space-y-3 relative z-10 flex-1">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              Assessment Title
            </span>
            <h3 className="text-lg font-bold text-white light:text-zinc-900 leading-snug">
              {results.assessmentTitle}
            </h3>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full border text-xs font-bold ${
                passed
                  ? 'bg-emerald-950/20 border-emerald-900/40 text-emerald-400'
                  : 'bg-red-950/20 border-red-900/40 text-red-400'
              }`}>
                {passed ? <ShieldCheck size={13} /> : <ShieldAlert size={13} />}
                <span>{passed ? 'PASSED' : 'FAILED'}</span>
              </span>
              <span className="text-xs text-zinc-500">Passing threshold: 70%</span>
            </div>

            {/* Score bar */}
            <div className="pt-2 space-y-1.5 max-w-xs">
              <div className="flex justify-between text-[10px] text-zinc-500">
                <span>Score</span>
                <span className="font-bold text-white">{totalScore} / {maxScore} pts</span>
              </div>
              <div className="h-2 bg-zinc-900 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    passed ? 'bg-gradient-to-r from-emerald-600 to-emerald-400' : 'bg-gradient-to-r from-red-700 to-red-500'
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>

            {/* Time info */}
            <div className="flex flex-wrap items-center gap-4 text-[10px] text-zinc-500 pt-1 font-medium">
              <span className="flex items-center space-x-1.5">
                <Clock size={12} className="text-zinc-600" />
                <span>Started: {formatDateTime(results.startTime)}</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <Clock size={12} className="text-zinc-600" />
                <span>Finished: {formatDateTime(results.endTime)}</span>
              </span>
              <span className="text-zinc-600">Duration taken: {calcDuration(results.startTime, results.endTime)}</span>
            </div>
          </div>

          {/* Circular score badge */}
          <div className={`relative z-10 flex flex-col justify-center items-center h-28 w-28 rounded-full border-4 shadow-2xl flex-shrink-0 ${
            passed ? 'border-emerald-800 bg-emerald-950/30' : 'border-red-900 bg-red-950/20'
          }`}>
            <span className={`text-3xl font-extrabold ${passed ? 'text-emerald-400' : 'text-red-400'}`}>
              {percentage}%
            </span>
            <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold mt-0.5">Score</span>
          </div>
        </div>

        {/* Accuracy metrics */}
        <div className="border border-zinc-900 light:border-zinc-200 bg-[#090909]/70 light:bg-white/70 p-6 rounded-2xl flex flex-col justify-between backdrop-blur-sm">
          <div>
            <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4">
              Accuracy Breakdown
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="flex items-center space-x-2 text-xs text-zinc-400">
                  <span className="h-2 w-2 rounded-full bg-zinc-600 inline-block" />
                  <span>Total Questions</span>
                </span>
                <span className="text-sm font-bold text-white">{totalQuestions}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center space-x-2 text-xs text-zinc-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 inline-block" />
                  <span>Correct</span>
                </span>
                <span className="text-sm font-bold text-emerald-400">{correctCount}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center space-x-2 text-xs text-zinc-400">
                  <span className="h-2 w-2 rounded-full bg-red-400 inline-block" />
                  <span>Incorrect</span>
                </span>
                <span className="text-sm font-bold text-red-400">{wrongCount}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center space-x-2 text-xs text-zinc-400">
                  <span className="h-2 w-2 rounded-full bg-zinc-600 inline-block" />
                  <span>Skipped</span>
                </span>
                <span className="text-sm font-bold text-zinc-400">{skippedCount}</span>
              </div>
            </div>
          </div>

          {/* Mini stacked bar */}
          <div className="mt-6 space-y-1.5">
            <div className="text-[10px] text-zinc-600 font-medium">Score distribution</div>
            <div className="flex h-2 rounded-full overflow-hidden w-full">
              <div className="bg-emerald-500 transition-all" style={{ width: `${(correctCount / totalQuestions) * 100}%` }} />
              <div className="bg-red-600 transition-all"     style={{ width: `${(wrongCount   / totalQuestions) * 100}%` }} />
              <div className="bg-zinc-800 flex-1" />
            </div>
            <div className="flex justify-between text-[9px] text-zinc-600">
              <span>{Math.round((correctCount / totalQuestions) * 100)}% correct</span>
              <span>{Math.round((wrongCount / totalQuestions) * 100)}% incorrect</span>
            </div>
          </div>
        </div>

      </div>

      {/* ── Per-Question Review ─────────────────────────────────────────────── */}
      <div className="space-y-5">
        <h3 className="text-base font-bold text-white light:text-zinc-900 flex items-center space-x-2">
          <Sparkles size={17} className="text-brand-500" />
          <span>Question-by-Question Review</span>
        </h3>

        <div className="space-y-4">
          {results.answers?.map((ans, idx) => {
            const skipped = !ans.selectedOptionId;
            const statusColor = ans.isCorrect
              ? 'border-emerald-900/30 bg-emerald-950/5'
              : skipped
              ? 'border-zinc-900 bg-[#0a0a0a]/40'
              : 'border-red-900/30 bg-red-950/5';

            return (
              <div
                key={ans.questionId || idx}
                className={`p-5 rounded-2xl border ${statusColor} transition duration-200`}
              >
                {/* Question header row */}
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                      <span>Q{idx + 1}</span>
                      <span>·</span>
                      <span className={
                        ans.isCorrect ? 'text-emerald-400'
                        : skipped ? 'text-zinc-500'
                        : 'text-red-400'
                      }>
                        {ans.isCorrect ? 'Correct' : skipped ? 'Skipped' : 'Incorrect'}
                      </span>
                      <span className="flex items-center space-x-0.5 text-purple-400">
                        <Hash size={9} />
                        <span>{ans.pointsEarned} / {ans.pointsEarned != null ? (ans.isCorrect ? ans.pointsEarned : '?') : '?'} pts</span>
                      </span>
                    </div>
                    <h4 className="text-sm font-semibold text-white light:text-zinc-900 leading-relaxed">
                      {ans.questionText}
                    </h4>
                  </div>

                  {/* Icon */}
                  {skipped ? (
                    <Minus className="text-zinc-500 flex-shrink-0 mt-0.5" size={18} />
                  ) : ans.isCorrect ? (
                    <CheckCircle className="text-emerald-400 flex-shrink-0 mt-0.5" size={18} />
                  ) : (
                    <XCircle className="text-red-400 flex-shrink-0 mt-0.5" size={18} />
                  )}
                </div>

                {/* Answer comparison */}
                <div className="mt-4 pl-4 border-l border-zinc-900 space-y-2">
                  <div className="text-xs">
                    <span className="text-zinc-500 block mb-0.5">Your Answer:</span>
                    <span className={`font-semibold ${
                      skipped ? 'text-zinc-500 italic'
                      : ans.isCorrect ? 'text-emerald-400'
                      : 'text-red-400'
                    }`}>
                      {skipped ? 'Not answered' : ans.selectedOptionText}
                    </span>
                  </div>

                  {!ans.isCorrect && (
                    <div className="text-xs pt-1">
                      <span className="text-zinc-500 block mb-0.5">Correct Answer:</span>
                      <span className="font-semibold text-emerald-400">
                        {ans.correctOptionText}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default AssessmentResults;
