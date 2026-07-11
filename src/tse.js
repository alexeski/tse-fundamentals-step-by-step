import {
  init,
  Action,
  AuthType,
  LiveboardEmbed,
  SearchEmbed,
  SpotterEmbed,
} from "https://unpkg.com/@thoughtspot/visual-embed-sdk/dist/tsembed.es.js";

const tsURL = "https://team1.thoughtspot.cloud";
const worksheetId = "1741c144-67c5-4d8e-a03c-966e1aa7aacb";
const liveboardId = "4186a3bb-5e32-48ff-9cd7-e0fcdaeab64a";
const healthLiveboardId = "fe0449e2-2d77-471d-bc93-5f896a511c1b";
const healthKpis = [
  { selector: "#healthKpi1", vizId: "5cae2058-111c-4c9f-be24-6c8135ffb8e4" },
  { selector: "#healthKpi2", vizId: "25635e9a-fe75-4935-9428-9c63e724ba9f" },
  { selector: "#healthKpi3", vizId: "109fd570-61d4-4bf7-8083-5b60277fafc8" },
  { selector: "#healthKpi4", vizId: "4c2c4b5b-8c77-4b78-9d43-1f5eeb3bc854" },
  { selector: "#healthKpi5", vizId: "6d378489-20f6-4e15-808a-0d6a53da8919" },
  { selector: "#healthKpi6", vizId: "465d075a-6a97-4ea7-be6a-423edd7520fc" },
];

const viewTitles = {
  home: "Welcome back, Northstar Bank",
  health: "Customer Health",
  analytics: "Analytics Hub",
  ask: "Ask Compass AI",
  explore: "Explore Data",
  monetize: "Plans & Add-ons",
  admin: "Tenant Administration",
};

const themeVariables = {
  light: {
    "--ts-var-root-background": "#ffffff",
    "--ts-var-root-color": "#15211f",
    "--ts-var-application-color": "#007e70",
    "--ts-var-liveboard-layout-background": "#ffffff",
    "--ts-var-liveboard-header-background": "#ffffff",
    "--ts-var-liveboard-header-font-color": "#15211f",
    "--ts-var-liveboard-tile-background": "#ffffff",
    "--ts-var-liveboard-tile-border-color": "#d9e1de",
    "--ts-var-viz-background": "#ffffff",
    "--ts-var-viz-title-color": "#15211f",
    "--ts-var-search-bar-background": "#ffffff",
    "--ts-var-search-bar-text-font-color": "#15211f",
    "--ts-var-button--primary-background": "#007e70",
    "--ts-var-button--primary-color": "#ffffff",
  },
  dark: {
    "--ts-var-root-background": "#18231f",
    "--ts-var-root-color": "#f4f7f3",
    "--ts-var-application-color": "#40c9b7",
    "--ts-var-liveboard-layout-background": "#18231f",
    "--ts-var-liveboard-header-background": "#18231f",
    "--ts-var-liveboard-header-font-color": "#f4f7f3",
    "--ts-var-liveboard-tile-background": "#22302b",
    "--ts-var-liveboard-tile-border-color": "#33443f",
    "--ts-var-viz-background": "#22302b",
    "--ts-var-viz-title-color": "#f4f7f3",
    "--ts-var-search-bar-background": "#22302b",
    "--ts-var-search-bar-text-font-color": "#f4f7f3",
    "--ts-var-button--primary-background": "#40c9b7",
    "--ts-var-button--primary-color": "#09110f",
  },
};

let activeView = "home";
const rendered = new Set();

const currentTheme = () => document.documentElement.dataset.theme || "light";

function initAnalyticsEngine() {
  init({
    thoughtSpotHost: tsURL,
    authType: AuthType.None,
    customizations: {
      style: { customCSS: { variables: themeVariables[currentTheme()] } },
      content: {
        strings: {
          "Meet Spotter, your AI analyst": "Ask Compass AI anything",
        },
      },
    },
  });
}

function embedOptions() {
  return {
    frameParams: {},
    customizations: {
      style: { customCSS: { variables: themeVariables[currentTheme()] } },
    },
  };
}

