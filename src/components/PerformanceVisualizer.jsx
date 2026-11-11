import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { Zap, Play, RotateCcw, AlertTriangle, ShieldCheck } from 'lucide-react';

// ==========================================
// UNMEMOIZED CELL COMPONENT
// ==========================================
function RegularCell({ id, onClick, count }) {
  const renderCount = useRef(0);
  renderCount.current += 1;

  // Flash border highlight on render
  const cellRef = useRef(null);
  useEffect(() => {
    if (cellRef.current) {
      cellRef.current.classList.add('flash-render');
      const timer = setTimeout(() => {
        cellRef.current?.classList.remove('flash-render');
      }, 500);
      return () => clearTimeout(timer);
    }
  });

  return (
    <div ref={cellRef} className="grid-cell unmemoized" onClick={() => onClick(id)}>
      <span className="cell-id">Cell {id}</span>
      <span className="render-count">Renders: {renderCount.current}</span>
      <span className="value">Val: {count}</span>
    </div>
  );
}

// ==========================================
// MEMOIZED CELL COMPONENT (React.memo)
// ==========================================
const MemoizedCell = React.memo(({ id, onClick, count }) => {
  const renderCount = useRef(0);
  renderCount.current += 1;

  const cellRef = useRef(null);
  useEffect(() => {
    if (cellRef.current) {
      cellRef.current.classList.add('flash-render-memo');
      const timer = setTimeout(() => {
        cellRef.current?.classList.remove('flash-render-memo');
      }, 500);
      return () => clearTimeout(timer);
    }
  });

  return (
    <div ref={cellRef} className="grid-cell memoized" onClick={() => onClick(id)}>
      <span className="cell-id">Cell {id} (Memo)</span>
      <span className="render-count">Renders: {renderCount.current}</span>
      <span className="value">Val: {count}</span>
    </div>
  );
});
MemoizedCell.displayName = 'MemoizedCell';


