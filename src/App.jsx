import React, { useEffect } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { store } from './store/store';
import {
  selectUiState,
  setActiveTab,
  toggleTheme
} from './store/uiSlice';
import CompoundComponents from './components/CompoundComponents';
import StateManagementDashboard from './components/StateManagementDashboard';
import PerformanceVisualizer from './components/PerformanceVisualizer';
import CustomHooksShowcase from './components/CustomHooksShowcase';
import {
  Sparkles,
  Database,
  Zap,
  Eye,
  Sun,
  Moon,
  Github,
  BookOpen
} from 'lucide-react';
import './App.css';

// Initialize TanStack React Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Prevents refetching when switching browser tabs
      retry: false
    }
  }
});

function AppContent() {
  const { theme, activeTab } = useSelector(selectUiState);
  const dispatch = useDispatch();

  // Apply light/dark data attribute to HTML tag
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Dynamic Content Router
  const renderActiveModule = () => {
    switch (activeTab) {
      case 'patterns':
        return <CompoundComponents />;
      case 'state':
        return <StateManagementDashboard />;
      case 'perf':
        return <PerformanceVisualizer />;
      case 'hooks':
        return <CustomHooksShowcase />;
      default:
        return <CompoundComponents />;
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="logo-section">
          <BookOpen className="logo-icon w-6 h-6" />
          <span className="logo-text">React Masterclass</span>
        </div>

        <nav className="nav-links">
          <button
            className={`nav-btn ${activeTab === 'patterns' ? 'active' : ''}`}
            onClick={() => dispatch(setActiveTab('patterns'))}
          >
            <Sparkles className="w-4 h-4" />
            Compound Components
          </button>
          <button
            className={`nav-btn ${activeTab === 'state' ? 'active' : ''}`}
            onClick={() => dispatch(setActiveTab('state'))}
          >
            <Database className="w-4 h-4" />
            State Management
          </button>
          <button
            className={`nav-btn ${activeTab === 'perf' ? 'active' : ''}`}
            onClick={() => dispatch(setActiveTab('perf'))}
          >
            <Zap className="w-4 h-4" />
            Performance & Memo
          </button>
          <button
            className={`nav-btn ${activeTab === 'hooks' ? 'active' : ''}`}
            onClick={() => dispatch(setActiveTab('hooks'))}
          >
            <Eye className="w-4 h-4" />
            Custom Hooks Lab
          </button>
        </nav>

        {/* Footer info in sidebar */}
        <div className="mt-auto border-t border-border pt-4 text-xs text-secondary flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span>Theme Mode:</span>
            <button
              className="btn-icon"
              onClick={() => dispatch(toggleTheme())}
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
          </div>
          <span className="text-2xs text-secondary opacity-60">Created with Antigravity AI</span>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="main-content">
        {renderActiveModule()}
      </main>
    </div>
  );
}

// Wrapper to provide Redux and Query Client contexts
export default function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </Provider>
  );
}
