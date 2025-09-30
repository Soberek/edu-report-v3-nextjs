import { FormState, FormAction } from "../types";
import { PrimaryButton, SecondaryButton } from "@/components/shared";

interface TodoFormProps {
  formState: FormState;
  formDispatch: React.Dispatch<FormAction>;
  onSubmit: () => void;
  onCancel: () => void;
}

export const TodoForm = ({ formState, formDispatch, onSubmit, onCancel }: TodoFormProps) => {
  return (
    <div className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Dodaj nowe zadanie</h3>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        <input
          type="text"
          value={formState.newTodo}
          onChange={(e) => formDispatch({ type: "SET_NEW_TODO", payload: e.target.value })}
          placeholder="Tytuł zadania..."
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          onKeyPress={(e) => e.key === "Enter" && onSubmit()}
        />
        <input
          type="date"
          value={formState.selectedDate}
          onChange={(e) => formDispatch({ type: "SET_SELECTED_DATE", payload: e.target.value })}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <select
          value={formState.priority}
          onChange={(e) => formDispatch({ type: "SET_PRIORITY", payload: e.target.value as "low" | "medium" | "high" })}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="low">Niski priorytet</option>
          <option value="medium">Średni priorytet</option>
          <option value="high">Wysoki priorytet</option>
        </select>
        <input
          type="text"
          value={formState.category}
          onChange={(e) => formDispatch({ type: "SET_CATEGORY", payload: e.target.value })}
          placeholder="Kategoria..."
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <input
          type="text"
          value={formState.tags}
          onChange={(e) => formDispatch({ type: "SET_TAGS", payload: e.target.value })}
          placeholder="Tagi (oddzielone przecinkami)..."
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <input
          type="number"
          value={formState.estimatedTime}
          onChange={(e) => formDispatch({ type: "SET_ESTIMATED_TIME", payload: e.target.value })}
          placeholder="Szacowany czas (min)"
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <textarea
          value={formState.description}
          onChange={(e) => formDispatch({ type: "SET_DESCRIPTION", payload: e.target.value })}
          placeholder="Opis zadania..."
          rows={3}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <div className="space-y-2">
          <input
            type="datetime-local"
            value={formState.reminder}
            onChange={(e) => formDispatch({ type: "SET_REMINDER", payload: e.target.value })}
            placeholder="Przypomnienie..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="flex gap-2">
            <select
              value={formState.recurringType}
              onChange={(e) => formDispatch({ type: "SET_RECURRING_TYPE", payload: e.target.value as any })}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="none">Bez powtórzeń</option>
              <option value="daily">Codziennie</option>
              <option value="weekly">Tygodniowo</option>
              <option value="monthly">Miesięcznie</option>
              <option value="yearly">Rocznie</option>
            </select>
            {formState.recurringType !== "none" && (
              <input
                type="number"
                value={formState.recurringInterval}
                onChange={(e) => formDispatch({ type: "SET_RECURRING_INTERVAL", payload: parseInt(e.target.value) })}
                min="1"
                className="w-20 px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            )}
          </div>
          {formState.recurringType !== "none" && (
            <input
              type="date"
              value={formState.recurringEndDate}
              onChange={(e) => formDispatch({ type: "SET_RECURRING_END_DATE", payload: e.target.value })}
              placeholder="Data zakończenia..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          )}
        </div>
      </div>
      <div className="flex gap-2">
        <PrimaryButton onClick={onSubmit}>Dodaj zadanie</PrimaryButton>
        <SecondaryButton onClick={onCancel}>Anuluj</SecondaryButton>
      </div>
    </div>
  );
};
