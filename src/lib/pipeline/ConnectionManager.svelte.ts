import { Connection } from './Connection.svelte'
import type { GraphManager } from './GraphManager.svelte'
import type Parameter from './Parameter.svelte'

export class ConnectionManager {
	public selectedOutput: Parameter | null = $state(null)
	private graph: GraphManager

	constructor(graphManager: GraphManager) {
		this.graph = graphManager
	}

	public setOutput(parameter: Parameter): void {
		if (parameter.role !== 'output') throw new Error('The provided parameter is not an output.')

		this.selectedOutput = parameter
	}

	public setInput(parameter: Parameter): void {
		if (parameter.role !== 'input') throw new Error('The provided parameter is not an input.')

		if (!this.selectedOutput) return

		if (parameter.type !== this.selectedOutput.type) return

		const connection = new Connection(this.selectedOutput, parameter)
		this.graph.addConnection(connection)

		this.selectedOutput = null
	}
}
