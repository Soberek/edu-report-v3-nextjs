"use client";
import React from "react";
import { Controller } from "react-hook-form";
import { useApp } from "../context/AppContext";
// import { Habit } from "../types";
import { useHabitForm } from "../hooks/useHabitForm";

export const TrackHabits = React.memo(() => {
  const {} = useApp();
  const {
    control,
    formState: { errors },
    reset,
    onSubmit,
  } = useHabitForm();

  // const mood = watch("mood");

  const habitFields = [
    { name: "water" as const, label: "Woda (szklanki)", icon: "💧", type: "number", max: 20 },
    { name: "sleep" as const, label: "Sen (godziny)", icon: "😴", type: "number", max: 24 },
    { name: "steps" as const, label: "Kroki", icon: "👟", type: "number", max: 50000 },
    { name: "exercise" as const, label: "Ćwiczenia (minuty)", icon: "🏃", type: "number", max: 300 },
    { name: "meditation" as const, label: "Medytacja (minuty)", icon: "🧘", type: "number", max: 120 },
    { name: "healthyMeals" as const, label: "Zdrowe posiłki", icon: "🥗", type: "number", max: 10 },
  ];

  const moodOptions = [
    { value: "excellent" as const, emoji: "😄", label: "Świetnie" },
    { value: "good" as const, emoji: "😊", label: "Dobrze" },
    { value: "neutral" as const, emoji: "😐", label: "Neutralnie" },
    { value: "bad" as const, emoji: "😔", label: "Słabo" },
    { value: "terrible" as const, emoji: "😢", label: "Źle" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Śledzenie nawyków</h2>
        <p className="text-gray-600">Zapisz swoje dzisiejsze postępy</p>
      </div>

      <form onSubmit={onSubmit} className="bg-white rounded-xl shadow-lg p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {habitFields.map((field) => (
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
                  min: { value: 0, message: "Wartość nie może być ujemna" },
                  max: { value: field.max, message: `Maksymalna wartość to ${field.max}` },
                }}
                render={({ field: inputField }) => (
                  <input
                    {...inputField}
                    type="number"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="0"
                  />
                )}
              />
              {errors[field.name] && <span className="text-red-500 text-sm mt-1">{errors[field.name]?.message}</span>}
            </div>
          ))}
        </div>

        <div className="mt-8">
          <label className="block text-sm font-medium text-gray-700 mb-4">Jak się dziś czujesz?</label>
          <Controller
            name="mood"
            control={control}
            render={({ field }) => (
              <div className="flex justify-center space-x-4">
                {moodOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => field.onChange(option.value)}
                    className={`p-4 rounded-xl border-2 transition-all transform hover:scale-110 ${
                      field.value === option.value ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <span className="text-4xl block mb-2">{option.emoji}</span>
                    <span className="text-sm font-medium">{option.label}</span>
                  </button>
                ))}
              </div>
            )}
          />
        </div>

        <div className="mt-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">Notatki (opcjonalne)</label>
          <Controller
            name="notes"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                rows={4}
                placeholder="Jak minął Twój dzień? Co wpłynęło na Twoje samopoczucie?"
              />
            )}
          />
        </div>

        <div className="mt-8 flex space-x-4">
          <button
            type="submit"
            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transform transition-all hover:scale-105"
          >
            💾 Zapisz postępy
          </button>
          <button
            type="button"
            onClick={() => reset()}
            className="px-8 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all"
          >
            🔄 Resetuj
          </button>
        </div>
      </form>
    </div>
  );
});

TrackHabits.displayName = "TrackHabits";
