import React, { useState } from 'react';
import { X, Save, Eye, Building, DollarSign, Star, AlertCircle, CheckCircle } from 'lucide-react';
import { PostCategory } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { RealtimeService } from '../services/realtimeService';

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PublishModal: React.FC<PublishModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'interview-experience' as PostCategory,
    tags: '',
    company: '',
    role: '',
    difficulty: '',
    salaryMin: '',
    salaryMax: '',
    isAnonymous: false,
  });

  const [isPreview, setIsPreview] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const categories = [
    { value: 'interview-experience', label: 'Interview Experience' },
    { value: 'preparation-tips', label: 'Preparation Tips' },
    { value: 'company-culture', label: 'Company Culture' },
    { value: 'career-thoughts', label: 'Career Insights' },
    { value: 'qa-format', label: 'Q&A Format' },
    { value: 'learning', label: 'Learning' },
  ];

  const difficulties = [
    { value: '', label: 'Select Difficulty' },
    { value: 'Easy', label: 'Easy' },
    { value: 'Medium', label: 'Medium' },
    { value: 'Hard', label: 'Hard' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPublishing(true);
    setError('');

    try {
      // Validate required fields
      if (!formData.title.trim()) {
        throw new Error('Title is required');
      }
      if (!formData.content.trim()) {
        throw new Error('Content is required');
      }

      // Create new post
      const newPost = {
        id: 'post_' + Date.now(),
        title: formData.title.trim(),
        content: formData.content.trim(),
        excerpt: formData.content.trim().substring(0, 200) + '...',
        author: formData.isAnonymous ? {
          ...user!,
          name: 'Anonymous User',
          avatar: undefined,
        } : user!,
        category: formData.category,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        company: formData.company.trim() || undefined,
        role: formData.role.trim() || undefined,
        difficulty: formData.difficulty || undefined,
        salary: (formData.salaryMin && formData.salaryMax) ? {
          min: parseInt(formData.salaryMin) * 100000, // Convert lakhs to actual amount
          max: parseInt(formData.salaryMax) * 100000,
          currency: 'INR',
        } : undefined,
        upvotes: 0,
        downvotes: 0,
        comments: 0,
        bookmarks: 0,
        views: 0,
        publishedAt: new Date(),
        updatedAt: new Date(),
        isAnonymous: formData.isAnonymous,
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Add to realtime service
      RealtimeService.addPost(newPost as any);

      setPublishSuccess(true);
      
      // Close modal after success message
      setTimeout(() => {
        onClose();
        setPublishSuccess(false);
        // Reset form
        setFormData({
          title: '',
          content: '',
          category: 'interview-experience',
          tags: '',
          company: '',
          role: '',
          difficulty: '',
          salaryMin: '',
          salaryMax: '',
          isAnonymous: false,
        });
        setIsPreview(false);
      }, 2000);

    } catch (error: any) {
      setError(error.message || 'Failed to publish post. Please try again.');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  if (publishSuccess) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8 text-center">
          <div className="mb-4">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Post Published!</h2>
          <p className="text-gray-600">Your post has been published successfully and is now visible to the community.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {isPreview ? 'Preview Post' : 'Publish New Post'}
          </h2>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsPreview(!isPreview)}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
            >
              <Eye className="h-4 w-4 mr-2" />
              {isPreview ? 'Edit' : 'Preview'}
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Error Message */}
          {error && (
            <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          )}

          {isPreview ? (
            /* Preview Mode */
            <div className="p-6">
              <div className="prose max-w-none">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{formData.title || 'Untitled Post'}</h1>
                
                {(formData.company || formData.role) && (
                  <div className="flex items-center space-x-4 mb-6 p-4 bg-gray-50 rounded-lg">
                    {formData.company && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Building className="h-4 w-4 mr-1" />
                        <span className="font-medium">{formData.company}</span>
                      </div>
                    )}
                    {formData.role && (
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">{formData.role}</span>
                      </div>
                    )}
                    {formData.salaryMin && formData.salaryMax && (
                      <div className="flex items-center text-sm text-gray-600">
                        <DollarSign className="h-4 w-4 mr-1" />
                        <span className="font-medium">{formData.salaryMin}L - {formData.salaryMax}L INR</span>
                      </div>
                    )}
                    {formData.difficulty && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Star className="h-4 w-4 mr-1" />
                        <span className="font-medium">{formData.difficulty}</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="whitespace-pre-wrap text-gray-700">
                  {formData.content || 'Start writing your post content...'}
                </div>

                {formData.tags && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.split(',').map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800"
                        >
                          #{tag.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Edit Mode */
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Post Title *
                  </label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    required
                    value={formData.title}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="e.g., Google SDE Interview Experience - L4 Position"
                  />
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    id="category"
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-2">
                    Difficulty Level
                  </label>
                  <select
                    id="difficulty"
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    {difficulties.map((diff) => (
                      <option key={diff.value} value={diff.value}>
                        {diff.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Company Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                    Company
                  </label>
                  <input
                    id="company"
                    name="company"
                    type="text"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="e.g., Google, Amazon, Microsoft"
                  />
                </div>

                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                    Role/Position
                  </label>
                  <input
                    id="role"
                    name="role"
                    type="text"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="e.g., Software Engineer L4, Product Manager"
                  />
                </div>
              </div>

              {/* Salary Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="salaryMin" className="block text-sm font-medium text-gray-700 mb-2">
                    Salary Range (Min) - in Lakhs INR
                  </label>
                  <input
                    id="salaryMin"
                    name="salaryMin"
                    type="number"
                    value={formData.salaryMin}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="e.g., 25"
                  />
                </div>

                <div>
                  <label htmlFor="salaryMax" className="block text-sm font-medium text-gray-700 mb-2">
                    Salary Range (Max) - in Lakhs INR
                  </label>
                  <input
                    id="salaryMax"
                    name="salaryMax"
                    type="number"
                    value={formData.salaryMax}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="e.g., 35"
                  />
                </div>
              </div>

              {/* Content */}
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                  Content *
                </label>
                <textarea
                  id="content"
                  name="content"
                  required
                  rows={12}
                  value={formData.content}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Share your detailed experience, tips, or insights. Use markdown formatting for better readability..."
                />
                <p className="mt-1 text-sm text-gray-500">
                  Tip: Use markdown formatting (# for headings, ** for bold, * for lists)
                </p>
              </div>

              {/* Tags */}
              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <input
                  id="tags"
                  name="tags"
                  type="text"
                  value={formData.tags}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="e.g., coding interview, system design, behavioral (comma separated)"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Separate tags with commas. This helps others find your post.
                </p>
              </div>

              {/* Anonymous Option */}
              <div className="flex items-center">
                <input
                  id="isAnonymous"
                  name="isAnonymous"
                  type="checkbox"
                  checked={formData.isAnonymous}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="isAnonymous" className="ml-2 block text-sm text-gray-700">
                  Publish anonymously (your name won't be shown)
                </label>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPublishing}
                  className="flex items-center px-6 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPublishing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Publishing...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Publish Post
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublishModal;