import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Plus, 
  Trash2, 
  Edit3, 
  Clock, 
  Search, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  Calendar,
  Loader2,
  MoreVertical,
  X,
  Play,
  Archive,
  BookOpen
} from 'lucide-react';
import {
  useAssessmentsQuery,
  useCreateAssessmentMutation,
  useUpdateAssessmentMutation,
  useDeleteAssessmentMutation
} from '../hooks/useAssessments';

const AssessmentManagement = () => {
  // Search and status filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // ALL, DRAFT, PUBLISHED, CLOSED

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingAssessment, setEditingAssessment] = useState(null); // null means creating
  const [deletingAssessment, setDeletingAssessment] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: 30,
    status: 'DRAFT'
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

  // Queries and mutations
  const { data: assessments = [], isLoading, error: fetchError } = useAssessmentsQuery();
  const createMutation = useCreateAssessmentMutation();
  const updateMutation = useUpdateAssessmentMutation();
  const deleteMutation = useDeleteAssessmentMutation();

  // Handle Toast dismiss
  const dismissToast = () => setToast(null);

  // Handle open create form
  const handleOpenCreate = () => {
    setEditingAssessment(null);
    setFormData({
      title: '',
      description: '',
      duration: 30,
      status: 'DRAFT'
    });
    setFormErrors({});
    setIsFormOpen(true);
  };

  // Handle open edit form
  const handleOpenEdit = (assessment) => {
    setEditingAssessment(assessment);
    setFormData({
      title: assessment.title || '',
      description: assessment.description || '',
      duration: assessment.duration || 30,
      status: assessment.status || 'DRAFT'
    });
    setFormErrors({});
    setIsFormOpen(true);
  };

  // Handle open delete dialog
  const handleOpenDelete = (assessment) => {
    setDeletingAssessment(assessment);
    setIsDeleteOpen(true);
  };

  // Quick action: Publish Draft
  const handleQuickPublish = async (assessment) => {
    try {
      await updateMutation.mutateAsync({
        id: assessment.id,
        title: assessment.title,
        description: assessment.description,
        duration: assessment.duration,
        status: 'PUBLISHED'
      });
      showToast('success', `"${assessment.title}" has been published successfully.`);
    } catch (err) {
      const errorMsg = err.response?.data || err.message || 'Failed to publish assessment.';
      showToast('error', errorMsg);
    }
  };

  // Form input validation
  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    }
    if (!formData.duration || formData.duration < 1) {
      errors.duration = 'Duration must be at least 1 minute';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle Form Submit (Create or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (editingAssessment) {
        await updateMutation.mutateAsync({
          id: editingAssessment.id,
          ...formData
        });
        showToast('success', `Assessment "${formData.title}" updated successfully.`);
      } else {
        await createMutation.mutateAsync(formData);
        showToast('success', `Assessment "${formData.title}" created successfully.`);
      }
      setIsFormOpen(false);
    } catch (err) {
      const errorMsg = err.response?.data || err.message || 'An error occurred during submission.';
      showToast('error', errorMsg);
    }
  };

  // Handle Delete Confirmation
  const handleDeleteConfirm = async () => {
    if (!deletingAssessment) return;
    try {
      await deleteMutation.mutateAsync(deletingAssessment.id);
      showToast('success', `Assessment "${deletingAssessment.title}" deleted successfully.`);
      setIsDeleteOpen(false);
    } catch (err) {
      const errorMsg = err.response?.data || err.message || 'Failed to delete assessment.';
      showToast('error', errorMsg);
    }
  };

  // Filter and Search logic
  const filteredAssessments = assessments.filter(assessment => {
    const matchesSearch = assessment.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          assessment.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || assessment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Date formatter helper
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(undefined, { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch {
      return dateString;
    }
  };

  // Loading skeleton card components
  const renderSkeletons = () => {
    return Array.from({ length: 4 }).map((_, idx) => (
      <div 
        key={idx}
        className="border border-[#1a1a1a] bg-[#0a0a0a]/40 p-6 rounded-2xl flex flex-col justify-between h-[230px] animate-pulse"
      >
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-900" />
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-zinc-900 rounded w-2/3" />
              <div className="h-3 bg-zinc-900 rounded w-1/3" />
            </div>
          </div>
          <div className="h-3 bg-zinc-900 rounded w-full" />
          <div className="h-3 bg-zinc-900 rounded w-5/6" />
          
          <div className="grid grid-cols-3 gap-2 pt-2">
            <div className="h-8 bg-zinc-900 rounded" />
            <div className="h-8 bg-zinc-900 rounded" />
            <div className="h-8 bg-zinc-900 rounded" />
          </div>
        </div>
        <div className="h-8 bg-zinc-900 rounded w-full mt-4" />
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
            onClick={dismissToast} 
            className="p-1 hover:bg-zinc-900/40 rounded transition"
            aria-label="Dismiss notification"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white light:text-zinc-900">Assessment Management</h2>
          <p className="text-sm text-zinc-500 light:text-zinc-400">
            Create, configure, publish, and manage structured coding or general recruitment assessments.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center justify-center space-x-2 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-brand-500/10 hover:shadow-brand-500/20 transition duration-200 cursor-pointer self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Create Assessment</span>
        </button>
      </div>

      {/* Filters, Tabs & Search */}
      <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search by title or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-zinc-900 light:border-zinc-200 bg-zinc-950/50 light:bg-zinc-50 py-2.5 pl-10 pr-4 text-sm text-white light:text-zinc-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-all duration-200 placeholder-zinc-600"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-zinc-950 light:bg-zinc-100 rounded-xl border border-zinc-900 light:border-zinc-200 self-start">
          {['ALL', 'DRAFT', 'PUBLISHED', 'CLOSED'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wider transition duration-150 cursor-pointer ${
                statusFilter === status
                  ? 'bg-zinc-900 light:bg-white text-brand-400 light:text-brand-600 shadow border border-zinc-800 light:border-zinc-200'
                  : 'text-zinc-500 hover:text-zinc-300 light:hover:text-zinc-800'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      {fetchError && (
        <div className="p-4 rounded-xl border border-red-900 bg-red-950/20 text-red-400 flex items-center space-x-3">
          <AlertCircle size={18} />
          <span className="text-xs font-medium">Failed to load assessments: {fetchError.message || 'Backend connection error.'}</span>
        </div>
      )}

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2">
          {renderSkeletons()}
        </div>
      ) : filteredAssessments.length === 0 ? (
        <div className="text-center py-16 border border-[#1a1a1a] light:border-zinc-200 rounded-2xl bg-[#0a0a0a]/20 light:bg-white/20">
          <FileSpreadsheet size={40} className="mx-auto text-zinc-600 mb-3" />
          <h3 className="text-sm font-semibold text-zinc-400 light:text-zinc-600">No assessments found</h3>
          <p className="text-xs text-zinc-500 light:text-zinc-400 mt-1 max-w-sm mx-auto">
            Try adjusting your search filters or create a new recruiter assessment to get started.
          </p>
          <button
            onClick={handleOpenCreate}
            className="mt-4 px-4 py-2 border border-zinc-800 hover:border-zinc-700 light:border-zinc-200 light:hover:border-zinc-300 rounded-xl text-xs font-medium text-white light:text-zinc-800 hover:bg-zinc-950 transition cursor-pointer"
          >
            Create your first assessment
          </button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {filteredAssessments.map((assessment) => (
            <div 
              key={assessment.id} 
              className="group border border-[#1a1a1a] light:border-zinc-200 bg-[#0a0a0a]/60 light:bg-white/60 p-6 rounded-2xl backdrop-blur-sm flex flex-col justify-between hover:border-zinc-800 light:hover:border-zinc-300 transition duration-200"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 rounded-xl bg-brand-600/10 text-brand-400 border border-brand-500/20">
                      <FileSpreadsheet size={20} />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-white light:text-zinc-900 group-hover:text-brand-400 transition duration-150">
                        {assessment.title}
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider">
                          ID: #{assessment.id}
                        </span>
                        <span className="text-zinc-700 text-xs">•</span>
                        {/* Status Badge */}
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border ${
                          assessment.status === 'PUBLISHED'
                            ? 'bg-emerald-950/20 border-emerald-900/50 text-emerald-400'
                            : assessment.status === 'CLOSED'
                            ? 'bg-red-950/20 border-red-900/50 text-red-400'
                            : 'bg-zinc-950/20 border-zinc-900 text-zinc-400'
                        }`}>
                          {assessment.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-zinc-400 light:text-zinc-500 leading-relaxed min-h-[40px] break-words">
                  {assessment.description || 'No description provided for this assessment.'}
                </p>

                {/* Grid stats */}
                <div className="grid grid-cols-2 gap-4 py-3 border-y border-[#161616] light:border-zinc-200">
                  <div className="flex items-center space-x-2.5">
                    <Clock size={14} className="text-brand-400" />
                    <div>
                      <div className="text-[10px] font-semibold text-zinc-500">Duration</div>
                      <div className="text-xs font-bold text-white light:text-zinc-900">{assessment.duration} mins</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2.5">
                    <Calendar size={14} className="text-purple-400" />
                    <div>
                      <div className="text-[10px] font-semibold text-zinc-500">Created Date</div>
                      <div className="text-xs font-bold text-white light:text-zinc-900">{formatDate(assessment.createdAt)}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Actions Footer */}
              <div className="flex items-center justify-between mt-6 pt-2 border-t border-[#121212]/30">
                <div>
                  {assessment.status === 'DRAFT' ? (
                    <button
                      onClick={() => handleQuickPublish(assessment)}
                      disabled={updateMutation.isPending}
                      className="text-xs font-semibold text-brand-400 hover:text-brand-300 disabled:opacity-50 flex items-center space-x-1.5 cursor-pointer bg-brand-500/5 hover:bg-brand-500/10 px-2.5 py-1.5 rounded-lg border border-brand-500/20 transition"
                    >
                      <Play size={12} className="fill-brand-400/20" />
                      <span>Publish Now</span>
                    </button>
                  ) : (
                    <span className="text-[10px] text-zinc-600 font-semibold italic">
                      Created by: {assessment.createdByEmail || 'System'}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => handleOpenEdit(assessment)}
                    className="p-2 bg-zinc-950 light:bg-zinc-50 border border-zinc-900 light:border-zinc-200 rounded-lg text-zinc-400 hover:text-white light:hover:text-zinc-900 transition cursor-pointer"
                    aria-label="Edit assessment"
                    title="Edit assessment"
                  >
                    <Edit3 size={13} />
                  </button>
                  <button 
                    onClick={() => handleOpenDelete(assessment)}
                    className="p-2 bg-red-950/10 light:bg-red-50 border border-red-950/20 light:border-red-100 rounded-lg text-red-400 hover:bg-red-950/30 hover:text-red-300 transition cursor-pointer"
                    aria-label="Delete assessment"
                    title="Delete assessment"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal Form */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative bg-zinc-950 border border-zinc-900 light:bg-white light:border-zinc-200 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4 text-white light:text-zinc-900 animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-2 border-b border-zinc-900 light:border-zinc-200">
              <h3 className="text-lg font-bold">
                {editingAssessment ? 'Edit Assessment' : 'Create Assessment'}
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
              
              {/* Title Field */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-400 light:text-zinc-600 block">Assessment Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Senior Frontend Engineer Test"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className={`w-full text-sm bg-zinc-900 light:bg-zinc-50 border rounded-xl py-2 px-3 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-all ${
                    formErrors.title ? 'border-red-500 focus:border-red-500' : 'border-zinc-800 light:border-zinc-200 focus:border-brand-500'
                  }`}
                />
                {formErrors.title && (
                  <span className="text-[10px] font-semibold text-red-400 block">{formErrors.title}</span>
                )}
              </div>

              {/* Description Field */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-400 light:text-zinc-600 block">Description</label>
                <textarea
                  rows="3"
                  placeholder="Summarize the assessment scope, questions, or target roles..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full text-sm bg-zinc-900 light:bg-zinc-50 border border-zinc-800 light:border-zinc-200 rounded-xl py-2 px-3 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-all"
                />
              </div>

              {/* Duration & Status Row */}
              <div className="grid grid-cols-2 gap-4">
                
                {/* Duration */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-400 light:text-zinc-600 block">Duration (Minutes) *</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                    className={`w-full text-sm bg-zinc-900 light:bg-zinc-50 border rounded-xl py-2 px-3 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-all ${
                      formErrors.duration ? 'border-red-500 focus:border-red-500' : 'border-zinc-800 light:border-zinc-200 focus:border-brand-500'
                    }`}
                  />
                  {formErrors.duration && (
                    <span className="text-[10px] font-semibold text-red-400 block">{formErrors.duration}</span>
                  )}
                </div>

                {/* Status Selection */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-400 light:text-zinc-600 block">Status *</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full text-sm bg-zinc-900 light:bg-zinc-50 border border-zinc-800 light:border-zinc-200 rounded-xl py-2 px-3 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-all text-white light:text-zinc-900"
                  >
                    <option value="DRAFT" className="bg-zinc-950 text-white">Draft</option>
                    <option value="PUBLISHED" className="bg-zinc-950 text-white">Published</option>
                    <option value="CLOSED" className="bg-zinc-950 text-white">Closed</option>
                  </select>
                </div>

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
                  <span>{editingAssessment ? 'Save Changes' : 'Create Assessment'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {isDeleteOpen && deletingAssessment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative bg-zinc-950 border border-zinc-900 light:bg-white light:border-zinc-200 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4 text-white light:text-zinc-900 animate-in zoom-in-95 duration-200">
            
            <div className="flex items-center space-x-3 text-red-500">
              <AlertCircle size={24} />
              <h3 className="text-base font-bold">Delete Assessment?</h3>
            </div>

            <p className="text-xs text-zinc-400 light:text-zinc-500 leading-relaxed">
              Are you sure you want to delete assessment <strong>"{deletingAssessment.title}"</strong>? 
              This action is permanent and cannot be undone. All candidate history for this assessment will be lost.
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

export default AssessmentManagement;
