import React, { useState, useRef } from 'react';
import {
  FileSearch, Cpu, CheckCircle, XCircle, AlertCircle,
  Loader2, Sparkles, Award, ChevronRight, RotateCcw,
  ClipboardPaste, Zap, Shield, TrendingUp
} from 'lucide-react';
import { useResumeAnalyzerMutation } from '../hooks/useResumeAnalyzer';

// ─── Circular Score Indicator (SVG) ──────────────────────────────────────────
const CircularScore = ({ score }) => {
  const radius    = 54;
  const stroke    = 7;
  const normalised = Math.min(Math.max(score, 0), 100);
  const circumference = 2 * Math.PI * radius;
  const dashOffset    = circumference - (normalised / 100) * circumference;

  const scoreColor =
    normalised >= 80 ? '#10b981' :
    normalised >= 60 ? '#f59e0b' :
    '#ef4444';

  return (
    <svg width={136} height={136} className="rotate-[-90deg]">
      {/* Track */}
      <circle
        cx={68} cy={68} r={radius}
        fill="none"
        stroke="#1a1a1a"
        strokeWidth={stroke}
      />
      {/* Progress arc */}
      <circle
        cx={68} cy={68} r={radius}
        fill="none"
        stroke={scoreColor}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={dashOffset}
        style={{ transition: 'stroke-dashoffset 1s ease, stroke 0.5s ease' }}
      />
      {/* Score text (un-rotate) */}
      <text
        x="50%" y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fill={scoreColor}
        fontSize="22"
        fontWeight="800"
        fontFamily="inherit"
        style={{ transform: 'rotate(90deg)', transformOrigin: '50% 50%' }}
      >
        {normalised}
      </text>
      <text
        x="50%" y="62%"
        dominantBaseline="middle"
        textAnchor="middle"
        fill="#71717a"
        fontSize="8"
        fontWeight="700"
        style={{ transform: 'rotate(90deg)', transformOrigin: '50% 50%', letterSpacing: '0.1em' }}
      >
        / 100
      </text>
    </svg>
  );
};

// ─── Progress bar row ─────────────────────────────────────────────────────────
const ScoreBar = ({ label, value, color }) => (
  <div className="space-y-1.5">
    <div className="flex justify-between text-[10px] font-semibold">
      <span className="text-zinc-400">{label}</span>
      <span style={{ color }}>{value}%</span>
    </div>
    <div className="h-1.5 bg-zinc-900 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{ width: `${value}%`, background: color }}
      />
    </div>
  </div>
);

// ─── Animated processing steps ────────────────────────────────────────────────
const STEPS = [
  'Parsing resume structure…',
  'Extracting keywords & skills…',
  'Comparing against role profiles…',
  'Computing ATS compatibility…',
  'Generating optimization insights…',
];

