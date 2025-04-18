import { derived, writable } from 'svelte/store'

export const isEditMode = writable(false)

// Initialize based on current URL hash
if (typeof window !== 'undefined') {
	isEditMode.set(window.location.hash === '#edit')

	// Update when hash changes
	window.addEventListener('hashchange', () => {
		isEditMode.set(window.location.hash === '#edit')
	})
}
