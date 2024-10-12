import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useStore = defineStore('base', () => {
  const count = ref(0);
  const skippedCount = ref(0); // Add a new ref for skipped count
  const words = ref<'all' | 'hiragana' | 'katakana' | 'ktb1-15' | 'kkj1-15' | 'kj1-10'>('ktb1-15');
  const modal = ref<'kana' | 'settings' | null>(null);
  const table = ref<'hiragana' | 'katakana'>('hiragana');
  const showKana = ref(true);
  return {
    count,
    skippedCount, // Expose the skippedCount ref
    modal,
    table,
    words,
    showKana
  };
});