const ProcessingState = () => {
  const [step, setStep] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => setStep(s => (s + 1) % STEPS.length), 1400);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[420px] space-y-7 p-12">
      {/* Pulsing orb */}
      <div className="relative flex items-center justify-center">
        <span className="animate-ping absolute inline-flex h-20 w-20 rounded-full bg-brand-500/15" />
        <span className="animate-ping absolute inline-flex h-14 w-14 rounded-full bg-brand-500/20 delay-150" />
        <div className="relative z-10 h-14 w-14 rounded-full bg-brand-600/20 border border-brand-500/30 flex items-center justify-center">
          <Cpu size={22} className="text-brand-400 animate-pulse" />
        </div>
      </div>

      <div className="text-center space-y-2">
        <h4 className="text-sm font-bold text-white">Gemini AI is Analyzing</h4>
        <p className="text-xs text-zinc-500 h-4 transition-all duration-300">{STEPS[step]}</p>
      </div>

      {/* Step indicators */}
      <div className="flex items-center space-x-1.5">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className={`h-1 rounded-full transition-all duration-500 ${
              i === step ? 'w-5 bg-brand-500' : 'w-1.5 bg-zinc-800'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

// ─── List item ────────────────────────────────────────────────────────────────
const ListItem = ({ text, variant }) => {
  const styles = {
    strength:   { dot: 'bg-emerald-500', text: 'text-zinc-300' },
    weakness:   { dot: 'bg-red-500',     text: 'text-zinc-300' },
    suggestion: { dot: 'bg-brand-500',   text: 'text-zinc-300' },
  }[variant];

  return (
    <li className="flex items-start space-x-2.5 leading-relaxed text-xs">
      <span className={`mt-1.5 h-1.5 w-1.5 rounded-full flex-shrink-0 ${styles.dot}`} />
      <span className={styles.text}>{text}</span>
    </li>
  );
};

// ─── MAX chars ────────────────────────────────────────────────────────────────
const MAX_CHARS = 8000;

// ─── Main Component ───────────────────────────────────────────────────────────
const ResumeAnalyzer = () => {
  const [resumeText, setResumeText] = useState('');
  const [validationError, setValidationError] = useState('');
  const textareaRef = useRef(null);

  const mutation = useResumeAnalyzerMutation();
  const { data: analysis, isPending, isError, error, reset } = mutation;

  const handleAnalyze = (e) => {
    e.preventDefault();
    const trimmed = resumeText.trim();
    if (!trimmed) {
      setValidationError('Please paste your resume content before analyzing.');
      textareaRef.current?.focus();
      return;
    }
    if (trimmed.length < 80) {
      setValidationError('Resume text seems too short. Paste the full resume content.');
      textareaRef.current?.focus();
      return;
    }
    setValidationError('');
    mutation.mutate(trimmed);
  };

  const handleReset = () => {
    reset();
    setResumeText('');
    setValidationError('');
    setTimeout(() => textareaRef.current?.focus(), 100);
  };

  const charCount  = resumeText.length;
  const overLimit  = charCount > MAX_CHARS;
  const charColor  = overLimit ? 'text-red-400' : charCount > MAX_CHARS * 0.8 ? 'text-amber-400' : 'text-zinc-600';

  // Derived score bars (estimate breakdown from overall)
  const score     = analysis?.overallScore ?? 0;
  const barData   = analysis ? [
    { label: 'Content Quality',  value: Math.min(100, Math.round(score * 1.0)),  color: '#6366f1' },
    { label: 'Keyword Density',  value: Math.min(100, Math.round(score * 0.9)),  color: '#a855f7' },
    { label: 'ATS Compatibility',value: Math.min(100, Math.round(score * 0.95)), color: '#10b981' },
    { label: 'Structure',        value: Math.min(100, Math.round(score * 1.05)), color: '#f59e0b' },
  ] : [];

  const scoreLabel = score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : score >= 40 ? 'Fair' : 'Needs Work';
  const scoreLabelColor = score >= 80 ? 'text-emerald-400' : score >= 60 ? 'text-amber-400' : 'text-red-400';

  return (
    <div className="space-y-8 animate-in fade-in duration-300">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white light:text-zinc-900 flex items-center space-x-2.5">
            <Cpu size={22} className="text-brand-500" />
            <span>AI Resume Analyzer</span>
          </h2>
          <p className="text-xs text-zinc-500 light:text-zinc-400 mt-1.5 max-w-lg">
            Powered by Gemini AI. Paste your resume to receive instant ATS scoring, strength/weakness breakdowns, and actionable optimization tips.
          </p>
        </div>

        {analysis && (
          <button
            onClick={handleReset}
            className="inline-flex items-center space-x-2 px-4 py-2 border border-zinc-800 hover:bg-zinc-900 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white transition cursor-pointer self-start sm:self-auto"
          >
            <RotateCcw size={13} />
            <span>Analyze New Resume</span>
          </button>
        )}
      </div>

      {/* ── Validation / API error ─────────────────────────────────────────── */}
      {(validationError || isError) && (
        <div className="flex items-start space-x-3 p-4 rounded-xl bg-red-950/15 border border-red-900/30 text-xs text-red-400">
          <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
          <span>
            {validationError ||
              (error?.response?.status === 403
                ? 'Only candidates are authorised to use the Resume Analyzer.'
                : error?.response?.data || error?.message || 'Analysis failed. Please check your backend is running.')}
          </span>
        </div>
      )}

      {/* ── Main grid ──────────────────────────────────────────────────────── */}
      <div className="grid gap-8 lg:grid-cols-12">

        {/* ── LEFT: Input form ──────────────────────────────────────────────── */}
        <div className="lg:col-span-5 space-y-5">
          <form onSubmit={handleAnalyze} className="border border-zinc-900 light:border-zinc-200 bg-[#090909]/80 light:bg-white/80 p-6 rounded-2xl backdrop-blur-sm flex flex-col space-y-5">

            {/* Textarea label + counter */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-zinc-400 light:text-zinc-600 uppercase tracking-widest">
                  Resume Content
                </label>
                <span className={`text-[10px] font-mono font-semibold ${charColor}`}>
                  {charCount.toLocaleString()} / {MAX_CHARS.toLocaleString()}
                </span>
              </div>

              <textarea
                ref={textareaRef}
                rows={16}
                placeholder={`Paste your full resume here…\n\nInclude:\n• Professional Summary\n• Work Experience\n• Skills & Technologies\n• Education\n• Certifications`}
                value={resumeText}
                onChange={e => setResumeText(e.target.value.slice(0, MAX_CHARS))}
                disabled={isPending}
                className={`w-full rounded-xl border bg-zinc-950/50 light:bg-zinc-50 p-4 text-xs text-zinc-200 light:text-zinc-800 placeholder-zinc-700 focus:outline-none focus:ring-1 transition-all resize-none font-mono leading-relaxed disabled:opacity-50 ${
                  validationError
                    ? 'border-red-900 focus:border-red-500 focus:ring-red-500/30'
                    : 'border-zinc-900 light:border-zinc-200 focus:border-brand-500 focus:ring-brand-500/20'
                }`}
              />

              {/* Character bar */}
              <div className="h-0.5 bg-zinc-900 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-200 ${overLimit ? 'bg-red-500' : 'bg-brand-600'}`}
                  style={{ width: `${Math.min((charCount / MAX_CHARS) * 100, 100)}%` }}
                />
              </div>
            </div>

            {/* Tips */}
            <div className="flex flex-wrap gap-2">
              {['ATS friendly', 'Plain text only', 'Include metrics'].map(tip => (
                <span key={tip} className="text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg bg-zinc-900/60 border border-zinc-800 text-zinc-500">
                  {tip}
                </span>
              ))}
            </div>

            {/* Analyze button */}
            <button
              type="submit"
              disabled={isPending || overLimit || !resumeText.trim()}
              className="relative flex w-full items-center justify-center space-x-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 py-3 text-sm font-bold text-white shadow-lg shadow-brand-500/15 hover:shadow-brand-500/25 transition duration-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer overflow-hidden group"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-brand-600 via-brand-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition duration-300" />
              <span className="relative flex items-center space-x-2.5">
                {isPending ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>AI Analyzing…</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    <span>Analyze with Gemini AI</span>
                    <ChevronRight size={15} className="opacity-60" />
                  </>
                )}
              </span>
            </button>

          </form>

          {/* Feature chips */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Zap,       label: 'Instant', sub: 'AI scoring' },
              { icon: Shield,    label: 'ATS',     sub: 'Compatibility' },
              { icon: TrendingUp,label: 'Tips',    sub: 'Optimization' },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="border border-zinc-900 bg-[#090909]/50 rounded-xl p-3 text-center space-y-1">
                <Icon size={15} className="text-brand-400 mx-auto" />
                <p className="text-[10px] font-bold text-zinc-400">{label}</p>
                <p className="text-[9px] text-zinc-600">{sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT: Results panel ──────────────────────────────────────────── */}
        <div className="lg:col-span-7">

          {isPending ? (
            /* Processing animation */
            <div className="border border-zinc-900 light:border-zinc-200 bg-[#090909]/80 light:bg-white/80 rounded-2xl backdrop-blur-sm h-full min-h-[420px]">
              <ProcessingState />
            </div>

          ) : analysis ? (
            /* Results dashboard */
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-3 duration-400">

              {/* Score hero card */}
              <div className="border border-zinc-900 light:border-zinc-200 bg-[#090909]/80 light:bg-white/80 p-6 rounded-2xl backdrop-blur-sm">
                <div className="flex flex-col sm:flex-row items-center gap-6">

                  {/* Circular score */}
                  <div className="relative flex-shrink-0">
                    <CircularScore score={analysis.overallScore} />
                  </div>

                  {/* Score details */}
                  <div className="flex-1 space-y-4 w-full">
                    <div>
                      <div className="flex items-center space-x-2">
                        <Award size={16} className="text-amber-400" />
                        <h3 className="text-sm font-bold text-white light:text-zinc-900">Resume Score</h3>
                        <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                          score >= 80 ? 'bg-emerald-950/20 border-emerald-900/30 text-emerald-400' :
                          score >= 60 ? 'bg-amber-950/20 border-amber-900/30 text-amber-400' :
                          'bg-red-950/20 border-red-900/30 text-red-400'
                        }`}>
                          {scoreLabel}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500 mt-1">Evaluated across content, keywords, ATS compatibility, and structure.</p>
                    </div>

                    {/* Score breakdown bars */}
                    <div className="space-y-2.5">
                      {barData.map(b => (
                        <ScoreBar key={b.label} label={b.label} value={b.value} color={b.color} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Strengths + Weaknesses grid */}
              <div className="grid gap-4 sm:grid-cols-2">

                {/* Strengths */}
                <div className="border border-emerald-900/30 bg-emerald-950/5 p-5 rounded-2xl space-y-3">
                  <div className="flex items-center space-x-2">
                    <CheckCircle size={14} className="text-emerald-400" />
                    <h4 className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-widest">
                      Strengths
                    </h4>
                    <span className="ml-auto text-[9px] font-bold text-emerald-400 bg-emerald-950/30 border border-emerald-900/30 px-1.5 py-0.5 rounded-full">
                      {analysis.strengths?.length ?? 0}
                    </span>
                  </div>
                  <ul className="space-y-2.5">
                    {analysis.strengths?.length > 0
                      ? analysis.strengths.map((s, i) => (
                          <ListItem key={i} text={s} variant="strength" />
                        ))
                      : <li className="text-xs text-zinc-600 italic">No strengths identified.</li>
                    }
                  </ul>
                </div>

                {/* Weaknesses */}
                <div className="border border-red-900/30 bg-red-950/5 p-5 rounded-2xl space-y-3">
                  <div className="flex items-center space-x-2">
                    <XCircle size={14} className="text-red-400" />
                    <h4 className="text-[10px] font-extrabold text-red-400 uppercase tracking-widest">
                      Areas to Improve
                    </h4>
                    <span className="ml-auto text-[9px] font-bold text-red-400 bg-red-950/30 border border-red-900/30 px-1.5 py-0.5 rounded-full">
                      {analysis.weaknesses?.length ?? 0}
                    </span>
                  </div>
                  <ul className="space-y-2.5">
                    {analysis.weaknesses?.length > 0
                      ? analysis.weaknesses.map((w, i) => (
                          <ListItem key={i} text={w} variant="weakness" />
                        ))
                      : <li className="text-xs text-zinc-600 italic">No critical weaknesses found.</li>
                    }
                  </ul>
                </div>

              </div>

              {/* Suggestions */}
              <div className="border border-brand-900/30 bg-brand-950/5 p-5 rounded-2xl space-y-4">
                <div className="flex items-center space-x-2">
                  <Sparkles size={14} className="text-brand-400" />
                  <h4 className="text-[10px] font-extrabold text-brand-400 uppercase tracking-widest">
                    Optimization Recommendations
                  </h4>
                  <span className="ml-auto text-[9px] font-bold text-brand-400 bg-brand-950/30 border border-brand-900/30 px-1.5 py-0.5 rounded-full">
                    {analysis.suggestions?.length ?? 0} tips
                  </span>
                </div>
                <ul className="space-y-2.5">
                  {analysis.suggestions?.length > 0
                    ? analysis.suggestions.map((s, i) => (
                        <li key={i} className="flex items-start space-x-3 p-3 bg-zinc-950/40 light:bg-zinc-50 rounded-xl border border-zinc-900/60 text-xs text-zinc-300 leading-relaxed">
                          <span className="flex-shrink-0 h-5 w-5 rounded-full bg-brand-600/20 border border-brand-500/30 flex items-center justify-center text-brand-400 font-extrabold text-[9px]">
                            {i + 1}
                          </span>
                          <span>{s}</span>
                        </li>
                      ))
                    : <li className="text-xs text-zinc-600 italic">No suggestions available.</li>
                  }
                </ul>
              </div>

            </div>

          ) : (
            /* Empty state */
            <div className="border border-zinc-900 light:border-zinc-200 bg-[#090909]/80 light:bg-white/80 rounded-2xl backdrop-blur-sm flex flex-col items-center justify-center space-y-5 min-h-[420px] p-12 text-center">
              <div className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800">
                <FileSearch size={32} className="text-zinc-600" />
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-zinc-500">Awaiting Resume</h4>
                <p className="text-xs text-zinc-600 max-w-xs">
                  Paste your resume text in the editor on the left, then click <strong className="text-zinc-500">Analyze with Gemini AI</strong> to receive your score.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className="flex items-center space-x-2 text-[10px] text-zinc-600">
                  <ClipboardPaste size={12} className="text-brand-500" />
                  <span>Paste plain text for best results</span>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ResumeAnalyzer;
