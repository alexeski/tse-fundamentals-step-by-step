/** Logic for embedding and controlling the application. */
import {
  init,
  Action,
  AppEmbed,
  AuthType,
  LiveboardEmbed,
  Page,
  SearchEmbed,
  SpotterEmbed,
} from "https://unpkg.com/@thoughtspot/visual-embed-sdk/dist/tsembed.es.js";

const tsURL = "https://team1.thoughtspot.cloud";
const themeStorageKey = "acme-portal-theme";
const userStorageKey = "acme-portal-user";
const users = [
  {
    id: "pro-user",
    initials: "AL",
    name: "Alice Lee - Revenue Manager",
    plan: "pro",
    usageLabel: "Usage: 68% of monthly analytics credits",
  },
  {
    id: "enterprise-user",
    initials: "ER",
    name: "Ethan Ross - Director of Analytics",
    plan: "enterprise",
    usageLabel: "Enterprise unlimited analytics credits",
  },
];
const darkThemeVariables = {
  "--ts-var-root-background": "#0f172a",
  "--ts-var-root-color": "#f1f5f9",
  "--ts-var-application-color": "#93c5fd",
  "--ts-var-nav-background": "#111827",
  "--ts-var-nav-color": "#e5e7eb",
  "--ts-var-liveboard-layout-background": "#0f172a",
  "--ts-var-liveboard-header-background": "#111827",
  "--ts-var-liveboard-header-font-color": "#f8fafc",
  "--ts-var-liveboard-tile-background": "#1f2937",
  "--ts-var-liveboard-tile-border-color": "#334155",
  "--ts-var-liveboard-group-title-font-color": "#f8fafc",
  "--ts-var-liveboard-group-description-font-color": "#e2e8f0",
  "--ts-var-liveboard-group-tile-title-font-color": "#f8fafc",
  "--ts-var-liveboard-group-tile-description-font-color": "#e2e8f0",
  "--ts-var-liveboard-notetitle-heading-font-color": "#f8fafc",
  "--ts-var-liveboard-notetitle-body-font-color": "#e2e8f0",
  "--ts-var-liveboard-styling-panel-text-color": "#e2e8f0",
  "--ts-var-viz-background": "#1f2937",
  "--ts-var-viz-title-color": "#f8fafc",
  "--ts-var-viz-description-color": "#cbd5e1",
  "--ts-var-liveboard-chip-background": "#1e293b",
  "--ts-var-liveboard-chip-color": "#e2e8f0",
  "--ts-var-liveboard-chip--active-background": "#334155",
  "--ts-var-parameter-chip-background": "#1e293b",
  "--ts-var-parameter-chip-text-color": "#e2e8f0",
  "--ts-var-search-bar-background": "#1f2937",
  "--ts-var-search-bar-text-font-color": "#e5e7eb",
  "--ts-var-menu-background": "#111827",
  "--ts-var-menu-color": "#e5e7eb",
  "--ts-var-button--primary-background": "#2563eb",
  "--ts-var-button--primary-color": "#ffffff",
  "--ts-var-button--secondary-background": "#334155",
  "--ts-var-button--secondary-color": "#e2e8f0",
  "--ts-var-kpi-hero-color": "#f8fafc",
  "--ts-var-kpi-comparison-color": "#e2e8f0",
  "--ts-var-kpi-analyze-text-color": "#93c5fd",
  "--ts-var-kpi-positive-change-color": "#34d399",
  "--ts-var-kpi-negative-change-color": "#f87171",
  "--ts-var-axis-data-label-color": "#cbd5e1",
  "--ts-var-axis-title-color": "#e2e8f0",
  // Spotter-focused variables
  "--ts-var-spotterviz-panel-background": "#111827",
  "--ts-var-spotterviz-text-primary": "#f9fafb",
  "--ts-var-spotterviz-text-secondary": "#cbd5e1",
  "--ts-var-spotterviz-input-background": "#1f2937",
  "--ts-var-spotterviz-input-placeholder-color": "#94a3b8",
  "--ts-var-spotterviz-message-background": "#1e293b",
  "--ts-var-spotterviz-prompt-card-background": "#1f2937",
  "--ts-var-spotterviz-prompt-card-hover-background": "#334155",
  "--ts-var-spotterviz-footer-text-color": "#cbd5e1",
  "--ts-var-spotterviz-emptystate-spotterviz-color": "#e2e8f0",
  "--ts-var-spotter-input-background": "#1f2937",
  "--ts-var-spotter-prompt-background": "#1e293b",
  // Additional generic text controls used by free text/notes widgets in some clusters.
  "--ts-var-text-color": "#e2e8f0",
  "--ts-var-viz-text-color": "#e2e8f0",
};

