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

const userStorageKey = "acme-compass-user";
const users = [
  {
    id: "pro-user",
    name: "Jordan Lee",
    plan: "pro",
    capabilityLabel: "Pro plan - Ask Compass AI locked",
  },
  {
    id: "enterprise-user",
    name: "Avery Brooks",
    plan: "enterprise",
    capabilityLabel: "Enterprise plan - Ask Compass AI unlocked",
  },
];

const themeVariables = {
  light: {
    "--ts-var-root-background": "#f5f7f6",
    "--ts-var-root-color": "#15211f",
    "--ts-var-application-color": "#007e70",
    "--ts-var-spotterviz-panel-background": "#f5f7f6",
    "--ts-var-spotter-input-background": "#f5f7f6",
    "--ts-var-spotter-prompt-background": "#eef3f1",
    "--ts-var-liveboard-layout-background": "#f5f7f6",
    "--ts-var-liveboard-header-background": "#f5f7f6",
    "--ts-var-liveboard-header-font-color": "#15211f",
    "--ts-var-liveboard-tile-background": "#f5f7f6",
    "--ts-var-liveboard-tile-border-color": "#d9e1de",
    "--ts-var-viz-background": "#f5f7f6",
    "--ts-var-viz-title-color": "#15211f",
    "--ts-var-search-bar-background": "#ffffff",
    "--ts-var-search-bar-text-font-color": "#15211f",
    "--ts-var-button--primary-background": "#007e70",
    "--ts-var-button--primary-color": "#ffffff",
  },
  dark: {
    "--ts-var-root-background": "#111816",
    "--ts-var-root-color": "#f4f7f3",
    "--ts-var-application-color": "#40c9b7",
    "--ts-var-liveboard-layout-background": "#111816",
    "--ts-var-liveboard-header-background": "#111816",
    "--ts-var-liveboard-header-font-color": "#f4f7f3",
    "--ts-var-liveboard-tile-background": "#111816",
    "--ts-var-liveboard-tile-border-color": "#33443f",
    "--ts-var-viz-background": "#111816",
    "--ts-var-viz-title-color": "#f4f7f3",
    "--ts-var-search-bar-background": "#22302b",
    "--ts-var-search-bar-text-font-color": "#f4f7f3",
    "--ts-var-button--primary-background": "#40c9b7",
    "--ts-var-button--primary-color": "#09110f",
  },
};

let activeView = "home";
const rendered = new Set();
let activeUserId = users[0].id;

const spotterIntroReplacement =
  "Compass AI is your AI analyst. It can answer questions you have about your data source and help you find insights quickly.\n\nTo start analyzing, ask a business question about your data.";

const spotterStringOverrides = {
  "Meet Spotter, your AI analyst": "Ask Compass AI anything",
  "Spotter is your AI analyst. It can answer questions you have about your data source and help you find insights quickly.":
    "Compass AI is your AI analyst. It can answer questions you have about your data source and help you find insights quickly.",
  "Spotter is your AI analyst. It can answer questions you have about your datasource and help you find insights quickly.":
    "Compass AI is your AI analyst. It can answer questions you have about your data source and help you find insights quickly.",
  "Spotter is your AI analyst. It can answer questions you have about your data source and help you find insights quickly.\n\nTo start analyzing, ask a business question about your data.":
    spotterIntroReplacement,
  "Spotter is your AI analyst. It can answer questions you have about your data source and help you find insights quickly. To start analyzing, ask a business question about your data.":
    spotterIntroReplacement,
  "Spotter is your AI analyst. It can answer questions you have about your datasource and help you find insights quickly.\n\nTo start analyzing, ask a business question about your data.":
    spotterIntroReplacement,
  "Spotter is your AI analyst. It can answer questions you have about your datasource and help you find insights quickly. To start analyzing, ask a business question about your data.":
    spotterIntroReplacement,
};

const currentTheme = () => document.documentElement.dataset.theme || "light";
const getActiveUser = () =>
  users.find((user) => user.id === activeUserId) || users[0];
const isEnterpriseUser = () => getActiveUser().plan === "enterprise";

function initAnalyticsEngine() {
  init({
    thoughtSpotHost: tsURL,
    authType: AuthType.None,
    customizations: {
      style: { customCSS: { variables: themeVariables[currentTheme()] } },
      content: { strings: spotterStringOverrides },
    },
  });
}

function embedOptions() {
  return {
    frameParams: {},
    customizations: {
      style: { customCSS: { variables: themeVariables[currentTheme()] } },
      content: { strings: spotterStringOverrides },
    },
  };
}

