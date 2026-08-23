// @vitest-environment jsdom
import React from "react";
import { render, screen, act } from "@testing-library/react";
import { describe, expect, it, vi, afterEach } from "vitest";
import { StartupBoot } from "../client/src/components/StartupBoot";

describe("NAQLA startup splash", () => {
  afterEach(() => vi.useRealTimers());

  it("renders the historical brand, loading indicator, then reveals the requested application without a blank frame", () => {
    vi.useFakeTimers();
    vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => window.setTimeout(() => callback(performance.now() + 1300), 1));
    vi.stubGlobal("cancelAnimationFrame", (id: number) => window.clearTimeout(id));
    vi.stubGlobal("matchMedia", () => ({ matches: false }));

    render(<StartupBoot><main data-testid="requested-route">Deep link content</main></StartupBoot>);
    expect(screen.getByTestId("startup-splash")).not.toBeNull();
    expect(screen.getByText("NAQLA")).not.toBeNull();
    expect(screen.getByText("Global Innovation Platform")).not.toBeNull();
    expect(screen.getByText("جاري التحميل...")).not.toBeNull();
    expect(screen.getByTestId("requested-route").parentElement?.getAttribute("aria-hidden")).toBe("true");

    act(() => vi.advanceTimersByTime(1800));
    expect(screen.queryByTestId("startup-splash")).toBeNull();
    expect(screen.getByTestId("requested-route").parentElement?.getAttribute("aria-hidden")).toBe("false");
  });
});
