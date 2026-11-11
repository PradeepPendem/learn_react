import { createSlice, createSelector } from '@reduxjs/toolkit';

const initialState = {
  theme: localStorage.getItem('masterclass-theme') || 'dark',
  activeTab: 'patterns', // 'patterns', 'state', 'perf', 'hooks'
  sidebarOpen: true,
  cart: [], // { id, name, price, quantity }
  logs: [] // For showing real-time event logs in the UI
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('masterclass-theme', state.theme);
    },
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    addToCart: (state, action) => {
      const { id, name, price } = action.payload;
      const existing = state.cart.find(item => item.id === id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.cart.push({ id, name, price, quantity: 1 });
      }
      state.logs.unshift({
        id: Date.now(),
        type: 'CART_ADD',
        message: `Added ${name} to cart. Quantity: ${existing ? existing.quantity + 1 : 1}`,
        timestamp: new Date().toLocaleTimeString()
      });
    },
    removeFromCart: (state, action) => {
      const id = action.payload;
      const existing = state.cart.find(item => item.id === id);
      if (existing) {
        if (existing.quantity > 1) {
          existing.quantity -= 1;
        } else {
          state.cart = state.cart.filter(item => item.id !== id);
        }
        state.logs.unshift({
          id: Date.now(),
          type: 'CART_REMOVE',
          message: `Removed ${existing.name} from cart`,
          timestamp: new Date().toLocaleTimeString()
        });
      }
    },
    clearCart: (state) => {
      state.cart = [];
      state.logs.unshift({
        id: Date.now(),
        type: 'CART_CLEAR',
        message: `Cleared shopping cart`,
        timestamp: new Date().toLocaleTimeString()
      });
    },
    addLog: (state, action) => {
      state.logs.unshift({
        id: Date.now(),
        type: action.payload.type || 'INFO',
        message: action.payload.message,
        timestamp: new Date().toLocaleTimeString()
      });
      // Keep only last 20 logs
      if (state.logs.length > 20) {
        state.logs.pop();
      }
    },
    clearLogs: (state) => {
      state.logs = [];
    }
  }
});

export const {
  toggleTheme,
  setActiveTab,
  toggleSidebar,
  addToCart,
  removeFromCart,
  clearCart,
  addLog,
  clearLogs
} = uiSlice.actions;

// Selectors
export const selectUiState = (state) => state.ui;
export const selectCart = (state) => state.ui.cart;
export const selectLogs = (state) => state.ui.logs;

// Memoized Selector Example (using Reselect via RTK's createSelector)
// This is a crucial advanced React Redux pattern to prevent unwanted re-renders!
export const selectCartTotal = createSelector(
  [selectCart],
  (cart) => cart.reduce((total, item) => total + item.price * item.quantity, 0)
);

export const selectCartItemCount = createSelector(
  [selectCart],
  (cart) => cart.reduce((count, item) => count + item.quantity, 0)
);

export default uiSlice.reducer;
