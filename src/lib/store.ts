import { useSyncExternalStore } from 'react'

export interface Unsubscriber {
	unsubscribe: () => void
}

export type SubscriberCallback<T> = (value: T, unsubscriber: Unsubscriber) => any
export type Subscriber<T> = (callback: SubscriberCallback<T>) => Unsubscriber

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

const createSubscription = <T>(
	subscribers: ((value: T) => SubscriberCallback<T>)[],
	subscriber: SubscriberCallback<T>,
) => {
	const unsubsciber: Unsubscriber = {
		unsubscribe: () => {
			const index = subscribers.indexOf(subscriberContext)
			subscribers.splice(index, 1)
		},
	}

	function subscriberContext(value: T) {
		return subscriber(value, unsubsciber)
	}

	subscribers.push(subscriberContext)

	return unsubsciber
}

const writable = <T>(value: T): Writable<T> => {
	const subscribers: ((value: T) => SubscriberCallback<T>)[] = []
	let currentState = value

	return {
		subscribe: (subscriber: SubscriberCallback<T>) => createSubscription(subscribers, subscriber),
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
		subscribe: (subscriber: SubscriberCallback<T>) => createSubscription(subscribers, subscriber),
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
		subscribe: (subscriber: SubscriberCallback<T>) => createSubscription(subscribers, subscriber),
		get: () => currentState,
		$$type: 'derived',
	}
}

function useStore<T>(store: Writable<T>): [T, (value: ((current: T) => T) | T) => void]
function useStore<T>(store: Readable<T>): T
function useStore<T>(store: Derived<T>): T
function useStore<T>(store: Writable<T> | Readable<T> | Derived<T>): [T, (value: T | ((current: T) => T)) => void] | T {
	const snapshot = useSyncExternalStore(
		(onStoreChange) => () => {
			store.subscribe(onStoreChange)
		},
		store.get,
		store.get,
	)

	const setter = (value: ((current: T) => T) | T) => {
		if (typeof value === 'function') {
			;(store as Writable<T>).update(value as (current: T) => T)
		} else {
			;(store as Writable<T>).set(value)
		}
	}

	if (store.$$type === 'readable' || store.$$type === 'derived') return snapshot

	return [snapshot, setter]
}

export { writable, readable, derived, useStore }
