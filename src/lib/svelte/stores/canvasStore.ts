import type { CanvasObject } from '$lib/types'
import { writable } from 'svelte/store'

export const canvasesStore = writable<CanvasObject[]>([])
