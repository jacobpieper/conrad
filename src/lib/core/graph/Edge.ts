import { IdGenerator } from '../utils/IdGenerator'
import type { Parameter } from './Parameter'

export class Edge {
	public from: Parameter
	public to: Parameter
	public id: string = IdGenerator.generateEdgeId()

	constructor(from: Parameter, to: Parameter) {
		this.from = from
		this.to = to
	}
}
