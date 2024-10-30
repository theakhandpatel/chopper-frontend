import React from 'react';
import { useState } from 'react';
import { Link, ChevronRight, Scissors, QrCode, BarChart3, LogIn, LogOut, User, Crown } from 'lucide-react';
import AuthModal from './components/AuthModal';
import URLShortener from './components/URLShortener';
import Analytics from './components/Analytics';
import URLList from './components/URLList';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [token, setToken] = useState('');
  const [activeTab, setActiveTab] = useState('shorten');

  const handleLogin = (newToken: string) => {
    setToken(newToken);
    setIsAuthenticated(true);
    setShowAuthModal(false);
  };

  const handleLogout = async () => {
    try {
      await fetch('https://ch-op.onrender.com/api/signout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setToken('');
      setIsAuthenticated(false);
      setIsPremium(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const upgradeToPremium = async () => {
    try {
      const response = await fetch('https://ch-op.onrender.com/api/premium', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        setIsPremium(true);
      }
    } catch (error) {
      console.error('Premium upgrade failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link className="text-indigo-600 w-6 h-6" />
              <span className="ml-2 text-xl font-bold text-gray-800">URL Shortener</span>
            </div>
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  {!isPremium && (
                    <button
                      onClick={upgradeToPremium}
                      className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-md hover:from-yellow-500 hover:to-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                    >
                      <Crown className="w-4 h-4 mr-2" />
                      Upgrade to Premium
                    </button>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Login / Sign Up
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isAuthenticated && (
          <div className="mb-8 flex justify-center space-x-4">
            <button
              onClick={() => setActiveTab('shorten')}
              className={`flex items-center px-4 py-2 rounded-md ${
                activeTab === 'shorten'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Scissors className="w-4 h-4 mr-2" />
              Shorten URL
            </button>
            <button
              onClick={() => setActiveTab('urls')}
              className={`flex items-center px-4 py-2 rounded-md ${
                activeTab === 'urls'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Link className="w-4 h-4 mr-2" />
              My URLs
            </button>
            {isPremium && (
              <button
                onClick={() => setActiveTab('analytics')}
                className={`flex items-center px-4 py-2 rounded-md ${
                  activeTab === 'analytics'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </button>
            )}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-xl p-6">
          {activeTab === 'shorten' && <URLShortener token={token} isPremium={isPremium} />}
          {activeTab === 'urls' && <URLList token={token} isPremium={isPremium} />}
          {activeTab === 'analytics' && isPremium && <Analytics token={token} />}
          {!isAuthenticated && (
            <div className="text-center py-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to URL Shortener</h2>
              <p className="text-gray-600 mb-6">Sign in to access all features and manage your shortened URLs.</p>
              <button
                onClick={() => setShowAuthModal(true)}
                className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                Get Started
                <ChevronRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          )}
        </div>
      </main>

      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;