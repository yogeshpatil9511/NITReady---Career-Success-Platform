import React, { useState, useEffect } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import PostCard from './components/PostCard';
import AuthModal from './components/AuthModal';
import PublishModal from './components/PublishModal';
import { mockPosts } from './data/mockData';
import { RealtimeService } from './services/realtimeService';
import { Post } from './types';

function App() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    // Load posts from storage or use mock data
    const storedPosts = RealtimeService.loadFromStorage();
    const initialPosts = storedPosts.length > 0 ? storedPosts : mockPosts;
    
    // Initialize realtime service
    RealtimeService.initialize(initialPosts);
    setPosts(initialPosts);

    // Subscribe to real-time updates
    const unsubscribe = RealtimeService.addListener((updatedPosts) => {
      setPosts(updatedPosts);
    });

    return unsubscribe;
  }, []);

  const filteredPosts = selectedCategory === 'all' 
    ? posts 
    : posts.filter(post => post.category === selectedCategory);

  const handlePostClick = (postId: string) => {
    // Navigate to post detail page
    console.log('Navigate to post:', postId);
  };

  const handleEngagement = (postId: string, type: 'upvote' | 'downvote' | 'comment' | 'bookmark') => {
    RealtimeService.updateEngagement(postId, type);
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Header 
          onAuthClick={() => setIsAuthModalOpen(true)}
          onPublishClick={() => setIsPublishModalOpen(true)}
        />
        
        <div className="flex">
          <Sidebar 
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
          
          <main className="flex-1 p-6">
            <div className="max-w-4xl mx-auto">
              {/* Header Section */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {selectedCategory === 'all' ? 'Latest Posts' : 
                   selectedCategory.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </h1>
                <p className="text-gray-600">
                  Discover interview experiences, preparation tips, and career insights from the tech community
                </p>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="text-2xl font-bold text-primary-600">{posts.length}</div>
                  <div className="text-sm text-gray-600">Total Posts</div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="text-2xl font-bold text-accent-600">
                    {new Set(posts.map(p => p.company).filter(Boolean)).size}
                  </div>
                  <div className="text-sm text-gray-600">Companies Covered</div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="text-2xl font-bold text-primary-600">
                    {posts.reduce((sum, post) => sum + post.views, 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Total Views</div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="text-2xl font-bold text-accent-600">
                    {posts.reduce((sum, post) => sum + post.upvotes, 0)}
                  </div>
                  <div className="text-sm text-gray-600">Total Upvotes</div>
                </div>
              </div>

              {/* Real-time indicator */}
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-600">Live updates enabled</span>
                </div>
                <div className="text-sm text-gray-500">
                  {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'} found
                </div>
              </div>

              {/* Posts Grid */}
              <div className="space-y-6">
                {filteredPosts.length > 0 ? (
                  filteredPosts.map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      onClick={() => handlePostClick(post.id)}
                      onEngagement={handleEngagement}
                    />
                  ))
                ) : (
                  <div className="text-center py-12">
                    <div className="text-gray-400 text-lg mb-2">No posts found</div>
                    <div className="text-gray-500">Try selecting a different category</div>
                  </div>
                )}
              </div>

              {/* Load More Button */}
              {filteredPosts.length > 0 && (
                <div className="text-center mt-12">
                  <button className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200">
                    Load More Posts
                  </button>
                </div>
              )}
            </div>
          </main>
        </div>

        {/* Modals */}
        <AuthModal 
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />
        
        <PublishModal
          isOpen={isPublishModalOpen}
          onClose={() => setIsPublishModalOpen(false)}
        />
      </div>
    </AuthProvider>
  );
}

export default App;