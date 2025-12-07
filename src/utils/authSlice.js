import { createSlice } from '@reduxjs/toolkit';

/**
 * Initial state for authentication
 */
const initialState = {
  user: null,            // Logged-in user details
  token: null,           // JWT or session token
  isAuthenticated: false // Auth status
};

/**
 * Load auth state from localStorage on initialization
 * Ensures user stays logged in after page refresh
 */
const loadStateFromStorage = () => {
  try {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (token && user) {
      return {
        user: JSON.parse(user),
        token,
        isAuthenticated: true,
      };
    }
  } catch (error) {
    console.error('Error loading auth state from storage:', error);
  }

  return initialState;
};

/**
 * Redux slice for authentication
 */
const authSlice = createSlice({
  name: 'auth',
  initialState: loadStateFromStorage(), // Load persisted state
  reducers: {
    /**
     * Handle login success
     * @param state - current auth state
     * @param action - payload contains { user, token }
     */
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;

      // Persist to localStorage
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },

    /**
     * Handle logout
     * Clears auth state and localStorage
     */
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;

      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },

    /**
     * Optional: Update user info in state and localStorage
     * @param state - current auth state
     * @param action - payload contains updated user object
     */
    updateUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
  },
});

// Export actions and reducer
export const { loginSuccess, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;