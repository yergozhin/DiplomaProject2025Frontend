<template>
  <div class="categories-section">
    <div class="categories-header">
      <h3>Event Categories</h3>
      <div class="add-category-controls">
        <select
          v-model="selectedCategoryId"
          :disabled="!!disabled || !!loadingCategories"
          class="category-select"
        >
          <option value="">Select a category</option>
          <option
            v-for="category in availableCategories"
            :key="category.id"
            :value="category.id"
          >
            {{ category.name }}
          </option>
        </select>
        <button
          type="button"
          class="add-category-btn"
          @click="assignCategory"
          :disabled="!!disabled || !selectedCategoryId || !!processingCategoryId"
        >
          {{ processingCategoryId ? 'Adding...' : 'Add Category' }}
        </button>
      </div>
    </div>
    <div v-if="loadingCategories" class="status-message">Loading categories...</div>
    <div v-else-if="categories.length > 0" class="categories-list">
      <div
        v-for="assignment in categories"
        :key="assignment.id"
        class="category-item"
      >
        <span class="category-name">{{ assignment.categoryName || 'Unknown' }}</span>
        <button
          type="button"
          class="remove-category-btn"
          @click="removeCategory(assignment.categoryId)"
          :disabled="processingCategoryId === assignment.categoryId"
        >
          {{ processingCategoryId === assignment.categoryId ? 'Removing...' : 'Remove' }}
        </button>
      </div>
    </div>
    <div v-else class="no-categories">No categories assigned</div>
    <div v-if="error" class="error-message">{{ error }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import { eventCategoriesService } from '@/services/event-categories.service';
import type { EventCategory, EventCategoryAssignment } from '@/types';

const props = defineProps<{
  eventId: string;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  (e: 'categories-updated'): void;
}>();

const categories = ref<EventCategoryAssignment[]>([]);
const allCategories = ref<EventCategory[]>([]);
const selectedCategoryId = ref<string>('');
const processingCategoryId = ref<string | null>(null);
const loadingCategories = ref(false);
const error = ref<string | null>(null);

const availableCategories = computed(() => {
  const assignedIds = new Set(categories.value.map(c => c.categoryId));
  return allCategories.value.filter(cat => !assignedIds.has(cat.id));
});

async function loadAllCategories() {
  try {
    allCategories.value = await eventCategoriesService.getAll();
    error.value = null;
  } catch (err: any) {
    error.value = err.error || 'Failed to load categories';
    allCategories.value = [];
  }
}

async function loadEventCategories() {
  loadingCategories.value = true;
  try {
    categories.value = await eventCategoriesService.getByEvent(props.eventId);
    error.value = null;
  } catch (err: any) {
    error.value = err.error || 'Failed to load event categories';
    categories.value = [];
  } finally {
    loadingCategories.value = false;
  }
}

async function assignCategory() {
  if (!selectedCategoryId.value) return;
  processingCategoryId.value = selectedCategoryId.value;
  error.value = null;
  try {
    await eventCategoriesService.assignToEvent(props.eventId, selectedCategoryId.value);
    await loadEventCategories();
    selectedCategoryId.value = '';
    emit('categories-updated');
  } catch (err: any) {
    error.value = err.error || 'Failed to assign category';
  } finally {
    processingCategoryId.value = null;
  }
}

async function removeCategory(categoryId: string) {
  if (!confirm('Are you sure you want to remove this category?')) return;
  processingCategoryId.value = categoryId;
  error.value = null;
  try {
    await eventCategoriesService.removeFromEvent(props.eventId, categoryId);
    await loadEventCategories();
    emit('categories-updated');
  } catch (err: any) {
    error.value = err.error || 'Failed to remove category';
  } finally {
    processingCategoryId.value = null;
  }
}

watch(() => props.eventId, () => {
  if (props.eventId) {
    loadEventCategories();
  }
}, { immediate: true });

onMounted(() => {
  loadAllCategories();
  if (props.eventId) {
    loadEventCategories();
  }
});
</script>

<style scoped>
.categories-section {
  margin-top: 20px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #fff;
}

.categories-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  flex-wrap: wrap;
  gap: 10px;
}

.categories-header h3 {
  margin: 0;
  font-size: 18px;
}

.add-category-controls {
  display: flex;
  gap: 8px;
  align-items: center;
}

.category-select {
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  min-width: 200px;
}

.category-select:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.add-category-btn {
  padding: 6px 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.add-category-btn:hover:not(:disabled) {
  background-color: #0056b3;
}

.add-category-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.status-message {
  padding: 10px;
  color: #6c757d;
  font-style: italic;
  text-align: center;
}

.categories-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.category-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background-color: #f9f9f9;
}

.category-name {
  font-weight: 500;
  color: #333;
}

.remove-category-btn {
  padding: 4px 12px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.remove-category-btn:hover:not(:disabled) {
  background-color: #c82333;
}

.remove-category-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.no-categories {
  padding: 10px;
  color: #6c757d;
  font-style: italic;
  text-align: center;
}

.error-message {
  padding: 10px;
  margin-top: 15px;
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
}
</style>

