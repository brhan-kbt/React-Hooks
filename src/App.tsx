import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  useReducer,
  useMemo,
  useCallback,
  createContext,
  useLayoutEffect,
  useImperativeHandle,
  useDebugValue,
  useId,
  useDeferredValue,
  useTransition,
  useSyncExternalStore,
  forwardRef,
  useRef as useRefType,
} from "react";

// Context for theme
const ThemeContext = createContext<{ theme: string; toggleTheme: () => void }>({
  theme: "light",
  toggleTheme: () => {},
});

// Types for useReducer
type Action = { type: "like" } | { type: "dislike" } | { type: "reset" };
type State = { likes: number };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "like":
      return { likes: state.likes + 1 };
    case "dislike":
      return { likes: state.likes - 1 };
    case "reset":
      return { likes: 0 };
    default:
      return state;
  }
}

// Custom hook for demonstration
function useCounter(initialValue: number = 0) {
  const [count, setCount] = useState(initialValue);
  
  const increment = useCallback(() => setCount(c => c + 1), []);
  const decrement = useCallback(() => setCount(c => c - 1), []);
  const reset = useCallback(() => setCount(initialValue), [initialValue]);
  
  useDebugValue(count > 10 ? "High count" : "Low count");
  
  return { count, increment, decrement, reset };
}

// Component for useImperativeHandle demonstration
const FancyInput = forwardRef<HTMLInputElement, { placeholder?: string }>((props, ref) => {
  const inputRef = useRefType<HTMLInputElement>(null);
  
  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
    blur: () => inputRef.current?.blur(),
    getValue: () => inputRef.current?.value || "",
    setValue: (value: string) => {
      if (inputRef.current) inputRef.current.value = value;
    }
  }));
  
  return <input ref={inputRef} {...props} className="border px-3 py-2 rounded" />;
});

// External store for useSyncExternalStore
let externalStore = { count: 0, listeners: new Set<() => void>() };

const subscribe = (callback: () => void) => {
  externalStore.listeners.add(callback);
  return () => externalStore.listeners.delete(callback);
};

const getSnapshot = () => externalStore.count;

const incrementExternal = () => {
  externalStore.count++;
  externalStore.listeners.forEach(listener => listener());
};

