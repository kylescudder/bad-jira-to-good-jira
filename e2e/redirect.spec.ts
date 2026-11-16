import { test, expect, chromium, type BrowserContext } from '@playwright/test'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'

// Loads the unpacked Chrome (MV3) extension exactly as shipped: manifest.json + rules.json.
const extensionPath = resolve(__dirname, '..')
let context: BrowserContext
let profile: string

test.beforeAll(async () => {
  profile = mkdtempSync(join(tmpdir(), 'bad-jira-e2e-'))
  context = await chromium.launchPersistentContext(profile, {
    channel: 'chromium',
    args: [`--disable-extensions-except=${extensionPath}`, `--load-extension=${extensionPath}`],
  })
  // Neither Jira host is contacted: the clone answers with the URL it was asked for.
  await context.route('https://jira.kylescudder.co.uk/**', (route) =>
    route.fulfill({ contentType: 'text/html', body: `<h1 id="landed">${route.request().url()}</h1>` }),
  )
  await context.route('https://mpro5jira.atlassian.net/**', (route) =>
    route.fulfill({ contentType: 'text/html', body: '<h1 id="landed">original Jira</h1>' }),
  )
})

test.afterAll(async () => {
  await context?.close()
  rmSync(profile, { recursive: true, force: true })
})

test('opening a Jira issue link lands on the same issue in the clone', async () => {
  const page = await context.newPage()
  await page.goto('https://mpro5jira.atlassian.net/browse/PROJ-123')
  await expect(page).toHaveURL('https://jira.kylescudder.co.uk/issues/PROJ-123')
  await expect(page.locator('#landed')).toHaveText('https://jira.kylescudder.co.uk/issues/PROJ-123')
})

test('the issue query string and fragment survive the redirect', async () => {
  const page = await context.newPage()
  await page.goto('https://mpro5jira.atlassian.net/browse/OPS-7?focusedCommentId=42')
  await expect(page).toHaveURL('https://jira.kylescudder.co.uk/issues/OPS-7?focusedCommentId=42')
})

test('Jira pages other than issues are left alone', async () => {
  const page = await context.newPage()
  await page.goto('https://mpro5jira.atlassian.net/jira/your-work')
  await expect(page).toHaveURL('https://mpro5jira.atlassian.net/jira/your-work')
  await expect(page.locator('#landed')).toHaveText('original Jira')
})
