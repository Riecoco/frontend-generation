<template>
  <section :class="classes">
    <slot />
  </section>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  padding: {
    type: String,
    default: 'none',
    validator: (value) => ['none', 'sm', 'md', 'lg'].includes(value),
  },
})

const classes = computed(() => {
  const baseClasses =
      'overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-sm'

  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  }

  return `${baseClasses} ${paddingClasses[props.padding]}`
})
</script>