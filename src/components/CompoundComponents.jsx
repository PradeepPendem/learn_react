import React, { createContext, useContext, useState } from 'react';
import { Sparkles, Terminal, Code, Info } from 'lucide-react';

// ==========================================
// 1. COMPOUND TABS IMPLEMENTATION
// ==========================================
const TabsContext = createContext(null);

function Tabs({ defaultValue, children, onChange }) {
  const [activeTab, setActiveTab] = useState(defaultValue);

  const changeTab = (value) => {
    setActiveTab(value);
    if (onChange) onChange(value);
  };

  return (
    <TabsContext.Provider value={{ activeTab, changeTab }}>
      <div className="compound-tabs">{children}</div>
    </TabsContext.Provider>
  );
}

function TabList({ children }) {
  return <div className="tab-list">{children}</div>;
}

function TabTrigger({ value, children }) {
  const { activeTab, changeTab } = useContext(TabsContext);
  const isActive = activeTab === value;

  return (
    <button
      className={`tab-trigger ${isActive ? 'active' : ''}`}
      onClick={() => changeTab(value)}
      type="button"
    >
      {children}
    </button>
  );
}

function TabPanel({ value, children }) {
  const { activeTab } = useContext(TabsContext);
  if (activeTab !== value) return null;
  return <div className="tab-panel animate-fade-in">{children}</div>;
}

// Attach sub-components to parent to achieve compound components namespaces
Tabs.List = TabList;
Tabs.Trigger = TabTrigger;
Tabs.Panel = TabPanel;


// ==========================================
// 2. COMPOUND ACCORDION IMPLEMENTATION
// ==========================================
const AccordionContext = createContext(null);

function Accordion({ children, allowMultiple = false }) {
  const [openItems, setOpenItems] = useState([]);

  const toggleItem = (value) => {
    if (allowMultiple) {
      setOpenItems(prev =>
        prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
      );
    } else {
      setOpenItems(prev => (prev.includes(value) ? [] : [value]));
    }
  };

  return (
    <AccordionContext.Provider value={{ openItems, toggleItem }}>
      <div className="compound-accordion">{children}</div>
    </AccordionContext.Provider>
  );
}

function AccordionItem({ value, children }) {
  return <div className="accordion-item">{children}</div>;
}

function AccordionTrigger({ value, children }) {
  const { openItems, toggleItem } = useContext(AccordionContext);
  const isOpen = openItems.includes(value);

  return (
    <button
      className={`accordion-trigger ${isOpen ? 'open' : ''}`}
      onClick={() => toggleItem(value)}
      type="button"
    >
      <span>{children}</span>
      <span className="arrow">{isOpen ? '▼' : '►'}</span>
    </button>
  );
}

function AccordionContent({ value, children }) {
  const { openItems } = useContext(AccordionContext);
  const isOpen = openItems.includes(value);

  if (!isOpen) return null;
  return <div className="accordion-content animate-slide-down">{children}</div>;
}

Accordion.Item = AccordionItem;
Accordion.Trigger = AccordionTrigger;
Accordion.Content = AccordionContent;


// ==========================================
// 3. MAIN COMPONENT CONTAINER
// ==========================================
export default function CompoundComponents() {
  return (
    <div className="module-container">
      <div className="module-header">
        <div className="header-icon">
          <Sparkles className="icon-purple" />
        </div>
        <div>
          <h2>Compound Components Pattern</h2>
          <p className="subtitle">
            Create highly cohesive, declarative, and reusable components that share state implicitly using React Context.
          </p>
        </div>
      </div>

      <div className="grid-2col">
        {/* Live Demo Column */}
        <div className="card live-demo">
          <div className="card-header">
            <h3>Live Interactive Demo</h3>
          </div>

          <div className="demo-section">
            <span className="demo-label">Demo 1: Compound Tabs</span>
            <Tabs defaultValue="overview">
              <Tabs.List>
                <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
                <Tabs.Trigger value="features">Features</Tabs.Trigger>
                <Tabs.Trigger value="code">API Usage</Tabs.Trigger>
              </Tabs.List>

              <Tabs.Panel value="overview">
                <div className="panel-content">
                  <h4>Welcome to Compound Components</h4>
                  <p>
                    Instead of passing configuration props (like an array of tabs and callbacks), we delegate layout control to the consumer. The container handles state management internally.
                  </p>
                </div>
              </Tabs.Panel>

              <Tabs.Panel value="features">
                <div className="panel-content">
                  <h4>Core Features of this Pattern</h4>
                  <ul>
                    <li>Implicit state sharing (no prop drilling).</li>
                    <li>Highly customizable markup layout.</li>
                    <li>Easily styled individual children.</li>
                  </ul>
                </div>
              </Tabs.Panel>

              <Tabs.Panel value="code">
                <div className="panel-content">
                  <pre className="code-block text-xs">
{`<Tabs defaultValue="overview">
  <Tabs.List>
    <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Panel value="overview">
    Content...
  </Tabs.Panel>
</Tabs>`}
                  </pre>
                </div>
              </Tabs.Panel>
            </Tabs>
          </div>

          <div className="divider"></div>

          <div className="demo-section">
            <span className="demo-label">Demo 2: Compound Accordion (Single-expand)</span>
            <Accordion>
              <Accordion.Item value="item-1">
                <Accordion.Trigger value="item-1">What is implicit state sharing?</Accordion.Trigger>
                <Accordion.Item value="item-1">
                  <Accordion.Content value="item-1">
                    <p className="text-sm">
                      It is the method where child components consume state directly from a shared Context Provider placed at the root compound container.
                    </p>
                  </Accordion.Content>
                </Accordion.Item>
              </Accordion.Item>

              <Accordion.Item value="item-2">
                <Accordion.Trigger value="item-2">When should I use this pattern?</Accordion.Trigger>
                <Accordion.Item value="item-2">
                  <Accordion.Content value="item-2">
                    <p className="text-sm">
                      Whenever you are building design system components (select inputs, tab boards, dropdown menus, sliders) where items always work together.
                    </p>
                  </Accordion.Content>
                </Accordion.Item>
              </Accordion.Item>
            </Accordion>
          </div>
        </div>

        {/* Explain Column */}
        <div className="card doc-panel">
          <div className="card-header">
            <h3>Under the Hood</h3>
          </div>
          <div className="doc-content">
            <div className="doc-alert warning">
              <Info className="doc-alert-icon" />
              <div>
                <strong>Alternative (Prop Drilling):</strong> Passing a giant <code>items={'{[...]}'}</code> prop limits visual layout flexibility and renders customizing specific headers/tab rows complex.
              </div>
            </div>

            <h4>How it works:</h4>
            <ol className="step-list">
              <li>
                <strong>Context Creation:</strong> Create a context at the parent component level (e.g. <code>TabsContext</code>).
              </li>
              <li>
                <strong>Internal Provider:</strong> The parent container mounts the Provider to wrap its children, supplying active tab states and change hooks.
              </li>
              <li>
                <strong>Consumer Triggers:</strong> Child parts like <code>Tabs.Trigger</code> use <code>useContext()</code> to intercept the state, checking if they are active, and calling update actions.
              </li>
            </ol>

            <pre className="code-block font-mono text-sm leading-relaxed mt-4">
{`// Context connection
const TabsContext = createContext();

// trigger implementation
function Trigger({ value, children }) {
  const { activeTab, changeTab } = useContext(TabsContext);
  return (
    <button 
      className={activeTab === value ? 'active' : ''} 
      onClick={() => changeTab(value)}
    >
      {children}
    </button>
  );
}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
