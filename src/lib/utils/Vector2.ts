export default class Vector2 {
	constructor(
		public x: number,
		public y: number
	) {
		this.x = x
		this.y = y
	}

	set(x: number, y: number): void {
		this.x = x
		this.y = y
	}

	add(vector2: Vector2): Vector2 {
		return new Vector2(this.x + vector2.x, this.y + vector2.y)
	}

	subtract(vector2: Vector2): Vector2 {
		return new Vector2(this.x - vector2.x, this.y - vector2.y)
	}
}
