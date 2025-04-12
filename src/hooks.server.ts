import type { Handle } from '@sveltejs/kit'

export const handle: Handle = async ({ event, resolve }) => {
	const env = process.env.VERCEL_ENV ?? 'development' // fallback for local dev
	event.locals.showBanner = env !== 'production'
	return resolve(event)
}
