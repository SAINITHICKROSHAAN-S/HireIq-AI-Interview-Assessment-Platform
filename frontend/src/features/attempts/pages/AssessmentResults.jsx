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
  ShieldAlert
} from 'lucide-react';

const AssessmentResults = () => {
  const { attemptId } = useParams();

  // Mock result payload matching AttemptResultResponse / CandidateAnswerResponse DTOs
  const results = {
    attemptId: attemptId || 1,
    assessmentTitle: 'Senior React Developer Assessment',
    score: 85,
    totalQuestions: 3,
    correctAnswersCount: 2,
    passingScore: 70,
    passed: true,
    answers: [
      {
        questionId: 201,
        questionText: 'What is the primary benefit of Reacts Virtual DOM?',
        selectedOptionText: 'It minimizes layout reflows and batches document updates',
        correctOptionText: 'It minimizes layout reflows and batches document updates',
        isCorrect: true,
        options: [
          { optionText: 'It writes directly to the browser DOM synchronously' },
          { optionText: 'It minimizes layout reflows and batches document updates' },
          { optionText: 'It requires double the memory of the default window object' },
        ]
      },
      {
        questionId: 202,
        questionText: 'When would you use the callback reference function inside the ref property in React?',
        selectedOptionText: 'To run code when the reference node is set, mounted, or unmounted',
        correctOptionText: 'To run code when the reference node is set, mounted, or unmounted',
        isCorrect: true,
        options: [
          { optionText: 'To fetch initial server states inside server components' },
          { optionText: 'To run code when the reference node is set, mounted, or unmounted' },
          { optionText: 'To declare a hook conditionally inside loops' },
        ]
      },
      {
        questionId: 203,
        questionText: 'What does React.useMemo hook memoize?',
        selectedOptionText: 'The state handler functions directly',
        correctOptionText: 'The computation return value across component updates',
        isCorrect: false,
        options: [
          { optionText: 'The rendered JSX node tree elements' },
          { optionText: 'The computation return value across component updates' },
          { optionText: 'The state handler functions directly' },
        ]
      }
    ]
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Top Header */}
      <div className="flex items-center space-x-2.5">
        <Link 
          to="/candidate/dashboard" 
          className="p-2 border border-zinc-900 light:border-zinc-200 bg-[#0a0a0a] light:bg-zinc-50 rounded-xl text-zinc-400 hover:text-white transition cursor-pointer"
        >
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white light:text-black">Assessment Scorecard</h2>
          <p className="text-sm text-zinc-500 light:text-zinc-400">Review final metrics and detailed question options evaluation</p>
        </div>
      </div>

      {/* Scoring Card summary */}
      <div className="grid gap-6 md:grid-cols-3">
        
        {/* Metric 1: Score & Status */}
        <div className="border border-zinc-900 light:border-zinc-200 bg-[#0a0a0a]/60 light:bg-white/60 p-6 rounded-2xl md:col-span-2 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="accent-glow top-0 right-0 opacity-40"></div>
          <div className="space-y-3 relative z-10">
            <span className="text-xs font-semibold text-zinc-500 uppercase">Assessment Title</span>
            <h3 className="text-lg font-bold text-white light:text-black">{results.assessmentTitle}</h3>
            
            <div className="flex items-center space-x-3 pt-2">
              <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full border text-xs font-semibold ${
                results.passed 
                  ? 'bg-emerald-950/20 border-emerald-900/30 text-emerald-400' 
                  : 'bg-red-950/20 border-red-900/30 text-red-400'
              }`}>
                {results.passed ? <ShieldCheck size={14} /> : <ShieldAlert size={14} />}
                <span>{results.passed ? 'PASSED' : 'FAILED'}</span>
              </span>
              <span className="text-xs text-zinc-500">Required: {results.passingScore}%</span>
            </div>
          </div>

          <div className="text-center relative z-10 flex flex-col justify-center items-center h-28 w-28 rounded-full border-4 border-zinc-900 bg-zinc-950/60 p-4 shadow-2xl">
            <span className="text-3xl font-extrabold text-white light:text-black">{results.score}%</span>
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold mt-1">Score</span>
          </div>
        </div>

        {/* Metric 2: Question breakdown */}
        <div className="border border-zinc-900 light:border-zinc-200 bg-[#0a0a0a]/60 light:bg-white/60 p-6 rounded-2xl flex flex-col justify-between">
          <div className="text-xs font-semibold text-zinc-500 uppercase">Accuracy Metrics</div>
          
          <div className="space-y-4 py-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-500">Total Questions</span>
              <span className="font-bold text-white light:text-black">{results.totalQuestions}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-500">Correct Answers</span>
              <span className="font-bold text-emerald-400">{results.correctAnswersCount}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-500">Incorrect Answers</span>
              <span className="font-bold text-red-400">{results.totalQuestions - results.correctAnswersCount}</span>
            </div>
          </div>
          
          <Link
            to="/candidate/dashboard"
            className="w-full flex items-center justify-center space-x-2 py-2 bg-zinc-900 light:bg-zinc-100 hover:bg-zinc-800 border border-zinc-800 light:border-zinc-300 text-zinc-300 light:text-zinc-800 rounded-xl text-xs font-semibold cursor-pointer"
          >
            <RotateCcw size={14} />
            <span>Back to Dashboard</span>
          </Link>
        </div>

      </div>

      {/* Review details */}
      <div className="space-y-6">
        <h3 className="text-base font-bold text-white light:text-black flex items-center space-x-2">
          <Sparkles size={18} className="text-brand-500" />
          <span>Question Review Analysis</span>
        </h3>

        <div className="space-y-6">
          {results.answers.map((ans, idx) => (
            <div 
              key={ans.questionId}
              className={`p-6 rounded-2xl border ${
                ans.isCorrect 
                  ? 'border-emerald-950/20 bg-emerald-950/5' 
                  : 'border-red-950/20 bg-red-950/5'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                    <span>Question {idx + 1}</span>
                    <span>•</span>
                    <span className={ans.isCorrect ? 'text-emerald-400' : 'text-red-400'}>
                      {ans.isCorrect ? 'Correct' : 'Incorrect'}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-white light:text-black pt-1">{ans.questionText}</h4>
                </div>

                {ans.isCorrect ? (
                  <CheckCircle className="text-emerald-400 flex-shrink-0" size={18} />
                ) : (
                  <XCircle className="text-red-400 flex-shrink-0" size={18} />
                )}
              </div>

              {/* Answers compare */}
              <div className="mt-4 space-y-2.5 pl-4 border-l border-zinc-900">
                <div className="text-xs">
                  <span className="text-zinc-500 block">Your Answer:</span>
                  <span className={`font-medium ${ans.isCorrect ? 'text-emerald-400' : 'text-red-400'}`}>
                    {ans.selectedOptionText}
                  </span>
                </div>
                {!ans.isCorrect && (
                  <div className="text-xs pt-1">
                    <span className="text-zinc-500 block">Correct Answer:</span>
                    <span className="font-medium text-emerald-400">
                      {ans.correctOptionText}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default AssessmentResults;
