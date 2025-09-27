"use client";
import React from "react";
import { useApp } from "../context/AppContext";
import { Habit } from "../types";
import { formatDate, getMoodEmoji } from "../utils";

export const History = React.memo(() => {
  const { state } = useApp();

  const sortedHabits = [...state.habits].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Historia</h2>
        <p className="text-gray-600">Przeglądaj swoje wcześniejsze wpisy</p>
      </div>

      {sortedHabits.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <span className="text-6xl block mb-4">📝</span>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Brak wpisów</h3>
          <p className="text-gray-600">Zacznij śledzić swoje nawyki już dziś!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {sortedHabits.map((habit) => (
            <div key={habit.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{formatDate(habit.date)}</h3>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className="text-2xl">{getMoodEmoji(habit.mood)}</span>
                    <span className="text-sm text-gray-600 capitalize">{habit.mood}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center">
                    <div className="text-sm text-gray-500">Woda</div>
                    <div className="font-semibold">{habit.water} 💧</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-500">Sen</div>
                    <div className="font-semibold">{habit.sleep}h 😴</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-500">Kroki</div>
                    <div className="font-semibold">{habit.steps} 👟</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-500">Ćwiczenia</div>
                    <div className="font-semibold">{habit.exercise}m 🏃</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-500">Medytacja</div>
                    <div className="font-semibold">{habit.meditation}m 🧘</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-500">Posiłki</div>
                    <div className="font-semibold">{habit.healthyMeals} 🥗</div>
                  </div>
                </div>
              </div>

              {habit.notes && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-gray-600">{habit.notes}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

History.displayName = "History";
