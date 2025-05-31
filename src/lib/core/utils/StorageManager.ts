export enum StorageType {
	LOCAL = 'local',
	SESSION = 'session',
}

export class StorageManager {
	private storage: Storage

	constructor(type: StorageType = StorageType.LOCAL) {
		this.storage = type === StorageType.LOCAL ? window.localStorage : window.sessionStorage
	}

	public save(key: string, data: string): void {
		try {
			this.storage.setItem(key, data)
		} catch (error) {
			console.error('Error saving data to storage:', error)
		}
	}

	public load(key: string): string | null {
		try {
			const data = this.storage.getItem(key)
			return data
		} catch (error) {
			console.error('Error loading data form storage:', error)
			return null
		}
	}

	public has(key: string): boolean {
		return this.storage.getItem(key) !== null
	}

	public remove(key: string): void {
		try {
			this.storage.removeItem(key)
		} catch (error) {
			console.error('Error removing data form storage:', error)
		}
	}

	public clear(): void {
		try {
			this.storage.clear()
		} catch (error) {
			console.error('Error clearing storage:', error)
		}
	}

	public getKeys(): string[] {
		const keys: string[] = []
		for (let i = 0; i < this.storage.length; i++) {
			const key = this.storage.key(i)
			if (key !== null) {
				keys.push(key)
			}
		}
		return keys
	}

	public getSize(): number {
		let totalSize = 0
		for (let i = 0; i < this.storage.length; i++) {
			const key = this.storage.key(i)
			if (key !== null) {
				const value = this.storage.getItem(key) || ''
				totalSize += key.length + value.length
			}
		}
		return totalSize * 2 // Approximate UTF-16 encoding (2 bytes per character)
	}
}
