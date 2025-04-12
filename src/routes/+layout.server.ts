import type { LayoutServerLoad } from './$types.js'
/**
 * Disables server side rendering
 */
export const ssr = false

/**
 * Checks if preview build
 */
export const load: LayoutServerLoad = async ({ locals }) => {
	return {
		showBanner: locals.showBanner,
		previewLabel: locals.previewLabel,
	}
}
