/** Logic for embedding and controlling the application. */
import {
  init,
  Action,
  AppEmbed,
  AuthType,
  ConversationEmbed,
  LiveboardEmbed,
  Page,
  SearchEmbed,
  SpotterEmbed,
} from "https://unpkg.com/@thoughtspot/visual-embed-sdk/dist/tsembed.es.js";

// 1) - Set the tsURL to point to your ThoughtSpot instance.
// If you are using the free trial the URL will be like the following:
const tsURL = "https://team1.thoughtspot.cloud";

/** Initializes the application with ThoughtSpot. */
const loadApp = () => {
  init({
    thoughtSpotHost: tsURL,
    authType: AuthType.None,
    // customizations: {
    //   style: {
    //     customCSSUrl:
    //       "https://cdn.jsdelivr.net/gh/nrentz-ts/css/dark-theme.css", // location of your style sheet
    //   },
    // },
  });

  document.getElementById("embed").innerHTML =
    "<p>Select an option from above.</p>";
};

const onSearch = () => {
  // Instantiate SearchEmbed class
  const embed = new SearchEmbed("#embed", {
    frameParams: {},

    collapseDataSources: true,

    dataSource: "1741c144-67c5-4d8e-a03c-966e1aa7aacb",

    searchOptions: {
      searchTokenString: "[Win Rate] by [product type] [date]",
      executeSearch: true,
    },
    disabledActions: [Action.Download],
    disabledActionReason: "Permission required",
    hiddenActions: [Action.Share],
  });

  embed.render();

  console.log("searching");
};

const onSpotter = () => {
  const embed = new SpotterEmbed("#embed", {
    frameParams: {},
    worksheetId: "1741c144-67c5-4d8e-a03c-966e1aa7aacb",

    searchOptions: {
      searchQuery: "top selling products",
    },

    hideSourceSelection: true,
    disableSourceSelection: true,
  });

  embed.render();
};

const onLiveboard = () => {
  const embed = new LiveboardEmbed("#embed", {
    frameParams: {},
    // fullHeight: true,
    hideLiveboardHeader: true,
    isLiveboardCompactHeaderEnabled: true,
    hideIrrelevantChipsInLiveboardTabs: true,
    coverAndFilterOptionInPDF: true,
    isLiveboardMasterpiecesEnabled: true,
    isEnhancedFilterInteractivityEnabled: true,
    isCentralizedLiveboardFilterUXEnabled: true,
    liveboardId: "4186a3bb-5e32-48ff-9cd7-e0fcdaeab64a",
  });

  embed.render();
};

const onVisualization = () => {
  console.log("visualization clicked");
  const embed = new LiveboardEmbed("#embed", {
    frameParams: {},
    /*param-start-miscLiveboardFeatures*/
    isLiveboardMasterpiecesEnabled: true,
    /*param-end-miscLiveboardFeatures*/
    /*param-start-modifyActions*/ /*param-end-modifyActions*/
    /*param-start-liveboardId*/
    liveboardId: "4186a3bb-5e32-48ff-9cd7-e0fcdaeab64a",
    /*param-end-liveboardId*/
    /*param-start-personalizedViewId*/ /*param-end-personalizedViewId*/
    /*param-start-vizId*/
    vizId: "492eed8c-b36c-466f-87a6-b78d240d818a",
    /*param-end-vizId*/
    /*param-start-runtimeFiltersAndParameters*/ /*param-end-runtimeFiltersAndParameters*/
    /*param-start-exposeTranslationIds*/ /*param-end-exposeTranslationIds*/
    /*param-start-codeBasedCustomActions*/ /*param-end-codeBasedCustomActions*/
  });
  embed.render();
};

const onApplication = () => {
  console.log("application clicked");
  const embed = new AppEmbed("#embed", {
    frameParams: {},
    /*param-start-customizeAppNavigation*/
    /* Default navigation settings - using new V3 experience */
    // discoveryExperience: {
    //   primaryNavbarVersion: PrimaryNavbarVersion.Sliding,
    //   homePage: HomePage.ModularWithStylingChanges,
    // },
    /*param-end-customizeAppNavigation*/
    /*param-start-customizeHomePageModules*/ /*param-end-customizeHomePageModules*/
    /*param-start-navigateToUrl*/ /*param-end-navigateToUrl*/
    /*param-start-miscLiveboardFeatures*/
    isLiveboardCompactHeaderEnabled: true,
    hideIrrelevantChipsInLiveboardTabs: true,
    coverAndFilterOptionInPDF: true,
    isLiveboardMasterpiecesEnabled: true,
    isEnhancedFilterInteractivityEnabled: true,
    isCentralizedLiveboardFilterUXEnabled: true,
    /*param-end-miscLiveboardFeatures*/
    /*param-start-pageId*/
    pageId: Page.Home,
    /*param-end-pageId*/
    /*param-start-runtimeFiltersAndParameters*/ /*param-end-runtimeFiltersAndParameters*/
    /*param-start-modifyActions*/ /*param-end-modifyActions*/
    /*param-start-exposeTranslationIds*/ /*param-end-exposeTranslationIds*/
    /*param-start-codeBasedCustomActions*/ /*param-end-codeBasedCustomActions*/
  });

  embed.render();
};

// ===============================================================================================
// Events for nav bar.  As you add functionality, you'll need to connect the UI to functions.
// Copy the following and change the id to the ID from the HTML document and the handler to be the function to call.
// document.getElementById('element-id').addEventListener('click', eventHandler);

document.getElementById("search-link").addEventListener("click", onSearch);
document.getElementById("spotter-link").addEventListener("click", onSpotter);
document
  .getElementById("Liveboard-link")
  .addEventListener("click", onLiveboard);

document
  .getElementById("liveboard-viz-link")
  .addEventListener("click", onVisualization);

document
  .getElementById("full-app-link")
  .addEventListener("click", onApplication);

// ===============================================================================================
// You shouldn't need to modify code below this point.
// ===============================================================================================

// Start the application.
window.onload = loadApp;
