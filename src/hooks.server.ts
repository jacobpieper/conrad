import type { Handle } from '@sveltejs/kit'
import { readFileSync } from 'fs'

export const handle: Handle = async ({ event, resolve }) => {
	const env = process.env.VERCEL_ENV ?? 'development' // fallback for local dev

	let showBanner = false
	let previewLabel: string | null = null

	if (env === 'development') {
		showBanner = true
		previewLabel = 'development'
	} else if (env === 'preview') {
		showBanner = true
		previewLabel = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? 'unknown'
	}

	event.locals.showBanner = showBanner
	event.locals.previewLabel = previewLabel

	return resolve(event)
}