const lightThemeVariables = {
  "--ts-var-root-background": "#f8fafc",
  "--ts-var-root-color": "#0f172a",
  "--ts-var-application-color": "#1d4ed8",
  "--ts-var-nav-background": "#ffffff",
  "--ts-var-nav-color": "#0f172a",
  "--ts-var-liveboard-layout-background": "#f8fafc",
  "--ts-var-liveboard-header-background": "#ffffff",
  "--ts-var-liveboard-header-font-color": "#0f172a",
  "--ts-var-liveboard-tile-background": "#ffffff",
  "--ts-var-liveboard-tile-border-color": "#e2e8f0",
  "--ts-var-liveboard-group-title-font-color": "#0f172a",
  "--ts-var-liveboard-group-description-font-color": "#334155",
  "--ts-var-liveboard-group-tile-title-font-color": "#0f172a",
  "--ts-var-liveboard-group-tile-description-font-color": "#334155",
  "--ts-var-liveboard-notetitle-heading-font-color": "#0f172a",
  "--ts-var-liveboard-notetitle-body-font-color": "#334155",
  "--ts-var-liveboard-styling-panel-text-color": "#0f172a",
  "--ts-var-viz-background": "#ffffff",
  "--ts-var-viz-title-color": "#0f172a",
  "--ts-var-viz-description-color": "#334155",
  "--ts-var-liveboard-chip-background": "#eef2ff",
  "--ts-var-liveboard-chip-color": "#1e293b",
  "--ts-var-liveboard-chip--active-background": "#dbeafe",
  "--ts-var-parameter-chip-background": "#eef2ff",
  "--ts-var-parameter-chip-text-color": "#1e293b",
  "--ts-var-search-bar-background": "#ffffff",
  "--ts-var-search-bar-text-font-color": "#0f172a",
  "--ts-var-menu-background": "#ffffff",
  "--ts-var-menu-color": "#0f172a",
  "--ts-var-button--primary-background": "#2563eb",
  "--ts-var-button--primary-color": "#ffffff",
  "--ts-var-button--secondary-background": "#f1f5f9",
  "--ts-var-button--secondary-color": "#0f172a",
  "--ts-var-kpi-hero-color": "#0f172a",
  "--ts-var-kpi-comparison-color": "#334155",
  "--ts-var-kpi-analyze-text-color": "#1d4ed8",
  "--ts-var-kpi-positive-change-color": "#059669",
  "--ts-var-kpi-negative-change-color": "#dc2626",
  "--ts-var-axis-data-label-color": "#334155",
  "--ts-var-axis-title-color": "#0f172a",
  // Spotter-focused variables
  "--ts-var-spotterviz-panel-background": "#ffffff",
  "--ts-var-spotterviz-text-primary": "#0f172a",
  "--ts-var-spotterviz-text-secondary": "#475569",
  "--ts-var-spotterviz-input-background": "#f8fafc",
  "--ts-var-spotterviz-input-placeholder-color": "#64748b",
  "--ts-var-spotterviz-message-background": "#f1f5f9",
  "--ts-var-spotterviz-prompt-card-background": "#f8fafc",
  "--ts-var-spotterviz-prompt-card-hover-background": "#e2e8f0",
  "--ts-var-spotterviz-footer-text-color": "#475569",
  "--ts-var-spotterviz-emptystate-spotterviz-color": "#0f172a",
  "--ts-var-spotter-input-background": "#ffffff",
  "--ts-var-spotter-prompt-background": "#f1f5f9",
  "--ts-var-text-color": "#0f172a",
  "--ts-var-viz-text-color": "#0f172a",
};

const viewToContainer = {
  spotter: "#embed",
  search: "#search-embed",
  liveboard: "#liveboard-embed",
  visualization: "#viz-embed",
  application: "#app-embed",
};

let activeView = "overview";
let activeUserId = users[0].id;

const getCurrentTheme = () =>
  document.documentElement.getAttribute("data-theme") || "light";
const getActiveUser = () =>
  users.find((user) => user.id === activeUserId) || users[0];
const isEnterpriseUser = () => getActiveUser().plan === "enterprise";
const getDataDownloadAction = () => Action.DownloadData || Action.Download;
const getPlanActionControls = ({ disableSpotterViz = false } = {}) => {
  if (isEnterpriseUser()) return {};
  const dataDownloadAction = getDataDownloadAction();
  const disabledActions = [];
  if (dataDownloadAction) {
    disabledActions.push(dataDownloadAction);
  }
  if (disableSpotterViz && Action.SpotterViz) {
    disabledActions.push(Action.SpotterViz);
  }
  return {
    disabledActions,
    disabledActionReason: "Data download is available on the Enterprise plan.",
  };
};

