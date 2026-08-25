import { createClient } from '@blinkdotnew/sdk'

export const blink = createClient({
  projectId: import.meta.env.VITE_BLINK_PROJECT_ID || 'mcu-events-platform-ev7w3txl',
  publishableKey: import.meta.env.VITE_BLINK_PUBLISHABLE_KEY || 'blnk_pk_2lz3cePnG6nfM9G4Kmuh77Q4gLf1uKCJ',
  authRequired: false,
  auth: { mode: 'managed' },
})
