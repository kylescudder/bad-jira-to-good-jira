// Prettier: printWidth 80

import { mapJiraToCloneUrl, JIRA_ORIGIN } from "./urlMapper";

// Firefox exposes the `browser` namespace; this simple declaration
// keeps TypeScript happy without extra type packages.
/* eslint-disable @typescript-eslint/no-unused-vars */
declare const browser: typeof chrome;

browser.webRequest.onBeforeRequest.addListener(
  (details) => {
    const mapped = mapJiraToCloneUrl(details.url);
    if (!mapped) {
      return {};
    }

    return { redirectUrl: mapped };
  },
  {
    urls: [`${JIRA_ORIGIN}/*`]
  },
  ["blocking"]
);
