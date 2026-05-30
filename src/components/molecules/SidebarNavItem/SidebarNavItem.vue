<template>
  <button
      type="button"
      :class="classes"
      :title="label"
      @click="$emit('select')"
  >
    <component
        :is="icon"
        class="h-5 w-5 shrink-0"
    />

    <span class="truncate">
  {{ label }}
</span>
  </button>
</template>

<script setup>
import { computed } from 'vue'
import { Text } from '../../atoms'

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  icon: {
    type: [Object, Function],
    required: true,
  },
  active: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['select'])

const classes = computed(() => [
  'flex w-full items-center justify-start gap-3 rounded-xl px-4 py-3 text-left transition-all',
  props.active
      ? 'bg-primary/10 text-sidebar-primary font-bold'
      : 'text-sidebar-foreground font-medium hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
])
</script>