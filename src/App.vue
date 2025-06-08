<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue';
import { useCounterStore } from './stores/counterStore';
import UserList from './components/UserList.vue';
import LoginForm from './components/LoginForm.vue';

const counterStore = useCounterStore();
</script>

<template>
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <HelloWorld :msg="`Vite + Vue + Pinia (${counterStore.name})`" />

  <h2>Pinia Counter</h2>
  <p>Count: {{ counterStore.count }}</p>
  <p>Double Count: {{ counterStore.doubleCount }}</p>
  <p>Name with Count: {{ counterStore.nameWithCount }}</p>
  <button @click="counterStore.increment()">Increment</button>
  <button @click="counterStore.decrement()">Decrement</button>
  <button @click="counterStore.reset()">Reset</button>
  <button @click="counterStore.setCount(10)">Set to 10</button>
  <button @click="counterStore.setName('Awesome Counter')">Change Name</button>

  <UserList />

  <LoginForm />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
