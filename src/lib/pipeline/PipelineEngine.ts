import type { NodeInstance, Connection, NodeParameter } from '$lib/types'
import { getProcessingOrder } from './utils/getProcessingOrder'

export default class PipelineEngine {
	#nodes: NodeInstance[] = []
	#connections: Connection[] = []
	#processingOrder: NodeInstance[] = []
	#initialised: boolean = false
	#fps: number
	#isRunning: boolean = false
	#animationFrameId: number | null = null

	constructor(nodes: NodeInstance[], connections: Connection[], fps: number) {
		this.#nodes = nodes
		this.#connections = connections
		this.#processingOrder = getProcessingOrder(this.#nodes, this.#connections)
		this.#fps = fps
		this.#animationFrameId
	}

	/**
	 * Initialise all nodes in processing order.
	 */
	async #onRun(): Promise<void> {
		if (this.#initialised) return

		for (const node of this.#processingOrder) {
			await node.onRun()
		}

		this.#initialised = true
	}

	/**
	 * Process all nodes in order for a single frame.
	 */
	async #onFrame(): Promise<void> {
		if (!this.#initialised) {
			throw new Error('Pipeline not initialised')
		}

		for (const node of this.#processingOrder) {
			// Get result from node's onFrame method
			const result = await node.onFrame()

			// Find output connections from this node
			const outputConnections = this.#connections.filter(
				(connection) => connection.output.node.id === node.id
			)

			// Pass result to connected input ports
			for (const connection of outputConnections) {
				const inputNode = connection.input.node
				const inputParameter = inputNode.parameters.find(
					(parameter: NodeParameter) => parameter.id === connection.input.parameterId
				)
				if (inputParameter) {
					inputParameter.value = result
				}
			}
		}
	}

	async startSingleFrame(): Promise<void> {
		this.#isRunning = true
		await this.#onRun()
		await this.#onFrame()
		this.stop()
	}

	async start(): Promise<void> {
		this.#isRunning = true
		await this.#onRun()

		const frameInterval = 1000 / this.#fps
		let lastFrameTime = 0

		const frame = async (timestamp: number) => {
			if (!this.#isRunning) return

			if (timestamp - lastFrameTime >= frameInterval) {
				await this.#onFrame()
				lastFrameTime = timestamp
			}
			this.#animationFrameId = requestAnimationFrame(frame)
		}

		this.#animationFrameId = requestAnimationFrame(frame)
	}

	stop(): void {
		this.#isRunning = false
		if (this.#animationFrameId) {
			cancelAnimationFrame(this.#animationFrameId)
		}
		this.#initialised = false
	}

	get isRunning(): boolean {
		return this.#isRunning
	}
}
