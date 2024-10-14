<template>
  <div class="flex-grow flex flex-col">
    <div class="fixed top-0 left-0 right-0 p-4 sm:p-6">
      <AppHeader /> 
    </div>
    <KanaDisplay class="flex-grow" :word="word" :is-match="isMatch" :word-type="store.words" />
    <div class="fixed bottom-0 left-0 right-0 p-4 sm:p-6">
      <KanaInput
        :is-match="isMatch"
        :show-tip="store.count === 0 && isMatch"
        v-model:value="input"
        @submit="onSubmit"
        @next="handleNext"
      />
    </div>
    
    <Teleport to="body">
      <OverlayKana v-if="store.modal === 'kana'" />
      <OverlaySettings v-else-if="store.modal === 'settings'" />
    </Teleport>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import type { KanaEntry, KanaEntryWithRoumaji } from '@/types';
import { katakanaMap } from '@/util/katakana-map';
import { hiraganaMap } from '@/util/hiragana-map';
import { mapKana } from '@/util/kana';
import { useStore } from '@/stores/base';

const store = useStore();
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const importContext = import.meta.glob('@/assets/data/*.json', { eager: true });

interface ImportContext {
  [key: string]: { default: KanaEntry[] };
}

const dictionaries: Record<string, KanaEntry[]> = {};
for (const path in importContext) {
  const fileName = path.match(/\/([^/]+)\.json$/)?.[1];
  if (fileName) {
    dictionaries[fileName] = (importContext as ImportContext)[path].default;
  }
}

const dictionary = computed<KanaEntry[]>(() => {
  let selectedDictionary: KanaEntry[] | undefined;

  if (store.words === 'hiragana') {
    return dictionaries.hiragana;
  }
  if (store.words === 'katakana') {
    return dictionaries.katakana;
  }
  if (store.words === 'ktb115') {
    return dictionaries.ktb115;
  }
  if (store.words === 'kkj115') {
    return dictionaries.kkj115;
  }
  if (store.words === 'kj110') {
    return dictionaries['kj110'];
  } else if (store.words === 'custom') {
    const selectedFiles = store.selectedFiles;
    selectedDictionary = selectedFiles.map(file => dictionaries[file.replace('.json', '')]).flat();
  } else {
    selectedDictionary = Object.values(dictionaries).flat();
  }

  if (selectedDictionary) {
    const dictionaryName = store.words === 'custom'
      ? store.selectedFiles.join(', ')
      : store.words;
    console.log("Using dictionary:", dictionaryName);
  }

  return selectedDictionary || [];
});

const allMaps = [...hiraganaMap, ...katakanaMap];

const input = ref('');
const index = ref(randomInt(0, dictionary.value.length - 1));
const word = computed<KanaEntryWithRoumaji>(() => {
  const entry = dictionary.value[index.value];
  const roumaji = entry.kana.map(mapKana(allMaps));
  return {
    ...entry,
    roumaji
  };
});

const isMatch = computed(() => {
  const match = word.value.roumaji.join('');
  return input.value.toLowerCase().replace(/ /g, '') === match;
});

let pressCount = 0;
let timer: ReturnType<typeof setTimeout> | null = null;

const onSubmit = () => {
  if (input.value.trim() === '') {
    pressCount++;
    if (pressCount === 1) {
      timer = setTimeout(() => {
        pressCount = 0; // Reset press count after 0.5 seconds
      }, 500);
    } else if (pressCount === 2) {
      store.skippedCount += 1;
      handleNext();
      pressCount = 0; // Reset after skip
      if (timer) clearTimeout(timer); // Clear timer after second press
    }
  } else if (isMatch.value) {
    store.count += 1;
    handleNext();
  }
};

const handleNext = () => {
  index.value = randomInt(0, dictionary.value.length - 1);
};

watch(
  () => index.value,
  () => (input.value = '')
);

watch(dictionary, (dict) => {
  index.value = randomInt(0, dict.length - 1);
});
</script>
