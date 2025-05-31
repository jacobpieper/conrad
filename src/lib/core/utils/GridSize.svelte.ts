import Vector2 from '$lib/utils/Vector2'

export class GridSize {
	private static instance: GridSize

	private _size: number = 24
	private _scale: number = $state(1)
	private _pan: Vector2 = $state(new Vector2(0, 0))

	private constructor() {}

	public static getInstance(): GridSize {
		if (!GridSize.instance) {
			GridSize.instance = new GridSize()
		}
		return GridSize.instance
	}

	public get size(): number {
		return this._size
	}

	public set size(value: number) {
		this._size = value
	}

	public get scale(): number {
		return this._scale
	}

	public set scale(value: number) {
		this._scale = value
	}

	public get pan(): Vector2 {
		return this._pan
	}

	public set pan(value: Vector2) {
		this._pan = value
	}

	public get scaledSize(): number {
		return this._size * this._scale
	}

	public toScreen(worldPosisition: Vector2): Vector2 {
		return new Vector2(
			worldPosisition.x * this._scale + this._pan.x,
			worldPosisition.y * this._scale + this._pan.y
		)
	}

	public toWorld(screenPos: Vector2): Vector2 {
		return new Vector2(
			(screenPos.x - this._pan.x) / this._scale,
			(screenPos.y - this._pan.y) / this._scale
		)
	}
}
