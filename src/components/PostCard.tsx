import React from 'react';
import { 
  ArrowUp, 
  ArrowDown, 
  MessageSquare, 
  Bookmark, 
  Eye, 
  Clock,
  Building,
  Star,
  DollarSign
} from 'lucide-react';
import { Post } from '../types';

interface PostCardProps {
  post: Post;
  onClick: () => void;
  onEngagement?: (postId: string, type: 'upvote' | 'downvote' | 'comment' | 'bookmark') => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onClick, onEngagement }) => {
  const formatSalary = (salary: { min: number; max: number; currency: string }) => {
    const formatAmount = (amount: number) => {
      if (amount >= 10000000) return `${(amount / 10000000).toFixed(1)}Cr`;
      if (amount >= 100000) return `${(amount / 100000).toFixed(1)}L`;
      return amount.toString();
    };

    return `${formatAmount(salary.min)} - ${formatAmount(salary.max)} ${salary.currency}`;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'interview-experience': 'bg-blue-100 text-blue-800',
      'preparation-tips': 'bg-green-100 text-green-800',
      'company-culture': 'bg-purple-100 text-purple-800',
      'career-thoughts': 'bg-orange-100 text-orange-800',
      'qa-format': 'bg-pink-100 text-pink-800',
      'learning': 'bg-indigo-100 text-indigo-800',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      'Easy': 'bg-green-100 text-green-800',
      'Medium': 'bg-yellow-100 text-yellow-800',
      'Hard': 'bg-red-100 text-red-800',
    };
    return colors[difficulty as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const timeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return `${Math.floor(diffInHours / 168)}w ago`;
  };

  const handleEngagementClick = (e: React.MouseEvent, type: 'upvote' | 'downvote' | 'comment' | 'bookmark') => {
    e.stopPropagation();
    onEngagement?.(post.id, type);
  };

  return (
    <article 
      onClick={onClick}
      className="bg-white rounded-lg border border-gray-200 hover:border-primary-300 hover:shadow-lg transition-all duration-300 cursor-pointer group"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <img
              src={post.author.avatar || 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=2'}
              alt={post.author.name}
              className="h-10 w-10 rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-medium text-gray-900">{post.author.name}</p>
              <div className="flex items-center text-xs text-gray-500 space-x-2">
                <span>{post.author.role} at {post.author.company}</span>
                <span>•</span>
                <span className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {timeAgo(post.publishedAt)}
                </span>
              </div>
            </div>
          </div>
          
          {post.isAnonymous && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              Anonymous
            </span>
          )}
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-700 transition-colors duration-200">
          {post.title}
        </h2>

        {/* Excerpt */}
        <p className="text-gray-600 mb-4 line-clamp-3">
          {post.excerpt}
        </p>

        {/* Company and Role Info */}
        {(post.company || post.role) && (
          <div className="flex items-center space-x-4 mb-4 p-3 bg-gray-50 rounded-lg">
            {post.company && (
              <div className="flex items-center text-sm text-gray-600">
                <Building className="h-4 w-4 mr-1" />
                <span className="font-medium">{post.company}</span>
              </div>
            )}
            {post.role && (
              <div className="text-sm text-gray-600">
                <span className="font-medium">{post.role}</span>
              </div>
            )}
            {post.salary && (
              <div className="flex items-center text-sm text-gray-600">
                <DollarSign className="h-4 w-4 mr-1" />
                <span className="font-medium">{formatSalary(post.salary)}</span>
              </div>
            )}
          </div>
        )}

        {/* Tags and Metadata */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(post.category)}`}>
              {post.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </span>
            
            {post.difficulty && (
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(post.difficulty)}`}>
                {post.difficulty}
              </span>
            )}

            {post.rating && (
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-sm text-gray-600 ml-1">{post.rating}/5</span>
              </div>
            )}
          </div>

          <div className="flex items-center text-sm text-gray-500">
            <Eye className="h-4 w-4 mr-1" />
            <span>{post.views.toLocaleString()}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-primary-50 text-primary-700 hover:bg-primary-100 transition-colors duration-200"
            >
              #{tag}
            </span>
          ))}
          {post.tags.length > 4 && (
            <span className="text-xs text-gray-500">+{post.tags.length - 4} more</span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-6">
            <button 
              onClick={(e) => handleEngagementClick(e, 'upvote')}
              className="flex items-center space-x-2 text-gray-500 hover:text-primary-600 transition-colors duration-200"
            >
              <ArrowUp className="h-5 w-5" />
              <span className="text-sm font-medium">{post.upvotes}</span>
            </button>
            
            <button 
              onClick={(e) => handleEngagementClick(e, 'downvote')}
              className="flex items-center space-x-2 text-gray-500 hover:text-red-600 transition-colors duration-200"
            >
              <ArrowDown className="h-5 w-5" />
              <span className="text-sm font-medium">{post.downvotes}</span>
            </button>
            
            <button 
              onClick={(e) => handleEngagementClick(e, 'comment')}
              className="flex items-center space-x-2 text-gray-500 hover:text-blue-600 transition-colors duration-200"
            >
              <MessageSquare className="h-5 w-5" />
              <span className="text-sm font-medium">{post.comments}</span>
            </button>
          </div>

          <button 
            onClick={(e) => handleEngagementClick(e, 'bookmark')}
            className="flex items-center space-x-2 text-gray-500 hover:text-primary-600 transition-colors duration-200"
          >
            <Bookmark className="h-5 w-5" />
            <span className="text-sm font-medium">{post.bookmarks}</span>
          </button>
        </div>
      </div>
    </article>
  );
};

export default PostCard;