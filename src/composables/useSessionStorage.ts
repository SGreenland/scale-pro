import { ref, watch } from 'vue';

export const useSessionStorage = <T>(key: string, initialValue: T) => {
  const storedValue = sessionStorage.getItem(key);
  const value = ref<T>(storedValue ? JSON.parse(storedValue) : initialValue);

  watch(value, (newValue) => {
    sessionStorage.setItem(key, JSON.stringify(newValue));
  }, { deep: true });

  return value;
}