function renderAnalyticsHub() {
  const container = document.querySelector("#liveboardEmbed");
  if (!container) return;
  container.innerHTML = "";

  const dashboardDownloadActions = [
    Action.Download,
    Action.DownloadData,
    Action.DownloadAsCsv,
    Action.DownloadAsPdf,
    Action.DownloadAsPng,
    Action.DownloadAsXlsx,
  ].filter(Boolean);

  const proVisibleActions = [
    Action.Explore,
    Action.DrillDown,
    Action.CrossFilter,
    Action.RemoveCrossFilter,
    Action.ShowUnderlyingData,
    Action.CopyLink,
    Action.Present,
    Action.ShareViz,
  ].filter(Boolean);

  const liveboardPlanControls = isEnterpriseUser()
    ? {}
    : {
        primaryAction: Action.Explore,
        visibleActions: proVisibleActions,
        disabledActions: [
          Action.SpotterViz,
          ...dashboardDownloadActions,
        ].filter(Boolean),
        disabledActionReason:
          "Upgrade to Enterprise to unlock Spotter actions, Data Alerts, and dashboard downloads.",
      };

  new LiveboardEmbed("#liveboardEmbed", {
    ...embedOptions(),
    ...liveboardPlanControls,
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

function renderAskCompass(query = "") {
  const container = document.querySelector("#spotterEmbed");
  if (!container) return;
  container.innerHTML = "";
  const spotterOptions = {
    ...embedOptions(),
    worksheetId,
    updatedSpotterChatPrompt: true,
    hideSourceSelection: false,
    disableSourceSelection: false,
  };
  if (query?.trim()) {
    spotterOptions.searchOptions = { searchQuery: query };
  }
  new SpotterEmbed("#spotterEmbed", spotterOptions).render();
}

function syncAskAccessState() {
  const askBanner = document.querySelector("#askAccessBanner");
  const askMessage = document.querySelector("#askAccessMessage");
  const askPromptChips = document.querySelector("#askPromptChips");
  const askUpgradeBtn = document.querySelector("#askUpgradeBtn");
  const askOverlayUpgradeBtn = document.querySelector("#askOverlayUpgradeBtn");
  const askOverlay = document.querySelector("#askLockedOverlay");
  const spotterEmbed = document.querySelector("#spotterEmbed");
  const user = getActiveUser();
  if (
    !askBanner ||
    !askMessage ||
    !askPromptChips ||
    !askUpgradeBtn ||
    !askOverlayUpgradeBtn ||
    !askOverlay ||
    !spotterEmbed ||
    !user
  )
    return;

  if (isEnterpriseUser()) {
    askBanner.classList.add("is-hidden");
    askBanner.classList.remove("locked-banner");
    askPromptChips.classList.remove("is-hidden");
    askUpgradeBtn.classList.add("is-hidden");
    askOverlayUpgradeBtn.classList.add("is-hidden");
    askOverlay.classList.remove("is-visible");
    spotterEmbed.classList.remove("is-readonly");
    return;
  }

  askBanner.classList.add("locked-banner");
  askBanner.classList.remove("is-hidden");
  askMessage.innerHTML =
    "<strong>Enterprise feature:</strong> upgrade to unlock Ask Compass AI.";
  askPromptChips.classList.add("is-hidden");
  askUpgradeBtn.classList.remove("is-hidden");
  askOverlayUpgradeBtn.classList.remove("is-hidden");
  askOverlay.classList.add("is-visible");
  spotterEmbed.classList.add("is-readonly");
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
  if (view === "ask") {
    renderAskCompass();
    syncAskAccessState();
  }
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
  const userSelect = document.querySelector("#userSelect");
  const tenantSmall = document.querySelector("#tenantNameSmall");
  const avatar = document.querySelector(".avatar");
  const userCycleBtn = document.querySelector("#userCycleBtn");
  const userPlanPill = document.querySelector("#userPlanPill");
  const userPlanStatusSmall = document.querySelector("#userPlanStatusSmall");

  const applyUser = (userId) => {
    const user = users.find((entry) => entry.id === userId) || users[0];
    activeUserId = user.id;
    localStorage.setItem(userStorageKey, user.id);
    if (!user) return;
    tenantSmall.textContent = user.name;
    avatar.textContent = user.name
      .split(" ")
      .map((part) => part[0]?.toUpperCase() || "")
      .join("")
      .slice(0, 2);
    if (userPlanPill) {
      userPlanPill.textContent =
        user.plan === "enterprise" ? "Enterprise" : "Pro";
      userPlanPill.classList.toggle("locked", user.plan !== "enterprise");
    }
    if (userPlanStatusSmall) {
      userPlanStatusSmall.textContent = user.capabilityLabel;
    }
    syncAskAccessState();
    rendered.delete(activeView);
    renderViewEmbed(activeView, true);
  };

  // Keep select as the source of truth, but cycle users via icon click.
  userCycleBtn?.addEventListener("click", () => {
    if (!userSelect || userSelect.options.length === 0) return;
    const nextIndex =
      (userSelect.selectedIndex + 1) % userSelect.options.length;
    userSelect.selectedIndex = nextIndex;
    userSelect.dispatchEvent(new Event("change"));
  });

  userSelect?.addEventListener("change", () => {
    applyUser(userSelect.value);
  });

  const storedUserId = localStorage.getItem(userStorageKey);
  if (storedUserId && userSelect) {
    const idx = [...userSelect.options].findIndex(
      (option) => option.value === storedUserId,
    );
    if (idx >= 0) userSelect.selectedIndex = idx;
  }
  applyUser(userSelect?.value);
}

function bindTheme() {
  const themeToggle = document.querySelector("#themeToggle");
  const syncThemeIcon = () => {
    if (!themeToggle) return;
    const isDark = currentTheme() === "dark";
    themeToggle.textContent = isDark ? "☀" : "☾";
    themeToggle.title = isDark
      ? "Switch to light theme"
      : "Switch to dark theme";
  };

  document.documentElement.dataset.theme =
    localStorage.getItem("acme-compass-theme") || "light";
  syncThemeIcon();
  themeToggle?.addEventListener("click", () => {
    const next = currentTheme() === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("acme-compass-theme", next);
    syncThemeIcon();
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
      syncAskAccessState();
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
