import getId from '$lib/utils/getId'
import type Parameter from './Parameter.svelte'

export class Connection {
	public from: Parameter
	public to: Parameter
	public id: number = getId()

	constructor(from: Parameter, to: Parameter) {
		this.from = from
		this.to = to
	}
}
