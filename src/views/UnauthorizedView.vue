<template>
  <div class="unauthorized-container">
    <h1>Unauthorized Access</h1>
    <p>You do not have permission to view this page.</p>
    <router-link to="/login">Go to Login</router-link>
  </div>
</template>

<script setup lang="ts">
// No script setup needed for this simple component
</script>

<style scoped>
.unauthorized-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
  background-color: #f8d7da; /* Light red for warning */
  color: #721c24; /* Dark red text */
  padding: 20px;
  box-sizing: border-box;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #721c24;
}

p {
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
}

a {
  color: #007bff;
  text-decoration: none;
  font-weight: bold;
}

a:hover {
  text-decoration: underline;
}
</style>
