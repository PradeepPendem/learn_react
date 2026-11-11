import React, { useState, useEffect, useRef } from 'react';
import { Eye, Search, Save, Info, RefreshCw } from 'lucide-react';

// ==========================================
// 1. CUSTOM HOOKS DEFINITIONS
// ==========================================

// useDebounce - Delays updating value until user stops typing
function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// useLocalStorage - Keeps state synchronized with browser localStorage
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

// usePrevious - Retrieves previous render's state value
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}


// ==========================================
// 2. COMPONENT LAB IMPLEMENTATION
// ==========================================
export default function CustomHooksShowcase() {
  // useDebounce States
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 600);
  const [debouncedLogs, setDebouncedLogs] = useState([]);

  // useLocalStorage States
  const [persistentNote, setPersistentNote] = useLocalStorage('masterclass-lab-note', 'Type something here...');

  // usePrevious States
  const [counter, setCounter] = useState(0);
  const previousCounter = usePrevious(counter);

  // Monitor search debounce changes
  useEffect(() => {
    if (debouncedSearch) {
      setDebouncedLogs(prev => [
        `Debounced change triggered: "${debouncedSearch}" at ${new Date().toLocaleTimeString()}`,
        ...prev.slice(0, 5)
      ]);
    }
  }, [debouncedSearch]);

  return (
    <div className="module-container">
      <div className="module-header">
        <div className="header-icon">
          <Eye className="icon-blue" />
        </div>
        <div>
          <h2>Custom Hooks Laboratory</h2>
          <p className="subtitle">
            Custom hooks extract component logic into reusable functions. Explore hooks for debouncing input, local storage synchronization, and previous state tracking.
          </p>
        </div>
      </div>

      <div className="grid-2col">
        {/* Left Column: Interactive Demos */}
        <div className="flex flex-col gap-4">
          
          {/* Demo 1: useDebounce */}
          <div className="card">
            <div className="card-header">
              <h3>useDebounce Showcase</h3>
            </div>
            <div className="p-4">
              <label className="text-xs font-semibold block mb-1">Instant Value (onChange):</label>
              <div className="flex gap-2 items-center">
                <Search className="w-5 h-5 text-secondary" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Type rapidly to test debounce..."
                  className="input-text"
                />
              </div>

              <div className="flex justify-between gap-4 mt-3 bg-card-dark p-3 rounded text-sm">
                <div>
                  <span className="text-xs text-secondary block">Immediate:</span>
                  <span className="font-mono">{searchTerm || '(empty)'}</span>
                </div>
                <div className="border-l border-border pl-4">
                  <span className="text-xs text-secondary block">Debounced (600ms):</span>
                  <span className="font-mono text-purple-400 font-semibold">{debouncedSearch || '(empty)'}</span>
                </div>
              </div>

              <div className="mt-3">
                <span className="text-xs text-secondary block mb-1">Trigger History:</span>
                <div className="bg-dark p-2 rounded text-xs font-mono max-h-24 overflow-y-auto">
                  {debouncedLogs.length === 0 ? (
                    <span className="text-secondary">Waiting for input changes...</span>
                  ) : (
                    debouncedLogs.map((log, i) => <div key={i} className="text-green-400">{log}</div>)
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Demo 2: useLocalStorage */}
          <div className="card">
            <div className="card-header">
              <h3>useLocalStorage Showcase</h3>
            </div>
            <div className="p-4">
              <label className="text-xs font-semibold block mb-1">Auto-synchronized Note Pad:</label>
              <textarea
                value={persistentNote}
                onChange={(e) => setPersistentNote(e.target.value)}
                className="input-textarea"
                rows="3"
                placeholder="Persistent browser settings or text..."
              />
              <span className="text-xs text-secondary flex items-center gap-1 mt-2">
                <Save className="w-3.5 h-3.5" /> Synchronized in real-time. Reload the tab to see it persist!
              </span>
            </div>
          </div>

          {/* Demo 3: usePrevious */}
          <div className="card">
            <div className="card-header">
              <h3>usePrevious Showcase</h3>
            </div>
            <div className="p-4 flex items-center justify-between">
              <div>
                <span className="text-xs text-secondary block">Value comparison:</span>
                <div className="flex gap-4 items-center mt-1">
                  <div>
                    <span className="text-xs">Current:</span>
                    <div className="font-mono text-lg font-bold">{counter}</div>
                  </div>
                  <div>
                    <span className="text-xs">Previous:</span>
                    <div className="font-mono text-lg font-bold text-yellow-400">
                      {previousCounter === undefined ? 'N/A' : previousCounter}
                    </div>
                  </div>
                </div>
              </div>
              <button
                className="btn btn-primary"
                onClick={() => setCounter(c => c + 1)}
              >
                Increment State (+1)
              </button>
            </div>
          </div>

        </div>

        {/* Right Column: Explanatory & Code Panel */}
        <div className="card doc-panel">
          <div className="card-header">
            <h3>Custom Hook Source Code</h3>
          </div>
          <div className="doc-content">
            <div className="doc-alert info">
              <Info className="doc-alert-icon" />
              <div>
                <strong>Rules of Hooks:</strong> Custom hooks must start with "use" prefix. They can consume other hooks and maintain encapsulation while providing isolated state for each calling component.
              </div>
            </div>

            <pre className="code-block font-mono text-xs leading-relaxed mt-4">
{`// useDebounce Implementation
function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // 1. Setup timeout
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // 2. Clean up timeout on value/delay change
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}`}
            </pre>

            <pre className="code-block font-mono text-xs leading-relaxed mt-4">
{`// usePrevious Implementation
function usePrevious(value) {
  const ref = useRef();
  
  // Runs AFTER render updates DOM
  useEffect(() => {
    ref.current = value;
  }, [value]);
  
  // Returns value captured during RENDER
  return ref.current;
}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
