import { connectionsStore, pipelineStore } from '$lib/svelte/stores/stores'
import type { NodeInstance, PortReference } from '$lib/types'

/**
 * Connections Store
 */
export function addConnection(output: PortReference, input: PortReference): void {
	connectionsStore.update((connections) => [...connections, { output, input }])
}

export function removeConnections(nodeId: number): void {
	connectionsStore.update((connections) =>
		connections.filter(
			(connection) => connection.output.node.id !== nodeId && connection.input.node.id !== nodeId
		)
	)
}

export function clearConnections(): void {
	connectionsStore.set([])
}

/**
 * Pipeline Store
 */
export function addToPipeline(node: NodeInstance): void {
	pipelineStore.update((nodes) => [...nodes, node])
}

export function removeFromPipeline(nodeId: number): void {
	pipelineStore.update((pipeline) => pipeline.filter((node) => node.id !== nodeId))
}

export function clearPipeline(): void {
	pipelineStore.set([])
}
