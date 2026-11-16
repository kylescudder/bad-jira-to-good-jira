# bad-jira-to-good-jira
Redirects Jira links to my much better version of Jira

## Testing

```sh
bun install --frozen-lockfile
bunx --no-install playwright install chromium
bun run test      # builds the bundles and checks the webRequest listener
bun run test:e2e  # loads the unpacked Chrome extension and follows real redirects
```

The end-to-end suite loads `manifest.json` and `rules.json` into Chromium and answers both
Jira hosts locally, so no real Jira is contacted. Pull requests run it in the **E2E tests** job.
