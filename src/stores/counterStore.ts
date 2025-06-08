import { defineStore } from 'pinia';

interface CounterState {
  count: number;
  name: string;
}

export const useCounterStore = defineStore('counter', {
  state: (): CounterState => ({
    count: 0,
    name: 'My Counter',
  }),
  getters: {
    doubleCount: (state) => state.count * 2,
    nameWithCount: (state) => `${state.name}: ${state.count}`,
  },
  actions: {
    increment() {
      this.count++;
    },
    decrement() {
      this.count--;
    },
    reset() {
      this.count = 0;
    },
    setCount(newCount: number) {
      this.count = newCount;
    },
    setName(newName: string) {
      this.name = newName;
    },
  },
});
