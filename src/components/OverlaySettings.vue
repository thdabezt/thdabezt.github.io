<template>
  <BaseOverlay v-slot="{ dismiss }" @dismiss="handleDismiss"> 
    <div class="max-w-md w-full rounded-lg p-6 shadow-xl bg-white border border-gray-200 dark:bg-gray-900 dark:border-gray-800">
      <div class="w-full flex justify-start items-center gap-2">
        <div>Settings</div>
        <button class="ml-auto btn-round text-gray-500 focus:bg-gray-300 hover:bg-gray-300 dark:focus:bg-gray-800 dark:hover:bg-gray-800" type="button" @click.prevent="dismiss">
          <IconX class="w-6 h-6" />
        </button>
      </div>

      <div class="w-full flex justify-start items-center gap-2 my-4">
        <div class="text-sm text-gray-500">Practice:</div>
        <BaseTabs class="text-sm" :options="[
          { title: 'Base 2', value: 'all' },
          { title: 'Hiragana', value: 'hiragana' },
          { title: 'Katakana', value: 'katakana' },
          { title: '1-15', value: 'ktb115' },
          { title: 'K1-10', value: 'kj110' },
          { title: 'KK1-15', value: 'kkj115' },
          { title: 'Custom', value: 'custom' }
        ]" v-model="store.words" />
      </div>

      <div v-if="store.words === 'custom'" class="mt-4">
        <div class="custom-scrollbar max-h-40 overflow-y-auto"> 
          <ul>
            <li v-for="file in jsonFiles" :key="file">
              <input 
                type="checkbox" 
                :id="file" 
                :value="file" 
                v-model="selectedFiles"
                :disabled="selectedFiles.length === 1 && file === 'empty.json'" 
              >
              <label :for="file">{{ file }}</label>
            </li>
          </ul>
        </div>
      </div>

      <p class="text-xs mt-2 text-gray-500">
        Built by
        <a class="text-lime-500" href="https://rupertdunk.com" target="_blank"> rdunk</a>.
      </p>
    </div>
  </BaseOverlay>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px; 
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent; 
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #d6d3d1; 
  border-radius: 10px; 
}
</style>

<script lang="ts" setup>
import { useStore } from '@/stores/base';
import { ref, computed, watch, onMounted } from 'vue'; 

const store = useStore();
const selectedFiles = ref<string[]>([]);

// Load selectedFiles from localStorage on mount
onMounted(() => {
  // Check if localStorage is available (it might not be in some environments like SSR)
  if (typeof localStorage !== 'undefined') { 
    const savedFiles = localStorage.getItem('selectedFiles');
    if (savedFiles) {
      selectedFiles.value = JSON.parse(savedFiles);
    } else {
      // Set default to empty.json if nothing is saved
      selectedFiles.value = ['empty.json']; 
    }
  } else {
    // If localStorage is not available, default to empty.json
    selectedFiles.value = ['empty.json']; 
  }
});

const handleDismiss = () => {
  // Save selectedFiles to localStorage when the overlay is closed
  localStorage.setItem('selectedFiles', JSON.stringify(selectedFiles.value));
  store.modal = null; 
};

// Watch selectedFiles and update the store
watch(selectedFiles, (newSelectedFiles) => {
  store.selectedFiles = newSelectedFiles;
});

const jsonFiles = computed(() => {
  const importContext = import.meta.glob('@/assets/data/*.json', { eager: true });
  return Object.keys(importContext).map((key) => {
    const parts = key.split('/');
    return parts[parts.length - 1];
  });
});
</script>