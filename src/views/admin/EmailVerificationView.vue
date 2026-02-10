<template>
  <div class="email-verification-container">
    <h2>Email Verification Management</h2>

    <div v-if="loading" class="status">Loading users...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    <div v-else-if="users.length === 0" class="status">No users found.</div>
    <table v-else class="users-table">
      <thead>
        <tr>
          <th>Email</th>
          <th>Name</th>
          <th>Role</th>
          <th>Email Verified</th>
          <th>Created At</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.email }}</td>
          <td>{{ user.name || 'N/A' }}</td>
          <td>
            <span class="role-badge" :class="user.role">{{ formatRole(user.role) }}</span>
          </td>
          <td>
            <span class="status-pill" :class="user.emailVerified ? 'verified' : 'unverified'">
              {{ user.emailVerified ? 'Verified' : 'Unverified' }}
            </span>
          </td>
          <td>{{ formatDate(user.createdAt) }}</td>
          <td>
            <button
              v-if="!user.emailVerified"
              type="button"
              class="action-button verify"
              :disabled="isProcessing(user.id)"
              @click="verifyEmail(user.id)"
            >
              {{ isProcessing(user.id) ? 'Verifying...' : 'Verify Email' }}
            </button>
            <span v-else class="verified-text">Already Verified</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { adminService, type User } from '@/services/admin.service';
import { getErrorMessage } from '@/utils/errorMessages';

const users = ref<User[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const processingIds = ref<Set<string>>(new Set());

function formatRole(role: string) {
  const roleMap: Record<string, string> = {
    fighter: 'Fighter',
    plo: 'Promotion League Owner',
    spectator: 'Spectator',
  };
  return roleMap[role] || role;
}

function formatDate(dateString: string | null) {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString();
}

function isProcessing(userId: string): boolean {
  return processingIds.value.has(userId);
}

async function loadUsers() {
  loading.value = true;
  error.value = null;
  try {
    users.value = await adminService.getUsers();
  } catch (err: any) {
    error.value = getErrorMessage(err.error, 'load users');
  } finally {
    loading.value = false;
  }
}

async function verifyEmail(userId: string) {
  processingIds.value.add(userId);
  try {
    await adminService.verifyUserEmail(userId);
    await loadUsers();
  } catch (err: any) {
    alert(getErrorMessage(err.error, 'verify the email'));
  } finally {
    processingIds.value.delete(userId);
  }
}

onMounted(() => {
  loadUsers();
});
</script>

<style scoped>
.email-verification-container {
  padding: 20px;
  padding-left: 30px;
  padding-top: 20px;
  max-width: 100%;
  box-sizing: border-box;
}

.email-verification-container h2 {
  color: white;
  font-size: 28px;
  margin-bottom: 20px;
}

.status {
  color: white;
  font-size: 16px;
  margin-bottom: 15px;
}

.error-message {
  color: #ff6b6b;
  font-size: 16px;
  margin-bottom: 15px;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  border-radius: 4px;
  overflow: hidden;
}

.users-table thead {
  background-color: #f8f9fa;
}

.users-table th {
  padding: 12px;
  text-align: left;
  font-weight: bold;
  color: #333;
  border-bottom: 2px solid #dee2e6;
}

.users-table td {
  padding: 12px;
  border-bottom: 1px solid #dee2e6;
  color: #666;
}

.users-table tbody tr:hover {
  background-color: #f8f9fa;
}

.role-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  text-transform: capitalize;
}

.role-badge.fighter {
  background-color: #e3f2fd;
  color: #1976d2;
}

.role-badge.plo {
  background-color: #fff3e0;
  color: #f57c00;
}

.role-badge.spectator {
  background-color: #f3e5f5;
  color: #7b1fa2;
}

.status-pill {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
}

.status-pill.verified {
  background-color: #28a745;
  color: white;
}

.status-pill.unverified {
  background-color: #ffc107;
  color: #212529;
}

.action-button {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
}

.action-button.verify {
  background-color: #007bff;
  color: white;
}

.action-button.verify:hover:not(:disabled) {
  background-color: #0056b3;
}

.action-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.verified-text {
  color: #28a745;
  font-weight: 500;
  font-size: 14px;
}
</style>

