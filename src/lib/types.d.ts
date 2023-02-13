export interface Unsubscriber {
	unsubscribe: () => void
}

export type Subscriber<T> = (value: T) => void
export type Cleanup = () => void

export interface Writable<T> {
	subscribe: (subscriber: Subscriber<T>) => Unsubscriber
	set: (value: T) => void
	update: (callback: (value: T) => T) => void
	get: () => T
	$$type: 'writable'
}

export interface Readable<T> {
	subscribe: (subscriber: Subscriber<T>) => Unsubscriber
	get: () => T
	$$type: 'readable'
}

export interface Derived<T> {
	subscribe: (subscriber: Subscriber<T>) => Unsubscriber
	get: () => T
	$$type: 'derived'
}
