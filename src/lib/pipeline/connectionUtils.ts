import { connectionsStore } from '$lib/svelte/stores/stores'
import type { PortReference } from '$lib/types'

export function removeConnections(nodeId: number): void {
	connectionsStore.update((connections) =>
		connections.filter(
			(connection) => connection.output.node.id !== nodeId && connection.input.node.id !== nodeId
		)
	)
}

export function addConnection(output: PortReference, input: PortReference): void {
	connectionsStore.update((connections) => [...connections, { output, input }])
}

export function clearConnections(): void {
	connectionsStore.set([])
}
