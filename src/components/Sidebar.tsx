import React from 'react';
import { 
  Home, 
  Briefcase, 
  GraduationCap, 
  Users, 
  MessageSquare, 
  TrendingUp,
  Building,
  Star,
  Filter
} from 'lucide-react';

interface SidebarProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ selectedCategory, onCategoryChange }) => {
  const categories = [
    { id: 'all', label: 'All Posts', icon: Home },
    { id: 'interview-experience', label: 'Interview Experiences', icon: Briefcase },
    { id: 'preparation-tips', label: 'Preparation Tips', icon: GraduationCap },
    { id: 'company-culture', label: 'Company Culture', icon: Building },
    { id: 'career-thoughts', label: 'Career Insights', icon: TrendingUp },
    { id: 'qa-format', label: 'Q&A', icon: MessageSquare },
    { id: 'learning', label: 'Learning', icon: Star },
  ];

  const topCompanies = [
    { name: 'Google', posts: 234, logo: '🔍' },
    { name: 'Amazon', posts: 189, logo: '📦' },
    { name: 'Microsoft', posts: 156, logo: '🪟' },
    { name: 'Meta', posts: 134, logo: '👥' },
    { name: 'Apple', posts: 98, logo: '🍎' },
    { name: 'Netflix', posts: 76, logo: '🎬' },
  ];

  const trendingTags = [
    'System Design',
    'Coding Interview',
    'Behavioral',
    'Salary Negotiation',
    'Remote Work',
    'Career Switch',
    'Internship',
    'New Grad',
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen sticky top-16 overflow-y-auto">
      <div className="p-6">
        {/* Categories */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
            Categories
          </h3>
          <nav className="space-y-1">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => onCategoryChange(category.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    selectedCategory === category.id
                      ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {category.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Top Companies */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
            Top Companies
          </h3>
          <div className="space-y-2">
            {topCompanies.map((company) => (
              <button
                key={company.name}
                className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors duration-200"
              >
                <div className="flex items-center">
                  <span className="text-lg mr-3">{company.logo}</span>
                  <span className="font-medium">{company.name}</span>
                </div>
                <span className="text-xs text-gray-400">{company.posts}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Trending Tags */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
            Trending Tags
          </h3>
          <div className="flex flex-wrap gap-2">
            {trendingTags.map((tag) => (
              <button
                key={tag}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 hover:bg-primary-100 hover:text-primary-700 transition-colors duration-200"
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4 flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty
              </label>
              <div className="space-y-2">
                {['Easy', 'Medium', 'Hard'].map((level) => (
                  <label key={level} className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-600">{level}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Experience Level
              </label>
              <div className="space-y-2">
                {['Intern', 'New Grad', '1-3 years', '3-5 years', '5+ years'].map((level) => (
                  <label key={level} className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-600">{level}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;