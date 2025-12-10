// Prettier: printWidth 80

import { mapJiraToCloneUrl, JIRA_ORIGIN } from "./urlMapper";

chrome.webRequest.onBeforeRequest.addListener(
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
