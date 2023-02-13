# React store

## Store file

```ts
export const count = writable(0)
```

## Increment component file

```tsx
export default function Increment() {
  const [count, update] = useStore(counter)
  return <button onClick={() => update(val => val + 1)}>Increment</button>
}
```

## App component

On every click in `Increment` component, App components will automatically rerender count

```tsx
export default function App() {
  const [count, update] = useStore(counter)

  return (
    <div className="App">
      count: {count}
      <Increment />
    </div>
  )
}
```

### Readable

Can by modified only by setter function that is defined on init

On every second readable store will call subscribers

This store cannot be set or update outside the setter function scope

```ts
export const time = readable(0, (set) => {
  setInterval(() => set(value => value + 1), 1000)
})
```

Readable and Derived doesn't have the setter in `useStore`

```tsx
export default function App() {
  const seconds = useStore(timer)

  return (
    <div className="App">
      seconds from start: {seconds}s
    </div>
  )
}
```

### Writable

Can by modified whethever you want

This store can be updated in any part of application and changes will call subscribers

```ts
export const count = writable(0)
```

### Derived

Readable like store that is derived by another store

If `count` store will change, `double` store will change too and will call subscribers as well as `count`

```ts
export const count = writable(0)
export const double = derived(count, $count => $count * 2)
```

### Subscribe changes

```ts
export const count = writable(0)

count.subscribe(currentValue => console.log(currentValue))
```

### Update and set new value in writable

Both these operations will call subscribers

```ts
export const count = writable(0)

count.set(1) // set new value

count.update(currentValue => currentValue + 1) // update current value
```