const getThoughtSpotStyleConfig = (theme) => {
  return {
    customCSS: {
      variables: theme === "dark" ? darkThemeVariables : lightThemeVariables,
    },
  };
};

const getEmbedThemeOptions = () => ({
  customizations: {
    style: getThoughtSpotStyleConfig(getCurrentTheme()),
  },
});

const syncVisualizationLockState = () => {
  const vizContainer = document.getElementById("viz-embed");
  const overlay = document.getElementById("viz-locked-overlay");
  const message = document.getElementById("insight-tier-message");
  if (!vizContainer || !overlay || !message) return;
  if (isEnterpriseUser()) {
    vizContainer.classList.remove("is-readonly");
    overlay.classList.remove("is-visible");
    message.innerHTML =
      "<strong>Enterprise feature:</strong> interactive embedded action workflows are enabled.";
    return;
  }
  vizContainer.classList.add("is-readonly");
  overlay.classList.add("is-visible");
  message.innerHTML =
    "<strong>Enterprise feature:</strong> switch user to Enterprise to interact with this insight tile.";
};

const initializeThoughtSpot = (theme) => {
  const style = getThoughtSpotStyleConfig(theme);
  init({
    thoughtSpotHost: tsURL,
    authType: AuthType.None,
    customizations: {
      style,
    },
  });
};

const rerenderActiveEmbedView = () => {
  if (viewToContainer[activeView] && viewRenderers[activeView]) {
    viewRenderers[activeView]();
  }
};

/** Initializes the application with ThoughtSpot. */
const loadApp = () => {
  applyStoredTheme();
  applyStoredUser();
  syncUserUi();
  initializeThoughtSpot(getCurrentTheme());
  bindNav();
  bindThemeToggle();
  bindPromptChips();
  bindUserSwitch();
  setActiveView("overview");
};

const clearEmbedContainer = (selector) => {
  const node = document.querySelector(selector);
  if (!node) return;
  node.innerHTML = "";
};

const renderSearch = () => {
  clearEmbedContainer(viewToContainer.search);
  const embed = new SearchEmbed(viewToContainer.search, {
    ...getEmbedThemeOptions(),
    frameParams: {},
    collapseDataSources: true,
    dataSource: "1741c144-67c5-4d8e-a03c-966e1aa7aacb",
    searchOptions: {
      searchTokenString: "[Win Rate] by [product type] [date]",
      executeSearch: true,
    },
    ...getPlanActionControls(),
    hiddenActions: [Action.Share],
  });

  embed.render();
};

const renderSpotter = (searchQuery = "top selling products") => {
  clearEmbedContainer(viewToContainer.spotter);
  const embed = new SpotterEmbed(viewToContainer.spotter, {
    ...getEmbedThemeOptions(),
    frameParams: {},
    worksheetId: "1741c144-67c5-4d8e-a03c-966e1aa7aacb",
    searchOptions: {
      searchQuery,
    },
    hideSourceSelection: true,
    disableSourceSelection: true,
  });

  embed.render();
};

const renderLiveboard = () => {
  clearEmbedContainer(viewToContainer.liveboard);
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
    ? {
        // primaryAction: Action.SpotterViz,
      }
    : {
        primaryAction: Action.Explore,
        visibleActions: proVisibleActions,
        disabledActions: [
          Action.SpotterViz,
          ...dashboardDownloadActions,
        ],
        disabledActionReason:
          "Upgrade to Enterprise to unlock Spotter actions, Data Alerts, and dashboard downloads.",
      };
  const embed = new LiveboardEmbed(viewToContainer.liveboard, {
    ...getEmbedThemeOptions(),
    ...liveboardPlanControls,
    frameParams: {},
    hideLiveboardHeader: true,
    isLiveboardCompactHeaderEnabled: true,
    hideIrrelevantChipsInLiveboardTabs: true,
    coverAndFilterOptionInPDF: true,
    isLiveboardMasterpiecesEnabled: true,
    isEnhancedFilterInteractivityEnabled: true,
    isCentralizedLiveboardFilterUXEnabled: true,
    // fullHeight: true,
    liveboardId: "4186a3bb-5e32-48ff-9cd7-e0fcdaeab64a",
  });

  embed.render();
};

const renderVisualization = () => {
  clearEmbedContainer(viewToContainer.visualization);
  syncVisualizationLockState();
  const embed = new LiveboardEmbed(viewToContainer.visualization, {
    ...getEmbedThemeOptions(),
    ...getPlanActionControls(),
    frameParams: {},
    isLiveboardMasterpiecesEnabled: true,
    liveboardId: "4186a3bb-5e32-48ff-9cd7-e0fcdaeab64a",
    vizId: "492eed8c-b36c-466f-87a6-b78d240d818a",
  });
  embed.render();
};

