import { useSyncExternalStore } from 'react'
import { Unsubscriber, Derived, Writable, Readable, Subscriber, Cleanup } from './types'

const createSubscription = <T>(subscribers: Subscriber<T>[], subscriber: Subscriber<T>, cleanup?: Cleanup) => {
	subscribers.push(subscriber)

	const unsubsciber: Unsubscriber = {
		unsubscribe: () => {
			const index = subscribers.indexOf(subscriber)
			subscribers.splice(index, 1)

			if (subscribers.length === 0) cleanup?.()
		},
	}

	return unsubsciber
}

const writable = <T>(value: T): Writable<T> => {
	const subscribers: Subscriber<T>[] = []
	let currentState = value

	return {
		subscribe: (subscriber: Subscriber<T>) => createSubscription(subscribers, subscriber),
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

const readable = <T>(value: T, initialSetter?: (set: (setter: (value: T) => T) => void) => Cleanup): Readable<T> => {
	const subscribers: ((value: T) => any)[] = []
	let currentState = value

	const set = (setter: (value: T) => T) => {
		currentState = setter(currentState)
		subscribers.forEach((subscriber) => subscriber(currentState))
	}

	const cleanup = initialSetter?.(set)

	return {
		subscribe: (subscriber: Subscriber<T>) => createSubscription(subscribers, subscriber, cleanup),
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
		subscribe: (subscriber: Subscriber<T>) => createSubscription(subscribers, subscriber),
		get: () => currentState,
		$$type: 'derived',
	}
}

function useStore<T>(store: Writable<T>): [T, (value: ((current: T) => T) | T) => void]
function useStore<T>(store: Readable<T>): T
function useStore<T>(store: Derived<T>): T
function useStore<T>(store: Writable<T> | Readable<T> | Derived<T>): [T, (value: T | ((current: T) => T)) => void] | T {
	const snapshot = useSyncExternalStore((onStoreChange) => () => store.subscribe(onStoreChange), store.get, store.get)

	if (store.$$type === 'readable' || store.$$type === 'derived') return snapshot

	const setter = (value: ((current: T) => T) | T) => {
		if (typeof value === 'function') {
			store.update(value as (current: T) => T)
		} else {
			store.set(value)
		}
	}

	return [snapshot, setter]
}

export { writable, readable, derived, useStore }
