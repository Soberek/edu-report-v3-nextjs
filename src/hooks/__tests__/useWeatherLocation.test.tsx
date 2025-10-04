import { renderHook, act, waitFor } from "@testing-library/react";
import { useWeatherLocation } from "../useWeatherLocation";
import { UserRole } from "@/types/user";

// Mock global fetch
// Helper to mock sequential fetch responses
const mockFetchSequence = (responses: unknown[]) => {
  let call = 0;
  global.fetch = vi.fn().mockImplementation(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(responses[call++]),
    })
  );
};

const baseUserData = {
  uid: "test",
  email: "test@example.com",
  role: UserRole.USER,
  createdAt: "2025-01-01T00:00:00.000Z",
  updatedAt: "2025-01-01T00:00:00.000Z",
};

describe("useWeatherLocation", () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY = "test-key";
  });
  afterEach(() => {
    vi.restoreAllMocks();
    delete process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
  });

  it("fetches weather by postal code", async () => {
    mockFetchSequence([
      { lat: 52.5, lon: 21.0 }, // Geocoding response (valid)
      { main: { temp: 15 }, weather: [{ icon: "01d" }], name: "Warszawa" }, // Weather response (valid)
    ]);
    const userData = { ...baseUserData, postalCode: "00-001", countryCode: "PL" };
    const coords = null;
    const { result } = renderHook(() => useWeatherLocation(userData, coords));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.weather?.temp).toBe(15);
    expect(result.current.location).toBe("Warszawa");
  });

  it("fetches weather by city if postal code fails", async () => {
    mockFetchSequence([
      {}, // Geocoding response (invalid)
      { main: { temp: 10 }, weather: [{ icon: "02d" }], name: "Kraków" }, // Weather response (valid)
    ]);
    const userData = { ...baseUserData, city: "Kraków" };
    const coords = null;
    const { result } = renderHook(() => useWeatherLocation(userData, coords));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.weather?.temp).toBe(10);
    expect(result.current.location).toBe("Kraków");
  });

  it("fetches weather by coords if city fails", async () => {
    mockFetchSequence([
      {}, // Geolocation response (invalid)
      { main: { temp: 5 }, weather: [{ icon: "03d" }], name: "Poznań" }, // Warszawa response (valid)
    ]);
    const userData = { ...baseUserData };
    const coords = { lat: 52.4, lon: 16.9 };
    const { result } = renderHook(() => useWeatherLocation(userData, coords));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.weather?.temp).toBe(5);
    expect(result.current.location).toBe("Poznań");
  });

  it("falls back to Warszawa if all else fails", async () => {
    mockFetchSequence([
      { main: { temp: 8 }, weather: [{ icon: "04d" }], name: "Warszawa" }, // Warszawa response (valid)
    ]);
    const userData = { ...baseUserData };
    const coords = null;
    const { result } = renderHook(() => useWeatherLocation(userData, coords));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.weather?.temp).toBe(8);
    expect(result.current.location).toBe("Warszawa");
  });

  it("handles fetch errors gracefully", async () => {
    global.fetch = vi.fn().mockImplementation(() => Promise.reject("API error"));
    const userData = { ...baseUserData, city: "Gdańsk" };
    const coords = null;
    const { result } = renderHook(() => useWeatherLocation(userData, coords));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.weather).toBeNull();
  });
});
