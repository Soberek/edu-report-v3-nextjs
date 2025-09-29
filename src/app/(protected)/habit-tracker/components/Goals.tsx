"use client";
import React from "react";
import { Controller } from "react-hook-form";
import { useApp } from "../context/AppContext";
// import { Goals as GoalsType } from "../types";
import { useGoals } from "../hooks/useGoals";

export const Goals = React.memo(() => {
  const { state } = useApp();
  const {
    control,
    formState: { errors },
    reset,
    onSubmit,
  } = useGoals();

  const goalFields = [
    { name: "water" as const, label: "Woda (szklanki dziennie)", icon: "💧", type: "number", min: 1, max: 20 },
    { name: "sleep" as const, label: "Sen (godziny dziennie)", icon: "😴", type: "number", min: 1, max: 12 },
    { name: "steps" as const, label: "Kroki dziennie", icon: "👟", type: "number", min: 1000, max: 30000 },
    { name: "exercise" as const, label: "Ćwiczenia (minuty dziennie)", icon: "🏃", type: "number", min: 10, max: 180 },
    { name: "meditation" as const, label: "Medytacja (minuty dziennie)", icon: "🧘", type: "number", min: 5, max: 60 },
    { name: "healthyMeals" as const, label: "Zdrowe posiłki dziennie", icon: "🥗", type: "number", min: 1, max: 5 },
  ];

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Twoje cele</h2>
        <p className="text-gray-600">Dostosuj swoje dzienne cele zdrowotne</p>
      </div>

      <form onSubmit={onSubmit} className="bg-white rounded-xl shadow-lg p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {goalFields.map((field) => (
            <div key={field.name}>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <span className="text-xl">{field.icon}</span>
                <span>{field.label}</span>
              </label>
              <Controller
                name={field.name}
                control={control}
                rules={{
                  required: "To pole jest wymagane",
                  min: { value: field.min, message: `Minimalna wartość to ${field.min}` },
                  max: { value: field.max, message: `Maksymalna wartość to ${field.max}` },
                }}
                render={({ field: inputField }) => (
                  <input
                    {...inputField}
                    type="number"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                )}
              />
              {errors[field.name] && <span className="text-red-500 text-sm mt-1">{errors[field.name]?.message}</span>}
            </div>
          ))}
        </div>

        <div className="mt-8 flex space-x-4">
          <button
            type="submit"
            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transform transition-all hover:scale-105"
          >
            💾 Zapisz cele
          </button>
          <button
            type="button"
            onClick={() => reset(state.goals)}
            className="px-8 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all"
          >
            🔄 Resetuj
          </button>
        </div>
      </form>

      <div className="mt-8 bg-white rounded-xl shadow-lg p-8">
        <h3 className="text-xl font-semibold mb-6">Rekomendowane cele</h3>

        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">💧</span>
              <div>
                <h4 className="font-semibold">Woda: 8-10 szklanek dziennie</h4>
                <p className="text-sm text-gray-600">Odpowiednie nawodnienie wspiera metabolizm i energię</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">😴</span>
              <div>
                <h4 className="font-semibold">Sen: 7-9 godzin dziennie</h4>
                <p className="text-sm text-gray-600">Dobry sen poprawia pamięć, koncentrację i nastrój</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">👟</span>
              <div>
                <h4 className="font-semibold">Kroki: 8,000-10,000 kroków dziennie</h4>
                <p className="text-sm text-gray-600">Regularna aktywność fizyczna wspiera zdrowie serca</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">🏃</span>
              <div>
                <h4 className="font-semibold">Ćwiczenia: 30 minut dziennie</h4>
                <p className="text-sm text-gray-600">WHO zaleca min. 150 minut umiarkowanej aktywności tygodniowo</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

Goals.displayName = "Goals";
