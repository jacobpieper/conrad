import { writable } from 'svelte/store'
import type { CanvasObject, Connection, NodeInstance } from '$lib/-types'
import Vector2 from '$lib/utils/Vector2'

export const canvasesStore = writable<CanvasObject[]>([])

export const connectionsStore = writable<Connection[]>([])

export const pipelineStore = writable<NodeInstance[]>([])

export const containerOffsetStore = writable<Vector2>(new Vector2(0, 0))
