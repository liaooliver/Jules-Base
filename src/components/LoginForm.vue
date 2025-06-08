<script setup lang="ts">
import { useForm, Field, ErrorMessage } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { loginSchema, type LoginFormInputs } from '@/schemas/validationSchemas'; // Assuming @ alias is set

// Use the Zod schema with VeeValidate
const { handleSubmit, errors, isSubmitting, values, setFieldValue } = useForm<LoginFormInputs>({
  validationSchema: toTypedSchema(loginSchema),
  initialValues: {
    username: '',
    password: '',
    rememberMe: false,
  },
});

const onSubmit = handleSubmit(async (formValues: LoginFormInputs) => {
  console.log('Form submitted with:', formValues);
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));
  alert(`Login successful for ${formValues.username} (Remember me: ${formValues.rememberMe})`);
  // In a real app, you would make an API call here
  // e.g., await authStore.login(formValues);
});

// For demonstration: Log errors and values when they change
// watch(errors, (newErrors) => console.log('Validation Errors:', newErrors));
// watch(values, (newValues) => console.log('Form Values:', newValues));
</script>

<template>
  <div class="login-form-container">
    <h2>Login Form (VeeValidate + Zod)</h2>
    <form class="form" @submit="onSubmit">
      <div class="form-group">
        <label for="username">Username (Email)</label>
        <Field
          id="username"
          name="username"
          type="email"
          class="form-control"
          placeholder="user@example.com"
        />
        <ErrorMessage name="username" class="error-message" />
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <Field
          id="password"
          name="password"
          type="password"
          class="form-control"
          placeholder="******"
        />
        <ErrorMessage name="password" class="error-message" />
      </div>

      <div class="form-group form-check">
        <Field id="rememberMe" name="rememberMe" type="checkbox" class="form-check-input" />
        <label for="rememberMe" class="form-check-label">Remember me</label>
      </div>
      <ErrorMessage name="rememberMe" class="error-message" />

      <button type="submit" class="submit-button" :disabled="isSubmitting">
        {{ isSubmitting ? 'Logging in...' : 'Login' }}
      </button>

      <div v-if="Object.keys(errors).length > 0 && !isSubmitting" class="form-summary-errors">
        Please correct the highlighted errors.
      </div>
    </form>
    <div class="form-values-display">
      <h3>Current Form Values (Live):</h3>
      <pre>{{ values }}</pre>
    </div>
  </div>
</template>

<style scoped>
.login-form-container {
  font-family: sans-serif;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-top: 20px;
  max-width: 400px;
}
.form-group {
  margin-bottom: 15px;
}
.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}
.form-control {
  width: calc(100% - 20px);
  padding: 8px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}
.form-check {
  display: flex;
  align-items: center;
}
.form-check-input {
  margin-right: 8px;
  width: auto; /* Override default width for checkbox */
}
.form-check-label {
  font-weight: normal;
  margin-bottom: 0;
}
.error-message {
  color: red;
  font-size: 0.875em;
  margin-top: 3px;
  display: block;
}
.submit-button {
  padding: 10px 15px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}
.submit-button:disabled {
  background-color: #aaa;
}
.form-summary-errors {
  margin-top: 15px;
  color: red;
  font-weight: bold;
}
.form-values-display {
  margin-top: 20px;
  padding: 10px;
  background-color: #f0f0f0;
  border-radius: 4px;
  font-size: 0.9em;
}
.form-values-display h3 {
  margin-top: 0;
  font-size: 1.1em;
}
pre {
  white-space: pre-wrap; /* CSS3 */
  white-space: -moz-pre-wrap; /* Mozilla, since 1999 */
  white-space: -pre-wrap; /* Opera 4-6 */
  white-space: -o-pre-wrap; /* Opera 7 */
  word-wrap: break-word; /* Internet Explorer 5.5+ */
}
</style>
