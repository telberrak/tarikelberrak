// Runs synchronously before first paint (inlined in <head>) so the correct
// theme is applied immediately — no flash of the wrong theme on load.
export const THEME_STORAGE_KEY = "theme";

export const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem("${THEME_STORAGE_KEY}");
    var theme = stored === "light" || stored === "dark"
      ? stored
      : (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
    document.documentElement.setAttribute("data-theme", theme);
  } catch (e) {}
})();
`;
