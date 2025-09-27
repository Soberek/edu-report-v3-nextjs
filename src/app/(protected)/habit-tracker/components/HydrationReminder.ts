// Hydration reminder functionality extracted into a separate module
const hydrationReminderStorageKey = "healthhub_hydration_reminders_sent";
const hydrationReminderHours = [9, 11, 13, 15, 17, 19];
let hydrationReminderIntervalId: number | null = null;
let hydrationReminderInitialized = false;

declare global {
  interface Window {
    __healthHubHydrationReminderInitialized__?: boolean;
    __healthHubHydrationReminderInterval__?: number;
  }
}

if (typeof window !== "undefined") {
  hydrationReminderInitialized = Boolean(window.__healthHubHydrationReminderInitialized__);
  hydrationReminderIntervalId = window.__healthHubHydrationReminderInterval__ ?? null;
}

type HydrationReminderState = Record<string, number[]>;

const loadHydrationReminderState = (): HydrationReminderState => {
  if (typeof window === "undefined") {
    return {};
  }
  const raw = localStorage.getItem(hydrationReminderStorageKey);
  if (!raw) {
    return {};
  }
  try {
    const parsed = JSON.parse(raw) as HydrationReminderState;
    if (parsed && typeof parsed === "object") {
      return parsed;
    }
  } catch {
    console.warn("HealthHub: Nie udało się odczytać przypomnień o nawodnieniu.");
  }
  return {};
};

const saveHydrationReminderState = (state: HydrationReminderState) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(hydrationReminderStorageKey, JSON.stringify(state));
  } catch (error) {
    console.warn("HealthHub: Nie udało się zapisać przypomnień o nawodnieniu.", error);
  }
};

const showHydrationReminderNotification = () => {
  if (typeof window === "undefined") return;

  const message = "Przypomnienie: wypij szklankę wody, aby utrzymać dobre nawodnienie.";
  if ("Notification" in window && Notification.permission === "granted") {
    try {
      new Notification("HealthHub 💧", {
        body: message,
        tag: "healthhub-hydration",
      });
    } catch {
      console.info("HealthHub:", message);
    }
  } else {
    console.info("HealthHub:", message);
  }
};

const evaluateHydrationReminder = () => {
  if (typeof window === "undefined") return;

  const now = new Date();
  const currentHour = now.getHours();

  if (!hydrationReminderHours.includes(currentHour)) {
    return;
  }

  const state = loadHydrationReminderState();
  const todayKey = now.toISOString().split("T")[0];
  const alreadySent = state[todayKey]?.includes(currentHour);

  if (alreadySent) {
    return;
  }

  showHydrationReminderNotification();

  const updatedForToday = [...(state[todayKey] ?? []), currentHour];
  const nextState = { ...state, [todayKey]: updatedForToday };
  saveHydrationReminderState(nextState);
};

const startHydrationReminderLoop = () => {
  if (typeof window === "undefined") return;
  if (hydrationReminderIntervalId !== null) {
    return;
  }

  hydrationReminderIntervalId = window.setInterval(evaluateHydrationReminder, 60_000);
  window.__healthHubHydrationReminderInterval__ = hydrationReminderIntervalId;
  evaluateHydrationReminder();
};

export const initHydrationReminders = () => {
  if (typeof window === "undefined") return;
  if (hydrationReminderInitialized || window.__healthHubHydrationReminderInitialized__) {
    hydrationReminderInitialized = true;
    return;
  }

  hydrationReminderInitialized = true;
  window.__healthHubHydrationReminderInitialized__ = true;

  const cleanup = () => {
    if (hydrationReminderIntervalId !== null) {
      window.clearInterval(hydrationReminderIntervalId);
      hydrationReminderIntervalId = null;
    }
    window.__healthHubHydrationReminderInterval__ = undefined;
    window.__healthHubHydrationReminderInitialized__ = false;
    hydrationReminderInitialized = false;
    window.removeEventListener("beforeunload", cleanup);
  };

  window.addEventListener("beforeunload", cleanup);

  if (!("Notification" in window)) {
    startHydrationReminderLoop();
    return;
  }

  if (Notification.permission === "granted") {
    startHydrationReminderLoop();
    return;
  }

  if (Notification.permission === "default") {
    Notification.requestPermission()
      .then(() => startHydrationReminderLoop())
      .catch(() => startHydrationReminderLoop());
    return;
  }

  startHydrationReminderLoop();
};

if (typeof window !== "undefined") {
  initHydrationReminders();
}
