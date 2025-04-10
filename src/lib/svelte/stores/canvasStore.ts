import type { CanvasObject } from '$lib/types'
import { writable } from 'svelte/store'

const canvasesStore = writable<CanvasObject[]>([])

export default canvasesStore
