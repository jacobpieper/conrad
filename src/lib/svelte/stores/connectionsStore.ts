import { writable } from 'svelte/store'
import type { Connection } from '$lib/types'
import Vector2 from '$lib/utils/Vector2'

export const connectionsStore = writable<Connection[]>([])
export const containerOffsetStore = writable<Vector2>(new Vector2(0, 0))
