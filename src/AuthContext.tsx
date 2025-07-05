import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState } from '../types';
import { AuthService } from '../services/authService';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithGithub: () => Promise<void>;
  logout: () => void;
  signup: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const savedUser = localStorage.getItem('nitready_user');
      if (savedUser) {
        const user = JSON.parse(savedUser);
        // Convert date string back to Date object
        user.joinedAt = new Date(user.joinedAt);
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const login = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser: User = {
      id: 'email_' + Date.now(),
      name: 'Demo User',
      email,
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      bio: 'Software Engineer passionate about sharing interview experiences',
      company: 'Tech Corp',
      role: 'Senior Software Engineer',
      experience: '5+ years',
      skills: ['React', 'Node.js', 'Python', 'AWS'],
      joinedAt: new Date(),
      followers: 245,
      following: 180,
      posts: 12,
    };

    localStorage.setItem('nitready_user', JSON.stringify(mockUser));
    
    setAuthState({
      user: mockUser,
      isAuthenticated: true,
      isLoading: false,
    });
  };

  const loginWithGoogle = async () => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // Get Google OAuth URL and open popup
      const authUrl = AuthService.getGoogleAuthUrl();
      const result = await AuthService.openOAuthPopup(authUrl, 'google');
      
      // Process the OAuth callback
      const userData = await AuthService.processOAuthCallback('google', result.code);
      
      localStorage.setItem('nitready_user', JSON.stringify(userData));
      
      setAuthState({
        user: userData,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      console.error('Google OAuth error:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const loginWithGithub = async () => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // Get GitHub OAuth URL and open popup
      const authUrl = AuthService.getGithubAuthUrl();
      const result = await AuthService.openOAuthPopup(authUrl, 'github');
      
      // Process the OAuth callback
      const userData = await AuthService.processOAuthCallback('github', result.code);
      
      localStorage.setItem('nitready_user', JSON.stringify(userData));
      
      setAuthState({
        user: userData,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      console.error('GitHub OAuth error:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const signup = async (userData: Partial<User>) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser: User = {
      id: 'signup_' + Date.now(),
      name: userData.name || '',
      email: userData.email || '',
      avatar: userData.avatar,
      bio: userData.bio,
      company: userData.company,
      role: userData.role,
      experience: userData.experience,
      skills: userData.skills || [],
      joinedAt: new Date(),
      followers: 0,
      following: 0,
      posts: 0,
    };

    localStorage.setItem('nitready_user', JSON.stringify(newUser));
    
    setAuthState({
      user: newUser,
      isAuthenticated: true,
      isLoading: false,
    });
  };

  const logout = () => {
    localStorage.removeItem('nitready_user');
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  const value: AuthContextType = {
    ...authState,
    login,
    loginWithGoogle,
    loginWithGithub,
    logout,
    signup,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};