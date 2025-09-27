"use client";
import React, { createContext, useContext, useReducer, useEffect } from "react";
import { State, Action, initialState, Habit, User } from "../types";
import { Dashboard } from "../components/Dashboard";
import { TrackHabits } from "../components/TrackHabits";
import { History } from "../components/History";
import { Goals } from "../components/Goals";
import { useForm } from "react-hook-form";

// Reducer
export function appReducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload };
    case "SET_HABITS":
      return { ...state, habits: action.payload };
    case "ADD_HABIT":
      return { ...state, habits: [...state.habits, action.payload] };
    case "UPDATE_HABIT":
      return {
        ...state,
        habits: state.habits.map((h) => (h.id === action.payload.id ? action.payload : h)),
      };
    case "SET_TODAY_HABITS":
      return { ...state, todayHabits: action.payload };
    case "UPDATE_GOALS":
      return { ...state, goals: { ...state.goals, ...action.payload } };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "SET_VIEW":
      return { ...state, view: action.payload };
    case "SET_DATE_FILTER":
      return { ...state, dateFilter: action.payload };
    case "LOGOUT":
      return initialState;
    default:
      return state;
  }
}

// Context
interface AppContextType {
  state: State;
  dispatch: React.Dispatch<Action>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Custom hook for context
export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
};

// Main App Component
export function HealthHub() {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Simulate Firebase auth
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      dispatch({ type: "SET_USER", payload: JSON.parse(savedUser) });
    }
  }, []);

  // Load habits from localStorage
  useEffect(() => {
    if (state.user) {
      const savedHabits = localStorage.getItem(`habits_${state.user.email}`);
      if (savedHabits) {
        dispatch({ type: "SET_HABITS", payload: JSON.parse(savedHabits) });
      }
    }
  }, [state.user]);

  // Check today's habits
  useEffect(() => {
    if (state.habits.length > 0) {
      const today = new Date().toISOString().split("T")[0];
      const todayHabit = state.habits.find((h) => h.date === today);
      dispatch({ type: "SET_TODAY_HABITS", payload: todayHabit || null });
    }
  }, [state.habits]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        {!state.user ? <AuthScreen /> : <MainApp />}
      </div>
    </AppContext.Provider>
  );
}

// Auth Screen Component
function AuthScreen() {
  const { dispatch } = useApp();
  const [isLogin, setIsLogin] = React.useState(true);
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<{ email: string; password: string }>();

  const onSubmit = (data: { email: string; password: string }) => {
    try {
      // Simulate Firebase auth
      const user: User = { email: data.email, uid: Date.now().toString() };
      localStorage.setItem("user", JSON.stringify(user));
      dispatch({ type: "SET_USER", payload: user });

      reset();
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Authentication failed" });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8 transform transition-all hover:scale-105">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
              <span className="text-3xl">💪</span>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">HealthHub</h1>
            <p className="text-gray-600 mt-2">Twój tracker nawyków zdrowotnych</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="twoj@email.com"
            />
            {errors.email && <span className="text-red-500 text-sm mt-1">{errors.email.message}</span>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Hasło</label>
            <input
              type="password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="********"
            />
            {errors.password && <span className="text-red-500 text-sm mt-1">{errors.password.message}</span>}
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transform transition-all hover:scale-105"
          >
            {isLogin ? "Zaloguj się" : "Zarejestruj się"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button onClick={() => setIsLogin(!isLogin)} className="text-blue-600 hover:text-purple-600 transition-colors">
            {isLogin ? "Nie masz konta? Zarejestruj się" : "Masz konto? Zaloguj się"}
          </button>
        </div>
      </div>
    </div>
  );
}

// Main App Component
function MainApp() {
  const { state, dispatch } = useApp();

  const handleLogout = () => {
    localStorage.removeItem("user");
    dispatch({ type: "LOGOUT" });
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-xl">💪</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">HealthHub</h1>
            </div>

            <nav className="flex items-center space-x-6">
              <button
                onClick={() => dispatch({ type: "SET_VIEW", payload: "dashboard" })}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  state.view === "dashboard" ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:text-blue-600"
                }`}
              >
                📊 Dashboard
              </button>
              <button
                onClick={() => dispatch({ type: "SET_VIEW", payload: "track" })}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  state.view === "track" ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:text-blue-600"
                }`}
              >
                ✏️ Dodaj wpis
              </button>
              <button
                onClick={() => dispatch({ type: "SET_VIEW", payload: "history" })}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  state.view === "history" ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:text-blue-600"
                }`}
              >
                📅 Historia
              </button>
              <button
                onClick={() => dispatch({ type: "SET_VIEW", payload: "goals" })}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  state.view === "goals" ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:text-blue-600"
                }`}
              >
                🎯 Cele
              </button>
            </nav>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{state.user?.email}</span>
              <button onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all">
                Wyloguj
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {state.view === "dashboard" && <Dashboard />}
        {state.view === "track" && <TrackHabits />}
        {state.view === "history" && <History />}
        {state.view === "goals" && <Goals />}
      </main>
    </div>
  );
}
