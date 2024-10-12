import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useStore = defineStore('base', () => {
  const count = ref(0);
  const words = ref<'all' | 'hiragana' | 'katakana' | 'ktb1-15' | 'kkj1-15' | 'kj1-10'>('ktb1-15'); //added test
  const modal = ref<'kana' | 'settings' | null>(null);
  const table = ref<'hiragana' | 'katakana'>('hiragana');
  const showKana = ref(true);
  return {
    count,
    modal,
    table,
    words,
    showKana
  };
});
