import { ref , watch } from 'vue';
import { defineStore } from 'pinia';

export const useStore = defineStore('base', () => {
  const count = ref(0);
  const skippedCount = ref(0); // Add a new ref for skipped count
  const words = ref<'all' | 'hiragana' | 'katakana' | 'ktb115' | 'kkj115' | 'kj110' | 'custom'>('ktb115');
  const modal = ref<'kana' | 'settings'| null>(null);
  const table = ref<'hiragana' | 'katakana'>('hiragana');
  const showKana = ref(true);
  const selectedFiles = ref<string[]>([]);

  // Watch selectedFiles and log changes
  watch(selectedFiles, (newSelectedFiles) => {
    console.log('Selected files:', newSelectedFiles);
  });

  return {
    count,
    skippedCount, // Expose the skippedCount ref
    modal,
    table,
    words,
    selectedFiles, 
    showKana
  };
});