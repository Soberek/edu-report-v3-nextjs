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
      const notification = new Notification("HealthHub 💧", {
        body: message,
        tag: "healthhub-hydration",
        icon: "/favicon.ico", // Use app icon
        requireInteraction: false, // Changed to false for better compatibility
        silent: false, // Allow sound
      });

      // Handle notification clicks
      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      // Auto-close after 5 seconds
      setTimeout(() => {
        notification.close();
      }, 5000);
    } catch (error) {
      console.error("Failed to show notification:", error);
      // Fallback to alert
      alert(`💧 ${message}`);
    }
  } else {
    console.info("HealthHub:", message);
  }
};

// Export function to manually trigger hydration notification
export const triggerHydrationNotification = async () => {
  if (typeof window === "undefined") {
    console.log("Window is undefined");
    return;
  }

  console.log("Triggering hydration notification...");
  console.log("Notification support:", "Notification" in window);
  console.log("Current permission:", Notification.permission);

  // Request notification permission if not already granted
  if ("Notification" in window) {
    if (Notification.permission === "default") {
      console.log("Requesting notification permission...");
      const permission = await Notification.requestPermission();
      console.log("Permission result:", permission);
      if (permission === "granted") {
        showHydrationReminderNotification();
      } else {
        console.log("Permission denied, showing alert");
        alert("💧 Przypomnienie: wypij szklankę wody, aby utrzymać dobre nawodnienie.");
      }
    } else if (Notification.permission === "granted") {
      console.log("Permission already granted, showing notification");
      showHydrationReminderNotification();
    } else {
      console.log("Permission denied, showing alert with instructions");
      alert(`💧 Przypomnienie: wypij szklankę wody, aby utrzymać dobre nawodnienie.

🔔 Aby otrzymywać powiadomienia w Safari:
1. Safari → Preferencje (Cmd + ,)
2. Zakładka "Strony internetowe" → "Powiadomienia"
3. Znajdź tę stronę i zmień na "Zezwól"
4. Odśwież stronę (Cmd + R)

Lub kliknij "aA" w pasku adresu → "Ustawienia dla tej strony"`);
    }
  } else {
    console.log("Notifications not supported, showing alert");
    alert("💧 Przypomnienie: wypij szklankę wody, aby utrzymać dobre nawodnienie.");
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
