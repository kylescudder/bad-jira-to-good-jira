// src/urlMapper.ts
// Prettier: printWidth 80

export const JIRA_ORIGIN = "https://mpro5jira.atlassian.net";
export const CLONE_ORIGIN = "https://jira.kylescudder.co.uk";

export function mapJiraToCloneUrl(input: string): string | null {
  let url: URL;

  try {
    url = new URL(input);
  } catch {
    return null;
  }

  if (url.origin !== JIRA_ORIGIN) {
    return null;
  }

  const cloneBase = new URL(CLONE_ORIGIN);
  url.protocol = cloneBase.protocol;
  url.host = cloneBase.host;

  // Option A: 1:1 origin swap (uncomment this and delete the browse mapping
  // below if your clone mirrors Jira paths exactly)
  //
  // return url.toString();

  // Option B: /browse/KEY-123 → /issues/KEY-123
  if (url.pathname.startsWith("/browse/")) {
    url.pathname = url.pathname.replace("/browse/", "/issues/");
  }

  return url.toString();
}
