import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Loader2,
  Send,
  X,
  BookOpen,
  Hash
} from 'lucide-react';
import { getQuestionsByAssessment } from '../../questions/api/questionsApi';
import { getAssessmentById } from '../../assessments/api/assessmentsApi';
import {
  useSubmitAnswerMutation,
  useSubmitAttemptMutation
} from '../hooks/useAttempts';

const AssessmentAttempt = () => {
  const { attemptId } = useParams();
  const navigate = useNavigate();

  // Retrieve stored assessmentId for this attempt
  const assessmentId = localStorage.getItem(`attempt_${attemptId}_assessment`);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // questionId -> optionId
  const [timeLeft, setTimeLeft] = useState(null);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [savingQuestionId, setSavingQuestionId] = useState(null); // tracks which question is auto-saving
  const hasAutoSubmitted = useRef(false);

  // Fetch assessment details (to get duration for timer)
  const { data: assessment, isLoading: isAssessmentLoading } = useQuery({
    queryKey: ['assessment', assessmentId],
    queryFn: () => getAssessmentById(assessmentId),
    enabled: !!assessmentId,
    staleTime: Infinity
  });

  // Fetch questions for this assessment
  const { data: questions = [], isLoading: isQuestionsLoading, error: questionsError } = useQuery({
    queryKey: ['questions', assessmentId],
    queryFn: () => getQuestionsByAssessment(assessmentId),
    enabled: !!assessmentId,
    staleTime: Infinity
  });

  // Mutations
  const submitAnswerMutation = useSubmitAnswerMutation();
  const submitAttemptMutation = useSubmitAttemptMutation();

  // Initialize timer once assessment duration is loaded
  useEffect(() => {
    if (assessment?.duration && timeLeft === null) {
      setTimeLeft(assessment.duration * 60);
    }
  }, [assessment, timeLeft]);

  // Submit attempt helper
  const handleAutoSubmit = useCallback(async () => {
    if (hasAutoSubmitted.current) return;
    hasAutoSubmitted.current = true;
    try {
      await submitAttemptMutation.mutateAsync(parseInt(attemptId));
      navigate(`/candidate/results/${attemptId}`);
    } catch (err) {
      console.error('Auto-submit failed:', err);
      navigate(`/candidate/results/${attemptId}`);
    }
  }, [attemptId, navigate, submitAttemptMutation]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft === null) return;
    if (timeLeft <= 0) {
      handleAutoSubmit();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, handleAutoSubmit]);

  // Format mm:ss
  const formatTime = (seconds) => {
    if (seconds === null) return '--:--';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Auto-save answer on selection
  const handleSelectOption = async (questionId, optionId) => {
    setSelectedAnswers(prev => ({ ...prev, [questionId]: optionId }));
    setSavingQuestionId(questionId);
    try {
      await submitAnswerMutation.mutateAsync({
        attemptId: parseInt(attemptId),
        questionId,
        selectedOptionId: optionId
      });
    } catch (err) {
      console.error('Failed to auto-save answer:', err);
    } finally {
      setSavingQuestionId(null);
    }
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) setCurrentIdx(prev => prev + 1);
  };

  const handlePrev = () => {
    if (currentIdx > 0) setCurrentIdx(prev => prev - 1);
  };

  const handleConfirmSubmit = async () => {
    try {
      await submitAttemptMutation.mutateAsync(parseInt(attemptId));
      navigate(`/candidate/results/${attemptId}`);
    } catch (err) {
      const errorMsg = err.response?.data || err.message || 'Failed to submit assessment.';
      alert(errorMsg);
    }
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const currentQuestion = questions[currentIdx];
  const isLoading = isAssessmentLoading || isQuestionsLoading;
  const timerDanger = timeLeft !== null && timeLeft <= 300; // last 5 mins

  // No assessmentId in storage - show error
  if (!assessmentId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <AlertCircle size={48} className="text-red-400" />
        <h2 className="text-xl font-bold text-white">Assessment Not Found</h2>
        <p className="text-sm text-zinc-400 max-w-sm">
          Unable to find the assessment data for this attempt. Please start a new attempt from the dashboard.
        </p>
        <a href="/candidate/dashboard" className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-sm font-semibold transition">
          Back to Dashboard
        </a>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        {/* Top Bar Skeleton */}
        <div className="h-20 bg-zinc-900/50 rounded-2xl border border-zinc-900" />
        <div className="grid gap-6 md:grid-cols-4">
          <div className="h-64 bg-zinc-900/50 rounded-2xl border border-zinc-900" />
          <div className="md:col-span-3 h-96 bg-zinc-900/50 rounded-2xl border border-zinc-900" />
        </div>
      </div>
    );
  }

  if (questionsError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <AlertCircle size={48} className="text-red-400" />
        <h2 className="text-xl font-bold text-white">Failed to Load Questions</h2>
        <p className="text-sm text-zinc-400">{questionsError.message}</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <BookOpen size={48} className="text-zinc-600" />
        <h2 className="text-xl font-bold text-white">No Questions Found</h2>
        <p className="text-sm text-zinc-400 max-w-sm">
          This assessment has no questions configured yet. Please contact your recruiter.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] flex flex-col space-y-6 animate-in fade-in duration-300">

      {/* Top Console Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border border-zinc-900 light:border-zinc-200 bg-[#080808]/90 light:bg-white/90 p-5 rounded-2xl backdrop-blur-sm gap-4">
        <div>
          <h3 className="text-base font-bold text-white light:text-zinc-900">
            {assessment?.title || 'Assessment Exam Console'}
          </h3>
          <p className="text-[11px] text-zinc-500 light:text-zinc-400 mt-0.5">
            {answeredCount} of {questions.length} answered — do not reload the page during the exam.
          </p>
        </div>

        <div className="flex items-center space-x-4">
          {/* Timer */}
          <div className={`flex items-center space-x-2 px-4 py-2 rounded-xl border font-mono font-bold text-sm transition ${
            timerDanger
              ? 'bg-red-950/40 border-red-900 text-red-400 animate-pulse'
              : 'bg-zinc-950 light:bg-zinc-100 border-zinc-900 light:border-zinc-200 text-zinc-300 light:text-zinc-700'
          }`}>
            <Clock size={15} className={timerDanger ? 'text-red-400' : 'text-amber-500'} />
            <span>{formatTime(timeLeft)}</span>
          </div>

          {/* Finish Test */}
          <button
            onClick={() => setIsSubmitOpen(true)}
            disabled={submitAttemptMutation.isPending}
            className="flex items-center space-x-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-500/10 transition disabled:opacity-50 cursor-pointer"
          >
            {submitAttemptMutation.isPending ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Send size={14} />
            )}
            <span>Finish Test</span>
          </button>
        </div>
      </div>

      {/* Main Console Board */}
      <div className="grid gap-6 md:grid-cols-4 flex-1">

        {/* LEFT: Question Navigation Map */}
        <div className="border border-zinc-900 light:border-zinc-200 bg-[#070707]/80 light:bg-white/80 p-5 rounded-2xl backdrop-blur-sm h-fit space-y-5">
          <div>
            <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Navigation</div>
            <div className="flex items-center space-x-4 text-[10px] text-zinc-600">
              <span className="flex items-center space-x-1">
                <span className="h-2.5 w-2.5 rounded bg-brand-600 inline-block" />
                <span>Current</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="h-2.5 w-2.5 rounded bg-emerald-900/50 border border-emerald-800 inline-block" />
                <span>Answered</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="h-2.5 w-2.5 rounded bg-zinc-900 border border-zinc-800 inline-block" />
                <span>Skipped</span>
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div>
            <div className="flex justify-between text-[10px] text-zinc-500 mb-1.5">
              <span>Progress</span>
              <span>{Math.round((answeredCount / questions.length) * 100)}%</span>
            </div>
            <div className="h-1.5 bg-zinc-900 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand-600 to-brand-400 rounded-full transition-all duration-500"
                style={{ width: `${(answeredCount / questions.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {questions.map((q, index) => {
              const isAnswered = selectedAnswers[q.id] !== undefined;
              const isCurrent = currentIdx === index;
              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIdx(index)}
                  title={`Question ${index + 1}`}
                  className={`h-9 w-full rounded-lg text-xs font-bold transition-all duration-150 flex items-center justify-center cursor-pointer ${
                    isCurrent
                      ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
                      : isAnswered
                      ? 'bg-emerald-950/30 text-emerald-400 border border-emerald-900/40 hover:border-emerald-700'
                      : 'bg-zinc-950 light:bg-zinc-100 text-zinc-500 border border-zinc-900 light:border-zinc-200 hover:bg-zinc-900 hover:text-zinc-300'
                  }`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT: Active Question Panel */}
        <div className="md:col-span-3 border border-zinc-900 light:border-zinc-200 bg-[#070707]/80 light:bg-white/80 p-6 rounded-2xl backdrop-blur-sm flex flex-col justify-between min-h-[460px]">
          <div className="space-y-6">

            {/* Question metadata */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-zinc-900 light:border-zinc-100">
              <div className="flex items-center space-x-3">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                  Question {currentIdx + 1} / {questions.length}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold border bg-brand-950/20 border-brand-900/40 text-brand-400 uppercase">
                  {currentQuestion.type?.replace('_', ' ')}
                </span>
              </div>
              <span className="flex items-center space-x-1 text-[10px] font-bold text-purple-400 bg-purple-950/20 border border-purple-900/30 rounded-full px-2.5 py-0.5">
                <Hash size={10} />
                <span>{currentQuestion.points} pts</span>
              </span>
            </div>

            {/* Question Text */}
            <h4 className="text-base font-semibold text-white light:text-zinc-900 leading-relaxed">
              {currentQuestion.text}
            </h4>

            {/* Answer Options */}
            <div className="space-y-3 pt-1">
              {currentQuestion.options?.map((opt) => {
                const isSelected = selectedAnswers[currentQuestion.id] === opt.id;
                const isSaving = savingQuestionId === currentQuestion.id && isSelected;
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(currentQuestion.id, opt.id)}
                    disabled={submitAnswerMutation.isPending && savingQuestionId === currentQuestion.id}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border text-sm text-left transition-all duration-150 cursor-pointer ${
                      isSelected
                        ? 'bg-brand-600/10 border-brand-500/60 text-brand-400 font-semibold'
                        : 'bg-zinc-950/40 light:bg-zinc-50 border-zinc-900 light:border-zinc-200 text-zinc-400 light:text-zinc-700 hover:bg-zinc-900/60 light:hover:bg-zinc-100 hover:border-zinc-800'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition ${
                        isSelected ? 'border-brand-500 bg-brand-500' : 'border-zinc-700 bg-transparent'
                      }`}>
                        {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                      </div>
                      <span className="break-words">{opt.text}</span>
                    </div>
                    {isSaving && (
                      <Loader2 size={14} className="animate-spin text-brand-400 flex-shrink-0 ml-2" />
                    )}
                    {isSelected && !isSaving && (
                      <CheckCircle size={14} className="text-brand-400 flex-shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>

          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between border-t border-[#151515] light:border-zinc-100 mt-8 pt-5">
            <button
              onClick={handlePrev}
              disabled={currentIdx === 0}
              className="flex items-center space-x-2 px-4 py-2 border border-zinc-900 light:border-zinc-200 bg-zinc-950 light:bg-zinc-50 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white hover:bg-zinc-900 transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft size={16} />
              <span>Previous</span>
            </button>

            <span className="text-[11px] text-zinc-600 font-mono">
              {answeredCount}/{questions.length} answered
            </span>

            <button
              onClick={handleNext}
              disabled={currentIdx === questions.length - 1}
              className="flex items-center space-x-2 px-4 py-2 border border-zinc-900 light:border-zinc-200 bg-zinc-950 light:bg-zinc-50 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white hover:bg-zinc-900 transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

      </div>

      {/* Confirm Submit Modal */}
      {isSubmitOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative bg-zinc-950 border border-zinc-900 light:bg-white light:border-zinc-200 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-5 text-white light:text-zinc-900 animate-in zoom-in-95 duration-200">

            <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
              <div className="flex items-center space-x-2 text-emerald-400">
                <Send size={18} />
                <h3 className="text-base font-bold">Submit Assessment?</h3>
              </div>
              <button onClick={() => setIsSubmitOpen(false)} className="text-zinc-500 hover:text-zinc-300 cursor-pointer">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3 text-xs text-zinc-400 leading-relaxed">
              <p>
                You have answered <strong className="text-white">{answeredCount}</strong> out of <strong className="text-white">{questions.length}</strong> questions.
              </p>
              {answeredCount < questions.length && (
                <div className="p-3 bg-amber-950/20 border border-amber-900/30 text-amber-400 rounded-xl flex items-start space-x-2">
                  <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                  <span>You have {questions.length - answeredCount} unanswered question(s). Unanswered questions will be marked incorrect.</span>
                </div>
              )}
              <p>Once submitted, you cannot change your answers. Your score will be calculated immediately.</p>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setIsSubmitOpen(false)}
                className="px-4 py-2 border border-zinc-800 hover:bg-zinc-900 rounded-xl text-xs font-semibold transition cursor-pointer"
              >
                Continue Exam
              </button>
              <button
                onClick={handleConfirmSubmit}
                disabled={submitAttemptMutation.isPending}
                className="flex items-center justify-center space-x-2 px-5 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-500/10 transition disabled:opacity-50 cursor-pointer"
              >
                {submitAttemptMutation.isPending ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <Send size={12} />
                )}
                <span>Submit Final Answers</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default AssessmentAttempt;