// ==========================================
// MAIN VISUALIZER
// ==========================================
export default function PerformanceVisualizer() {
  const [useMemoization, setUseMemoization] = useState(false);
  const [useCallbackHooks, setUseCallbackHooks] = useState(false);
  const [parentCount, setParentCount] = useState(0);
  const [cellData, setCellData] = useState({
    1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0
  });

  // Keep track of parent render count
  const parentRenders = useRef(0);
  parentRenders.current += 1;

  // 1. Regular click callback (changes identity on EVERY render)
  const handleCellClickRegular = (id) => {
    setCellData(prev => ({ ...prev, [id]: prev[id] + 1 }));
  };

  // 2. useCallback click callback (maintains reference identity)
  const handleCellClickMemoized = useCallback((id) => {
    setCellData(prev => ({ ...prev, [id]: prev[id] + 1 }));
  }, []);

  // Decide which handler to pass down based on toggle
  const activeClickHandler = useCallbackHooks ? handleCellClickMemoized : handleCellClickRegular;

  // 3. useMemo Showcase: Heavy calculation demo
  const [heavyIterations, setHeavyIterations] = useState(1000000);
  
  const calculateExpensiveValue = (iterations) => {
    let result = 0;
    for (let i = 0; i < iterations; i++) {
      result += Math.sin(i) * Math.cos(i);
    }
    return result.toFixed(4);
  };

  // Unmemoized expensive calculation (runs on EVERY parent render!)
  const expensiveValueRegular = calculateExpensiveValue(heavyIterations);

  // Memoized expensive calculation (ONLY runs when heavyIterations changes!)
  const expensiveValueMemoized = useMemo(() => {
    return calculateExpensiveValue(heavyIterations);
  }, [heavyIterations]);

  const activeExpensiveValue = useMemoization ? expensiveValueMemoized : expensiveValueRegular;

  const resetAll = () => {
    setCellData({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 });
    setParentCount(0);
  };

  return (
    <div className="module-container">
      <div className="module-header">
        <div className="header-icon">
          <Zap className="icon-orange" />
        </div>
        <div>
          <h2>Performance & Memoization Sandbox</h2>
          <p className="subtitle">
            See parent-child renders cascade in real-time. Understand how <code>React.memo</code>, <code>useCallback</code>, and <code>useMemo</code> protect your app's performance.
          </p>
        </div>
      </div>

      <div className="grid-2col">
        {/* Left Column: Visualizer Grid */}
        <div className="card performance-card">
          <div className="card-header justify-between">
            <h3>Render Grid Visualizer</h3>
            <span className="badge badge-accent">Parent Renders: {parentRenders.current}</span>
          </div>

          <div className="settings-controls mt-2">
            <label className="flex items-center gap-2 cursor-pointer font-medium">
              <input
                type="checkbox"
                checked={useMemoization}
                onChange={(e) => setUseMemoization(e.target.checked)}
              />
              Enable Cell Memoization (React.memo)
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-medium mt-2">
              <input
                type="checkbox"
                checked={useCallbackHooks}
                onChange={(e) => setUseCallbackHooks(e.target.checked)}
              />
              Enable Callback Memoization (useCallback)
            </label>
          </div>

          <div className="grid-cells-container mt-4">
            {Object.keys(cellData).map((idStr) => {
              const id = Number(idStr);
              return useMemoization ? (
                <MemoizedCell
                  key={id}
                  id={id}
                  onClick={activeClickHandler}
                  count={cellData[id]}
                />
              ) : (
                <RegularCell
                  key={id}
                  id={id}
                  onClick={activeClickHandler}
                  count={cellData[id]}
                />
              );
            })}
          </div>

          <div className="action-row mt-4">
            <button className="btn btn-primary" onClick={() => setParentCount(c => c + 1)}>
              Render Parent Only (+1 state)
            </button>
            <button className="btn btn-outline" onClick={resetAll}>
              <RotateCcw className="w-4 h-4 mr-1" /> Reset Counters
            </button>
          </div>

          <div className="divider"></div>

          <div className="expensive-calculation-showcase">
            <span className="demo-label">Demo 2: Expensive Calculation (useMemo)</span>
            <div className="flex gap-4 mt-2">
              <div className="flex-1">
                <label className="text-xs block mb-1">Iterations (Loops):</label>
                <select
                  value={heavyIterations}
                  onChange={(e) => setHeavyIterations(Number(e.target.value))}
                  className="input-select"
                >
                  <option value={100000}>100k loops (Fast)</option>
                  <option value={5000000}>5M loops (Slow)</option>
                  <option value={20000000}>20M loops (Very Slow)</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="text-xs block mb-1">Result value:</label>
                <div className="calc-result font-mono">{activeExpensiveValue}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Tutorial/Logs */}
        <div className="card doc-panel">
          <div className="card-header">
            <h3>Learn the Mechanics</h3>
          </div>
          <div className="doc-content">
            <div className={`doc-alert ${useMemoization && useCallbackHooks ? 'success' : 'warning'}`}>
              {useMemoization && useCallbackHooks ? (
                <>
                  <ShieldCheck className="doc-alert-icon text-green-500" />
                  <div>
                    <strong>Optimize Successful!</strong> Notice how rendering the parent or clicking other cells does NOT cause other memoized cells to re-render.
                  </div>
                </>
              ) : (
                <>
                  <AlertTriangle className="doc-alert-icon text-yellow-500" />
                  <div>
                    <strong>Why is everything rendering?</strong> Even if <code>React.memo</code> is checked, cells will re-render on parent changes unless <code>useCallback</code> is enabled too, because the click callback gets recreated.
                  </div>
                </>
              )}
            </div>

            <h4 className="mt-4">Three Pillars of React Performance:</h4>
            
            <div className="accordion-like">
              <h5>1. React.memo(Component)</h5>
              <p className="text-xs text-secondary">
                Prevents a component from re-rendering if its props are shallowly equal to previous props.
              </p>

              <h5>2. useCallback(fn, [deps])</h5>
              <p className="text-xs text-secondary">
                Caches the reference instance of a function. Crucial when passing function props to memoized children.
              </p>

              <h5>3. useMemo(() =&gt; value, [deps])</h5>
              <p className="text-xs text-secondary">
                Caches the computed result of an expensive function. Prevents recalculating on every single render pass.
              </p>
            </div>

            <pre className="code-block font-mono text-xs leading-relaxed mt-4">
{`// Correct Memoization Combo:
const Cell = React.memo(({ onClick }) => { ... });

function App() {
  const handleClick = useCallback((id) => {
    selectItem(id);
  }, []); // Static reference
  
  return <Cell onClick={handleClick} />;
}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
