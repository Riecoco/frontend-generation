<template>
  <div :class="containerClasses">
    <slot />
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  tone: {
    type: String,
    default: 'primary',
    validator: (value) =>
        ['primary', 'success', 'danger', 'muted'].includes(value),
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value),
  },
})

const containerClasses = computed(() => {
  const baseClasses =
      'inline-flex shrink-0 items-center justify-center rounded-2xl'

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-11 w-11',
    lg: 'h-12 w-12',
  }

  const toneClasses = {
    primary: 'bg-primary/10 text-primary',
    success: 'bg-success/10 text-success',
    danger: 'bg-destructive/10 text-destructive',
    muted: 'bg-muted text-muted-foreground',
  }

  return `${baseClasses} ${sizeClasses[props.size]} ${toneClasses[props.tone]}`
})
</script>