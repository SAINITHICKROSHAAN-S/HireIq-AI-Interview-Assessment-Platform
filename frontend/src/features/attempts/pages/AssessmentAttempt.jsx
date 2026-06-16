import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle,
  HelpCircle,
  AlertCircle,
  Play
} from 'lucide-react';

const AssessmentAttempt = () => {
  const { attemptId } = useParams();
  const navigate = useNavigate();

  // Test state parameters
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes in seconds

  // Mock assessment details with questions matching the Question entity schema
  const assessment = {
    id: 1,
    title: 'Senior React Developer Assessment',
    questions: [
      {
        id: 201,
        questionText: 'What is the primary benefit of Reacts Virtual DOM?',
        options: [
          { id: 1, optionText: 'It writes directly to the browser DOM synchronously', isCorrect: false },
          { id: 2, optionText: 'It minimizes layout reflows and batches document updates', isCorrect: true },
          { id: 3, optionText: 'It requires double the memory of the default window object', isCorrect: false },
          { id: 4, optionText: 'It handles style sheet parsing in Node server environments', isCorrect: false },
        ]
      },
      {
        id: 202,
        questionText: 'When would you use the callback reference function inside the ref property in React?',
        options: [
          { id: 5, optionText: 'To fetch initial server states inside server components', isCorrect: false },
          { id: 6, optionText: 'To run code when the reference node is set, mounted, or unmounted', isCorrect: true },
          { id: 7, optionText: 'To declare a hook conditionally inside loops', isCorrect: false },
          { id: 8, optionText: 'To trigger re-renders when the state property value changes', isCorrect: false },
        ]
      },
      {
        id: 203,
        questionText: 'What does React.useMemo hook memoize?',
        options: [
          { id: 9, optionText: 'The rendered JSX node tree elements', isCorrect: false },
          { id: 10, optionText: 'The computation return value across component updates', isCorrect: true },
          { id: 11, optionText: 'The state handler functions directly', isCorrect: false },
        ]
      }
    ]
  };

  // Timer loop
  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Format helper for timer mm:ss
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (questionId, optionId) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }));
  };

  const handleNext = () => {
    if (currentIdx < assessment.questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    alert('Assessment submitted successfully!');
    // Redirect to results placeholder
    navigate(`/candidate/results/${attemptId || 1}`);
  };

  const currentQuestion = assessment.questions[currentIdx];
  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <div className="min-h-[calc(100vh-8rem)] flex flex-col justify-between animate-in fade-in duration-300">
      
      {/* Top Console Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border border-zinc-900 light:border-zinc-200 bg-[#0a0a0a]/80 light:bg-white/80 p-5 rounded-2xl backdrop-blur-sm mb-6 gap-4">
        <div>
          <h3 className="text-base font-bold text-white light:text-black">{assessment.title}</h3>
          <p className="text-xs text-zinc-500 light:text-zinc-400">Answer all questions to submit score. Do not reload page.</p>
        </div>

        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2 bg-zinc-950 light:bg-zinc-100 border border-zinc-900 light:border-zinc-200 px-4 py-2 rounded-xl text-zinc-300 light:text-zinc-700">
            <Clock size={16} className="text-amber-500" />
            <span className="text-sm font-mono font-bold">{formatTime(timeLeft)}</span>
          </div>
          
          <button
            onClick={handleSubmit}
            className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-emerald-500/10 transition cursor-pointer"
          >
            <CheckCircle size={16} />
            <span>Finish Test</span>
          </button>
        </div>
      </div>

      {/* Main Console Board */}
      <div className="grid gap-6 md:grid-cols-4 flex-1">
        
        {/* Left Side: Navigation Map */}
        <div className="border border-zinc-900 light:border-zinc-200 bg-[#0a0a0a]/60 light:bg-white/60 p-5 rounded-2xl backdrop-blur-sm h-fit space-y-4">
          <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
            Test Navigation
          </div>
          <p className="text-[10px] text-zinc-500">Answered: {answeredCount} / {assessment.questions.length}</p>

          <div className="grid grid-cols-4 gap-2">
            {assessment.questions.map((q, index) => {
              const isAnswered = selectedAnswers[q.id] !== undefined;
              const isCurrent = currentIdx === index;
              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIdx(index)}
                  className={`h-9 w-9 rounded-lg text-xs font-bold transition flex items-center justify-center cursor-pointer ${
                    isCurrent
                      ? 'bg-brand-600 text-white shadow-md'
                      : isAnswered
                      ? 'bg-emerald-950/20 text-emerald-400 border border-emerald-900/30'
                      : 'bg-zinc-950 light:bg-zinc-100 text-zinc-400 light:text-zinc-700 border border-zinc-900 light:border-zinc-200 hover:bg-zinc-900'
                  }`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Active Question Panel */}
        <div className="md:col-span-3 border border-zinc-900 light:border-zinc-200 bg-[#0a0a0a]/60 light:bg-white/60 p-6 rounded-2xl backdrop-blur-sm flex flex-col justify-between min-h-[400px]">
          <div className="space-y-6">
            
            {/* Question title */}
            <div className="flex items-center justify-between text-xs text-zinc-500 font-semibold uppercase">
              <span>Question {currentIdx + 1} of {assessment.questions.length}</span>
              <span className="flex items-center space-x-1 text-brand-400">
                <Play size={12} />
                <span>Single Choice</span>
              </span>
            </div>

            <h4 className="text-base font-semibold text-white light:text-black leading-relaxed">
              {currentQuestion.questionText}
            </h4>

            {/* MCQ Options list */}
            <div className="space-y-3 pt-2">
              {currentQuestion.options.map((opt) => {
                const isSelected = selectedAnswers[currentQuestion.id] === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(currentQuestion.id, opt.id)}
                    className={`w-full flex items-center space-x-4 p-4 rounded-xl border text-sm text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-brand-600/10 border-brand-500 text-brand-400 font-semibold'
                        : 'bg-zinc-950/40 light:bg-zinc-50 border-zinc-900 light:border-zinc-200 text-zinc-400 light:text-zinc-700 hover:bg-zinc-900/60 light:hover:bg-zinc-100 hover:border-zinc-800'
                    }`}
                  >
                    <div className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                      isSelected ? 'border-brand-500 bg-brand-500' : 'border-zinc-700 bg-transparent'
                    }`}>
                      {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-white"></div>}
                    </div>
                    <span>{opt.optionText}</span>
                  </button>
                );
              })}
            </div>

          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between border-t border-[#161616] light:border-zinc-200 mt-8 pt-6">
            <button
              onClick={handlePrev}
              disabled={currentIdx === 0}
              className="flex items-center space-x-2 px-4 py-2 border border-zinc-900 light:border-zinc-200 bg-zinc-950 light:bg-zinc-50 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white hover:bg-zinc-900 transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft size={16} />
              <span>Previous</span>
            </button>

            <button
              onClick={handleNext}
              disabled={currentIdx === assessment.questions.length - 1}
              className="flex items-center space-x-2 px-4 py-2 border border-zinc-900 light:border-zinc-200 bg-zinc-950 light:bg-zinc-50 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white hover:bg-zinc-900 transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight size={16} />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};

export default AssessmentAttempt;
