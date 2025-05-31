import { IdGenerator } from '$lib/core/utils/IdGenerator'
import { Parameter, type ParameterConfig } from '../Parameter'

export type NodeType = 'Node' | 'ImageCacheNode' | 'RenderNode'

export class Node {
	public type: NodeType = 'Node'
	public name: string = 'Node'
	public id: string = IdGenerator.generateNodeId()
	public parameters: Parameter[] = []

	//~ BASE METHODS
	public async onInit(): Promise<void> {}

	public async onRun(): Promise<void> {}

	public async onFrame(): Promise<any> {}

	//~ PUBLIC METHODS
	public getParameter(name: string): Parameter {
		const parameter = this.parameters.find((param: Parameter) => param.name === name)
		if (!parameter) {
			throw new Error(`Parameter with name "${name}" not found`)
		}
		return parameter
	}

	public setParameter(id: string, value: any): void {
		const parameter = this.getParameter(id)
		parameter.value = value
	}

	public createParameter(config: ParameterConfig): void {
		const parameter = new Parameter(config, this.id)
		this.parameters.push(parameter)
	}
}
