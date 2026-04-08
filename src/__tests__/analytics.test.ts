import { analyticsService, EVENTS } from "../lib/services/analytics-service";

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(global, "localStorage", { value: localStorageMock });

describe("analyticsService", () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it("should track an event", () => {
    analyticsService.track(EVENTS.SIGNUP);
    const events = analyticsService.getAll();
    expect(events).toHaveLength(1);
    expect(events[0].event).toBe("user_signup");
  });

  it("should filter PII from properties", () => {
    analyticsService.track(EVENTS.RECORD_CREATED, {
      category: "IBA經典",
      username: "secret_user", // should be filtered
      rating: 5,
    });
    const events = analyticsService.getAll();
    expect(events[0].properties).toHaveProperty("category");
    expect(events[0].properties).toHaveProperty("rating");
    expect(events[0].properties).not.toHaveProperty("username");
  });

  it("should only allow safe property keys", () => {
    analyticsService.track("test", {
      category: "ok",
      baseSpirit: "ok",
      mode: "ok",
      feature: "ok",
      page: "ok",
      count: 1,
      rating: 5,
      userId: "should_be_filtered",
      email: "should_be_filtered",
    });
    const events = analyticsService.getAll();
    const props = events[0].properties!;
    expect(Object.keys(props).sort()).toEqual(
      ["baseSpirit", "category", "count", "feature", "mode", "page", "rating"]
    );
  });

  it("should count events", () => {
    analyticsService.track(EVENTS.SIGNUP);
    analyticsService.track(EVENTS.SIGNUP);
    analyticsService.track(EVENTS.RECORD_CREATED);
    expect(analyticsService.getCount(EVENTS.SIGNUP)).toBe(2);
    expect(analyticsService.getCount(EVENTS.RECORD_CREATED)).toBe(1);
  });

  it("should get summary", () => {
    analyticsService.track(EVENTS.SIGNUP);
    analyticsService.track(EVENTS.RECORD_CREATED);
    analyticsService.track(EVENTS.RECORD_CREATED);
    const summary = analyticsService.getSummary();
    expect(summary[EVENTS.SIGNUP]).toBe(1);
    expect(summary[EVENTS.RECORD_CREATED]).toBe(2);
  });

  it("should clear all events", () => {
    analyticsService.track(EVENTS.SIGNUP);
    analyticsService.clear();
    expect(analyticsService.getAll()).toHaveLength(0);
  });

  it("should keep max 1000 events", () => {
    for (let i = 0; i < 1050; i++) {
      analyticsService.track("bulk_event");
    }
    const events = analyticsService.getAll();
    expect(events.length).toBeLessThanOrEqual(1000);
  });
});
