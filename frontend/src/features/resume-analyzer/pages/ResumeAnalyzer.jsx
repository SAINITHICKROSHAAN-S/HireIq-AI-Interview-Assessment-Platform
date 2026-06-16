import React, { useState } from 'react';
import api from '../../../services/api';
import { 
  FileSearch, 
  Cpu, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Loader2, 
  Sparkles,
  Award,
  ArrowRight
} from 'lucide-react';

const ResumeAnalyzer = () => {
  const [resumeText, setResumeText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [analysis, setAnalysis] = useState(null);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!resumeText.trim()) {
      setError('Please paste your resume content before analysis.');
      return;
    }
    setError('');
    setLoading(true);
    setAnalysis(null);

    try {
      const response = await api.post('/api/resume/analyze', { resumeText });
      setAnalysis(response.data);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.status === 403 
          ? 'Only candidates are authorized to run resume analysis.' 
          : err.response?.data || 'Failed to analyze resume. Please check your backend connections.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white light:text-black flex items-center space-x-2.5">
          <Cpu size={24} className="text-brand-500" />
          <span>AI Resume Analyzer</span>
        </h2>
        <p className="text-sm text-zinc-500 light:text-zinc-400">
          Upload or paste your resume text to receive instant Gemini AI optimization feedback, ratings, and match metrics.
        </p>
      </div>

      {error && (
        <div className="flex items-center space-x-2 rounded-xl bg-red-950/20 border border-red-900/30 p-4 text-xs text-red-400">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Grid: Form and Results */}
      <div className="grid gap-8 lg:grid-cols-12">
        
        {/* Left Hand: Paste Form */}
        <div className="lg:col-span-5 space-y-4">
          <form onSubmit={handleAnalyze} className="border border-zinc-900 light:border-zinc-200 bg-[#0a0a0a]/60 light:bg-white/60 p-6 rounded-2xl backdrop-blur-sm space-y-4 flex flex-col">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-400 light:text-zinc-600">Resume Plaintext Content</label>
              <textarea
                required
                rows={12}
                placeholder="Paste the text from your resume here (e.g. Professional Summary, Skills, Work Experience, Education)..."
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                className="w-full rounded-xl border border-zinc-900 light:border-zinc-200 bg-zinc-950/40 light:bg-zinc-50 p-4 text-xs text-white light:text-black placeholder-zinc-700 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-all resize-none font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center space-x-2 rounded-xl bg-brand-600 hover:bg-brand-500 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/10 hover:shadow-brand-500/20 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                  <span>AI Parsing Resume...</span>
                </>
              ) : (
                <>
                  <span>Analyze Resume</span>
                  <Sparkles size={16} className="text-brand-300" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Hand: AI Results Display */}
        <div className="lg:col-span-7">
          {loading ? (
            <div className="border border-zinc-900 light:border-zinc-200 bg-[#0a0a0a]/60 light:bg-white/60 p-12 rounded-2xl backdrop-blur-sm flex flex-col items-center justify-center space-y-4 h-full min-h-[400px]">
              <div className="relative flex h-14 w-14 items-center justify-center">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-500 opacity-20"></span>
                <span className="relative inline-flex rounded-full h-10 w-10 bg-brand-600 border border-brand-400 flex items-center justify-center text-white">
                  <Cpu size={18} className="animate-pulse" />
                </span>
              </div>
              <div className="text-center space-y-1.5">
                <h4 className="text-sm font-semibold text-white light:text-black">Running Deep AI Assessment</h4>
                <p className="text-xs text-zinc-500">Gemini model is scanning experience metrics, keywords, and structural formats...</p>
              </div>
            </div>
          ) : analysis ? (
            <div className="border border-zinc-900 light:border-zinc-200 bg-[#0a0a0a]/60 light:bg-white/60 p-6 rounded-2xl backdrop-blur-sm space-y-6 animate-in fade-in duration-300">
              
              {/* Score header */}
              <div className="flex items-center justify-between border-b border-[#161616] pb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <Award size={20} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white light:text-black">Resume Assessment Score</h3>
                    <p className="text-xs text-zinc-500">Calculated relative to core SaaS skills profiles</p>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center h-20 w-20 rounded-full border-4 border-zinc-900 bg-zinc-950/60 p-3 shadow-lg">
                  <span className="text-xl font-extrabold text-white light:text-black">{analysis.overallScore}</span>
                  <span className="text-[8px] text-zinc-500 uppercase tracking-widest font-semibold">Match</span>
                </div>
              </div>

              {/* Grid: Strengths, Weaknesses */}
              <div className="grid gap-6 md:grid-cols-2">
                
                {/* Strengths */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-emerald-400 flex items-center space-x-1.5 uppercase tracking-wider">
                    <CheckCircle size={14} />
                    <span>Identified Strengths</span>
                  </h4>
                  <ul className="space-y-2 pl-2">
                    {analysis.strengths && analysis.strengths.map((str, index) => (
                      <li key={index} className="text-xs text-zinc-300 light:text-zinc-700 flex items-start space-x-2 leading-relaxed">
                        <span className="text-emerald-500 mt-0.5">•</span>
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Weaknesses */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-red-400 flex items-center space-x-1.5 uppercase tracking-wider">
                    <XCircle size={14} />
                    <span>Areas to Improve</span>
                  </h4>
                  <ul className="space-y-2 pl-2">
                    {analysis.weaknesses && analysis.weaknesses.map((weak, index) => (
                      <li key={index} className="text-xs text-zinc-300 light:text-zinc-700 flex items-start space-x-2 leading-relaxed">
                        <span className="text-red-500 mt-0.5">•</span>
                        <span>{weak}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

              {/* Suggestions */}
              <div className="border-t border-[#161616] pt-6 space-y-3">
                <h4 className="text-xs font-bold text-brand-400 flex items-center space-x-1.5 uppercase tracking-wider">
                  <Sparkles size={14} />
                  <span>Actionable Optimization Recommendations</span>
                </h4>
                <ul className="space-y-2.5">
                  {analysis.suggestions && analysis.suggestions.map((sug, index) => (
                    <li key={index} className="text-xs text-zinc-300 light:text-zinc-700 flex items-start space-x-2 bg-zinc-950/40 p-3 rounded-xl border border-zinc-900 leading-relaxed">
                      <span className="text-brand-500 font-bold mt-0.5">→</span>
                      <span>{sug}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          ) : (
            <div className="border border-zinc-900 light:border-zinc-200 bg-[#0a0a0a]/60 light:bg-white/60 p-12 rounded-2xl backdrop-blur-sm flex flex-col items-center justify-center space-y-4 h-full min-h-[400px]">
              <FileSearch size={36} className="text-zinc-700" />
              <div className="text-center space-y-1">
                <h4 className="text-sm font-semibold text-zinc-500">Awaiting Resume Input</h4>
                <p className="text-xs text-zinc-600">Submit your resume in the editor to trigger Gemini model analysis</p>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default ResumeAnalyzer;
