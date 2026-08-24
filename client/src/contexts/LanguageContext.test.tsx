// @vitest-environment jsdom
import * as React from "react";
import "@testing-library/jest-dom/vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { LanguageProvider, useLanguage } from "./LanguageContext";

function Probe() {
  const { language, setLanguage } = useLanguage();
  return <><span data-testid="language">{language}</span><button type="button" onClick={() => setLanguage(language === "ar" ? "en" : "ar")}>toggle</button></>;
}

afterEach(() => {
  localStorage.clear();
  document.documentElement.dir = "";
  document.documentElement.lang = "";
});

describe("LanguageProvider direction", () => {
  it("applies persisted English as LTR and switches to Arabic RTL", () => {
    localStorage.setItem("naqla_language", "en");
    render(<LanguageProvider><Probe /></LanguageProvider>);
    expect(screen.getByTestId("language")).toHaveTextContent("en");
    expect(document.documentElement).toHaveAttribute("dir", "ltr");
    expect(document.documentElement).toHaveAttribute("lang", "en");
    fireEvent.click(screen.getByRole("button", { name: "toggle" }));
    expect(screen.getByTestId("language")).toHaveTextContent("ar");
    expect(document.documentElement).toHaveAttribute("dir", "rtl");
    expect(document.documentElement).toHaveAttribute("lang", "ar");
    expect(localStorage.getItem("naqla_language")).toBe("ar");
  });
});
