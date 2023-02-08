import { derived, readable, writable } from '../lib/store'

export const count = writable(0)
export const double = derived(count, ($count) => $count * 2)

export const time = readable(0, (set) => {
	setInterval(() => set((value) => value + 1), 1000)
})