function renderAnalyticsHub() {
  const container = document.querySelector("#liveboardEmbed");
  if (!container) return;
  container.innerHTML = "";
  new LiveboardEmbed("#liveboardEmbed", {
    ...embedOptions(),
    frameParams: {},
    hideLiveboardHeader: true,
    isLiveboardCompactHeaderEnabled: true,
    hideIrrelevantChipsInLiveboardTabs: true,
    coverAndFilterOptionInPDF: true,
    isLiveboardMasterpiecesEnabled: true,
    liveboardId,
  }).render();
}

function renderHealthKpis() {
  healthKpis.forEach(({ selector, vizId }) => {
    const container = document.querySelector(selector);
    if (!container) return;
    container.innerHTML = "";
    new LiveboardEmbed(selector, {
      ...embedOptions(),
      frameParams: {},
      isLiveboardMasterpiecesEnabled: true,
      liveboardId: healthLiveboardId,
      vizId,
    }).render();
  });
}

function renderAskCompass(
  query = "Which customers have the highest churn risk this quarter?",
) {
  const container = document.querySelector("#spotterEmbed");
  if (!container) return;
  container.innerHTML = "";
  new SpotterEmbed("#spotterEmbed", {
    ...embedOptions(),
    worksheetId,
    searchOptions: { searchQuery: query },
    hideSourceSelection: true,
    disableSourceSelection: true,
  }).render();
}

function renderExploreData() {
  const container = document.querySelector("#searchEmbed");
  if (!container) return;
  container.innerHTML = "";
  new SearchEmbed("#searchEmbed", {
    ...embedOptions(),
    collapseDataSources: true,
    dataSource: worksheetId,
    searchOptions: {
      searchTokenString: "[Win Rate] by [product type] [date]",
      executeSearch: true,
    },
    hiddenActions: [Action.Share].filter(Boolean),
  }).render();
}

function renderViewEmbed(view, force = false) {
  if (!force && rendered.has(view)) return;
  initAnalyticsEngine();
  if (view === "health") renderHealthKpis();
  if (view === "analytics") renderAnalyticsHub();
  if (view === "ask") renderAskCompass();
  if (view === "explore") renderExploreData();
  rendered.add(view);
}

function setActiveView(view) {
  activeView = view;
  document
    .querySelectorAll(".nav-item")
    .forEach((button) =>
      button.classList.toggle("active", button.dataset.view === view),
    );
  document
    .querySelectorAll(".view")
    .forEach((section) => section.classList.remove("is-visible"));
  document.querySelector(`#${view}-view`)?.classList.add("is-visible");
  document.querySelector("#viewTitle").textContent =
    viewTitles[view] || "Acme Compass";
  renderViewEmbed(view);
}

function bindNavigation() {
  document
    .querySelectorAll("[data-view]")
    .forEach((button) =>
      button.addEventListener("click", () =>
        setActiveView(button.dataset.view),
      ),
    );
  document
    .querySelectorAll("[data-jump]")
    .forEach((button) =>
      button.addEventListener("click", () =>
        setActiveView(button.dataset.jump),
      ),
    );
}

function bindTenant() {
  const tenantSelect = document.querySelector("#tenantSelect");
  const tenantSmall = document.querySelector("#tenantNameSmall");
  tenantSelect?.addEventListener("change", () => {
    const tenant = tenantSelect.value;
    tenantSmall.textContent = tenant;
    viewTitles.home = `Welcome back, ${tenant}`;
    if (activeView === "home")
      document.querySelector("#viewTitle").textContent = viewTitles.home;
  });
}

function bindTheme() {
  document.documentElement.dataset.theme =
    localStorage.getItem("acme-compass-theme") || "light";
  document.querySelector("#themeToggle")?.addEventListener("click", () => {
    const next = currentTheme() === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("acme-compass-theme", next);
    rendered.clear();
    renderViewEmbed(activeView, true);
  });
}

function bindPromptChips() {
  document.querySelectorAll("[data-prompt]").forEach((button) => {
    button.addEventListener("click", () => {
      setActiveView("ask");
      initAnalyticsEngine();
      renderAskCompass(button.dataset.prompt);
      rendered.add("ask");
    });
  });
}

window.addEventListener("DOMContentLoaded", () => {
  bindTheme();
  initAnalyticsEngine();
  bindNavigation();
  bindTenant();
  bindPromptChips();
  setActiveView("home");
});
