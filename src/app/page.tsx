"use client";

import Image from "next/image";
import Link from "next/link";
import { useUser } from "@/hooks/useUser";
import { PrimaryButton, StatsCard, PageHeader, NoDataEmptyState } from "@/components/shared";
import {
  useTodoApp,
  useTodoUtils,
  TodoForm,
  TodoControls,
  TodoItem,
  TodoCalendar,
  TodoEditDialog,
  TodoKanban,
} from "@/app/(protected)/todo";
import type { Todo } from "@/app/(protected)/todo/types";

export default function Home() {
  const { user, loading } = useUser();
  const {
    state,
    dispatch,
    // formState, formDispatch, not used for now
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodo,
    addSubtask,
    toggleSubtask,
    deleteSubtask,
    getTodoById,
  } = useTodoApp();

  const { filteredTodos, getPriorityColor, getPriorityLabel, getCategories, getProgressStats, formatTime, getDueDateStatus } =
    useTodoUtils(state);

  // Edit dialog handlers
  const handleEditTodo = (todo: Todo | null, updates: Partial<Todo>) => {
    if (todo) {
      updateTodo(todo.id, updates);
    } else {
      // Create new todo
      addTodo(updates);
    }
  };

  const handleCloseEditDialog = () => {
    dispatch({ type: "SET_EDITING_TODO", payload: null });
  };

  const handleOpenCreateDialog = () => {
    dispatch({ type: "SET_EDITING_TODO", payload: "create" });
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="font-sans min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Ładowanie...</p>
        </div>
      </div>
    );
  }

  // Show dashboard for logged-in users
  if (user) {
    return (
      <div className="font-sans min-h-screen bg-gray-50">
        {/* Todo List Content */}
        <div className="container mx-auto px-6 py-8">
          {/* Header with Stats */}
          <PageHeader
            title="Lista zadań"
            subtitle="Zarządzaj swoimi zadaniami efektywnie"
            actions={
              <PrimaryButton onClick={handleOpenCreateDialog} startIcon={<span>+</span>}>
                Nowe zadanie
              </PrimaryButton>
            }
          />

          {/* Progress Stats */}
          {(() => {
            const stats = getProgressStats();
            return (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                <StatsCard title="Wszystkie" value={stats.total} color="primary" icon={<span className="text-2xl">📋</span>} />
                <StatsCard title="Ukończone" value={stats.completed} color="success" icon={<span className="text-2xl">✅</span>} />
                <StatsCard title="Dziś" value={stats.today} color="warning" icon={<span className="text-2xl">📅</span>} />
                <StatsCard title="Przeterminowane" value={stats.overdue} color="error" icon={<span className="text-2xl">⚠️</span>} />
                <StatsCard title="Postęp" value={`${stats.progress}%`} color="info" icon={<span className="text-2xl">📊</span>} />
              </div>
            );
          })()}

          {/* Advanced Todo List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            {/* Controls */}
            <TodoControls state={state} dispatch={dispatch} categories={getCategories()} />

            {/* Todo List Display */}
            <div className="space-y-4">
              {filteredTodos.length === 0 ? (
                <NoDataEmptyState
                  title="Brak zadań do wyświetlenia"
                  description="Dodaj nowe zadanie, aby rozpocząć"
                  onAdd={handleOpenCreateDialog}
                  addLabel="Dodaj pierwsze zadanie"
                />
              ) : state.viewMode === "kanban" ? (
                <TodoKanban
                  todos={filteredTodos}
                  state={state}
                  dispatch={dispatch}
                  getPriorityColor={getPriorityColor}
                  getPriorityLabel={getPriorityLabel}
                  getDueDateStatus={getDueDateStatus}
                  formatTime={formatTime}
                  onToggleTodo={toggleTodo}
                  onDeleteTodo={deleteTodo}
                  onAddSubtask={addSubtask}
                  onToggleSubtask={toggleSubtask}
                  onDeleteSubtask={deleteSubtask}
                />
              ) : (
                <div className={`grid gap-4 ${state.viewMode === "grid" ? "md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
                  {filteredTodos.map((todo) => (
                    <TodoItem
                      key={todo.id}
                      todo={todo}
                      state={state}
                      dispatch={dispatch}
                      getPriorityColor={getPriorityColor}
                      getPriorityLabel={getPriorityLabel}
                      getDueDateStatus={getDueDateStatus}
                      formatTime={formatTime}
                      onToggleTodo={toggleTodo}
                      onDeleteTodo={deleteTodo}
                      onAddSubtask={addSubtask}
                      onToggleSubtask={toggleSubtask}
                      onDeleteSubtask={deleteSubtask}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Calendar Section */}
          <TodoCalendar state={state} />

          {/* Edit Dialog */}
          <TodoEditDialog
            open={!!state.editingTodo}
            onClose={handleCloseEditDialog}
            todo={state.editingTodo && state.editingTodo !== "create" ? getTodoById(state.editingTodo) : null}
            onSave={handleEditTodo}
            mode={state.editingTodo === "create" ? "create" : "edit"}
          />
        </div>
      </div>
    );
  }

  // Show landing page for non-authenticated users
  return (
    <div className="font-sans min-h-screen bg-white relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Minimal geometric accents */}
        <div className="absolute top-32 right-32 w-2 h-2 bg-blue-500/30 rounded-full"></div>
        <div className="absolute top-64 left-32 w-1 h-1 bg-purple-500/40 rounded-full"></div>
        <div className="absolute bottom-32 right-64 w-1.5 h-1.5 bg-indigo-500/30 rounded-full"></div>
        <div className="absolute bottom-64 left-64 w-1 h-1 bg-blue-500/40 rounded-full"></div>

        {/* Subtle gradient overlays */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-50/30 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-indigo-50/20 to-transparent rounded-full blur-3xl"></div>
      </div>

      {/* Minimal grid pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%220%200%2040%2040%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23f8fafc%22%20fill-opacity%3D%220.5%22%3E%3Cpath%20d%3D%22M0%200h40v40H0V0zm20%2020h20v20H20V20z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-60"></div>

      {/* Navigation Bar */}
      <nav className="relative z-20 px-6 py-6 border-b border-gray-100">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-xl text-white">📊</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">Edu Report V3</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/login" className="px-6 py-2.5 text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200">
              Zaloguj się
            </Link>
            <Link
              href="/register"
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Zarejestruj się
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 relative z-10">
        <header className="text-center mb-20">
          <div className="mb-12">
            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight tracking-tight">Edu Report V3</h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-normal mb-8">
              Nowoczesna platforma do zarządzania edukacją zdrowotną
            </p>
            <p className="text-lg text-gray-500 max-w-3xl mx-auto leading-relaxed mb-12">
              Generuj dokumenty z realizacji zadań, zarządzaj szkołami w programach, planuj harmonogram zadań edukacyjnych i tworz
              sprawozdania budżetowe
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-12 mb-16">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600">500+</div>
                <div className="text-sm text-gray-500 font-medium">Szkół w programach</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600">10K+</div>
                <div className="text-sm text-gray-500 font-medium">Wygenerowanych dokumentów</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600">1000+</div>
                <div className="text-sm text-gray-500 font-medium">Zadań edukacyjnych</div>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/login"
              className="group inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold text-lg rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <span className="mr-3 text-xl">🚀</span>
              Rozpocznij pracę
            </Link>
            <Link
              href="/register"
              className="group inline-flex items-center px-8 py-4 border border-gray-300 text-gray-700 font-semibold text-lg rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
            >
              <span className="mr-3 text-xl">📝</span>
              Zarejestruj się
            </Link>
          </div>
        </header>

        {/* Features Grid */}
        <main className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 mb-24">
          {/* Document Generation */}
          <div className="group bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 hover:border-gray-200">
            <div className="text-4xl mb-6">📄</div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Generowanie Dokumentów</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Automatyczne tworzenie dokumentów z realizacji zadań edukacyjnych z profesjonalnymi szablonami.
            </p>
            <ul className="text-sm text-gray-500 space-y-2">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>Raporty z realizacji zadań
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>Szablony dokumentów
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></span>Eksport do PDF/Word
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>Automatyczne wypełnianie
              </li>
            </ul>
          </div>

          {/* Budget Meter Reports */}
          <div className="group bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 hover:border-gray-200">
            <div className="text-4xl mb-6">💰</div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Miernik Budżetowy</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Zaawansowane sprawozdania budżetowe z analizą kosztów i wydatków programów edukacyjnych.
            </p>
            <ul className="text-sm text-gray-500 space-y-2">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>Sprawozdania budżetowe
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-pink-500 rounded-full mr-3"></span>Analiza kosztów
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-rose-500 rounded-full mr-3"></span>Wykresy i wizualizacje
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-purple-600 rounded-full mr-3"></span>Eksport do Excel
              </li>
            </ul>
          </div>

          {/* School Program Management */}
          <div className="group bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 hover:border-gray-200">
            <div className="text-4xl mb-6">🏫</div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Zarządzanie Szkołami</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Kompleksowe zarządzanie szkołami uczestniczącymi w programach edukacyjnych.
            </p>
            <ul className="text-sm text-gray-500 space-y-2">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>Baza szkół w programach
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></span>Śledzenie uczestnictwa
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-teal-500 rounded-full mr-3"></span>Statystyki i raporty
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>Zarządzanie kontaktami
              </li>
            </ul>
          </div>

          {/* Educational Task Scheduling */}
          <div className="group bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 hover:border-gray-200">
            <div className="text-4xl mb-6">📅</div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Harmonogram Zadań</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">Zaawansowane planowanie i zarządzanie harmonogramem zadań edukacyjnych.</p>
            <ul className="text-sm text-gray-500 space-y-2">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>Planowanie zadań
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-amber-500 rounded-full mr-3"></span>Śledzenie postępu
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></span>Powiadomienia i przypomnienia
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-orange-600 rounded-full mr-3"></span>Kalendarz zadań
              </li>
            </ul>
          </div>

          {/* Educational Modules */}
          <div className="group bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 hover:border-gray-200">
            <div className="text-4xl mb-6">📚</div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Moduły Edukacyjne</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Specjalistyczne moduły edukacyjne: czerniak, nawyki zdrowotne, kalendarz świąt.
            </p>
            <ul className="text-sm text-gray-500 space-y-2">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-cyan-500 rounded-full mr-3"></span>Quiz o czerniaku
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-sky-500 rounded-full mr-3"></span>Śledzenie nawyków
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>Kalendarz świąt
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-cyan-600 rounded-full mr-3"></span>Baza kontaktów
              </li>
            </ul>
          </div>
        </main>

        {/* Benefits Section */}
        <section className="bg-white rounded-xl p-12 mb-24 shadow-sm border border-gray-100">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">Dlaczego Edu Report V3?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-6 border border-blue-100">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Szybkość i Wydajność</h3>
              <p className="text-gray-600 leading-relaxed">
                Automatyzacja procesów generowania dokumentów i raportów oszczędza czas i eliminuje błędy ludzkie.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-50 rounded-xl flex items-center justify-center mx-auto mb-6 border border-green-100">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Bezpieczeństwo Danych</h3>
              <p className="text-gray-600 leading-relaxed">
                Zaawansowane szyfrowanie i kontrola dostępu zapewniają pełne bezpieczeństwo wrażliwych danych edukacyjnych.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-50 rounded-xl flex items-center justify-center mx-auto mb-6 border border-purple-100">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Analityka i Raporty</h3>
              <p className="text-gray-600 leading-relaxed">
                Szczegółowe analizy i wizualizacje danych pomagają w podejmowaniu świadomych decyzji edukacyjnych.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <div className="text-center bg-blue-600 rounded-xl p-16 text-white">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Gotowy na start?</h2>
            <p className="text-xl md:text-2xl mb-10 opacity-90 max-w-2xl mx-auto leading-relaxed">
              Dołącz do tysięcy edukatorów, którzy już korzystają z Edu Report V3
            </p>
            <Link
              href="/login"
              className="group inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold text-lg rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <span className="mr-3 text-xl">🚀</span>
              Rozpocznij teraz
            </Link>
          </div>
        </div>

        {/* Footer */}
        <footer className="relative z-10 mt-24 py-12 border-t border-gray-200">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-sm text-white">📊</span>
                  </div>
                  <span className="text-xl font-bold text-gray-900">Edu Report V3</span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Nowoczesna platforma do zarządzania edukacją zdrowotną z wykorzystaniem sztucznej inteligencji.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Główne Moduły</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>
                    <Link href="#" className="hover:text-blue-600 transition-colors">
                      Generowanie dokumentów
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-blue-600 transition-colors">
                      Miernik budżetowy
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-blue-600 transition-colors">
                      Zarządzanie szkołami
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-blue-600 transition-colors">
                      Harmonogram zadań
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Wsparcie</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>
                    <Link href="#" className="hover:text-blue-600 transition-colors">
                      Dokumentacja
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-blue-600 transition-colors">
                      Pomoc
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-blue-600 transition-colors">
                      Kontakt
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-blue-600 transition-colors">
                      Status systemu
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Kontakt</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>📧 kontakt@edureport.pl</li>
                  <li>📞 +48 123 456 789</li>
                  <li>🏢 Warszawa, Polska</li>
                  <li>🌐 www.edureport.pl</li>
                </ul>
              </div>
            </div>

            <div className="pt-8 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-600">
                © 2024 Edu Report V3. Wszystkie prawa zastrzeżone. |
                <Link href="#" className="hover:text-blue-600 transition-colors ml-2">
                  Polityka prywatności
                </Link>{" "}
                |
                <Link href="#" className="hover:text-blue-600 transition-colors ml-2">
                  Warunki użytkowania
                </Link>
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
