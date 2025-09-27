"use client";
import React from "react";
import { useApp } from "../context/AppContext";
import { Habit, Goals } from "../types";
import { calculateProgress, getProgressColor } from "../utils";

export const Dashboard = React.memo(() => {
  const { state } = useApp();

  const habitData: Partial<Habit> = state.todayHabits || {
    water: 0,
    sleep: 0,
    steps: 0,
    exercise: 0,
    meditation: 0,
    healthyMeals: 0,
  };

  const stats = [
    { icon: "💧", label: "Woda", value: habitData.water!, goal: state.goals.water, unit: "szklanek" },
    { icon: "😴", label: "Sen", value: habitData.sleep!, goal: state.goals.sleep, unit: "godzin" },
    { icon: "👟", label: "Kroki", value: habitData.steps!, goal: state.goals.steps, unit: "kroków" },
    { icon: "🏃", label: "Ćwiczenia", value: habitData.exercise!, goal: state.goals.exercise, unit: "minut" },
    { icon: "🧘", label: "Medytacja", value: habitData.meditation!, goal: state.goals.meditation, unit: "minut" },
    { icon: "🥗", label: "Zdrowe posiłki", value: habitData.healthyMeals!, goal: state.goals.healthyMeals, unit: "posiłków" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h2>
        <p className="text-gray-600">Twój postęp na dzisiaj</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const progress = calculateProgress(stat.value, stat.goal);
          const progressColor = getProgressColor(progress);

          return (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all transform hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">{stat.icon}</span>
                  <div>
                    <h3 className="font-semibold text-gray-800">{stat.label}</h3>
                    <p className="text-sm text-gray-500">
                      Cel: {stat.goal} {stat.unit}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.unit}</p>
                </div>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-500 ${progressColor}`} style={{ width: `${progress}%` }} />
              </div>

              <div className="mt-2 text-right">
                <span className="text-sm font-medium text-gray-600">{Math.round(progress)}% celu</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mood section */}
      {state.todayHabits?.mood && (
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Dzisiejszy nastrój</h3>
          <div className="flex items-center space-x-4">
            <span className="text-5xl">
              {state.todayHabits.mood === "excellent" && "😄"}
              {state.todayHabits.mood === "good" && "😊"}
              {state.todayHabits.mood === "neutral" && "😐"}
              {state.todayHabits.mood === "bad" && "😔"}
              {state.todayHabits.mood === "terrible" && "😢"}
            </span>
            <div>
              <p className="text-lg font-medium capitalize">{state.todayHabits.mood}</p>
              {state.todayHabits.notes && <p className="text-gray-600 mt-2">{state.todayHabits.notes}</p>}
            </div>
          </div>
        </div>
      )}

      {/* Quick stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Streak</p>
              <p className="text-3xl font-bold mt-2">{state.habits.length} dni</p>
            </div>
            <span className="text-5xl opacity-50">🔥</span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Ten tydzień</p>
              <p className="text-3xl font-bold mt-2">
                {
                  state.habits.filter((h) => {
                    const date = new Date(h.date);
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return date >= weekAgo;
                  }).length
                }{" "}
                dni
              </p>
            </div>
            <span className="text-5xl opacity-50">📈</span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Ukończone cele</p>
              <p className="text-3xl font-bold mt-2">
                {state.todayHabits
                  ? Object.keys(state.goals).filter((key) => (habitData[key as keyof Habit] as number) >= state.goals[key as keyof Goals])
                      .length
                  : 0}
                /{Object.keys(state.goals).length}
              </p>
            </div>
            <span className="text-5xl opacity-50">✅</span>
          </div>
        </div>
      </div>
    </div>
  );
});

Dashboard.displayName = "Dashboard";
