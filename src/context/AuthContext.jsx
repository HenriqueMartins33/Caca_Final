import { createContext, useContext, useMemo, useReducer } from 'react';

const STORAGE_KEY = 'caca_auth';

const AuthContext = createContext(null);

const initialState = {
  user: null,
  token: null,
};

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return {
        user: action.payload.user,
        token: action.payload.token,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload.user,
      };
    case 'LOGOUT':
      return initialState;
    default:
      return state;
  }
}

function getInitialAuthState() {
  const storedSession = localStorage.getItem(STORAGE_KEY);

  if (!storedSession) return initialState;

  try {
    const parsedSession = JSON.parse(storedSession);

    if (parsedSession?.token) {
      return {
        user: parsedSession.user,
        token: parsedSession.token,
      };
    }
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }

  return initialState;
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, getInitialAuthState());

  function login(user, token) {
    const session = { user, token };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    dispatch({ type: 'LOGIN', payload: session });
  }

  function updateUser(user) {
    const session = { user, token: state.token };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    dispatch({ type: 'UPDATE_USER', payload: { user } });
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEY);
    dispatch({ type: 'LOGOUT' });
  }

  const value = useMemo(() => ({
    user: state.user,
    token: state.token,
    isAuthenticated: Boolean(state.token),
    login,
    logout,
    updateUser,
  }), [state.user, state.token]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }

  return context;
}
