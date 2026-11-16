import { expect, test } from 'bun:test'
import { readFileSync } from 'node:fs'
import { runInNewContext } from 'node:vm'

test('the bundled webRequest listener redirects Jira issues and ignores other origins', () => {
  let listener: (details: { url: string }) => { redirectUrl?: string }
  const listeners: unknown[] = []
  runInNewContext(readFileSync('dist/background.chrome.js', 'utf8'), {
    URL,
    chrome: { webRequest: { onBeforeRequest: { addListener: (callback: typeof listener, filter: unknown, extra: unknown) => {
      listener = callback
      listeners.push(filter, extra)
    } } } }
  })
  expect(listeners).toEqual([{ urls: ['https://mpro5jira.atlassian.net/*'] }, ['blocking']])
  expect(listener!({ url: 'https://mpro5jira.atlassian.net/browse/PROJ-123?x=1#comment' })).toEqual({ redirectUrl: 'https://jira.kylescudder.co.uk/issues/PROJ-123?x=1#comment' })
  expect(listener!({ url: 'https://unrelated.invalid/browse/PROJ-123' })).toEqual({})
  expect(listener!({ url: 'not a URL' })).toEqual({})
})
