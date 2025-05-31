import type { ParameterDataType } from '../graph/Parameter'

export class IdGenerator {
	private static usedIds = new Set<string>()

	//~ PRIVATE METHODS
	private static hexFragment(length: number = 4): string {
		return Math.floor(Math.random() * (1 << (length * 4)))
			.toString(16)
			.padStart(length, '0')
	}

	//~ PUBLIC METHODS
	// Generade a node ID: node-1a2f
	public static generateNodeId(): string {
		let id: string
		do {
			id = `node-${this.hexFragment()}`
		} while (this.usedIds.has(id))

		this.usedIds.add(id)
		return id
	}

	// Generate an edge ID: edge-9d83
	public static generateEdgeId(): string {
		let id: string
		do {
			id = `edge-${this.hexFragment()}`
		} while (this.usedIds.has(id))

		this.usedIds.add(id)
		return id
	}

	// Generate a parameter ID: node-1a2f-3c9d
	public static generateParameterId(
		nodeId: string,
		direction: 'input' | 'output',
		dataType: ParameterDataType
	): string {
		const typeHexMap: Record<string, string> = {
			string: '0',
			boolean: '1',
			vector2: '2',
			number: '3',
			imageData: '4',
			array: '5',
		}

		const typeHex = typeHexMap[dataType] ?? 'f'
		const dirHex =
			direction === 'input'
				? (Math.floor(Math.random() * 8) * 2).toString(16) // Even
				: (Math.floor(Math.random() * 8) * 2 + 1).toString(16) // Odd

		let id: string
		do {
			const suffix = `${dirHex}${typeHex}${this.hexFragment(2)}`
			id = `${nodeId}-${suffix}`
		} while (this.usedIds.has(id))

		this.usedIds.add(id)
		return id
	}

	public static reset(): void {
		this.usedIds.clear()
	}
}
