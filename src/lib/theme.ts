/** Shared theme storage key for the pre-paint script and the navbar toggle. */
export const THEME_STORAGE_KEY = "tokyolearn:theme:v1";

/** Inline script string injected in the root layout before hydration. */
export const THEME_INIT_SCRIPT = `
try {
  var stored = localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});
  document.documentElement.classList.toggle("dark", stored === "dark");
} catch (error) {}
`;