export default function App() {
  // Basic Hooks
  const [title, setTitle] = useState("Learning React Hooks");
  const [author, setAuthor] = useState("Abebe");
  const [comment, setComment] = useState("");
  const [isPending, startTransition] = useTransition();
  const [searchTerm, setSearchTerm] = useState("");
  const deferredSearchTerm = useDeferredValue(searchTerm);
  
  // useReducer
  const [state, dispatch] = useReducer(reducer, { likes: 0 });
  
  // useRef
  const commentRef = useRef<HTMLInputElement>(null);
  const fancyInputRef = useRef<HTMLInputElement>(null);
  
  // useContext
  const { theme, toggleTheme } = useContext(ThemeContext);
  
  // useId
  const titleId = useId();
  const authorId = useId();
  
  // useSyncExternalStore
  const externalCount = useSyncExternalStore(subscribe, getSnapshot);
  
  // Custom hook
  const { count, increment, decrement, reset } = useCounter(0);
  
  // useLayoutEffect
  useLayoutEffect(() => {
    console.log("Layout effect: DOM measurements can be done here");
  }, [title]);
  
  // useEffect
  useEffect(() => {
    if (comment) {
      console.log(`New comment: ${comment}`);
    }
  }, [comment]);

  // useMemo
  const readingTime = useMemo(() => {
    console.log("Calculating reading time...");
    return Math.ceil(title.split(" ").length / 2);
  }, [title]);

  // useCallback
  const greet = useCallback(() => {
    alert(`Hello, this blog is written by ${author}`);
  }, [author]);

  const focusComment = () => commentRef.current?.focus();
  
  const handleFancyInput = () => {
    if (fancyInputRef.current) {
      fancyInputRef.current.focus();
      setTimeout(() => {
        fancyInputRef.current?.setValue("Hello from imperative handle!");
      }, 1000);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme: "dark", toggleTheme: () => {} }}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-white mb-2">
              🎣 Complete React Hooks Guide
            </h1>
            <p className="text-center text-gray-600 dark:text-gray-300">
              Learn all React hooks with interactive examples and real-world use cases
            </p>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Navigation */}
          <nav className="mb-8">
            <div className="flex flex-wrap gap-2 justify-center">
              <a href="#basic" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">Basic Hooks</a>
              <a href="#advanced" className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">Advanced Hooks</a>
              <a href="#custom" className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">Custom Hooks</a>
            </div>
          </nav>

          {/* Basic Hooks Section */}
          <section id="basic" className="mb-12">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 text-center">🔧 Basic Hooks</h2>
            
            {/* useState */}
            <div className="mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <span className="text-2xl mr-3">📝</span>
                <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">useState</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                <strong>Purpose:</strong> Manages component state. Returns the current state value and a function to update it.
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                <strong>Real-world use:</strong> Form inputs, counters, toggles, any data that changes over time.
              </p>
              
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg mb-4 font-mono text-sm overflow-x-auto">
                <pre>{`const [title, setTitle] = useState("Learning React Hooks");
const [author, setAuthor] = useState("Abebe");`}</pre>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-4">
                <p className="text-gray-800 dark:text-white">
                  Current Blog: <strong className="text-blue-600 dark:text-blue-400">{title}</strong> by <strong className="text-blue-600 dark:text-blue-400">{author}</strong>
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setTitle("Mastering React with Stories")}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Change Title
                </button>
                <button
                  onClick={() => setAuthor("John Doe")}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Change Author
                </button>
              </div>
            </div>

            {/* useReducer */}
            <div className="mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <span className="text-2xl mr-3">🔄</span>
                <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">useReducer</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                <strong>Purpose:</strong> Manages complex state logic with a reducer function. Better than useState for complex state updates.
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                <strong>Real-world use:</strong> Shopping carts, form validation, complex counters, state machines.
              </p>
              
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg mb-4 font-mono text-sm overflow-x-auto">
                <pre>{`function reducer(state, action) {
  switch(action.type) {
    case "like": return { likes: state.likes + 1 };
    case "dislike": return { likes: state.likes - 1 };
    case "reset": return { likes: 0 };
    default: return state;
  }
}

const [state, dispatch] = useReducer(reducer, { likes: 0 });`}</pre>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg mb-4">
                <p className="text-2xl text-center text-gray-800 dark:text-white">
                  Likes: <span className="text-green-600 dark:text-green-400 font-bold">{state.likes}</span>
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => dispatch({ type: "like" })}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  👍 Like
                </button>
                <button
                  onClick={() => dispatch({ type: "dislike" })}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  👎 Dislike
                </button>
                <button
                  onClick={() => dispatch({ type: "reset" })}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* useRef */}
            <div className="mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <span className="text-2xl mr-3">🎯</span>
                <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">useRef</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                <strong>Purpose:</strong> Creates a mutable reference that persists across renders. Doesn't trigger re-renders when changed.
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                <strong>Real-world use:</strong> DOM element access, storing previous values, timers, focus management.
              </p>
              
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg mb-4 font-mono text-sm overflow-x-auto">
                <pre>{`const commentRef = useRef<HTMLInputElement>(null);

const focusComment = () => {
  commentRef.current?.focus();
};`}</pre>
              </div>

              <div className="space-y-4">
                <div>
                  <input
                    ref={commentRef}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="w-full border border-gray-300 dark:border-gray-600 px-3 py-2 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <button
                    onClick={focusComment}
                    className="mt-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                  >
                    Focus Comment Box
                  </button>
                </div>
              </div>
            </div>

            {/* useEffect */}
            <div className="mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <span className="text-2xl mr-3">⚡</span>
                <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">useEffect</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                <strong>Purpose:</strong> Performs side effects in functional components. Runs after render.
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                <strong>Real-world use:</strong> API calls, subscriptions, timers, DOM manipulation, cleanup.
              </p>
              
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg mb-4 font-mono text-sm overflow-x-auto">
                <pre>{`useEffect(() => {
  if (comment) {
    console.log("New comment:", comment);
  }
}, [comment]); // Runs when comment changes`}</pre>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <p className="text-gray-800 dark:text-white">
                  👉 Check your browser console after typing a comment above!
                </p>
              </div>
            </div>
          </section>

          {/* Advanced Hooks Section */}
          <section id="advanced" className="mb-12">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 text-center">🚀 Advanced Hooks</h2>
            
            {/* useMemo */}
            <div className="mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <span className="text-2xl mr-3">🧠</span>
                <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">useMemo</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                <strong>Purpose:</strong> Memoizes expensive calculations. Only recalculates when dependencies change.
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                <strong>Real-world use:</strong> Expensive computations, filtered lists, derived state.
              </p>
              
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg mb-4 font-mono text-sm overflow-x-auto">
                <pre>{`const readingTime = useMemo(() => {
  console.log("Calculating reading time...");
  return Math.ceil(title.split(" ").length / 2);
}, [title]); // Only recalculates when title changes`}</pre>
              </div>

              <div className="bg-pink-50 dark:bg-pink-900/20 p-4 rounded-lg">
                <p className="text-gray-800 dark:text-white">
                  Estimated Reading Time: <span className="text-pink-600 dark:text-pink-400 font-bold">{readingTime} seconds</span> ⏱️
                </p>
              </div>
            </div>

            {/* useCallback */}
            <div className="mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <span className="text-2xl mr-3">🔄</span>
                <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">useCallback</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                <strong>Purpose:</strong> Memoizes functions. Returns the same function reference unless dependencies change.
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                <strong>Real-world use:</strong> Preventing unnecessary re-renders, optimizing child components.
              </p>
              
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg mb-4 font-mono text-sm overflow-x-auto">
                <pre>{`const greet = useCallback(() => {
  alert("Hello, " + author);
}, [author]); // Function only changes when author changes`}</pre>
              </div>

              <button
                onClick={greet}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Greet Author
              </button>
            </div>

            {/* useContext */}
            <div className="mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <span className="text-2xl mr-3">🌐</span>
                <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">useContext</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                <strong>Purpose:</strong> Accesses React context values without prop drilling.
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                <strong>Real-world use:</strong> Theme, user authentication, language settings, global state.
              </p>
              
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg mb-4 font-mono text-sm overflow-x-auto">
                <pre>{`const ThemeContext = createContext("light");
const theme = useContext(ThemeContext);`}</pre>
              </div>

              <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg">
                <p className="text-gray-800 dark:text-white">
                  Current Theme: <span className="text-indigo-600 dark:text-indigo-400 font-bold">{theme}</span>
                </p>
              </div>
            </div>

            {/* useLayoutEffect */}
            <div className="mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <span className="text-2xl mr-3">📐</span>
                <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">useLayoutEffect</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                <strong>Purpose:</strong> Same as useEffect but runs synchronously after all DOM mutations.
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                <strong>Real-world use:</strong> DOM measurements, preventing visual flicker, synchronous updates.
              </p>
              
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg mb-4 font-mono text-sm overflow-x-auto">
                <pre>{`useLayoutEffect(() => {
  console.log("Layout effect: DOM measurements can be done here");
}, [title]);`}</pre>
              </div>

              <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                <p className="text-gray-800 dark:text-white">
                  👉 Check console for layout effect logs when title changes!
                </p>
              </div>
            </div>

            {/* useImperativeHandle */}
            <div className="mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <span className="text-2xl mr-3">🎭</span>
                <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">useImperativeHandle</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                <strong>Purpose:</strong> Customizes the instance value exposed to parent components when using ref.
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                <strong>Real-world use:</strong> Custom input components, video players, form libraries.
              </p>
              
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg mb-4 font-mono text-sm overflow-x-auto">
                <pre>{`const FancyInput = forwardRef((props, ref) => {
  const inputRef = useRef();
  
  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
    setValue: (value) => inputRef.current.value = value
  }));
  
  return <input ref={inputRef} {...props} />;
});`}</pre>
              </div>

              <div className="space-y-4">
                <FancyInput ref={fancyInputRef} placeholder="Fancy input with custom methods" />
                <button
                  onClick={handleFancyInput}
                  className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                >
                  Focus & Set Value
                </button>
              </div>
            </div>

            {/* useId */}
            <div className="mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <span className="text-2xl mr-3">🆔</span>
                <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">useId</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                <strong>Purpose:</strong> Generates unique IDs that are stable across server and client renders.
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                <strong>Real-world use:</strong> Form labels, accessibility attributes, unique keys.
              </p>
              
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg mb-4 font-mono text-sm overflow-x-auto">
                <pre>{`const titleId = useId();
const authorId = useId();`}</pre>
              </div>

              <div className="bg-teal-50 dark:bg-teal-900/20 p-4 rounded-lg">
                <p className="text-gray-800 dark:text-white">
                  Title ID: <span className="text-teal-600 dark:text-teal-400 font-mono">{titleId}</span>
                </p>
                <p className="text-gray-800 dark:text-white">
                  Author ID: <span className="text-teal-600 dark:text-teal-400 font-mono">{authorId}</span>
                </p>
              </div>
            </div>

            {/* useTransition */}
            <div className="mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <span className="text-2xl mr-3">⚡</span>
                <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">useTransition</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                <strong>Purpose:</strong> Marks state updates as transitions, allowing React to keep the UI responsive.
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                <strong>Real-world use:</strong> Search filters, large list updates, non-urgent state changes.
              </p>
              
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg mb-4 font-mono text-sm overflow-x-auto">
                <pre>{`const [isPending, startTransition] = useTransition();

const handleSearch = (term) => {
  startTransition(() => {
    setSearchTerm(term);
  });
};`}</pre>
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Search (try typing fast)..."
                  onChange={(e) => {
                    startTransition(() => {
                      setSearchTerm(e.target.value);
                    });
                  }}
                  className="w-full border border-gray-300 dark:border-gray-600 px-3 py-2 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                {isPending && (
                  <div className="text-blue-600 dark:text-blue-400">
                    🔄 Updating search results...
                  </div>
                )}
                <div className="bg-cyan-50 dark:bg-cyan-900/20 p-4 rounded-lg">
                  <p className="text-gray-800 dark:text-white">
                    Search Term: <span className="text-cyan-600 dark:text-cyan-400 font-bold">{deferredSearchTerm}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* useDeferredValue */}
            <div className="mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <span className="text-2xl mr-3">⏳</span>
                <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">useDeferredValue</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                <strong>Purpose:</strong> Defers updating a value, allowing urgent updates to take priority.
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                <strong>Real-world use:</strong> Search inputs, typeahead, expensive computations.
              </p>
              
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg mb-4 font-mono text-sm overflow-x-auto">
                <pre>{`const [searchTerm, setSearchTerm] = useState("");
const deferredSearchTerm = useDeferredValue(searchTerm);

// Use deferredSearchTerm for expensive operations`}</pre>
              </div>

              <div className="bg-violet-50 dark:bg-violet-900/20 p-4 rounded-lg">
                <p className="text-gray-800 dark:text-white">
                  Deferred Value: <span className="text-violet-600 dark:text-violet-400 font-bold">{deferredSearchTerm}</span>
                </p>
              </div>
            </div>

            {/* useSyncExternalStore */}
            <div className="mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <span className="text-2xl mr-3">🔗</span>
                <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">useSyncExternalStore</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                <strong>Purpose:</strong> Subscribes to external data sources and keeps React in sync.
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                <strong>Real-world use:</strong> Browser APIs, third-party libraries, global stores.
              </p>
              
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg mb-4 font-mono text-sm overflow-x-auto">
                <pre>{`const externalCount = useSyncExternalStore(
  subscribe,    // Subscribe function
  getSnapshot   // Get current value
);`}</pre>
              </div>

              <div className="space-y-4">
                <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg">
                  <p className="text-gray-800 dark:text-white">
                    External Store Count: <span className="text-emerald-600 dark:text-emerald-400 font-bold text-2xl">{externalCount}</span>
                  </p>
                </div>
                <button
                  onClick={incrementExternal}
                  className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                >
                  Increment External Store
                </button>
              </div>
            </div>
          </section>

          {/* Custom Hooks Section */}
          <section id="custom" className="mb-12">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 text-center">🛠️ Custom Hooks</h2>
            
            <div className="mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <span className="text-2xl mr-3">🎣</span>
                <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">useCounter (Custom Hook)</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                <strong>Purpose:</strong> Custom hooks let you extract component logic into reusable functions.
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                <strong>Real-world use:</strong> API calls, form handling, timers, local storage, authentication.
              </p>
              
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg mb-4 font-mono text-sm overflow-x-auto">
                <pre>{`function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);
  
  const increment = useCallback(() => setCount(c => c + 1), []);
  const decrement = useCallback(() => setCount(c => c - 1), []);
  const reset = useCallback(() => setCount(initialValue), [initialValue]);
  
  useDebugValue(count > 10 ? "High count" : "Low count");
  
  return { count, increment, decrement, reset };
}`}</pre>
              </div>

              <div className="space-y-4">
                <div className="bg-rose-50 dark:bg-rose-900/20 p-4 rounded-lg">
                  <p className="text-gray-800 dark:text-white text-center">
                    Count: <span className="text-rose-600 dark:text-rose-400 font-bold text-3xl">{count}</span>
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                  <button
                    onClick={increment}
                    className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
                  >
                    ➕ Increment
                  </button>
                  <button
                    onClick={decrement}
                    className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
                  >
                    ➖ Decrement
                  </button>
                  <button
                    onClick={reset}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    🔄 Reset
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="text-center text-gray-600 dark:text-gray-400 py-8">
            <p>🎉 You've learned all the React hooks! Practice building projects to master them.</p>
          </footer>
        </div>
      </div>
    </ThemeContext.Provider>
  );
}