const renderApplication = () => {
  clearEmbedContainer(viewToContainer.application);
  const embed = new AppEmbed(viewToContainer.application, {
    ...getEmbedThemeOptions(),
    ...getPlanActionControls(),
    frameParams: {},
    isLiveboardCompactHeaderEnabled: true,
    hideIrrelevantChipsInLiveboardTabs: true,
    coverAndFilterOptionInPDF: true,
    isLiveboardMasterpiecesEnabled: true,
    isEnhancedFilterInteractivityEnabled: true,
    isCentralizedLiveboardFilterUXEnabled: true,
    pageId: Page.Home,
  });

  embed.render();
};

const viewRenderers = {
  search: renderSearch,
  spotter: renderSpotter,
  liveboard: renderLiveboard,
  visualization: renderVisualization,
  application: renderApplication,
  overview: () => {},
  monetization: () => {},
};

const setActiveView = (viewName) => {
  activeView = viewName;
  document.querySelectorAll(".nav-item").forEach((button) => {
    button.classList.toggle("active", button.dataset.view === viewName);
  });

  document.querySelectorAll(".view").forEach((section) => {
    section.classList.remove("is-visible");
  });
  const activeSection = document.getElementById(`${viewName}-view`);
  if (activeSection) {
    activeSection.classList.add("is-visible");
  }

  if (viewRenderers[viewName]) {
    if (viewToContainer[viewName]) {
      initializeThoughtSpot(getCurrentTheme());
    }
    viewRenderers[viewName]();
  }
};

const bindNav = () => {
  document.querySelectorAll(".nav-item").forEach((button) => {
    button.addEventListener("click", () => {
      setActiveView(button.dataset.view);
    });
  });
};

const syncUserUi = () => {
  const user = getActiveUser();
  const avatar = document.getElementById("user-switch");
  const planPill = document.getElementById("plan-pill");
  const planValue = document.getElementById("current-plan-value");
  const userLabel = document.getElementById("current-user-label");
  const usageLabel = document.getElementById("plan-usage-label");
  const ctaBtn = document.getElementById("plan-cta-btn");
  if (avatar) avatar.textContent = user.initials;
  if (planPill) {
    planPill.textContent = user.plan === "enterprise" ? "Enterprise" : "Pro";
    planPill.classList.toggle("locked", user.plan !== "enterprise");
  }
  if (planValue) {
    planValue.textContent = user.plan === "enterprise" ? "Enterprise" : "Pro";
  }
  if (userLabel) userLabel.textContent = user.name;
  if (usageLabel) usageLabel.textContent = user.usageLabel;
  if (ctaBtn) {
    ctaBtn.textContent =
      user.plan === "enterprise"
        ? "Enterprise plan active"
        : "Upgrade to Enterprise";
  }
  syncVisualizationLockState();
};

const applyStoredUser = () => {
  const storedUser = localStorage.getItem(userStorageKey);
  if (storedUser && users.some((user) => user.id === storedUser)) {
    activeUserId = storedUser;
  }
};

const switchUser = () => {
  const currentIdx = users.findIndex((user) => user.id === activeUserId);
  const nextIdx = (currentIdx + 1) % users.length;
  activeUserId = users[nextIdx].id;
  localStorage.setItem(userStorageKey, activeUserId);
  syncUserUi();
  initializeThoughtSpot(getCurrentTheme());
  rerenderActiveEmbedView();
};

const bindUserSwitch = () => {
  const userSwitchBtn = document.getElementById("user-switch");
  if (!userSwitchBtn) return;
  userSwitchBtn.addEventListener("click", switchUser);
};

const applyTheme = (theme) => {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem(themeStorageKey, theme);
};

const applyStoredTheme = () => {
  const preferredTheme = localStorage.getItem(themeStorageKey) || "light";
  applyTheme(preferredTheme);
};

const bindThemeToggle = () => {
  const toggleBtn = document.getElementById("theme-toggle");
  if (!toggleBtn) return;
  toggleBtn.addEventListener("click", () => {
    const currentTheme = getCurrentTheme();
    const nextTheme = currentTheme === "light" ? "dark" : "light";
    applyTheme(nextTheme);
    initializeThoughtSpot(nextTheme);
    rerenderActiveEmbedView();
  });
};

const bindPromptChips = () => {
  document.querySelectorAll("#spotter-prompts .chip").forEach((button) => {
    button.addEventListener("click", () => {
      const prompt = button.dataset.prompt;
      setActiveView("spotter");
      if (prompt) {
        renderSpotter(prompt);
      }
    });
  });
};

// Start the application.
window.onload = loadApp;
