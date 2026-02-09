<template>
  <div class="categories-container">
    <h1 class="categories-title">Event Categories</h1>
    <button v-if="!showForm" @click="showForm = true" class="add-btn">Add Category</button>
    <div v-if="loading" class="status-message">Loading categories...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    <form v-if="showForm" @submit.prevent="handleSubmit" class="category-form">
      <div class="form-group">
        <label for="name">Name *</label>
        <input id="name" v-model="form.name" type="text" required :disabled="submitting" />
      </div>
      <div class="form-group">
        <label for="description">Description</label>
        <textarea id="description" v-model="form.description" :disabled="submitting"></textarea>
      </div>
      <div class="form-actions">
        <button type="submit" :disabled="submitting" class="submit-btn">Submit</button>
        <button type="button" @click="cancelForm" :disabled="submitting" class="cancel-btn">Cancel</button>
      </div>
    </form>
    <div v-if="categories.length === 0 && !showForm" class="status-message">No categories found</div>
    <ul v-else class="categories-list">
      <li v-for="category in categories" :key="category.id" class="category-item">
        <div class="category-header">
          <strong>{{ category.name }}</strong>
          <button
            type="button"
            class="delete-btn"
            :disabled="isProcessing(category.id)"
            @click="deleteCategory(category.id)"
          >
            Delete
          </button>
        </div>
        <div v-if="category.description" class="category-description">{{ category.description }}</div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { eventCategoriesService } from '@/services/event-categories.service';
import { getErrorMessage } from '@/utils/errorMessages';
import type { EventCategory, CreateEventCategoryRequest } from '@/types';

const categories = ref<EventCategory[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const showForm = ref(false);
const submitting = ref(false);
const processingId = ref<string | null>(null);

const form = ref<CreateEventCategoryRequest>({
  name: '',
  description: null,
});

function isProcessing(id: string) {
  return processingId.value === id;
}

function cancelForm() {
  showForm.value = false;
  form.value = {
    name: '',
    description: null,
  };
}

async function handleSubmit() {
  submitting.value = true;
  error.value = null;
  try {
    await eventCategoriesService.create(form.value);
    cancelForm();
    await loadCategories();
  } catch (err: any) {
    error.value = getErrorMessage(err.error, 'create the category');
  } finally {
    submitting.value = false;
  }
}

async function deleteCategory(id: string) {
  if (!confirm('Are you sure you want to delete this category?')) return;
  processingId.value = id;
  error.value = null;
  try {
    await eventCategoriesService.delete(id);
    await loadCategories();
  } catch (err: any) {
    error.value = getErrorMessage(err.error, 'delete the category');
  } finally {
    processingId.value = null;
  }
}

async function loadCategories() {
  loading.value = true;
  error.value = null;
  try {
    categories.value = await eventCategoriesService.getAll();
  } catch (err: any) {
    error.value = getErrorMessage(err.error, 'load categories');
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadCategories();
});
</script>

<style scoped>
.categories-container {
  padding: 20px;
  max-width: 100%;
  box-sizing: border-box;
}

.categories-title {
  font-size: 28px;
  margin-bottom: 20px;
  color: #1f2937;
}

.add-btn {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 20px;
}

.add-btn:hover {
  background-color: #0056b3;
}

.status-message {
  font-size: 16px;
  margin-bottom: 15px;
  color: #6c757d;
}

.error-message {
  color: #dc3545;
  font-size: 16px;
  margin-bottom: 15px;
  padding: 10px;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
}

.category-form {
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f9f9f9;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #333;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

.form-group textarea {
  min-height: 80px;
  resize: vertical;
}

.form-actions {
  display: flex;
  gap: 10px;
}

.submit-btn {
  padding: 10px 20px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.submit-btn:hover {
  background-color: #218838;
}

.submit-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.cancel-btn {
  padding: 10px 20px;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.cancel-btn:hover {
  background-color: #5a6268;
}

.cancel-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.categories-list {
  list-style: none;
  padding: 0;
  max-width: 100%;
  box-sizing: border-box;
}

.category-item {
  padding: 20px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f9f9f9;
}

.category-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ddd;
}

.delete-btn {
  padding: 6px 12px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.delete-btn:hover {
  background-color: #c82333;
}

.delete-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.category-description {
  color: #666;
  margin-top: 10px;
}
</style>

