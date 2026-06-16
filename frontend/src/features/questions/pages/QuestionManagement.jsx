import React, { useState } from 'react';
import { 
  Database, 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  Filter, 
  CheckCircle2, 
  HelpCircle,
  Hash
} from 'lucide-react';

const QuestionManagement = () => {
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['ALL', 'REACT', 'SPRING_BOOT', 'DATABASES', 'AI_ML'];

  // Mock questions array matching schema fields (id, questionText, type, difficulty, options)
  const questions = [
    { 
      id: 1, 
      questionText: 'What is the virtual DOM in React?', 
      category: 'REACT', 
      difficulty: 'Easy',
      options: [
        { optionText: 'A direct copy of the HTML DOM', isCorrect: false },
        { optionText: 'A lightweight JavaScript representation of the actual DOM', isCorrect: true },
        { optionText: 'A browser plugin for debugging DOM elements', isCorrect: false },
        { optionText: 'An external server-side rendered HTML node tree', isCorrect: false },
      ]
    },
    { 
      id: 2, 
      questionText: 'Which Spring annotation is used to auto-inject dependent beans?', 
      category: 'SPRING_BOOT', 
      difficulty: 'Easy',
      options: [
        { optionText: '@Autowired', isCorrect: true },
        { optionText: '@Inject', isCorrect: false },
        { optionText: '@Resource', isCorrect: false },
        { optionText: '@Component', isCorrect: false },
      ]
    },
    { 
      id: 3, 
      questionText: 'Explain the difference between useEffect cleanup function and componentWillUnmount.', 
      category: 'REACT', 
      difficulty: 'Medium',
      options: [
        { optionText: 'useEffect cleanup runs after every render cleanup; componentWillUnmount runs only before destruction', isCorrect: true },
        { optionText: 'They are completely identical in execution flow and scope', isCorrect: false },
        { optionText: 'componentWillUnmount runs asynchronously; useEffect cleanup runs synchronously', isCorrect: false },
      ]
    }
  ];

  const filteredQuestions = questions.filter(q => {
    const matchesCategory = activeCategory === 'ALL' || q.category === activeCategory;
    const matchesSearch = q.questionText.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white light:text-black">Question Bank</h2>
          <p className="text-sm text-zinc-500 light:text-zinc-400">
            Maintain questions pool, assign options, and tag categories
          </p>
        </div>
        <button
          className="flex items-center space-x-2 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-brand-500/10 hover:shadow-brand-500/20 transition cursor-pointer"
        >
          <Plus size={16} />
          <span>Add Question</span>
        </button>
      </div>

      {/* Control panel (Search & Tabs) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search questions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-zinc-900 light:border-zinc-200 bg-zinc-950/50 light:bg-zinc-50 py-2 pl-10 pr-4 text-sm text-white light:text-black focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-all"
          />
        </div>

        {/* Categories Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-zinc-950 light:bg-zinc-100 rounded-xl border border-zinc-900 light:border-zinc-200">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition cursor-pointer ${
                activeCategory === cat
                  ? 'bg-zinc-900 light:bg-white text-brand-400 light:text-brand-600 shadow border border-zinc-800 light:border-zinc-200'
                  : 'text-zinc-500 hover:text-zinc-300 light:hover:text-zinc-800'
              }`}
            >
              {cat.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Questions list */}
      <div className="space-y-6">
        {filteredQuestions.length === 0 ? (
          <div className="text-center py-12 border border-[#1a1a1a] rounded-2xl">
            <HelpCircle size={32} className="mx-auto text-zinc-600 mb-2" />
            <p className="text-zinc-500 text-sm">No questions found matching criteria.</p>
          </div>
        ) : (
          filteredQuestions.map((q) => (
            <div 
              key={q.id} 
              className="border border-[#1a1a1a] light:border-zinc-200 bg-[#0a0a0a]/60 light:bg-white/60 p-6 rounded-2xl backdrop-blur-sm space-y-4"
            >
              {/* Question Header details */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-zinc-500 bg-zinc-950 light:bg-zinc-100 border border-zinc-900 light:border-zinc-200 px-2 py-0.5 rounded-md">
                    {q.category}
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                    q.difficulty === 'Medium' 
                      ? 'bg-amber-950/30 border-amber-900/30 text-amber-400' 
                      : 'bg-emerald-950/30 border-emerald-900/30 text-emerald-400'
                  }`}>
                    {q.difficulty}
                  </span>
                </div>

                <div className="flex items-center space-x-1.5">
                  <button 
                    className="p-1.5 bg-zinc-950 light:bg-zinc-50 border border-zinc-900 light:border-zinc-200 rounded-lg text-zinc-400 hover:text-white transition cursor-pointer"
                    aria-label="Edit question"
                  >
                    <Edit3 size={13} />
                  </button>
                  <button 
                    className="p-1.5 bg-red-950/20 light:bg-red-50 border border-red-950/50 light:border-red-100 rounded-lg text-red-400 hover:text-red-300 transition cursor-pointer"
                    aria-label="Delete question"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              {/* Question Body */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-white light:text-black flex items-start space-x-2">
                  <span className="text-brand-500 mt-0.5">Q:</span>
                  <span>{q.questionText}</span>
                </h4>

                {/* Multiple choice options */}
                <div className="grid gap-2.5 pl-6 md:grid-cols-2">
                  {q.options.map((opt, index) => (
                    <div 
                      key={index} 
                      className={`flex items-center space-x-3 p-3 rounded-xl border text-xs font-medium ${
                        opt.isCorrect 
                          ? 'bg-emerald-950/10 border-emerald-900/40 text-emerald-400' 
                          : 'bg-zinc-950/30 border-zinc-900 light:border-zinc-150 text-zinc-400 light:text-zinc-600'
                      }`}
                    >
                      <CheckCircle2 size={14} className={opt.isCorrect ? 'text-emerald-400' : 'text-zinc-700'} />
                      <span>{opt.optionText}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};

export default QuestionManagement;
