import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ClipboardList, 
  Award, 
  ArrowRight, 
  Calendar,
  Clock,
  Sparkles,
  Info,
  Play,
  Loader2,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { useAssessmentsQuery } from '../../assessments/hooks/useAssessments';
import { useAllQuestionsQuery } from '../../questions/hooks/useQuestions';
import { useStartAttemptMutation } from '../../attempts/hooks/useAttempts';

const CandidateDashboard = () => {
  const navigate = useNavigate();
  const [selectedAssessment, setSelectedAssessment] = useState(null); // for confirmation modal
  const [pastAttempts, setPastAttempts] = useState([]);

  // Queries
  const { data: assessments = [], isLoading: isAssessmentsLoading, error: assessmentsError } = useAssessmentsQuery();
  const publishedAssessments = assessments.filter(a => a.status === 'PUBLISHED');

  // Load questions for all published assessments to calculate question count
  const { data: allQuestions = [], isLoading: isQuestionsLoading } = useAllQuestionsQuery(publishedAssessments);

  // Mutations
  const startAttemptMutation = useStartAttemptMutation();

  // Calculate question count map
  const questionCountMap = allQuestions.reduce((acc, q) => {
    if (q.assessmentId) {
      acc[q.assessmentId] = (acc[q.assessmentId] || 0) + 1;
    }
    return acc;
  }, {});

  // Load attempt logs on component mount
  useEffect(() => {
    const logged = localStorage.getItem('hireiq_candidate_attempts');
    if (!logged) {
      const defaultPast = [
        { id: 101, title: 'Frontend Basics & JS Essentials', score: 85, totalQuestions: 10, date: '2026-06-14', status: 'SUBMITTED' },
        { id: 102, title: 'SQL & Database Design Quiz', score: 60, totalQuestions: 15, date: '2026-06-11', status: 'SUBMITTED' },
      ];
      localStorage.setItem('hireiq_candidate_attempts', JSON.stringify(defaultPast));
      setPastAttempts(defaultPast);
    } else {
      setPastAttempts(JSON.parse(logged));
    }
  }, []);

  // Update past attempts helper (e.g. when finishing a test)
  const syncAttemptStatus = (attemptId, score, status = 'SUBMITTED') => {
    const logged = localStorage.getItem('hireiq_candidate_attempts');
    if (logged) {
      const list = JSON.parse(logged);
      const updated = list.map(item => 
        item.id === attemptId ? { ...item, score, status } : item
      );
      localStorage.setItem('hireiq_candidate_attempts', JSON.stringify(updated));
      setPastAttempts(updated);
    }
  };

  // Start attempt action
  const handleConfirmStart = async () => {
    if (!selectedAssessment) return;
    try {
      const res = await startAttemptMutation.mutateAsync(selectedAssessment.id);
      const attemptId = res.id;

      // Store mapping in local storage to support refreshing the exam console page
      localStorage.setItem(`attempt_${attemptId}_assessment`, String(selectedAssessment.id));

      // Append new attempt to local storage attempts list
      const logged = localStorage.getItem('hireiq_candidate_attempts');
      const list = logged ? JSON.parse(logged) : [];
      
      // Filter duplicate ID
      const filteredList = list.filter(item => item.id !== attemptId);
      filteredList.unshift({
        id: attemptId,
        assessmentId: selectedAssessment.id,
        title: selectedAssessment.title,
        score: null,
        totalQuestions: questionCountMap[selectedAssessment.id] || 0,
        date: new Date().toLocaleDateString(),
        status: 'IN_PROGRESS'
      });
      localStorage.setItem('hireiq_candidate_attempts', JSON.stringify(filteredList));
      setPastAttempts(filteredList);

      setSelectedAssessment(null);
      navigate(`/candidate/attempt/${attemptId}`);
    } catch (err) {
      const errorMsg = err.response?.data || err.message || 'An error occurred while starting the assessment.';
      alert(errorMsg);
    }
  };

  const isPageLoading = isAssessmentsLoading || isQuestionsLoading;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
      
      {/* Header banner */}
      <div className="relative border border-brand-900/30 bg-brand-950/20 p-8 rounded-3xl overflow-hidden backdrop-blur-sm">
        <div className="absolute top-0 right-0 h-40 w-40 bg-brand-500/10 rounded-full filter blur-3xl"></div>
        <div className="relative z-10 space-y-4 max-w-xl">
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full border border-brand-900/40 bg-brand-950/40 text-brand-400 text-[10px] font-bold uppercase tracking-wider">
            <Sparkles size={12} />
            <span>AI Powered Tools Available</span>
          </div>
          <h2 className="text-2xl font-bold text-white light:text-zinc-900">Supercharge your interview preparation</h2>
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
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white light:text-zinc-900 flex items-center space-x-2">
            <ClipboardList size={18} className="text-brand-500" />
            <span>Available Assessments</span>
          </h3>
        </div>

        {assessmentsError && (
          <div className="p-4 rounded-xl border border-red-950 bg-red-950/20 text-red-400 flex items-center space-x-2 text-xs">
            <AlertCircle size={16} />
            <span>Failed to load assessments. Please check backend connection.</span>
          </div>
        )}

        {isPageLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div 
                key={idx}
                className="border border-[#1a1a1a] bg-[#0a0a0a]/40 p-6 rounded-2xl h-[200px] animate-pulse space-y-4"
              >
                <div className="h-4 bg-zinc-900 rounded w-1/3" />
                <div className="h-5 bg-zinc-900 rounded w-2/3" />
                <div className="h-3 bg-zinc-900 rounded w-1/2" />
                <div className="h-10 bg-zinc-900 rounded w-full mt-6" />
              </div>
            ))}
          </div>
        ) : publishedAssessments.length === 0 ? (
          <div className="text-center py-12 border border-[#1a1a1a] light:border-zinc-200 bg-[#0a0a0a]/20 light:bg-white/20 rounded-2xl">
            <HelpCircle size={32} className="mx-auto text-zinc-600 mb-2" />
            <p className="text-zinc-500 text-sm">No assessments currently available to attempt.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {publishedAssessments.map((assessment) => {
              const questionCount = questionCountMap[assessment.id] || 0;
              return (
                <div 
                  key={assessment.id} 
                  className="group border border-[#1a1a1a] light:border-zinc-200 bg-[#0a0a0a]/60 light:bg-white/60 p-6 rounded-2xl backdrop-blur-sm flex flex-col justify-between hover:border-zinc-800 light:hover:border-zinc-300 transition duration-200"
                >
                  <div className="space-y-2.5">
                    <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider bg-zinc-950/60 light:bg-zinc-100 border border-zinc-900 light:border-zinc-200 px-2 py-0.5 rounded">
                      ID: #{assessment.id}
                    </span>
                    <h4 className="text-base font-bold text-white light:text-zinc-900 group-hover:text-brand-400 transition leading-snug">
                      {assessment.title}
                    </h4>
                    <p className="text-xs text-zinc-400 light:text-zinc-500 line-clamp-2">
                      {assessment.description || 'Test your proficiency and coding knowledge in this structural exam.'}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-zinc-500 pt-2 font-medium">
                      <span className="flex items-center space-x-1.5">
                        <ClipboardList size={13} className="text-brand-400" />
                        <span>{questionCount} Questions</span>
                      </span>
                      <span className="flex items-center space-x-1.5">
                        <Clock size={13} className="text-purple-400" />
                        <span>{assessment.duration} mins</span>
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-[#121212] light:border-zinc-100">
                    <button 
                      onClick={() => setSelectedAssessment(assessment)}
                      className="w-full inline-flex items-center justify-center space-x-2 py-2.5 bg-zinc-900 light:bg-zinc-100 hover:bg-zinc-800 light:hover:bg-zinc-200 text-white light:text-zinc-800 rounded-xl text-xs font-bold border border-zinc-800 light:border-zinc-200 transition cursor-pointer"
                    >
                      <span>Start Assessment</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Past attempts list */}
      <div className="border border-[#1a1a1a] light:border-zinc-200 bg-[#0a0a0a]/60 light:bg-white/60 rounded-2xl p-6 backdrop-blur-sm space-y-6">
        <h3 className="text-base font-bold text-white light:text-zinc-900 flex items-center space-x-2">
          <Award size={18} className="text-purple-500" />
          <span>Past Attempts & Results</span>
        </h3>

        <div className="space-y-4">
          {pastAttempts.length === 0 ? (
            <p className="text-xs text-zinc-500 text-center py-4">No completed attempts recorded.</p>
          ) : (
            pastAttempts.map((attempt) => (
              <div 
                key={attempt.id} 
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-zinc-900 light:border-zinc-200 hover:bg-[#161616]/40 light:hover:bg-zinc-50/40 transition gap-4"
              >
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-white light:text-zinc-900">{attempt.title}</h4>
                  <div className="flex items-center space-x-3 text-xs text-zinc-500">
                    <span className="flex items-center space-x-1">
                      <Calendar size={12} />
                      <span>{attempt.date}</span>
                    </span>
                    <span>•</span>
                    <span>{attempt.totalQuestions} Questions</span>
                    <span>•</span>
                    <span className={`text-[10px] font-bold ${
                      attempt.status === 'IN_PROGRESS' ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      {attempt.status}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between sm:justify-end gap-6">
                  {attempt.status === 'IN_PROGRESS' ? (
                    <Link
                      to={`/candidate/attempt/${attempt.id}`}
                      className="px-3.5 py-1.5 bg-brand-600/10 border border-brand-500/20 text-brand-400 rounded-lg text-xs font-semibold hover:bg-brand-600 hover:text-white transition cursor-pointer"
                    >
                      Resume Test
                    </Link>
                  ) : (
                    <>
                      <div className="text-right">
                        <div className="text-sm font-bold text-emerald-400">
                          {attempt.score !== null ? `${attempt.score}%` : 'N/A'}
                        </div>
                        <div className="text-[9px] text-zinc-500 uppercase tracking-widest font-semibold">Score</div>
                      </div>
                      <Link 
                        to={`/candidate/results/${attempt.id}`}
                        className="px-3.5 py-1.5 bg-[#161616] light:bg-zinc-100 hover:bg-zinc-900 light:hover:bg-zinc-200 border border-zinc-800 light:border-zinc-300 text-zinc-300 light:text-zinc-700 rounded-lg text-xs font-medium transition cursor-pointer"
                      >
                        View Report
                      </Link>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Confirmation Start Modal */}
      {selectedAssessment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative bg-zinc-950 border border-zinc-900 light:bg-white light:border-zinc-200 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-5 text-white light:text-zinc-900 animate-in zoom-in-95 duration-200">
            
            <div className="flex items-center space-x-3 text-brand-400 border-b border-zinc-900 light:border-zinc-100 pb-2">
              <ClipboardList size={22} className="text-brand-500" />
              <h3 className="text-base font-bold">Start Assessment?</h3>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-zinc-400 light:text-zinc-500 leading-relaxed">
                You are about to start the assessment: <strong className="text-white light:text-zinc-900">"{selectedAssessment.title}"</strong>.
              </p>

              <div className="p-3 bg-zinc-900/60 light:bg-zinc-50 border border-zinc-900 light:border-zinc-200 rounded-xl space-y-2.5 text-xs text-zinc-400 light:text-zinc-600">
                <div className="flex items-center space-x-2">
                  <Clock size={14} className="text-amber-500 flex-shrink-0" />
                  <span>Duration: <strong>{selectedAssessment.duration} minutes</strong></span>
                </div>
                <div className="flex items-center space-x-2">
                  <ClipboardList size={14} className="text-brand-500 flex-shrink-0" />
                  <span>Total Questions: <strong>{questionCountMap[selectedAssessment.id] || 0} questions</strong></span>
                </div>
                <div className="flex items-center space-x-2">
                  <Info size={14} className="text-zinc-500 flex-shrink-0" />
                  <span>Do not reload the browser or navigate away once you start.</span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedAssessment(null)}
                className="px-4 py-2 border border-zinc-800 hover:bg-zinc-900 light:border-zinc-200 light:hover:bg-zinc-50 rounded-xl text-xs font-semibold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmStart}
                disabled={startAttemptMutation.isPending}
                className="flex items-center justify-center space-x-2 px-5 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-brand-500/10 hover:shadow-brand-500/20 transition disabled:opacity-50 cursor-pointer"
              >
                {startAttemptMutation.isPending ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <Play size={12} className="fill-white" />
                )}
                <span>Begin Assessment</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default CandidateDashboard;
