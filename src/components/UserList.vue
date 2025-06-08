<script setup lang="ts">
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import apiClient from '@/utils/http'; // Assuming http.ts is in src/utils
import { ref } from 'vue';

// --- Types ---
interface User {
  id: number;
  name: string;
  email: string;
}

interface NewUser {
  name: string;
  email: string;
}

// --- Mock API calls ---
// Simulate fetching users (replace with actual API call if available)
const fetchUsers = async (): Promise<User[]> => {
  console.log('Fetching users...');
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
  // In a real app, this would be:
  // const response = await apiClient.get<User[]>('/users');
  // return response.data;

  // Mock data for demonstration
  const mockUsers: User[] = [
    { id: 1, name: 'Alice Wonderland', email: 'alice@example.com' },
    { id: 2, name: 'Bob The Builder', email: 'bob@example.com' },
    { id: 3, name: 'Charlie Brown', email: 'charlie@example.com' },
  ];
  // Simulate finding no users sometimes
  // if (Math.random() > 0.7) return [];
  return mockUsers;
};

// Simulate adding a user (replace with actual API call)
const addUser = async (newUser: NewUser): Promise<User> => {
  console.log('Adding user:', newUser);
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
  // In a real app, this would be:
  // const response = await apiClient.post<User>('/users', newUser);
  // return response.data;

  // Mock response for demonstration
  const createdUser: User = { ...newUser, id: Date.now() };
  return createdUser;
};

// --- Vue Query ---
const queryClient = useQueryClient();

// Query for fetching users
const {
  data: users,
  isLoading,
  isError,
  error,
  refetch,
} = useQuery<User[], Error>({
  queryKey: ['users'],
  queryFn: fetchUsers,
  // staleTime: 1000 * 60 * 1 // 1 minute, can override default
});

// Mutation for adding a user
const {
  mutate: createUser,
  isPending: isCreatingUser,
  isError: isCreateUserError,
  error: createUserError,
} = useMutation<User, Error, NewUser>({
  mutationFn: addUser,
  onSuccess: (newUser) => {
    console.log('User added successfully:', newUser);
    // Invalidate and refetch the 'users' query to update the list
    queryClient.invalidateQueries({ queryKey: ['users'] });
    // Optionally, you can optimistically update the list here
    // queryClient.setQueryData(['users'], (oldData: User[] | undefined) => oldData ? [...oldData, newUser] : [newUser]);

    // Clear form fields
    newUserName.value = '';
    newUserEmail.value = '';
  },
  onError: (err) => {
    console.error('Error adding user:', err.message);
  },
});

// --- Form state for adding a new user ---
const newUserName = ref('');
const newUserEmail = ref('');

const handleAddUser = () => {
  if (!newUserName.value || !newUserEmail.value) {
    alert('Please enter name and email for the new user.');
    return;
  }
  createUser({ name: newUserName.value, email: newUserEmail.value });
};
</script>

<template>
  <div class="user-list-container">
    <h2>User List (Vue Query)</h2>

    <div v-if="isLoading" class="loading">Loading users...</div>
    <div v-if="isError" class="error-message">Error fetching users: {{ error?.message }}</div>

    <ul v-if="users && users.length > 0">
      <li v-for="user in users" :key="user.id" class="user-item">
        <strong>{{ user.name }}</strong> ({{ user.email }})
      </li>
    </ul>
    <div v-if="users && users.length === 0 && !isLoading" class="no-users">No users found.</div>

    <button :disabled="isLoading" class="refetch-button" @click="() => refetch()">
      Refetch Users
    </button>

    <div class="add-user-form">
      <h3>Add New User</h3>
      <input v-model="newUserName" type="text" placeholder="Name" :disabled="isCreatingUser" />
      <input v-model="newUserEmail" type="email" placeholder="Email" :disabled="isCreatingUser" />
      <button :disabled="isCreatingUser" @click="handleAddUser">
        {{ isCreatingUser ? 'Adding...' : 'Add User' }}
      </button>
      <div v-if="isCreateUserError" class="error-message">
        Error adding user: {{ createUserError?.message }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.user-list-container {
  font-family: sans-serif;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-top: 20px;
}
.loading,
.no-users {
  color: #888;
  font-style: italic;
}
.error-message {
  color: red;
  margin-top: 10px;
}
.user-item {
  background-color: #f9f9f9;
  border: 1px solid #eee;
  padding: 8px;
  margin-bottom: 5px;
  border-radius: 4px;
}
.refetch-button,
.add-user-form button {
  margin-top: 10px;
  padding: 8px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.refetch-button:disabled,
.add-user-form button:disabled {
  background-color: #aaa;
}
.add-user-form {
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid #eee;
}
.add-user-form input {
  display: block;
  width: calc(100% - 16px);
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>
