import { useReducer } from 'react'

export type Subscriber<T> = (callback: (value: T) => any) => {
	unsubscribe: () => void
}

export interface Writable<T> {
	subscribe: Subscriber<T>
	set: (value: T) => void
	update: (callback: (value: T) => T) => void
	get: () => T
	$$type: 'writable'
}

export interface Readable<T> {
	subscribe: Subscriber<T>
	get: () => T
	$$type: 'readable'
}

export interface Derived<T> {
	subscribe: Subscriber<T>
	get: () => T
	$$type: 'derived'
}

const writable = <T>(value: T): Writable<T> => {
	const subscribers: ((value: T) => any)[] = []
	let currentState = value

	return {
		subscribe: (subscriber: (value: T) => any) => {
			subscribers.push(subscriber)

			console.log('subscribers', subscribers)

			return {
				unsubscribe: () => {
					const index = subscribers.indexOf(subscriber)
					subscribers.splice(index, 1)
				},
			}
		},
		set: (value: T) => {
			currentState = value
			subscribers.forEach((subscriber) => subscriber(currentState))
		},
		update: (updater: (value: T) => T) => {
			currentState = updater(currentState)
			subscribers.forEach((subscriber) => subscriber(currentState))
		},
		get: () => currentState,
		$$type: 'writable',
	}
}

const readable = <T>(value: T, initialSetter?: (set: (setter: (value: T) => T) => void) => any): Readable<T> => {
	const subscribers: ((value: T) => any)[] = []
	let currentState = value

	const set = (setter: (value: T) => T) => {
		currentState = setter(currentState)
		subscribers.forEach((subscriber) => subscriber(currentState))
	}

	if (initialSetter) initialSetter(set)

	return {
		subscribe: (subscriber: (value: T) => any) => {
			subscribers.push(subscriber)

			return {
				unsubscribe: () => {
					const index = subscribers.indexOf(subscriber)
					subscribers.splice(index, 1)
				},
			}
		},
		get: () => currentState,
		$$type: 'readable',
	}
}

const derived = <T>(store: Writable<T> | Readable<T>, setter: (value: T) => T): Derived<T> => {
	const subscribers: ((value: T) => any)[] = []
	let currentState = setter(store.get())

	const set = (value: T) => {
		currentState = value
		subscribers.forEach((subscriber) => subscriber(currentState))
	}

	store.subscribe((value) => set(setter(value)))

	return {
		subscribe: (subscriber: (value: T) => any) => {
			subscribers.push(subscriber)

			return {
				unsubscribe: () => {
					const index = subscribers.indexOf(subscriber)
					subscribers.splice(index, 1)
				},
			}
		},
		get: () => currentState,
		$$type: 'derived',
	}
}

function useStore<T>(store: Writable<T>): Writable<T>
function useStore<T>(store: Readable<T>): Readable<T>
function useStore<T>(store: Derived<T>): Derived<T>
function useStore<T>(store: Writable<T> | Readable<T> | Derived<T>): Writable<T> | Readable<T> | Derived<T> {
	const [currentState, forceUpdate] = useReducer((x) => x + 1, 0)

	if (currentState === 0) {
		// state is initial
		store.subscribe(forceUpdate)
	}

	return store
}

export { writable, readable, derived, useStore }
