import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  HelpCircle,
  Hash,
  X,
  Loader2,
  CheckCircle,
  AlertCircle,
  BookOpen,
  ArrowRight,
  Sparkles,
  Info
} from 'lucide-react';
import { useAssessmentsQuery } from '../../assessments/hooks/useAssessments';
import {
  useAllQuestionsQuery,
  useCreateQuestionMutation,
  useUpdateQuestionMutation,
  useDeleteQuestionMutation
} from '../hooks/useQuestions';

const QuestionManagement = () => {
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [assessmentFilter, setAssessmentFilter] = useState('ALL'); // ALL or assessmentId
  const [typeFilter, setTypeFilter] = useState('ALL'); // ALL or QuestionType

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null); // null means creating
  const [deletingQuestion, setDeletingQuestion] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    text: '',
    type: 'SINGLE_CHOICE',
    points: 5,
    assessmentId: '', // selected assessment ID (for creation only)
    options: [
      { text: '', isCorrect: false },
      { text: '', isCorrect: false }
    ]
  });
  const [formErrors, setFormErrors] = useState({});

  // Toast notification state
  const [toast, setToast] = useState(null);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast(current => current?.message === message ? null : current);
    }, 4000);
  };

  // Queries
  const { data: assessments = [], isLoading: isAssessmentsLoading, error: assessmentsError } = useAssessmentsQuery();
  const { data: questions = [], isLoading: isQuestionsLoading, error: questionsError } = useAllQuestionsQuery(assessments);

  // Mutations
  const createMutation = useCreateQuestionMutation();
  const updateMutation = useUpdateQuestionMutation();
  const deleteMutation = useDeleteQuestionMutation();

  // Reset form options when type changes
  const handleTypeChange = (newType) => {
    let newOptions = [];
    if (newType === 'TRUE_FALSE') {
      newOptions = [
        { text: 'True', isCorrect: true },
        { text: 'False', isCorrect: false }
      ];
    } else if (newType === 'SHORT_ANSWER') {
      newOptions = [
        { text: '', isCorrect: true }
      ];
    } else {
      // MCQ or SCQ: initialize with 2 empty options
      newOptions = [
        { text: '', isCorrect: false },
        { text: '', isCorrect: false }
      ];
    }

    setFormData({
      ...formData,
      type: newType,
      options: newOptions
    });
    setFormErrors(prev => ({ ...prev, options: null }));
  };

  // Option actions for MCQ/SCQ
  const handleAddOption = () => {
    setFormData({
      ...formData,
      options: [...formData.options, { text: '', isCorrect: false }]
    });
  };

  const handleRemoveOption = (indexToRemove) => {
    if (formData.options.length <= 1) return;
    setFormData({
      ...formData,
      options: formData.options.filter((_, idx) => idx !== indexToRemove)
    });
  };

  const handleOptionTextChange = (index, value) => {
    const updatedOptions = formData.options.map((opt, idx) => 
      idx === index ? { ...opt, text: value } : opt
    );
    setFormData({ ...formData, options: updatedOptions });
  };

  const handleOptionCorrectChange = (index, type) => {
    let updatedOptions = [];
    if (type === 'SINGLE_CHOICE' || type === 'TRUE_FALSE') {
      // Radio logic: Only one is correct
      updatedOptions = formData.options.map((opt, idx) => ({
        ...opt,
        isCorrect: idx === index
      }));
    } else if (type === 'MULTIPLE_CHOICE') {
      // Checkbox logic: Toggle isCorrect
      updatedOptions = formData.options.map((opt, idx) => 
        idx === index ? { ...opt, isCorrect: !opt.isCorrect } : opt
      );
    }
    setFormData({ ...formData, options: updatedOptions });
  };

  // Open Create Form
  const handleOpenCreate = () => {
    setEditingQuestion(null);
    setFormData({
      text: '',
      type: 'SINGLE_CHOICE',
      points: 5,
      assessmentId: assessments[0]?.id ? String(assessments[0].id) : '',
      options: [
        { text: '', isCorrect: false },
        { text: '', isCorrect: false }
      ]
    });
    setFormErrors({});
    setIsFormOpen(true);
  };

  // Open Edit Form
  const handleOpenEdit = (question) => {
    setEditingQuestion(question);
    setFormData({
      text: question.text || '',
      type: question.type || 'SINGLE_CHOICE',
      points: question.points || 5,
      assessmentId: String(question.assessmentId || ''),
      options: question.options ? question.options.map(opt => ({
        text: opt.text || '',
        isCorrect: opt.isCorrect || false
      })) : []
    });
    setFormErrors({});
    setIsFormOpen(true);
  };

  // Open Delete dialog
  const handleOpenDelete = (question) => {
    setDeletingQuestion(question);
    setIsDeleteOpen(true);
  };

  // Form Validation
  const validateForm = () => {
    const errors = {};
    if (!formData.text.trim()) {
      errors.text = 'Question text is required';
    }
    if (!formData.points || formData.points < 1) {
      errors.points = 'Points must be at least 1';
    }
    if (!editingQuestion && !formData.assessmentId) {
      errors.assessmentId = 'Target assessment is required';
    }

    // Options validation
    const optionsErrors = [];
    let hasCorrect = false;

    formData.options.forEach((opt, idx) => {
      if (!opt.text.trim()) {
        optionsErrors[idx] = 'Option text cannot be empty';
      }
      if (opt.isCorrect) {
        hasCorrect = true;
      }
    });

    if (optionsErrors.length > 0) {
      errors.optionsList = optionsErrors;
    }

    if (!hasCorrect) {
      errors.options = 'At least one option must be marked as correct';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle Form Submit (Create/Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (editingQuestion) {
        await updateMutation.mutateAsync({
          id: editingQuestion.id,
          text: formData.text,
          type: formData.type,
          points: formData.points,
          options: formData.options
        });
        showToast('success', 'Question updated successfully.');
      } else {
        await createMutation.mutateAsync({
          assessmentId: parseInt(formData.assessmentId),
          text: formData.text,
          type: formData.type,
          points: formData.points,
          options: formData.options
        });
        showToast('success', 'Question added to assessment successfully.');
      }
      setIsFormOpen(false);
    } catch (err) {
      const errorMsg = err.response?.data || err.message || 'Failed to submit question.';
      showToast('error', errorMsg);
    }
  };

  // Handle Delete Confirmation
  const handleDeleteConfirm = async () => {
    if (!deletingQuestion) return;
    try {
      await deleteMutation.mutateAsync(deletingQuestion.id);
      showToast('success', 'Question deleted successfully.');
      setIsDeleteOpen(false);
    } catch (err) {
      const errorMsg = err.response?.data || err.message || 'Failed to delete question.';
      showToast('error', errorMsg);
    }
  };

  // Filter and Search logic
  const filteredQuestions = questions.filter(question => {
    const matchesSearch = question.text?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          question.assessmentName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAssessment = assessmentFilter === 'ALL' || String(question.assessmentId) === assessmentFilter;
    const matchesType = typeFilter === 'ALL' || question.type === typeFilter;
    return matchesSearch && matchesAssessment && matchesType;
  });

  // Render Skeleton cards
  const renderSkeletons = () => {
    return Array.from({ length: 3 }).map((_, idx) => (
      <div 
        key={idx}
        className="border border-[#1a1a1a] bg-[#0a0a0a]/40 p-6 rounded-2xl space-y-4 animate-pulse h-[220px]"
      >
        <div className="flex justify-between items-start">
          <div className="flex space-x-2 w-1/2">
            <div className="h-5 bg-zinc-900 rounded w-16" />
            <div className="h-5 bg-zinc-900 rounded w-16" />
          </div>
          <div className="h-7 bg-zinc-900 rounded w-14" />
        </div>
        <div className="h-4 bg-zinc-900 rounded w-5/6" />
        <div className="h-4 bg-zinc-900 rounded w-1/2" />
        
        <div className="grid grid-cols-2 gap-2 pt-2">
          <div className="h-8 bg-zinc-900 rounded" />
          <div className="h-8 bg-zinc-900 rounded" />
        </div>
      </div>
    ));
  };

  return (
    <div className="relative min-h-full space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
      
      {/* Toast Notification */}
      {toast && (
        <div 
          className={`fixed top-6 right-6 z-50 flex items-center space-x-3 px-4 py-3.5 rounded-xl border shadow-xl backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-top-4 ${
            toast.type === 'success' 
              ? 'bg-emerald-950/90 border-emerald-800 text-emerald-400' 
              : 'bg-red-950/90 border-red-900 text-red-400'
          }`}
        >
          {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span className="text-xs font-semibold">{toast.message}</span>
          <button 
            onClick={() => setToast(null)} 
            className="p-1 hover:bg-zinc-900/40 rounded transition"
            aria-label="Dismiss toast"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white light:text-zinc-900">Question Bank</h2>
          <p className="text-sm text-zinc-500 light:text-zinc-400">
            Build and manage reusable assessment questions. Add options, customize difficulty, and assign scores.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          disabled={assessments.length === 0}
          className="flex items-center justify-center space-x-2 px-4 py-2 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white rounded-xl text-sm font-semibold shadow-lg shadow-brand-500/10 hover:shadow-brand-500/20 transition duration-200 cursor-pointer self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Add Question</span>
        </button>
      </div>

      {/* Control Panel (Search, Filters, Tabs) */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center justify-between">
        
        {/* Search & Select Grid */}
        <div className="grid gap-3 sm:grid-cols-2 w-full lg:max-w-xl">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Search by text or assessment..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-zinc-900 light:border-zinc-200 bg-zinc-950/50 light:bg-zinc-50 py-2.5 pl-10 pr-4 text-sm text-white light:text-zinc-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-all duration-200 placeholder-zinc-600"
            />
          </div>

          {/* Assessment Filter Dropdown */}
          <select
            value={assessmentFilter}
            onChange={(e) => setAssessmentFilter(e.target.value)}
            className="w-full rounded-xl border border-zinc-900 light:border-zinc-200 bg-zinc-950/50 light:bg-zinc-50 py-2.5 px-3.5 text-sm text-white light:text-zinc-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-all duration-200"
          >
            <option value="ALL" className="bg-zinc-950 text-white">All Assessments</option>
            {assessments.map((ass) => (
              <option key={ass.id} value={String(ass.id)} className="bg-zinc-950 text-white">
                {ass.title}
              </option>
            ))}
          </select>
        </div>

        {/* Type Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-zinc-950 light:bg-zinc-100 rounded-xl border border-zinc-900 light:border-zinc-200 self-start">
          {['ALL', 'SINGLE_CHOICE', 'MULTIPLE_CHOICE', 'TRUE_FALSE', 'SHORT_ANSWER'].map((type) => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition duration-150 cursor-pointer ${
                typeFilter === type
                  ? 'bg-zinc-900 light:bg-white text-brand-400 light:text-brand-600 shadow border border-zinc-800 light:border-zinc-200'
                  : 'text-zinc-500 hover:text-zinc-300 light:hover:text-zinc-800'
              }`}
            >
              {type.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Areas */}
      {assessmentsError && (
        <div className="p-4 rounded-xl border border-red-900 bg-red-950/20 text-red-400 flex items-center space-x-3 text-xs">
          <AlertCircle size={16} />
          <span>Failed to load assessments: {assessmentsError.message}</span>
        </div>
      )}

      {questionsError && (
        <div className="p-4 rounded-xl border border-red-900 bg-red-950/20 text-red-400 flex items-center space-x-3 text-xs">
          <AlertCircle size={16} />
          <span>Failed to load questions: {questionsError.message}</span>
        </div>
      )}

      {/* If no assessments exist */}
      {!isAssessmentsLoading && assessments.length === 0 && (
        <div className="text-center py-16 border border-[#1a1a1a] rounded-2xl bg-[#0a0a0a]/20">
          <BookOpen size={40} className="mx-auto text-zinc-600 mb-3" />
          <h3 className="text-sm font-semibold text-zinc-400">No Assessments Available</h3>
          <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
            You must create at least one recruitment assessment in the Assessment Dashboard before adding questions to the question bank.
          </p>
        </div>
      )}

      {assessments.length > 0 && (
        <>
          {isQuestionsLoading ? (
            <div className="space-y-6">
              {renderSkeletons()}
            </div>
          ) : filteredQuestions.length === 0 ? (
            <div className="text-center py-16 border border-[#1a1a1a] light:border-zinc-200 rounded-2xl bg-[#0a0a0a]/20 light:bg-white/20">
              <HelpCircle size={40} className="mx-auto text-zinc-600 mb-3" />
              <h3 className="text-sm font-semibold text-zinc-400 light:text-zinc-600">No questions found</h3>
              <p className="text-xs text-zinc-500 light:text-zinc-400 mt-1 max-w-sm mx-auto">
                No questions match your filter query. Create a new question or modify filters.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredQuestions.map((question) => (
                <div 
                  key={question.id} 
                  className="border border-[#1a1a1a] light:border-zinc-200 bg-[#0a0a0a]/60 light:bg-white/60 p-6 rounded-2xl backdrop-blur-sm space-y-4 hover:border-zinc-800 light:hover:border-zinc-300 transition duration-200"
                >
                  {/* Card Header Details */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#141414] pb-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-bold text-zinc-500 bg-zinc-950 light:bg-zinc-100 border border-zinc-900 light:border-zinc-200 px-2.5 py-0.5 rounded-md">
                        {question.assessmentName}
                      </span>
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider border bg-brand-950/20 border-brand-900/40 text-brand-400">
                        {question.type?.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold border bg-purple-950/20 border-purple-900/40 text-purple-400 flex items-center space-x-1">
                        <Hash size={10} />
                        <span>{question.points} pts</span>
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleOpenEdit(question)}
                        className="p-1.5 bg-zinc-950 light:bg-zinc-50 border border-zinc-900 light:border-zinc-200 rounded-lg text-zinc-400 hover:text-white light:hover:text-zinc-900 transition cursor-pointer"
                        aria-label="Edit question"
                        title="Edit question"
                      >
                        <Edit3 size={13} />
                      </button>
                      <button 
                        onClick={() => handleOpenDelete(question)}
                        className="p-1.5 bg-red-950/10 light:bg-red-50 border border-red-950/20 light:border-red-100 rounded-lg text-red-400 hover:bg-red-950/30 hover:text-red-300 transition cursor-pointer"
                        aria-label="Delete question"
                        title="Delete question"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Question Body */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-white light:text-zinc-900 flex items-start space-x-2">
                      <span className="text-brand-500 mt-0.5">Q:</span>
                      <span className="break-words w-full leading-relaxed">{question.text}</span>
                    </h4>

                    {/* Options list render */}
                    <div className="grid gap-2.5 pl-6 md:grid-cols-2">
                      {question.options?.map((opt, idx) => (
                        <div 
                          key={opt.id || idx} 
                          className={`flex items-center justify-between p-3 rounded-xl border text-xs font-medium ${
                            opt.isCorrect 
                              ? 'bg-emerald-950/10 border-emerald-900/40 text-emerald-400' 
                              : 'bg-zinc-950/30 border-zinc-900 light:border-zinc-150 text-zinc-400 light:text-zinc-600'
                          }`}
                        >
                          <span className="break-words pr-2">{opt.text}</span>
                          {opt.isCorrect && (
                            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                              Correct
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Create / Edit Question Modal Form */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative bg-zinc-950 border border-zinc-900 light:bg-white light:border-zinc-200 rounded-2xl w-full max-w-xl p-6 shadow-2xl space-y-4 text-white light:text-zinc-900 animate-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-2 border-b border-zinc-900 light:border-zinc-200">
              <h3 className="text-lg font-bold flex items-center space-x-2">
                <Sparkles size={18} className="text-brand-400 animate-pulse" />
                <span>{editingQuestion ? 'Edit Question' : 'Add Question'}</span>
              </h3>
              <button 
                onClick={() => setIsFormOpen(false)}
                className="p-1 text-zinc-500 hover:text-zinc-300 light:hover:text-zinc-800 transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Target Assessment (Create Only) */}
              {!editingQuestion && (
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-400 light:text-zinc-600 block">Assessment Target *</label>
                  <select
                    value={formData.assessmentId}
                    onChange={(e) => setFormData({ ...formData, assessmentId: e.target.value })}
                    className={`w-full text-sm bg-zinc-900 light:bg-zinc-50 border rounded-xl py-2 px-3 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-all text-white light:text-zinc-900 ${
                      formErrors.assessmentId ? 'border-red-500' : 'border-zinc-800 light:border-zinc-200'
                    }`}
                  >
                    <option value="" disabled className="text-zinc-500">Select an assessment</option>
                    {assessments.map((ass) => (
                      <option key={ass.id} value={String(ass.id)} className="bg-zinc-950 text-white">
                        {ass.title}
                      </option>
                    ))}
                  </select>
                  {formErrors.assessmentId && (
                    <span className="text-[10px] font-semibold text-red-400 block">{formErrors.assessmentId}</span>
                  )}
                </div>
              )}

              {/* Question Text */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-400 light:text-zinc-600 block">Question Text *</label>
                <textarea
                  rows="3"
                  placeholder="e.g. Which of the following is correct about Virtual DOM in React?"
                  value={formData.text}
                  onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                  className={`w-full text-sm bg-zinc-900 light:bg-zinc-50 border rounded-xl py-2.5 px-3.5 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-all ${
                    formErrors.text ? 'border-red-500' : 'border-zinc-800 light:border-zinc-200'
                  }`}
                />
                {formErrors.text && (
                  <span className="text-[10px] font-semibold text-red-400 block">{formErrors.text}</span>
                )}
              </div>

              {/* Question Type and Points */}
              <div className="grid grid-cols-2 gap-4">
                
                {/* Type Selection */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-400 light:text-zinc-600 block">Question Type *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => handleTypeChange(e.target.value)}
                    className="w-full text-sm bg-zinc-900 light:bg-zinc-50 border border-zinc-800 light:border-zinc-200 rounded-xl py-2 px-3 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-all text-white light:text-zinc-900"
                  >
                    <option value="SINGLE_CHOICE" className="bg-zinc-950 text-white">Single Choice</option>
                    <option value="MULTIPLE_CHOICE" className="bg-zinc-950 text-white">Multiple Choice</option>
                    <option value="TRUE_FALSE" className="bg-zinc-950 text-white">True / False</option>
                    <option value="SHORT_ANSWER" className="bg-zinc-950 text-white">Short Answer</option>
                  </select>
                </div>

                {/* Score Points */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-400 light:text-zinc-600 block">Score Points *</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.points}
                    onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) || 0 })}
                    className={`w-full text-sm bg-zinc-900 light:bg-zinc-50 border rounded-xl py-2 px-3 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-all ${
                      formErrors.points ? 'border-red-500' : 'border-zinc-800 light:border-zinc-200'
                    }`}
                  />
                  {formErrors.points && (
                    <span className="text-[10px] font-semibold text-red-400 block">{formErrors.points}</span>
                  )}
                </div>

              </div>

              {/* DYNAMIC OPTION BUILDER */}
              <div className="space-y-3.5 pt-2 border-t border-zinc-900 light:border-zinc-200">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-zinc-300 light:text-zinc-800 block">Configure Answers & Options</label>
                  
                  {/* General validation warnings */}
                  {formErrors.options && (
                    <span className="text-[10px] font-bold text-red-400 flex items-center space-x-1">
                      <AlertCircle size={10} />
                      <span>{formErrors.options}</span>
                    </span>
                  )}
                </div>

                {/* Render Builder depending on Type */}
                
                {/* 1. SINGLE_CHOICE */}
                {formData.type === 'SINGLE_CHOICE' && (
                  <div className="space-y-2.5">
                    <p className="text-[10px] text-zinc-500 flex items-center space-x-1 bg-zinc-900/50 p-2 rounded-lg border border-zinc-900 light:border-zinc-150">
                      <Info size={12} className="text-brand-400 flex-shrink-0" />
                      <span>Provide answer options and check the radio button corresponding to the single correct option.</span>
                    </p>
                    <div className="space-y-2">
                      {formData.options.map((option, idx) => (
                        <div key={idx} className="flex items-center space-x-3">
                          <input
                            type="radio"
                            name="correct-option-single"
                            checked={option.isCorrect}
                            onChange={() => handleOptionCorrectChange(idx, 'SINGLE_CHOICE')}
                            className="h-4 w-4 text-brand-600 focus:ring-brand-500 focus:ring-offset-zinc-950 focus:ring-1 border-zinc-800 bg-zinc-900 cursor-pointer"
                          />
                          <input
                            type="text"
                            placeholder={`Option #${idx + 1}`}
                            value={option.text}
                            onChange={(e) => handleOptionTextChange(idx, e.target.value)}
                            className={`flex-1 text-xs bg-zinc-900 light:bg-zinc-50 border rounded-lg py-2 px-2.5 focus:outline-none ${
                              formErrors.optionsList?.[idx] ? 'border-red-500' : 'border-zinc-800 light:border-zinc-200'
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveOption(idx)}
                            disabled={formData.options.length <= 1}
                            className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-950/10 rounded-lg transition disabled:opacity-30 cursor-pointer"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={handleAddOption}
                      className="text-[11px] font-bold text-brand-400 hover:text-brand-300 transition py-1 px-2.5 border border-brand-500/10 rounded-lg bg-brand-500/5 cursor-pointer"
                    >
                      + Add Custom Option
                    </button>
                  </div>
                )}

                {/* 2. MULTIPLE_CHOICE */}
                {formData.type === 'MULTIPLE_CHOICE' && (
                  <div className="space-y-2.5">
                    <p className="text-[10px] text-zinc-500 flex items-center space-x-1 bg-zinc-900/50 p-2 rounded-lg border border-zinc-900 light:border-zinc-150">
                      <Info size={12} className="text-brand-400 flex-shrink-0" />
                      <span>Provide answer options and check checkboxes for all correct answers (multiple option selections allowed).</span>
                    </p>
                    <div className="space-y-2">
                      {formData.options.map((option, idx) => (
                        <div key={idx} className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={option.isCorrect}
                            onChange={() => handleOptionCorrectChange(idx, 'MULTIPLE_CHOICE')}
                            className="h-4 w-4 text-brand-600 focus:ring-brand-500 focus:ring-offset-zinc-950 rounded border-zinc-800 bg-zinc-900 cursor-pointer"
                          />
                          <input
                            type="text"
                            placeholder={`Option #${idx + 1}`}
                            value={option.text}
                            onChange={(e) => handleOptionTextChange(idx, e.target.value)}
                            className={`flex-1 text-xs bg-zinc-900 light:bg-zinc-50 border rounded-lg py-2 px-2.5 focus:outline-none ${
                              formErrors.optionsList?.[idx] ? 'border-red-500' : 'border-zinc-800 light:border-zinc-200'
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveOption(idx)}
                            disabled={formData.options.length <= 1}
                            className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-950/10 rounded-lg transition disabled:opacity-30 cursor-pointer"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={handleAddOption}
                      className="text-[11px] font-bold text-brand-400 hover:text-brand-300 transition py-1 px-2.5 border border-brand-500/10 rounded-lg bg-brand-500/5 cursor-pointer"
                    >
                      + Add Custom Option
                    </button>
                  </div>
                )}

                {/* 3. TRUE_FALSE */}
                {formData.type === 'TRUE_FALSE' && (
                  <div className="space-y-3 bg-[#0a0a0a] p-4 rounded-xl border border-zinc-900 light:bg-zinc-50 light:border-zinc-200">
                    <span className="text-[10px] font-semibold text-zinc-400 light:text-zinc-500 block uppercase tracking-wider mb-1">
                      Choose correct boolean answer
                    </span>
                    <div className="flex items-center space-x-6">
                      <label className="flex items-center space-x-2 text-xs font-semibold cursor-pointer">
                        <input
                          type="radio"
                          name="correct-tf"
                          checked={formData.options[0]?.isCorrect}
                          onChange={() => handleOptionCorrectChange(0, 'TRUE_FALSE')}
                          className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-zinc-800 bg-zinc-900"
                        />
                        <span>True is correct</span>
                      </label>
                      <label className="flex items-center space-x-2 text-xs font-semibold cursor-pointer">
                        <input
                          type="radio"
                          name="correct-tf"
                          checked={formData.options[1]?.isCorrect}
                          onChange={() => handleOptionCorrectChange(1, 'TRUE_FALSE')}
                          className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-zinc-800 bg-zinc-900"
                        />
                        <span>False is correct</span>
                      </label>
                    </div>
                  </div>
                )}

                {/* 4. SHORT_ANSWER */}
                {formData.type === 'SHORT_ANSWER' && (
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-400 light:text-zinc-600 block uppercase tracking-wider">
                      Expected Answer Text *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Virtual DOM, useEffect, Spring Beans, or regex keywords..."
                      value={formData.options[0]?.text || ''}
                      onChange={(e) => handleOptionTextChange(0, e.target.value)}
                      className={`w-full text-xs bg-zinc-900 light:bg-zinc-50 border rounded-lg py-2 px-3 focus:outline-none focus:border-brand-500 transition-all ${
                        formErrors.optionsList?.[0] ? 'border-red-500' : 'border-zinc-800 light:border-zinc-200'
                      }`}
                    />
                    {formErrors.optionsList?.[0] && (
                      <span className="text-[10px] font-semibold text-red-400 block">{formErrors.optionsList[0]}</span>
                    )}
                  </div>
                )}

              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-zinc-900 light:border-zinc-200">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 border border-zinc-800 hover:bg-zinc-900 light:border-zinc-200 light:hover:bg-zinc-50 rounded-xl text-xs font-semibold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="flex items-center justify-center space-x-2 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-brand-500/10 hover:shadow-brand-500/20 transition disabled:opacity-50 cursor-pointer"
                >
                  {(createMutation.isPending || updateMutation.isPending) && (
                    <Loader2 size={12} className="animate-spin" />
                  )}
                  <span>{editingQuestion ? 'Save Changes' : 'Add Question'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {isDeleteOpen && deletingQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative bg-zinc-950 border border-zinc-900 light:bg-white light:border-zinc-200 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4 text-white light:text-zinc-900 animate-in zoom-in-95 duration-200">
            
            <div className="flex items-center space-x-3 text-red-500">
              <AlertCircle size={24} />
              <h3 className="text-base font-bold">Delete Question?</h3>
            </div>

            <p className="text-xs text-zinc-400 light:text-zinc-500 leading-relaxed">
              Are you sure you want to delete this question?
              <span className="block mt-2 bg-zinc-900/60 p-3 rounded-lg border border-zinc-900 italic font-mono text-[11px]">
                "{deletingQuestion.text}"
              </span>
              This action cannot be undone and will remove it from the associated assessment.
            </p>

            {/* Dialog Footer Actions */}
            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setIsDeleteOpen(false)}
                className="px-4 py-2 border border-zinc-800 hover:bg-zinc-900 light:border-zinc-200 light:hover:bg-zinc-50 rounded-xl text-xs font-semibold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={deleteMutation.isPending}
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-red-500/10 hover:shadow-red-500/20 transition disabled:opacity-50 cursor-pointer"
              >
                {deleteMutation.isPending && (
                  <Loader2 size={12} className="animate-spin" />
                )}
                <span>Delete Permanently</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default QuestionManagement;
